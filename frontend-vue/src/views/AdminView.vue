<script>

  import { useUserStore } from '@/stores/userStore';

  export default {
    data() {
      return {
        professeursValides: [
          { id: 1, nom: 'GUILLOU', prenom: 'Axel', type: 'Validé' },
          { id: 2, nom: 'BENIZRI', prenom: 'Sam', type: 'Validé' },
        ],
        professeursEnAttente: [
          { id: 3, nom: 'BORGES', prenom: 'Maxime', type: 'En attente' },
          { id: 4, nom: 'PALOTAS', prenom: 'Tamas', type: 'En attente' },
        ],
      };
    },
    setup() {
      const userStore = useUserStore();
      return {
        userStore,
      };
    },
    methods: {
      async fetchUsers(page, nbItem) {
        try {
          const response = await this.userStore.getUsers(page, nbItem);
          if (!response.ok) {
            throw new Error('Erreur de chargement des utilisateurs');
          }
          const users = await response.json();
          this.userStore.commit('userStore/setUsers', users);
        } catch (error) {
          console.error(error);
        }
      },

      async loadUser() {
        const response = await this.userStore.getUsers(1, 50);
        console.log(this.userStore.users);
      }


    },
  }

</script>

<template>

  <div id="app" v-if="userStore.isAuthenticated && userStore.isAdmin" @click='loadUser'>
    <h1>Page d'Administration</h1>
    <h2>Professeurs Validés</h2>
    <table>
      <thead>
    <tr>
      <th>ID</th>
      <th>Nom</th>
      <th>Prénom</th>
      <th>Type</th>
    </tr>
    </thead>
      <tbody>
<!--    <v-sheet v-for="(user, index) in userStore.getUsers(1, 50)" :key="index">-->
      <tr class='professeurs-valides'  v-for="user in userStore.users" :key="user.id" v-if='userStore.users.length > 0'>
        <td>{{ user.id }}</td>
        <td>{{ user.name }}</td>
        <td>{{ user.surname }}</td>
        <td>{{ user.userType }}</td>
      </tr>
<!--    </v-sheet>-->
      </tbody>
    </table>

<!--    <h2>Professeurs en Attente de Validation</h2>-->
<!--    <table>-->
<!--      <thead>-->
<!--      <tr>-->
<!--        <th>ID</th>-->
<!--        <th>Nom</th>-->
<!--        <th>Prénom</th>-->
<!--        <th>Type</th>-->
<!--      </tr>-->
<!--      </thead>-->
<!--      <tbody>-->
<!--      <tr class='professeurs-attente' v-for="professeur in professeursEnAttente" :key="professeur.id">-->
<!--        <td>{{ professeur.id }}</td>-->
<!--        <td>{{ professeur.nom }}</td>-->
<!--        <td>{{ professeur.prenom }}</td>-->
<!--        <td>{{ professeur.type }}</td>-->
<!--      </tr>-->
<!--      </tbody>-->
<!--    </table>-->
  </div>
</template>

<style scoped>
  #app {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f5f5f5;
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
