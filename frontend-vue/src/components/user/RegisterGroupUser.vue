<template>
  <div>
    <v-data-table
      :items="users"
      class="elevation-1"
      :headers="headers"
      :multi-sort="true"
      :sort-by="[{ key: 'validate', order: 'desc' }]">
      <template v-slot:top>
        <v-toolbar class="justify-center">
          <v-toolbar-title>New users</v-toolbar-title>
          <v-divider class="mx-4" :inset="true" :vertical="true"></v-divider>
          <v-spacer></v-spacer>
          <v-btn
            @click="addRow"
            :disabled="isNotValidatedUser()"
            prepend-icon="add">
            Ajouter une ligne
          </v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item="{ item }">
        <tr v-if="item.validate">
          <td>{{ item.username }}</td>
          <td>{{ item.surname }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.accountType }}</td>
          <td>
            <div>
              <v-btn
                elevation="2"
                size="small"
                class="mx-2"
                @click="editItem(item)"
                color="warning"
                icon="edit"></v-btn>
              <v-btn
                elevation="2"
                size="small"
                class="mx-2"
                @click="deleteItem(item)"
                color="error"
                icon="delete"></v-btn>
            </div>
          </td>
        </tr>
        <tr v-else>
          <td>
            <v-text-field
              v-model="item.username"
              variant="underlined"></v-text-field>
          </td>
          <td>
            <v-text-field
              v-model="item.name"
              variant="underlined"></v-text-field>
          </td>
          <td>
            <v-text-field
              v-model="item.surname"
              variant="underlined"></v-text-field>
          </td>
          <td>
            <v-select
              v-model="item.accountType"
              variant="underlined"
              :items="types"></v-select>
          </td>
          <td>
            <div>
              <v-btn
                elevation="2"
                size="small"
                class="mx-2"
                @click="validateItem(item)"
                color="success"
                icon="done"></v-btn>
              <v-btn
                elevation="2"
                size="small"
                class="mx-2"
                @click="deleteItem(item)"
                color="error"
                icon="delete"></v-btn>
            </div>
          </td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script>
  import { ValidationError } from '@/utils/valdiationError';
  import { useUserStore } from '@/stores/userStore';
  import { ref } from 'vue';
  import { getUserRoles, UserRoles } from '@/utils/userRoles';

  export default {
    data() {
      return {
        items: [
          { surname: '', name: '', username: '', accountType: 'student' },
        ],
        headers: [
          {
            title: 'Username',
            align: 'start',
            key: 'username',
          },
          { title: 'Name', key: 'name' },
          { title: 'Surname', key: 'surname' },
          { title: 'Account Type', key: 'accountType' },
          { title: 'Actions', key: 'actions', sortable: false },
        ],
        users: [],
        username: ref(''),
        accountType: ref('student'),
        surname: ref(''),
        name: ref(''),
        rules: {
          required: (value) => !!value || 'Required',
        },
      };
    },
    setup() {
      const userStore = useUserStore();
      return {
        types: getUserRoles(),
        userStore,
      };
    },
    methods: {
      getUserRoles,
      async register() {
        try {
          const body = [];
          this.users.forEach((user) => {
            body.push({
              username: user.username,
              name: user.name,
              surname: user.surname,
              userType: user.accountType,
            });
          });
          await this.userStore.registerMultiple(this.users);
          this.$emit('users-registered', {
            nbUsers: this.users.length,
          });
        } catch (error) {
          if (error instanceof ValidationError) {
            this.$emit('error-register', this.username);
          } else this.$emit('error-register', error);
        }
      },
      addRow() {
        const rowData = {
          surname: '',
          name: '',
          username: '',
          accountType: UserRoles.STUDENT,
          validate: false,
        };
        this.users.push(rowData);
      },
      validateItem(item) {
        item.validate = true;
      },
      editItem(item) {
        item.validate = false;
      },
      deleteItem(item) {
        const index = this.users.indexOf(item);
        if (index > -1) {
          this.users.splice(index, 1);
        }
      },
      isNotValidatedUser() {
        return this.users.some((user) => !user.validate);
      },
    },
  };
</script>

<style>
  .v-data-table-header__sort-badge {
    display: none;
  }
</style>
