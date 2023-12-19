<template>
  <div>
    <v-data-table :items="users" class="elevation-1" :headers="headers">
      <template v-slot:top>
        <v-toolbar class="justify-center">
          <v-btn @click="addRow" color="primary">
            <v-icon left>mdi-plus</v-icon>
            Ajouter une ligne
          </v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item="{ item }">
        <tr>
          <td>{{ item.username }}</td>
          <td>{{ item.surname }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.accountType }}</td>
          <td>
            <div v-if="item.validate">
              <v-icon size="small" class="me-2" @click="editItem(item)">
                edit
              </v-icon>
              <v-icon size="small" @click="deleteItem(item)">delete</v-icon>
            </div>
            <div v-else>
              <v-btn
                class="ma-3 align-center"
                @click="validateRow()"
                color="success">
                Valider
              </v-btn>
            </div>
          </td>
        </tr>
      </template>
      <template v-slot:bottom>
        <tr>
          <td>
            <v-text-field v-model="surname" label="Prénom" class="w-100" />
          </td>
          <td>
            <v-text-field v-model="name" label="Nom de famille" class="w-100" />
          </td>
          <td>
            <v-text-field
              v-model="username"
              label="Nom d'utilisateur"
              class="w-100" />
          </td>
          <td>
            <v-select
              v-model="accountType"
              :items="types"
              label="Type"></v-select>
          </td>
          <td>
            <v-btn
              class="ma-3 align-center"
              @click="validateRow()"
              color="success">
              Valider
            </v-btn>
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

  export default {
    data() {
      return {
        types: ['student', 'teacher', 'admin'],
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
      };
    },
    methods: {
      setup() {
        const userStore = useUserStore();
        return {
          userStore,
        };
      },
      async register() {
        try {
          await this.userStore.register(
            this.surname,
            this.name,
            this.username,
            this.accountType,
          );
          this.$emit('user-registered', {
            username: this.username,
            name: this.name,
            surname: this.surname,
            accountType: this.accountType,
          });
        } catch (error) {
          if (error instanceof ValidationError) {
            this.$emit('error-register', this.username);
          } else this.$emit('error-register', error);
        }
      },
      addRow() {
        this.items.splice(1, 0, {
          surname: '',
          name: '',
          username: '',
          accountType: 'student',
        });
      },
      validateRow() {
        const rowData = {
          username: this.username,
          accountType: this.accountType,
          surname: this.surname,
          name: this.name,
          validate: false,
        };
        this.users.push(rowData);
      },
    },
  };
</script>

<style></style>
