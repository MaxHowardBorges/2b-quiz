import { defineStore } from 'pinia';
import { UserRoles } from '@/utils/userRoles';

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
  },
});
