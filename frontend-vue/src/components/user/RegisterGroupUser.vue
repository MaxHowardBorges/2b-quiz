<template>
  <v-app>
    <v-container>
      <v-data-table
        :items="items"
        class="elevation-1"
      >

        <template v-slot:top>
          <v-toolbar class="justify-center">
            <v-btn @click="addRow" color="primary">
              <v-icon left>mdi-plus</v-icon>Ajouter une ligne
            </v-btn>
          </v-toolbar>
        </template>

        <template v-slot:item="{ item, index }">
          <tr>
            <td><v-text-field v-model="item.surname" label="Prénom" class="w-100"/></td>
            <td><v-text-field v-model="item.name" label="Nom de famille" class="w-100"/></td>
            <td><v-text-field v-model="item.username" label="Nom d'utilisateur" class="w-100"/></td>
            <td>
              <v-select v-model="item.accountType" :items="types" label="Type"></v-select>
            </td>
            <td>
              <v-btn class="ma-3 align-center" @click="validateRow(index)" color="success">Valider</v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-container>
  </v-app>
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
      };
    },
    methods: {
      setup() {
        const userStore = useUserStore();
        return {
          userStore,
          username: ref(''),
          accountType: ref('student'),
          surname: ref(''),
          name: ref(''),
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
        this.items.splice(1, 0, { surname: '', name: '', username: '', accountType: 'student' });
      },
      validateRow(index) {
        const rowData = this.items[index];
      },
    },
  };
</script>

<style>
</style>
