import { defineStore } from 'pinia';
import { getGroup, createGroup, getGroupsOfTeacher } from '@/api/group';
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
    getTabsGroup() {
      return this.tabsGroups;
    },

    //userStore.token

    async getGroups() {
      const userStoreU = useUserStore();
      console.log('getGroups');
      const response = await getGroupsOfTeacher(userStoreU.token);
      console.log('response : ');
      console.log(response);
      const groups = await response.json();
      await this.setTabsGroups(groups);
      return this.getTabsGroup();
    },

    async createGroup(body) {
      const userStoreU = useUserStore();
      try {
        console.log('createGroup');
        const bodytosend = { name: body };
        console.log('bodytosend : ');
        console.log(bodytosend);
        const response = await createGroup(bodytosend, userStoreU.token);
        if (!response.ok || response.status !== 201) {
          throw new Error('Erreur de réponse'); // TODO manage error
        }
        userStoreU.updateToken(response.headers.get('Authorization'));
        const group = JSON.parse(await response.text());
        //this.idGroup = JSON.parse(await response.text()).id;
        await this.getGroups();
        this.setTabsGroups(group);
        console.log('group : ');
        console.log(group);
      } catch (error) {
        console.error(error);
      }
    },

    async getGroup(idGroup) {
      const userStoreU = useUserStore();
      try {
        const response = await getGroup(idGroup, userStoreU.token);
        if (!response.ok) {
          throw new Error('Erreur de chargement du groupe'); // TODO manage error
        }
        userStoreU.updateToken(response.headers.get('Authorization'));
        const group = await response.json();
        return group;
      } catch (error) {
        console.error(error);
      }
    },

    async deleteGroup(idGroup) {
      const userStoreU = useUserStore();
      try {
        const response = await deleteGroup(idGroup, userStoreU.token);
        if (!response.ok) {
          throw new Error('Erreur de chargement du groupe'); // TODO manage error
        }
        userStoreU.updateToken(response.headers.get('Authorization'));
        const group = await response.json();
        console.log(group);
        await this.getGroups();
      } catch (error) {
        console.error(error);
      }
    },

    async removeStudentFromGroup(idGroup, idStudent) {
      const userStoreU = useUserStore();
      try {
        const response = await removeStudentFromGroup(
          idGroup,
          idStudent,
          userStoreU.token,
        );
        if (!response.ok) {
          throw new Error('Erreur de chargement du groupe'); // TODO manage error
        }
        userStoreU.updateToken(response.headers.get('Authorization'));
        const group = await response.json();
        console.log(group);
        await this.getGroups();
      } catch (error) {
        console.error(error);
      }
    },

    async addStudentToGroup(idGroup, idStudent) {
      const userStoreU = useUserStore();
      try {
        const response = await addStudentToGroup(
          idGroup,
          idStudent,
          userStoreU.token,
        );
        if (!response.ok) {
          throw new Error('Erreur de chargement du groupe'); // TODO manage error
        }
        userStoreU.updateToken(response.headers.get('Authorization'));
        const group = await response.json();
        console.log(group);
        await this.getGroups();
      } catch (error) {
        console.error(error);
      }
    },
  },
});
