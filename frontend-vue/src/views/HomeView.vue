<template>
  <v-snackbar v-model="snackbarError" vertical="">
    <div class="text-subtitle-1 pb-2">Erreur lors de la session.</div>

    <p>Veuillez vérifier l'ID de session.</p>

    <template v-slot:actions>
      <v-btn color="indigo" variant="text" @click="snackbarError = false">
        Close
      </v-btn>
    </template>
  </v-snackbar>

  <v-dialog v-model="dialogError" width="auto">
    <!-- TODO make a component-->
    <v-card class="pa-5" min-width="40vw">
      <v-card-text>
        <p class="mb-3 text-h3 text-error text-uppercase">
          The server is offline
        </p>
        <p>The server is offline.</p>
        <p>Re-try later.</p>
      </v-card-text>
      <v-card-actions class="align-self-end">
        <v-btn variant="elevated" color="info" @click="dialogError = false">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <form @submit.prevent="handleJoinSession">
    <label id="id" for="id"></label>
    <input
      id="username"
      type="text"
      placeholder="Votre nom"
      v-model="username"
      style="border: 1px solid #000000" />
    <input
      id="id-Session"
      type="text"
      placeholder="ID de la Session"
      v-model="idSession"
      style="border: 1px solid #000000" />
    <input id="submit1" type="submit" value="Join" />
  </form>
</template>

<script>
  import { ref } from 'vue';
  import { mainStore } from '@/stores/main.store';
  import { fetchAPIStore } from '@/stores/fetchAPI.store';
  import { mapStores } from 'pinia';

  export default {
    computed: {
      ...mapStores(mainStore, fetchAPIStore),
    },
    methods: {
      async handleJoinSession() {
        try {
          const body = { idSession: this.idSession, username: this.username };
          this.mainStore.setRouter(this.$router);
          if (!(await this.fetchAPIStore.joinSession(body)))
            this.snackbarError = true;
          else this.$router.push('/waiting-session');
        } catch (error) {
          console.error('Error while joining session:', error);
          this.dialogError = true;
        }
      },
    },
    data() {
      return {
        dialogError: ref(false),
        idSession: ref(''),
        username: ref(''),
        snackbarError: false,
      };
    },
  };
</script>

<style scoped>
  body {
    font-family: 'Roboto Light', serif;
  }

  form {
    margin: 15% auto;
    min-width: 150px;
    max-width: 350px;
    min-height: 150px;
    padding: 30px;
    border: 1px solid #f1f1f1;
    background: #fff;
    box-shadow:
      0 0 20px 0 rgba(0, 0, 0, 0.2),
      0 5px 5px 0 rgba(0, 0, 0, 0.24);
  }

  input[type='text'] {
    width: 100%;
    padding: 12px 20px;
    margin: 8px 0;
    display: inline-block;
    border: 1px solid #5e6567;
    box-sizing: border-box;
  }

  input::placeholder {
    color: #5e6567;
    opacity: 50%;
    margin-left: 50%;
  }
  input:placeholder-shown {
    border: 1px solid #ffffff;
  }

  input[type='submit'] {
    background-color: #f1dc66;
    border: none;
    color: white;
    padding: 14px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    border-radius: 8px;
    margin: 8px 0;
    font-size: 15px;
    cursor: pointer;
    width: 100%;
    box-shadow:
      0 1px 3px rgba(0, 0, 0, 0.12),
      0 1px 2px rgba(0, 0, 0, 0.24);
  }

  input[type='submit']:hover {
    transform: scale(1.06);
    background-position: -60px;
    box-shadow:
      0 3px 6px rgba(0, 0, 0, 0.16),
      0 3px 6px rgba(0, 0, 0, 0.23);
  }

  input[type='submit']:active {
    transform: scale(1);
    background-position: 500px;
    box-shadow:
      0 1px 3px rgba(0, 0, 0, 0.12),
      0 1px 2px rgba(0, 0, 0, 0.24);
  }
</style>
