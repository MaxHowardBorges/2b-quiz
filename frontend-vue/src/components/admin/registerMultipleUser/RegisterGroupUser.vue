<template>
  <div>
    <div class="d-flex mb-3">
      <p class="text-h4">Import user</p>
      <v-spacer></v-spacer>
      <csv-import-dialog @import-csv="saveUsersFromCsv" />
    </div>
    <v-data-table
      :items="users"
      class="elevation-1"
      :headers="headers"
      :multi-sort="true"
      :sort-by="[{ key: 'validate', order: 'desc' }]">
      <template v-slot:top>
        <v-toolbar class="justify-center">
          <v-toolbar-title>Users</v-toolbar-title>
          <v-spacer></v-spacer>

          <v-btn
            @click="addRow"
            :disabled="isNotValidatedUser()"
            prepend-icon="add">
            Add user
          </v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item="{ item }">
        <tr v-if="item.validate">
          <td>{{ item.username }}</td>
          <td>{{ item.surname }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.userType }}</td>
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
              v-model="item.userType"
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
    <v-btn
      class="mt-2"
      color="primary"
      @click="register"
      :disabled="isNotValidatedUser()">
      Register
    </v-btn>
    <v-alert color="red" dismissible type="warning" v-if="errorMessage">
      {{ errorMessage }}
    </v-alert>
  </div>
</template>

<script>
  import { ValidationError } from '@/utils/valdiationError';
  import { useUserStore } from '@/stores/userStore';
  import { getUserRoles, UserRoles } from '@/utils/userRoles';
  import CsvImportDialog from '@/components/admin/registerMultipleUser/CsvImportDialog.vue';

  export default {
    components: { CsvImportDialog },
    data() {
      return {
        headers: [
          {
            title: 'Username',
            align: 'start',
            key: 'username',
          },
          { title: 'Name', key: 'name' },
          { title: 'Surname', key: 'surname' },
          { title: 'Account Type', key: 'userType' },
          { title: 'Actions', key: 'actions', sortable: false },
        ],
        errorMessage: '',
        users: [],
        usernameExists: false,
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
      async register() {
        try {
          const body = [];
          this.users.forEach((user) => {
            body.push({
              username: user.username,
              name: user.name,
              surname: user.surname,
              userType: user.userType,
            });
          });
          await this.userStore.registerMultiple(body);
          this.$emit('user-registered', {
            nbUsers: this.users.length,
          });
          this.users = [];
        } catch (error) {
          if (error instanceof ValidationError) {
            console.log(error.message);
            if (error.message.includes('duplicate username error:'))
              this.$emit(
                'error-register-multiple-duplicate',
                error.message.split('duplicate username error:')[1].split(','),
              );
            else if (error.message.includes('used username error:'))
              this.$emit(
                'error-register-multiple-used',
                error.message.split('used username error:')[1].split(','),
              );
            else this.$emit('error-register-multiple', error);
          } else this.$emit('error-register-multiple', error);
        }
      },
      addRow() {
        const rowData = {
          surname: '',
          name: '',
          username: '',
          userType: UserRoles.STUDENT,
          validate: false,
        };
        this.users.push(rowData);
      },
      validateItem(item) {
        if (item.username !== '' && item.name !== '' && item.surname !== '') {
          this.usernameExists = this.users.some(
            (user) => user.username === item.username && user !== item,
          );
          if (!this.usernameExists) {
            item.validate = true;
            this.errorMessage = '';
          } else {
            console.log('Username déjà existant dans une autre ligne.');
            this.errorMessage = 'Username déjà existant dans une autre ligne.';
          }
        } else {
          this.errorMessage =
            "Il y a un ou plusieurs éléments nécessaires qui n'ont pas été renseignés.";
        }
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
      saveUsersFromCsv(users) {
        this.users = users;
      },
    },
    emits: [
      'user-registered',
      'error-register-multiple',
      'error-register-multiple-used',
      'error-register-multiple-duplicate',
    ],
  };
</script>

<style>
  .v-data-table-header__sort-badge {
    display: none;
  }
  .error-message {
    color: red;
    margin-top: 10px;
  }
</style>
