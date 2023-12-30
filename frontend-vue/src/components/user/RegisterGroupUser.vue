<template>
  <div>
    <div class="d-flex mb-3">
      <p class="text-h4">Import user</p>
      <v-spacer></v-spacer>
      <v-dialog v-model="importCsvDialog" max-width="600px">
        <template v-slot:activator="{ props }">
          <v-btn dark class="mb-2" v-bind="props">Import from CSV</v-btn>
        </template>
        <v-card class="pa-2">
          <v-card-title>
            <span>Import CSV</span>
          </v-card-title>
          <v-card-text>
            <v-alert color="info" icon="$info" class="mb-5 mx-5">
              <p class="mb-1">
                The csv file must contain a header with the following fields:
                <code class="text-dark-color">
                  username,name,surname,userType
                </code>
                .
              </p>
              <p>
                The field
                <code>userType</code>
                must be one of the following values:
                <code class="text-dark-color">student,teacher,admin</code>
                .
              </p>
            </v-alert>
            <v-file-input
              v-model="csv"
              accept=".csv"
              label="Select CSV file"
              outlined
              dense
              placeholder="No file selected"></v-file-input>
            <div v-if="csv">
              <v-divider></v-divider>
              <p class="mb-2 mt-4">Preview of the file:</p>
              <v-sheet class="pa-3" max-height="500" rounded="lg" border>
                <pre class="overflow-auto">{{ getPreview() }}</pre>
              </v-sheet>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="text" @click="importCsvDialog = false">
              Cancel
            </v-btn>
            <!-- TODO: add close popup message -->
            <v-btn
              variant="text"
              @click="importCsv"
              :disabled="!(csv && csv[0])">
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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
  </div>
</template>

<script>
  import { ValidationError } from '@/utils/valdiationError';
  import { useUserStore } from '@/stores/userStore';
  import { ref } from 'vue';
  import { getUserRoles, UserRoles } from '@/utils/userRoles';
  import { parseUserListCsv } from '@/utils/csvParser';

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
          { title: 'Account Type', key: 'userType' },
          { title: 'Actions', key: 'actions', sortable: false },
        ],
        users: [],
        username: ref(''),
        accountType: ref('student'),
        surname: ref(''),
        name: ref(''),
        importCsvDialog: false,
        csv: null,
        preview: '',
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
      async importCsv() {
        console.log(this.csv[0]);
        try {
          const usersData = await parseUserListCsv(this.csv[0]);
          usersData.forEach((user) => {
            user.validate = true;
          });
          this.users = usersData;
          this.importCsvDialog = false;
          //TODO add success message
        } catch (error) {
          console.log(error); //TODO: handle parse error
        }
      },
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
          await this.userStore.registerMultiple(body);
          this.$emit('users-registered', {
            nbUsers: this.users.length,
          });
        } catch (error) {
          if (error instanceof ValidationError) {
            if (error.message.includes('duplicate username error:'))
              this.$emit(
                'error-register-multiple-duplicate',
                error.message.split('duplicate username error:')[1].split(','),
              );
            else
              this.$emit(
                'error-register-multiple-used',
                error.message.split('used username error:')[1].split(','),
              );
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
      getPreview() {
        //return the content of the csv file
        const file = this.csv[0];
        const reader = new FileReader();
        if (!file) return;
        //read csv file for preview with Line Feed
        reader.onload = (e) => {
          const text = e.target.result;
          const lines = text.split(/[\r\n]/);
          console.log(lines);
          this.preview = lines.slice(0, 5).join('\n');
        };
        reader.readAsText(file);
        return this.preview;
      },
    },
  };
</script>

<style>
  .v-data-table-header__sort-badge {
    display: none;
  }
</style>
