<template>
  <v-dialog
    v-model="SelectionDialog"
    max-width="1000"
    rounded="lg"
    :persistent="true"
    class="pa-2">
    <v-card class="pa-2">
      <v-card-title>Choose members</v-card-title>
      <v-card-text>
        <v-btn-toggle v-model="toggleTable" color="primary">
          <v-btn @click="openDisplayUserStudent">Etudiants</v-btn>
          <v-btn @click="openDisplayUserTeacher">Enseignants</v-btn>
          <v-btn @click="openDisplayUserGroup">Groupes</v-btn>
        </v-btn-toggle>
        <v-text-field
          v-model="search"
          label="Search"
          prepend-inner-icon="magnify"
          :single-line="true"
          variant="outlined"
          class="mt-2"
          hide-details></v-text-field>
      </v-card-text>
      <v-sheet
        border="lg"
        class="ma-2 overflow-y-auto overflow-x-hidden border-dark-color"
        rounded="lg"
        elevation="3">
        <v-data-table
          v-if="displayUserStudent || displayUserTeacher"
          :items="displayUserTeacher ? teachers : students"
          :headers="headers"
          :search="search"
          class="ma-2"
          show-headers>
          <template v-slot:item.selected="{ item }">
            <v-checkbox
              v-model="item.selected"
              :disabled="this.isInSession ? isIdInWhitelist(item.id) : false"
              @update:model-value="appendToSelect(item)"></v-checkbox>
          </template>
        </v-data-table>
        <v-data-table
          v-if="displayUserGroup"
          :items="groups"
          :headers="headersGroups"
          class="ma-2"
          show-headers>
          <template v-slot:item.selected="{ item }">
            <v-checkbox
              v-model="item.selected"
              :disabled="this.isInSession ? isIdInWhitelist(item.id) : false"
              @update:model-value="appendGroupToSelect(item)"></v-checkbox>
          </template>
        </v-data-table>
      </v-sheet>
      <v-alert
        v-if="selectedUsers.length !== 0 || selectedGroups.length !== 0"
        :title="selectedUsers.length + selectedGroups.length + ' selected'"
        type="info">
        <template v-if="selectedUsers.length !== 0">
          {{ selectedUsers.length }} users selected
        </template>
        <template
          v-if="selectedUsers.length !== 0 && selectedGroups.length !== 0">
          and
        </template>
        <template v-if="selectedGroups.length !== 0">
          {{ selectedGroups.length }} group selected
        </template>
      </v-alert>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="closeSelectionDialog">Fermer</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <div>
    <div class="d-flex flex-row mt-4">
      <v-select
        v-if="!isInSession"
        v-model="selectedSessionType"
        :items="sessionTypes"
        label="Type de session"
        class="mt-4 mx-3"
        outlined
        dense
        required></v-select>

      <v-select
        v-model="selectedAcces"
        :items="itemsAcces"
        label="Type d'accès"
        class="mt-4 mx-3"
        outlined
        dense
        required></v-select>

      <v-btn
        v-if="selectedAcces === AccessType.PRIVATE"
        @click="openSelectionDialog"
        class="mt-4 mx-3">
        Choisir étudiants
      </v-btn>
    </div>
    <v-divider class="ma-2"></v-divider>
    <p class="text-h5">Display settings</p>
    <div class="d-flex">
      <v-switch
        color="primary"
        label="Display question on public screen"
        v-model="displaySettings.displayQuestion"
        @update:model-value="
          displaySettings.displayAnswer =
            displaySettings.displayAnswer && displaySettings.displayQuestion
        " />
      <v-switch
        color="primary"
        label="Display answers on public screen"
        v-model="displaySettings.displayAnswer"
        :disabled="!displaySettings.displayQuestion" />
    </div>
  </div>
</template>

