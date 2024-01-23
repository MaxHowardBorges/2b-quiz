<template>
  <v-sheet
    class="mt-5 p-6 mx-auto"
    elevation="5"
    style="max-width: 1500px; width: 100%">
    <h1 class="text-h4 ma-5">List of groups</h1>
    <table class="w-full">
      <thead>
        <tr>
          <th class="text-center">id</th>
          <th class="text-center">Group name</th>
          <th class="text-center">Number of people</th>
          <th class="text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr class="ma-2" v-for="(group, index) in ListOFGroup" :key="index">
          <td class="text-center" @click="openDisplay(index)">
            {{ group.id }}
          </td>
          <td class="text-center" @click="openDisplay(index)">
            {{ group.groupName }}
          </td>
          <td class="text-center" @click="openDisplay(index)">
            {{ group.nbTabUsers }}
          </td>
          <td class="text-center">
            <v-btn
              class="ma-1"
              @click="openAddUser(group.id, index)"
              icon="add"></v-btn>
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
        <v-card-title>Delete Group</v-card-title>
        <v-card-text>Are you sure to delete this Group?</v-card-text>
        <v-card-actions>
          <v-btn @click="deleteGroup(this.SelectGroupID)">Yes</v-btn>
          <v-btn @click="closeDialogs">No</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="CreateGroupDialog" max-width="500px">
      <v-card>
        <v-card-title>Create a group</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="nameOFGroup"
            label="Group name"
            required></v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-btn @click="HandleCreateGroup">Create</v-btn>
          <v-btn @click="closeDialogs">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="DisplayGroupDialog"
      max-height="700px"
      max-width="1000px">
      <v-card class="d-flex align-center">
        <v-card-title class="headline font-weight-bold">
          Display group
        </v-card-title>
        <v-card-text class="subtitle-1">List of users in the group</v-card-text>

        <table>
          <thead>
            <tr>
              <th class="text-center">ID</th>
              <th class="text-center">Name</th>
              <th class="text-center">Surname</th>
              <th class="text-center">Actions</th>
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
          <v-btn @click="closeDialogs">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="DeleteUserDialog" max-height="700px" max-width="700px">
      <v-card>
        <v-card-title>Delete user</v-card-title>
        <v-card-text>
          Are you sure to delete this user of the group?
        </v-card-text>
        <v-card-actions>
          <v-btn @click="deleteUserFromGroup(this.SelectedUserID)">Yes</v-btn>
          <v-btn @click="closeDialogs">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-btn class="ma-4" color="primary" @click="openCreate">
      Create a group
    </v-btn>

    <v-dialog v-model="DisplayAddUser" max-height="700px" max-width="700px">
      <v-card class="d-flex align-center">
        <v-card-title>Add user to a group</v-card-title>
        <v-card-text>List of users to add</v-card-text>

        <v-btn-toggle class="ma-2">
          <v-btn @click="switchStudent">Students</v-btn>
          <v-btn @click="switchTeacher">Teachers</v-btn>
        </v-btn-toggle>
        <v-autocomplete
          v-model="selectedUsers"
          v-if="seeStudent"
          :items="usersToAdd"
          item-value="id"
          item-title="username"
          label="Select a user"
          chips
          closable-chips
          clearable
          multiple
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
          label="Select a user"
          chips
          closable-chips
          clearable
          multiple
          class="w-50">
          <template v-slot:item="{ props, item }">
            <v-list-item
              v-bind="props"
              :title="item.raw.username"
              :subtitle="item.raw.name + ' ' + item.raw.surname"></v-list-item>
          </template>
        </v-autocomplete>

        <v-card-actions>
          <v-btn @click="addUserToGroup">Add</v-btn>
          <v-btn @click="closeAddUser">Close</v-btn>
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
        usersToAdd: ref([]),
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
        ListOFGroup: ref([{ id: 17, groupName: 'test' }]),
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
          alert('Please enter a name for the group');
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
