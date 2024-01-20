<template>
  <v-sheet
    max-width="1500px"
    rounded="lg"
    width="70%"
    class="mt-5 px-6 py-8 mx-auto"
    elevation="5">
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
        <!--      <tr class="ma-2">-->
        <!--        <td class="text-center">1</td>-->
        <!--        <td class="text-center" @click="openDisplay">group.groupName</td>-->
        <!--        <td class="text-center">7</td>-->
        <!--        <td class="text-center">-->
        <!--          <v-btn @click="openAddUser" icon="add"></v-btn>-->
        <!--          <v-btn @click="openLeave" icon="logout"></v-btn>-->
        <!--          <v-btn @click="openDelete" icon="delete"></v-btn>-->
        <!--        </td>-->
        <!--      </tr>-->
        <tr class="ma-2" v-for="group in ListOFGroup">
          <td class="text-center">{{ group.id }}</td>
          <td class="text-center" @click="openDisplay">
            {{ group.groupName }}
          </td>
          <td class="text-center">{{ group.nbTabUsers }}</td>
          <td class="text-center">
            <v-btn @click="openAddUser" icon="add"></v-btn>
            <v-btn @click="openLeave" icon="logout"></v-btn>
            <v-btn @click="openDelete" icon="delete"></v-btn>
          </td>
        </tr>
      </tbody>
    </table>

    <v-dialog v-model="addDialog" max-width="500px">
      <v-card>
        <v-card-title>Add User</v-card-title>
        <v-card-text>
          <v-text-field label="Email" required></v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-btn @click="closeDialogs">Add</v-btn>
          <v-btn @click="closeDialogs">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="leaveDialog" max-width="500px">
      <v-card>
        <v-card-title>Leave Group</v-card-title>
        <v-card-text>Are you sure to leave this Group?</v-card-text>
        <v-card-actions>
          <v-btn @click="closeDialogs">Yes</v-btn>
          <v-btn @click="closeDialogs">No</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title>Delete Group</v-card-title>
        <v-card-text>Are you sure to delete this Group?</v-card-text>
        <v-card-actions>
          <v-btn @click="closeDialogs">Yes</v-btn>
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

    <v-dialog v-model="DisplayGroupDialog" max-width="500px">
      <v-card>
        <v-card-title>Display group</v-card-title>
        <v-card-text>List of users in the group</v-card-text>

        <table>
          <thead>
            <tr>
              <th class="text-center">Name</th>
              <th class="text-center">Surname</th>
              <th class="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr class="ma-2">
              <td class="text-center">Axel</td>
              <td class="text-center">GUILLOU</td>
              <td class="text-center">
                <v-btn @click="openDelete" icon="delete"></v-btn>
              </td>
            </tr>
          </tbody>
        </table>
        <v-card-actions>
          <v-btn @click="closeDialogs">Create</v-btn>
          <v-btn @click="closeDialogs">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-btn class="mt-5" color="primary" @click="openCreate">
      Create a group
    </v-btn>

    <v-dialog v-model="DisplayAddUser" max-width="1000px">
      <v-card>
        <v-card-title>Add user to a group</v-card-title>
        <v-card-text>List of users to add</v-card-text>

        <table>
          <thead>
            <tr>
              <th class="text-center">ID</th>
              <th class="text-center">Username</th>
              <th class="text-center">Name</th>
              <th class="text-center">Surname</th>
              <th class="text-center">Type</th>
              <th class="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id" class="ma-2">
              <td class="text-center">{{ user.id }}</td>
              <td class="text-center">{{ user.username }}</td>
              <td class="text-center">{{ user.name }}</td>
              <td class="text-center">{{ user.surname }}</td>
              <td class="text-center">{{ user.type }}</td>
              <td class="text-center">
                <v-btn @click="openDelete" text="add"></v-btn>
              </td>
            </tr>
          </tbody>
        </table>
        <v-card-actions>
          <v-btn @click="closeAddUser">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-sheet>
</template>

