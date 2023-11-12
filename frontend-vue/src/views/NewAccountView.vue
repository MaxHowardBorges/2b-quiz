<template>
  <v-sheet
    max-width="500px"
    rounded="lg"
    width="70%"
    class="mt-5 mb-8 px-6 py-8 mx-auto"
    elevation="5">
    <p class="text-lg-h2 text-sm-h3 text-h4 mb-5">Register</p>
    <form @submit.prevent="register">
      <v-text-field
        v-model="prenom"
        type="text"
        id="name"
        autocomplete="given-name"
        label="First name"></v-text-field>
      <v-text-field
        v-model="nom"
        type="text"
        id="surname"
        autocomplete="family-name"
        label="Last name"></v-text-field>
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
        autocomplete="new-password"
        :append-inner-icon="
          passwordVisibility ? 'visibility' : 'visibility_off'
        "
        @click:append-inner="togglePasswordVisibility"></v-text-field>
      <v-text-field
        v-model="confirmPassword"
        :type="confirmPasswordVisibility ? 'text' : 'password'"
        id="password-confirmation"
        label="Password confirmation"
        autocomplete="new-password"
        :append-inner-icon="
          confirmPasswordVisibility ? 'visibility' : 'visibility_off'
        "
        @click:append-inner="toggleConfirmPasswordVisibility"></v-text-field>
      <v-radio-group label="User type" :inline="$vuetify.display.mdAndUp">
        <v-radio
          direction="horizontal"
          v-model="accountType"
          value="student"
          label="Student"></v-radio>
        <v-radio
          direction="horizontal"
          v-model="accountType"
          value="teacher"
          label="Teacher"></v-radio>
      </v-radio-group>
      <v-btn color="primary" type="submit">
        <p class="text-white font-weight-bold">Register</p>
      </v-btn>
    </form>
  </v-sheet>
</template>

<script>
  import { ref } from 'vue';

  export default {
    data() {
      return {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        accountType: '',
        nom: '',
        prenom: '',
        passwordVisibility: ref(false),
        confirmPasswordVisibility: ref(false),
      };
    },
    methods: {
      register() {
        console.log('Registration form submitted');
        this.$router.push('/login');
      },
      togglePasswordVisibility() {
        this.passwordVisibility = !this.passwordVisibility;
      },

      toggleConfirmPasswordVisibility() {
        this.confirmPasswordVisibility = !this.confirmPasswordVisibility;
      },
    },
  };
</script>

<style scoped></style>
