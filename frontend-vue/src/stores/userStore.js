import { defineStore } from 'pinia';
import { UserRoles } from '@/utils/userRoles';
import {
  getAllUsers,
  getUserType,
  loginUser,
  registerUser,
  renewToken,
  validateSelf,
} from '@/api/user';
import { throwIfNotOK } from '@/utils/apiUtils';
import { useActivityStore } from '@/stores/activityStore';
import router from '@/router';
import { serverError } from '@/router/routerUtils';
import { getCurrentQuestion } from '@/api/session';

export const useUserStore = defineStore('user', {
  state: () => ({
    userRole: UserRoles,
    username: null,
    token: null,
    interval: null,
    users: []
  }),
  getters: {
    isStudent() {
      return this.userRole === UserRoles.STUDENT;
    },
    isAdmin() {
      return this.userRole === UserRoles.ADMIN;
    },
    isTeacher() {
      return this.userRole === UserRoles.TEACHER;
    },
    isNotChoose() {
      return this.userRole === UserRoles.NOT_CHOOSE;
    },
    isAuthenticated() {
      return !!this.token;
    },
  },
  actions: {
    setUserRoles(userRole) {
      this.userRole = userRole;
    },
    setUsername(username) {
      this.username = username;
    },
    setToken(token) {
      this.token = token;
    },
    setUsers(user){
      this.user = user;
    },
    async register(
      name,
      surname,
      username,
      password,
      passwordConfirm,
      userType,
    ) {
      const body = {
        name,
        surname,
        username,
        password,
        passwordConfirm,
        userType,
      };
      const response = await registerUser(body);
      await throwIfNotOK(response, 204);
    },
    async login(ticket, service) {
      const body = { ticket, service };
      const response = await loginUser(body);
      await throwIfNotOK(response, 201);
      const token = (await response.json()).access_token;
      this.setToken(token);
      //this.setUsername(username);
      this.setUserRoles(await this.fetchUserType());
      await this.intervalChecker();
    },
    async fetchUserType() {
      try {
        const response = await getUserType(this.token);
        if (!response.ok) await this.logoutUser();
        else {
          return (await response.json()).userType;
        }
      } catch (e) {
        await serverError();
      }
    },
    async renewToken() {
      try {
        const response = await renewToken(this.token);
        if (!response.ok) await this.logoutUser();
        else {
          const token = (await response.json()).access_token;
          this.setToken(token);
        }
      } catch (e) {
        await serverError();
      }
    },
    async intervalChecker() {
      const activityStore = useActivityStore();
      this.interval = setInterval(() => {
        if (activityStore.wasActive) {
          console.log('renew token');
          this.renewToken();
        }
        if (activityStore.isInactive) {
          //TODO show inactivity message
        }
        if (activityStore.isInactiveAndClosed) {
          console.log('expiredToken');
          this.logoutUser();
        }
      }, 30 * 1000);
    },
    async logoutUser() {
      clearInterval(this.interval);
      this.setToken(null);
      this.setUserRoles(null);
      this.setUsername(null);
      const urlEncoded = encodeURIComponent((window.location.origin) + "")
      console.log(urlEncoded);
      window.location.href =(
        import.meta.env.VITE_CAS_URL +
        import.meta.env.VITE_CAS_LOGOUT_ROUTE +
        '?service=' +urlEncoded
        );
      //await router.push({ name: 'Login', query: { expiredError: 'true' } });
    },
    async validateSelf(name, surname, userType) {
      const response = await validateSelf(
        { name, surname, userType },
        this.token,
      );
      await throwIfNotOK(response, 204);
      this.setUserRoles(await this.fetchUserType());
      if (this.userRole === UserRoles.TEACHER) await this.logoutUser();
    },

    async getUsers(page, nbItem) {
      try {
        const response = await getAllUsers(page, nbItem, this.token);
        if (!response.ok) {
          throw new Error('Erreur de chargement de la liste des utilisateur'); // TODO manage error
        }
        const users = await response.json();
        this.setUsers(users);
        console.log(users);
      } catch (error) {
        console.error(error);
      }
    },
  },
  persist: true,
});
