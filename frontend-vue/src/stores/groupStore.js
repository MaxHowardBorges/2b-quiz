import { defineStore } from 'pinia';

export const useGroupStore = defineStore('group', {
  state: () => ({
    idGroup: null,
    teacher: null,
    groupName: null,
    tabUsers: [],
  }),
  actions: {
    setIdGroup(idGroup) {
      this.idGroup = idGroup;
    },
    setGroupName(groupName) {
      this.groupName = groupName;
    },
    setTeacher(teacher) {
      this.teacher = teacher;
    },
    setTabUsers(tabUsers) {
      this.tabUsers = tabUsers;
    },

  },
});