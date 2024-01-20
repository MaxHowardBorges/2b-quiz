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
      </v-card-text>
      <v-sheet
        border="lg"
        class="ma-2 overflow-y-auto overflow-x-hidden border-dark-color"
        rounded="lg"
        elevation="3">
        <v-data-table
          v-if="displayUserStudent || displayUserTeacher"
          :items="users"
          :headers="headers"
          class="ma-2"
          show-headers>
          <template v-slot:item.selected="{ item }">
            <v-checkbox
              v-model="item.selected"
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
        v-model="selected"
        :items="items"
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
      <!--    TODO choisir les membres à ajouter en cours de route -->
    </div>

    <div class="d-flex">
      <v-switch
        color="primary"
        label="Display question on public screen"
        v-model="displaySetting.displayQuestion"
        @update:model-value="
          displaySetting.displayAnswer =
            displaySetting.displayAnswer && displaySetting.displayQuestion
        " />
      <v-switch
        color="primary"
        label="Display answers on public screen"
        v-model="displaySetting.displayAnswer"
        :disabled="!displaySetting.displayQuestion" />
    </div>
  </div>
</template>

<script>
  import { ref } from 'vue';
  import { AccessType } from '@/utils/accesType';

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
        items: ['piloté', 'libre', 'chronometré'],
        selected: ref('piloté'),
        itemsAcces: [AccessType.PUBLIC, AccessType.PRIVATE, AccessType.CLOSED],
        selectedAcces: ref(AccessType.PRIVATE),
        SelectionDialog: ref(false),
        popup: ref(false),
        displaySetting: {
          displayQuestion: true,
          displayAnswer: true,
        },
        displayUserStudent: true,
        displayUserTeacher: false,
        displayUserGroup: false,
        selectedUsers: [],
        selectedGroups: [],
        toggleTable: '0',
        users: [
          {
            id: 1,
            username: 'username1',
            name: 'name1',
            surname: 'name1',
            selected: false,
          },
          {
            id: 2,
            username: 'username2',
            name: 'name2',
            surname: 'name2',
            selected: false,
          },
          {
            id: 3,
            username: 'username3',
            name: 'name3',
            surname: 'name3',
            selected: false,
          },
          {
            id: 4,
            username: 'username4',
            name: 'name4',
            surname: 'name4',
            selected: false,
          },
          {
            id: 5,
            username: 'username5',
            name: 'name5',
            surname: 'name5',
            selected: false,
          },
          {
            id: 6,
            username: 'username6',
            name: 'name6',
            surname: 'name6',
            selected: false,
          },
          {
            id: 7,
            username: 'username7',
            name: 'name7',
            surname: 'name7',
            selected: false,
          },
          {
            id: 8,
            username: 'username8',
            name: 'name8',
            surname: 'name8',
            selected: false,
          },
          {
            id: 9,
            username: 'username9',
            name: 'name9',
            surname: 'name9',
            selected: false,
          },
          {
            id: 10,
            username: 'username10',
            name: 'name10',
            surname: 'name10',
            selected: false,
          },
          {
            id: 11,
            username: 'username11',
            name: 'name11',
            surname: 'name11',
            selected: false,
          },
          {
            id: 12,
            username: 'username12',
            name: 'name12',
            surname: 'name12',
            selected: false,
          },
        ],
        groups: [
          { id: 1, name: 'name1', nb: 1, selected: false },
          { id: 2, name: 'name2', nb: 2, selected: false },
          { id: 3, name: 'name3', nb: 3, selected: false },
          { id: 4, name: 'name4', nb: 4, selected: false },
          { id: 5, name: 'name5', nb: 5, selected: false },
          { id: 6, name: 'name6', nb: 6, selected: false },
          { id: 7, name: 'name7', nb: 7, selected: false },
          { id: 8, name: 'name8', nb: 8, selected: false },
          { id: 9, name: 'name9', nb: 9, selected: false },
          { id: 10, name: 'name10', nb: 10, selected: false },
          { id: 11, name: 'name11', nb: 11, selected: false },
        ],
        headersGroups: [
          { title: 'ID', key: 'id' },
          { title: 'Name', key: 'name' },
          { title: 'Nb Users', key: 'nb' },
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
    methods: {
      openSelectionDialog() {
        this.SelectionDialog = true;
        this.displayUserTeacher = false;
        this.displayUserStudent = true;
        this.displayUserGroup = false;
      },
      closeSelectionDialog() {
        this.SelectionDialog = false;
        this.displayUserTeacher = false;
        this.displayUserStudent = false;
        this.displayUserGroup = false;
      },
      openDisplayUserStudent() {
        this.displayUserStudent = !this.displayUserStudent;
        this.displayUserTeacher = false;
        this.displayUserGroup = false;
      },
      openDisplayUserTeacher() {
        this.displayUserTeacher = !this.displayUserTeacher;
        this.displayUserStudent = false;
        this.displayUserGroup = false;
      },
      openDisplayUserGroup() {
        this.displayUserGroup = !this.displayUserGroup;
        this.displayUserTeacher = false;
        this.displayUserStudent = false;
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
    },
  };
</script>

<style scoped></style>
