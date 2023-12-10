import { defineStore } from 'pinia';
import { UserRoles } from '@/utils/userRoles';
import { getUserType, loginUser, registerUser, validateSelf } from '@/api/user';
import { throwIfNotOK } from '@/utils/apiUtils';
import { useActivityStore } from '@/stores/activityStore';
import router from '@/router';
import { serverError } from '@/router/routerUtils';

export const useUserStore = defineStore('user', {
  state: () => ({
    userRole: UserRoles,
    username: null,
    token: null,
    interval: null,
  }),
  getters: {
    isStudent() {
      return this.userRole === UserRoles.STUDENT;
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
        if (!response.ok) await this.logoutUser();
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
          this.logoutUser().then();
        }
      }, 2 * 1000);
    },
    async logoutUser() {
      clearInterval(this.interval);
      this.setToken(null);
      this.setUserRoles(null);
      this.setUsername(null);
      await router.push({ name: 'Home', query: { expiredError: 'true' } });
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
  },
  persist: true,
});
