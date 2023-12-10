<script>

  import { useUserStore } from '@/stores/userStore';

  export default {
    data() {
      return {
        indexpage: 1,
        indexLigne: 7,
      };
    },
    setup() {
      const userStore = useUserStore();

      return {
        userStore,
      };
    },
    async mounted() {
      await this.userStore.getUsers(1, 7);
    },
    computed: {
      pageOptions() {
        return Array.from({ length: 25 }, (_, index) => index + 1);
      },
      lineOptions() {
        return Array.from({ length: 50 }, (_, index) => index + 1);
      },
    },
    methods: {

      async loadUser() {
        let response = await this.userStore.getUsers(this.indexpage+1, this.indexLigne);
        if(this.userStore.users.length===0){
          this.indexpage=1;
          response = await this.userStore.getUsers(this.indexpage, this.indexLigne);
        }
        else{
          this.indexpage++;
        }
      },

      async loadUserW() {
        await this.userStore.getUsers(this.indexpage, this.indexLigne);
        console.log("test",this.indexpage, this.indexLigne);
      }
    },
    watch: {
      indexpage: 'loadUserW',
      indexLigne: 'loadUserW',
    },
  }

</script>

<template>

  <v-sheet id="app" v-if="userStore.isAuthenticated && userStore.isAdmin">
    <h1>Admin Page</h1>
    <h2>List of Users</h2>


    <v-sheet class='ma-2'>
      <v-select
        id="pageSelector"
        v-model="indexpage"
        @change='loadUserW'
        :items="pageOptions"
        label="Select page:"
        dense
        outlined
      ></v-select>
    </v-sheet>

    <v-sheet class="ma-2">
      <v-select
        id="lineSelector"
        v-model="indexLigne"
        @change="loadUserW"
        :items="lineOptions"
        label="Select the number of lines:"
        dense
        outlined
      ></v-select></v-sheet>
    <table>
      <thead>
    <tr>
      <th>ID</th>
      <th>Name</th>
      <th>Surname</th>
      <th>Type</th>
    </tr>
    </thead>
      <tbody>

      <tr class='professeurs-valides'  v-for="user in userStore.users" :key="user.id" v-if='userStore.users !== null'>
        <td>{{ user.id }}</td>
        <td>{{ user.name }}</td>
        <td>{{ user.surname }}</td>
        <td>{{ user.userType }}</td>
      </tr>
      </tbody>
    </table>

    <v-sheet class='ma-5'>
      <v-btn text="Next Page" @click="loadUser">    </v-btn>
    </v-sheet>

  </v-sheet>
</template>

<style scoped>
  #app {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }

  h1 {
    font-size: 24px;
    margin-bottom: 20px;
    text-align: center;
  }

  h2 {
    font-size: 20px;
    margin-top: 20px;
    margin-bottom: 10px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    margin-bottom: 20px;
  }

  th, td {
    padding: 10px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }

  th {
    background-color: #f2f2f2;
  }

  tbody tr:hover {
    background-color: #f0f0f0;
  }

  .professeurs-valides {
    background-color: #c9f7c5;
  }

  .professeurs-attente {
    background-color: #fce5cd;
  }
</style>
