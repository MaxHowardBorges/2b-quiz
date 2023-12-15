import { defineStore } from 'pinia';
import { UserRoles } from '@/utils/userRoles';
import {
  deleteUser,
  getAllUsers,
  getAllUsersSort,
  getUserType,
  loginUser,
  registerUser,
  validateSelf,
  validateUser,
} from '@/api/user';
import { throwIfNotOK } from '@/utils/apiUtils';
import { useActivityStore } from '@/stores/activityStore';
import router from '@/router';
import { serverError } from '@/router/routerUtils';

export const useUserStore = defineStore('user', {
  state: () => ({
    userRole: null,
    username: null,
    token: null,
    interval: null,
    users: [],
    nbPage: null,
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
    setUsers(user) {
      this.users = user;
    },
    setNbPageUser(nbPage) {
      this.nbPage = nbPage;
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
      await this.updateUserType();
      //this.setUsername(username);
      this.intervalChecker();
    },
    updateToken(token) {
      token = token.replace('Bearer ', '');
      this.setToken(token);
    },
    async updateUserType() {
      const userType = await this.fetchUserType();
      this.setUserRoles(userType);
    },
    async fetchUserType() {
      try {
        const response = await getUserType(this.token);
        if (!response.ok) await this.forceLogout();
        else {
          this.updateToken(response.headers.get('Authorization'));
          const body = await response.json();
          return body.userType;
        }
      } catch (e) {
        await serverError();
      }
    },
    intervalChecker() {
      const activityStore = useActivityStore();
      this.interval = setInterval(() => {
        if (activityStore.isInactive) {
          //TODO show inactivity message
        }
        if (activityStore.isInactiveAndClosed) {
          this.forceLogout().then();
        }
      }, 2 * 1000);
    },
    async selfLogout() {
      await this.logoutUser();
      const urlEncoded = encodeURIComponent(window.location.origin + '');
      window.location.href =
        import.meta.env.VITE_CAS_URL +
        import.meta.env.VITE_CAS_LOGOUT_ROUTE +
        '?service=' +
        urlEncoded;
    },
    async forceLogout() {
      await this.logoutUser();
      await router.push({ name: 'Home', query: { expiredError: 'true' } });
    },
    async logoutUser() {
      clearInterval(this.interval);
      this.setToken(null);
      this.setUserRoles(null);
      this.setUsername(null);
    },
    async validateSelf(name, surname, userType) {
      const response = await validateSelf(
        { name, surname, userType },
        this.token,
      );
      await throwIfNotOK(response, 204);
      this.updateToken(response.headers.get('Authorization'));
      this.setUserRoles(await this.fetchUserType());
      if (this.userRole === UserRoles.TEACHER) await this.logoutUser();
    },
    async getUsers(page, nbItem, sort) {
      let response;
      if (sort) {
        response = await getAllUsersSort(page, nbItem, sort, this.token);
      } else {
        response = await getAllUsers(page, nbItem, this.token);
      }
      await throwIfNotOK(response, 200);
      this.updateToken(response.headers.get('Authorization'));
      const body = await response.json();
      this.setUsers(body.userList);
      this.setNbPageUser(body.nbPage);
      return { userList: body.userList, nbPage: body.nbPage };
    },
    async validateUser(id) {
      const response = await validateUser(id, this.token);
      await throwIfNotOK(response, 204);
      this.updateToken(response.headers.get('Authorization'));
    },
    async deleteUser(id) {
      const response = await deleteUser(id, this.token);
      await throwIfNotOK(response, 204);
      this.updateToken(response.headers.get('Authorization'));
    },
  },
  persist: {
    paths: ['token'],
  },
});
