<template>
  <v-sheet
    class="mt-5 p-6 mx-4"
    elevation="5"
    style="max-width: 1500px; width: 100%">
    <h1 class="text-h4 ma-5">{{ $t('group.GroupName') }}</h1>
    <table class="w-full">
      <thead>
      <tr>
        <th class="text-center">{{ $t('group.ID') }}</th>
        <th class="text-center">{{ $t('group.GroupName') }}</th>
        <th class="text-center">{{ $t('group.NumberOfPeople') }}</th>
        <th class="text-center">{{ $t('group.Actions') }}</th>
      </tr>
      </thead>
      <tbody>
        <tr class="ma-2" v-for="(group, index) in ListOFGroup" :key="index">
          <td class="text-center">
            {{ group.id }}
          </td>
          <td class="text-center">
            {{ group.groupName }}
          </td>
          <td class="text-center">
            {{ group.nbTabUsers }}
          </td>
          <td class="text-center">
            <v-btn
              class="ma-1"
              @click="openAddUser(group.id, index)"
              icon="add"></v-btn>
            <v-btn
              @click="openDisplay(index)"
              class="ma-1"
              icon="visibility"></v-btn>
            <v-btn
              class="ma-1"
              @click="openDelete(group.id)"
              icon="delete"></v-btn>
          </td>
        </tr>
      </tbody>
    </table>

    <v-dialog v-model="deleteDialog" max-height="700px" max-width="700px">
      <v-card>
        <v-card-title>{{ $t('group.DeleteGroupTitle') }}</v-card-title>
        <v-card-text>{{ $t('group.DeleteGroupConfirmation') }} </v-card-text>
        <v-card-actions>
          <v-btn @click="deleteGroup(this.SelectGroupID)">{{ $t('group.Yes') }}</v-btn>
          <v-btn @click="closeDialogs">{{ $t('group.No') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="CreateGroupDialog" max-width="500px">
      <v-card>
        <v-card-title>{{ $t('group.CreateGroupDialogTitle') }}</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="nameOFGroup"
            label="Group name"
            required></v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-btn @click="HandleCreateGroup">{{ $t('group.CreateButton') }}</v-btn>
          <v-btn @click="closeDialogs">{{ $t('group.CancelButton') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="DisplayGroupDialog"
      max-height="700px"
      max-width="1000px">
      <v-card class="d-flex align-center pa-2">
        <v-card-title class="headline font-weight-bold">
          Display group
        </v-card-title>
        <v-card-text class="subtitle-1">{{ $t('group.UsersListTitle') }}</v-card-text>

        <table class="mx-2">
          <thead>
            <tr>
              <th class="text-center">{{ $t('group.ID') }}</th>
              <th class="text-center">{{ $t('group.UserName') }}</th>
              <th class="text-center">{{ $t('group.UserSurname') }}</th>
              <th class="text-center">{{ $t('group.Actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr class="ma-2" v-for="(user, index) in usersOfGroup" :key="index">
              <td class="text-center">{{ user.id }}</td>
              <td class="text-center">{{ user.name }}</td>
              <td class="text-center">{{ user.surname }}</td>
              <td class="text-center">
                <v-btn @click="openDeleteUser(user.id)" icon="delete"></v-btn>
              </td>
            </tr>
          </tbody>
        </table>
        <v-card-actions>
          <v-btn @click="closeDialogs">{{ $t('admin.close') }} </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="DeleteUserDialog" max-height="700px" max-width="700px">
      <v-card>
        <v-card-title>{{ $t('group.DeleteUserTitle') }}</v-card-title>
        <v-card-text>
          {{ $t('group.DeleteUserConfirmation') }}
        </v-card-text>
        <v-card-actions>
          <v-btn @click="deleteUserFromGroup(this.SelectedUserID)">{{ $t('group.Yes') }}</v-btn>
          <v-btn @click="closeDialogs">{{ $t('group.CancelButton') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-btn class="ma-4" color="primary" @click="openCreate">
      {{ $t('group.CreateGroupButton') }}
    </v-btn>

    <v-dialog v-model="DisplayAddUser" max-height="700px" max-width="700px">
      <v-card class="d-flex align-center">
        <v-card-title>{{ $t('group.AddUserTitle') }}</v-card-title>
        <v-card-text>{{ $t('group.UsersListToAdd') }}</v-card-text>

        <v-btn-toggle class="ma-2">
          <v-btn @click="switchStudent">{{ $t('group.Students') }}</v-btn>
          <v-btn @click="switchTeacher">{{ $t('group.Teachers') }}</v-btn>
        </v-btn-toggle>
        <v-autocomplete
          v-model="selectedUsers"
          v-if="seeStudent"
          :items="usersToAdd"
          item-value="id"
          item-title="username"
          :label="$t('group.SelectUserLabel')"
          :chips="true"
          :closable-chips="true"
          :clearable="true"
          multiple=""
          class="w-50">
          <template v-slot:item="{ props, item }">
            <v-list-item
              v-bind="props"
              :title="item.raw.username"
              :subtitle="item.raw.name + ' ' + item.raw.surname"></v-list-item>
          </template>
        </v-autocomplete>

        <v-autocomplete
          v-model="selectedUsers"
          v-if="seeTeacher"
          :items="usersToAdd"
          item-value="id"
          item-title="username"
          :label="$t('group.SelectUserLabel')"
          :chips="true"
          :closable-chips="true"
          :clearable="true"
          multiple=""
          class="w-50">
          <template v-slot:item="{ props, item }">
            <v-list-item
              v-bind="props"
              :title="item.raw.username"
              :subtitle="item.raw.name + ' ' + item.raw.surname"></v-list-item>
          </template>
        </v-autocomplete>

        <v-card-actions>
          <v-btn @click="addUserToGroup">{{ $t('group.AddButton') }}</v-btn>
          <v-btn @click="closeAddUser">{{ $t('group.CloseButton') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-sheet>
</template>

<script>
  import { useUserStore } from '@/stores/userStore';
  import { ref } from 'vue';
  import { useGroupStore } from '@/stores/groupStore';

  export default {
    name: 'ListOfGroup',
    data() {
      return {
        addDialog: false,
        leaveDialog: false,
        deleteDialog: false,
        CreateGroupDialog: false,
        DisplayGroupDialog: false,
        DisplayAddUser: false,
        isDeletedUsers: false,
        DeleteUserDialog: false,
        nameOFGroup: ref(''),
        usersOfGroup: ref([]),
        usersToAdd: [],
        selectedUsers: [],
        SelectedUserID: ref(0),
        seeStudent: ref(false),
        seeTeacher: ref(false),
      };
    },
    setup() {
      const userStore = useUserStore();
      const useGroup = useGroupStore();
      return {
        userStore,
        useGroup,
        ListOFGroup: ref([]),
        SelectGroupID: ref(0),
      };
    },
    async mounted() {
      this.ListOFGroup = await this.useGroup.getGroups();
    },
    methods: {
      async switchStudent() {
        this.usersToAdd = await this.useGroup.getStudents();
        const existingUserIds = this.usersOfGroup.map((user) => user.id);
        this.usersToAdd = this.usersToAdd.filter(
          (user) => !existingUserIds.includes(user.id),
        );
        this.selectedUsers = [];
        this.seeStudent = true;
        this.seeTeacher = false;
      },
      async switchTeacher() {
        this.usersToAdd = await this.useGroup.getTeachers();
        const existingUserIds = this.usersOfGroup.map((user) => user.id);
        this.usersToAdd = this.usersToAdd.filter(
          (user) => !existingUserIds.includes(user.id),
        );
        this.selectedUsers = [];
        this.seeTeacher = true;
        this.seeStudent = false;
      },
      openDelete(id) {
        this.SelectGroupID = id;
        this.deleteDialog = true;
      },
      openDisplay(id) {
        this.SelectGroupID = this.ListOFGroup[id].id;
        this.usersOfGroup = this.ListOFGroup[id].tabUsers;
        this.DisplayGroupDialog = true;
      },
      openCreate() {
        this.CreateGroupDialog = true;
      },
      async openAddUser(id, index) {
        this.usersToAdd = await this.useGroup.getStudents();
        this.usersOfGroup = this.ListOFGroup[index].tabUsers;
        //Pour enlever les users déjà dans le groupe
        const existingUserIds = this.usersOfGroup.map((user) => user.id);
        this.usersToAdd = this.usersToAdd.filter(
          (user) => !existingUserIds.includes(user.id),
        );
        this.DisplayAddUser = true;
        this.SelectGroupID = id;
      },
      openDeleteUser(id) {
        this.SelectedUserID = id;
        this.DeleteUserDialog = true;
      },
      closeAddUser() {
        this.DisplayAddUser = false;
      },
      closeDialogs() {
        this.addDialog = false;
        this.leaveDialog = false;
        this.deleteDialog = false;
        this.CreateGroupDialog = false;
        this.DisplayGroupDialog = false;
        this.DisplayAddUser = false;
        this.DeleteUserDialog = false;
      },
      async HandleCreateGroup() {
        if (this.nameOFGroup === '') {
          alert(this.$t('group.PENGroup'));
          return;
        }
        await this.useGroup.createGroup(this.nameOFGroup);
        this.ListOFGroup = await this.useGroup.getGroups();
        this.closeDialogs();
      },
      async deleteGroup(id) {
        await this.useGroup.deleteGroupID(id);
        this.ListOFGroup = await this.useGroup.getGroups();
        this.closeDialogs();
      },
      async addUserToGroup() {
        for (let i = 0; i < this.selectedUsers.length; i++) {
          await this.useGroup.addStudentToAGroup(
            this.SelectGroupID,
            this.selectedUsers[i],
          );
        }
        this.selectedUsers = [];
        this.ListOFGroup = await this.useGroup.getGroups();
        this.closeAddUser();
      },
      async deleteUserFromGroup(id) {
        await this.useGroup.removeStudentFromAGroup(this.SelectGroupID, id);
        this.ListOFGroup = await this.useGroup.getGroups();
        this.closeDialogs();
      },
    },
  };
</script>

<style scoped>
  table {
    width: 100%;
    border-collapse: collapse;
  }

  th,
  td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
  }

  .d-flex {
    display: flex;
  }

  .align-center {
    align-items: center;
  }

  .w-50 {
    width: 50%;
  }

  @media (max-width: 600px) {
    table {
      font-size: 14px;
    }

    th,
    td {
      padding: 6px;
    }

    .w-50 {
      width: 100%;
    }
  }
</style>
