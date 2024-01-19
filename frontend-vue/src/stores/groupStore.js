import { defineStore } from 'pinia';
import { getGroup, createGroup } from '@/api/group';
import { useUserStore } from '@/stores/userStore';

export const useGroupStore = defineStore('group', {
  state: () => ({
    idGroup: null,
    teacher: null,
    groupName: null,
    tabUsers: [],
    tabsGroups: [],
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
    setTabsGroups(tabsGroups) {
      this.tabsGroups = tabsGroups;
    },

    //userStore.token
    async createGroup(body) {
    },

    async getGroup() {
      const userStoreU = useUserStore();
      console.log("getGroup");
      console.log('token : ');
      console.log(userStoreU.token);
      const response = await getGroup(userStoreU.token);
      const group = await response.json();
      this.setTabsGroups(group);
    },

  },
});