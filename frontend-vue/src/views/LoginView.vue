<script>
  import { ref } from 'vue';

  export default {
    name: 'loginView',
    data() {
      return {
        username: '',
        password: '',
        loginError: false,
        accountType: '',
        passwordVisibility: ref(false),
      };
    },
    methods: {
      login() {
        if (this.username === 'ok' && this.password === 'ok') {
          this.$router.push('/');
        } else {
          this.loginError = true;
          console.error('Échec de la connexion');
        }
      },
      togglePasswordVisibility() {
        this.passwordVisibility = !this.passwordVisibility;
      },
    },
  };
</script>

<template>
  <v-sheet
    max-width="500px"
    rounded="lg"
    width="70%"
    class="mt-5 px-6 py-8 mx-auto"
    elevation="5">
    <h1>Login</h1>
    <v-form @submit.prevent="login" class="ma-2" max-width="500px">
      <v-text-field
        v-model="username"
        type="text"
        id="username"
        autocomplete="username"
        label="Username"></v-text-field>
      <v-text-field
        v-model="password"
        :type="passwordVisibility ? 'text' : 'password'"
        id="password"
        label="Password"
        autocomplete="current-password"
        :append-inner-icon="
          passwordVisibility ? 'visibility' : 'visibility_off'
        "
        @click:append-inner="togglePasswordVisibility"></v-text-field>
      <v-btn color="primary" type="submit">
        <p class="text-white font-weight-bold">Login</p>
      </v-btn>
    </v-form>
    <v-btn color="secondary" to="/register"><p>Créer un compte</p></v-btn>
  </v-sheet>
</template>

<style scoped></style>
