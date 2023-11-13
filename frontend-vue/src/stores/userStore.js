import { defineStore } from 'pinia';
import { UserRoles } from '@/utils/userRoles';
import { registerUser } from '@/api/user';
import { throwIfNotOK } from '@/utils/apiUtils';

export const useUserStore = defineStore('user', {
  state: () => ({
    userRole: UserRoles,
    username: null,
  }),
  getters: {
    isStudent() {
      return this.userRole === UserRoles.STUDENT;
    },
    isTeacher() {
      return this.userRole === UserRoles.TEACHER;
    },
    isAuthenticated() {
      return !!this.username;
    },
  },
  actions: {
    setUserRoles(userRole) {
      this.userRole = userRole;
    },
    setUsername(username) {
      this.username = username;
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
  },
});