<script>
  import { ref } from 'vue';
  import { AccessType } from '@/utils/accesType';
  import { useUserStore } from '@/stores/userStore';
  import { SessionType } from '@/utils/sessionType';
  import { useSessionStore } from '@/stores/sessionStore';
  import { useGroupStore } from '@/stores/groupStore';

  export default {
    name: 'SessionSetting',
    computed: {
      AccessType() {
        return AccessType;
      },
    },
    props: {
      isInSession: Boolean,
    },
    data() {
      return {
        sessionTypes: [
          SessionType.PILOTED,
          SessionType.FREE,
          SessionType.TIMED,
        ],
        selectedSessionType: ref(SessionType.PILOTED),
        itemsAcces: [AccessType.PUBLIC, AccessType.PRIVATE, AccessType.CLOSED],
        selectedAcces: ref(AccessType.CLOSED),
        SelectionDialog: ref(false),
        popup: ref(false),
        displaySettings: {
          displayQuestion: true,
          displayAnswer: true,
        },
        search: '',
        displayUserStudent: true,
        displayUserTeacher: false,
        displayUserGroup: false,
        selectedUsers: [],
        selectedGroups: [],
        toggleTable: '0',
        students: [],
        teachers: [],
        groups: [],
        headersGroups: [
          { title: 'ID', key: 'id' },
          { title: 'Name', key: 'groupName' },
          { title: 'Nb Users', key: 'nbTabUsers' },
          { title: 'Selected', key: 'selected' },
        ],
        headers: [
          { title: 'ID', key: 'id' },
          { title: 'Username', key: 'username' },
          { title: 'Name', key: 'name' },
          { title: 'Surname', key: 'surname' },
          { title: 'Selected', key: 'selected' },
        ],
      };
    },
    setup() {
      const userStore = useUserStore();
      const sessionStore = useSessionStore();
      const groupStore = useGroupStore();
      return { userStore, sessionStore, groupStore };
    },
    async beforeMount() {
      await this.getUsersAndGroups();
      if (this.isInSession) {
        this.selectedAcces = this.sessionStore.settings.accessType;
        this.displaySettings = this.sessionStore.settings.displaySettings;
        if (this.sessionStore.whitelist)
          for (let i = 0; i < this.sessionStore.whitelist.length; i++) {
            const idUser = this.sessionStore.whitelist[i];
            let user = this.students.find((user) => user.id === idUser);
            if (!user) user = this.teachers.find((user) => user.id === idUser);
            user.selected = true;
          }
        if (this.sessionStore.whitelistGroups)
          for (let i = 0; i < this.sessionStore.whitelistGroups.length; i++) {
            const idGroup = this.sessionStore.whitelistGroups[i];
            const group = this.students.find((group) => group.id === idGroup);
            group.selected = true;
          }
      }
    },
    methods: {
      async getUsersAndGroups() {
        this.students = await this.userStore.getStudentForTeacher();
        this.teachers = await this.userStore.getTeacherForTeacher();
        this.groups = await this.groupStore.getGroups();
      },
      isIdInWhitelist(id) {
        return (
          this.sessionStore.whitelist.includes(id) ||
          this.sessionStore.whitelistGroups.includes(id)
        );
      },
      openSelectionDialog() {
        this.SelectionDialog = true;
      },
      closeSelectionDialog() {
        this.SelectionDialog = false;
      },
      openDisplayUserStudent() {
        this.displayUserStudent = true;
        this.displayUserTeacher = false;
        this.displayUserGroup = false;
        this.search = '';
      },
      openDisplayUserTeacher() {
        this.displayUserTeacher = true;
        this.displayUserStudent = false;
        this.displayUserGroup = false;
        this.search = '';
      },
      openDisplayUserGroup() {
        this.displayUserGroup = true;
        this.displayUserTeacher = false;
        this.displayUserStudent = false;
        this.search = '';
      },
      appendToSelect(value) {
        if (value) {
          if (value.selected) {
            this.selectedUsers.push(value);
          } else {
            this.selectedUsers = this.selectedUsers.filter(
              (user) => user.id !== value.id,
            );
          }
        }
      },
      appendGroupToSelect(value) {
        if (value) {
          if (value.selected) {
            this.selectedGroups.push(value);
          } else {
            this.selectedGroups = this.selectedGroups.filter(
              (user) => user.id !== value.id,
            );
          }
        }
      },
      getSelectedUsersId() {
        return this.selectedUsers.map((user) => user.id);
      },
      getSelectedGroupsId() {
        return this.selectedGroups.map((group) => group.id);
      },
      getSettings() {
        if (this.isInSession)
          return {
            accessType: this.selectedAcces,
            displaySettings: this.displaySettings,
          };
        return {
          sessionType: this.selectedSessionType,
          accessType: this.selectedAcces,
          displaySettings: this.displaySettings,
        };
      },
    },
  };
</script>

<style scoped></style>