<script>
  import { useUserStore } from '@/stores/userStore';
  import { ref } from 'vue';
  import AdminTableHeaderBlock from '@/components/admin/AdminTableHeaderBlock.vue';
  import AdminListItem from '@/components/admin/AdminListItem.vue';
  import { useGroupStore } from '@/stores/groupStore';

  export default {
    components: { AdminListItem, AdminTableHeaderBlock },
    data() {
      return {
        addDialog: false,
        leaveDialog: false,
        deleteDialog: false,
        CreateGroupDialog: false,
        DisplayGroupDialog: false,
        DisplayAddUser: false,
        isDeletedUsers: false,
        sorting: {
          id: null,
          username: null,
          name: null,
          surname: null,
          type: null,
          validate: null,
        },
        loading: ref(false),
        nbItemsOptions: [10, 20, 50, 100],
        indexPage: 1,
        itemsPerPage: 10,
        columns1: [
          { id: 'id', label: 'ID' },
          { id: 'username', label: 'Username' },
          { id: 'name', label: 'Name' },
          { id: 'surname', label: 'Surname' },
          { id: 'type', label: 'Type' },
          { id: 'askedDelete', label: 'Asked delete', icon: 'feedback' },
          { id: 'validate', label: 'Validated' },
        ],
        nameOFGroup: ref(''),
      };
    },
    setup() {
      const userStore = useUserStore();
      const useGroup = useGroupStore();
      return {
        userStore,
        useGroup,
        ListOFGroup: ref([{ id: 17, groupName: 'test' }]),
        users: ref([
          {
            id: 18,
            username: 'Apolline.Lecomte',
            name: 'Apolline',
            surname: 'Lecomte',
            type: 'student',
          },
          {
            id: 19,
            username: 'Dimitri35',
            name: 'Dimitri',
            surname: 'Laurent',
            type: 'student',
          },
          {
            id: 20,
            username: 'Martine_Hubert30',
            name: 'Martine',
            surname: 'Hubert',
            type: 'student',
          },
          {
            id: 21,
            username: 'Angelique.Sanchez',
            name: 'Angélique',
            surname: 'Sanchez',
            type: 'student',
          },
          {
            id: 22,
            username: 'Maud.Rousseau',
            name: 'Maud',
            surname: 'Rousseau',
            type: 'student',
          },
          {
            id: 23,
            username: 'Paterne_Lemoine80',
            name: 'Paterne',
            surname: 'Lemoine',
            type: 'student',
          },
          {
            id: 24,
            username: 'Jade_Garnier',
            name: 'Jade',
            surname: 'Garnier',
            type: 'student',
          },
          {
            id: 25,
            username: 'Eulalie60',
            name: 'Eulalie',
            surname: 'Fabre',
            type: 'student',
          },
        ]),
        nbPage: ref(1),
      };
    },
    async mounted() {
      this.ListOFGroup = await this.useGroup.getGroups(); //this.useGroup.tabsGroups;
      console.log('groups of ListOFGroup', this.ListOFGroup);
    },
    computed: {
      filteredUsers() {
        return this.users.filter((user) =>
          user.name.toLowerCase().includes(this.search.toLowerCase()),
        );
      },
    },
    methods: {
      openAdd() {
        this.addDialog = true;
      },
      openLeave() {
        this.leaveDialog = true;
      },
      openDelete() {
        this.deleteDialog = true;
      },
      openDisplay() {
        this.DisplayGroupDialog = true;
      },
      openCreate() {
        this.CreateGroupDialog = true;
      },
      openAddUser() {
        this.DisplayAddUser = true;
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
      },
      HandleCreateGroup() {
        if (this.nameOFGroup === '') {
          alert('Please enter a name for the group');
          return;
        }
        this.useGroup.createGroup(this.nameOFGroup);
        this.closeDialogs();
      },
    },
  };
</script>

<style scoped>
  table {
    border-collapse: collapse;
    width: 100%;
  }

  th,
  td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }

  th {
    background-color: #f2f2f2;
  }

  tr:hover {
    background-color: #f5f5f5;
  }
</style>
