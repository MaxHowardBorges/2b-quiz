import { defineStore } from 'pinia';
import { UserRoles } from '@/utils/userRoles';
import { getUserType, loginUser, registerUser, renewToken } from '@/api/user';
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
    isAuthenticated() {
      return !!this.username && !!this.token;
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
      //this.setUsername(username);
      this.setUserRoles(await this.fetchUserType());
      await this.intervalChecker();
    },
    async fetchUserType() {
      try {
        const response = await getUserType(this.token);
        if (!response.ok) await this.expiredToken();
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
        if (!response.ok) await this.expiredToken();
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
          this.expiredToken();
        }
      }, 30 * 1000);
    },
    async expiredToken() {
      clearInterval(this.interval);
      this.setToken(null);
      this.setUserRoles(null);
      this.setUsername(null);
      await router.push({ name: 'Login', query: { expiredError: 'true' } });
    },
  },
  persist: true,
});
