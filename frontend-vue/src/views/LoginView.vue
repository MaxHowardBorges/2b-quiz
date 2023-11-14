<script>
  import { ref } from 'vue';
  import ErrorSnackbar from '@/components/commun/ErrorSnackbar.vue';
  import ErrorDialog from '@/components/commun/ErrorDialog.vue';
  import { resetPiniaStores } from '@/utils/piniaUtils';
  import { useUserStore } from '@/stores/userStore';
  import { ValidationError } from '@/utils/valdiationError';
  import router from '@/router';

  export default {
    name: 'loginView',
    components: { ErrorDialog, ErrorSnackbar },
    props: {
      expiredError: Boolean,
      serverError: Boolean,
    },
    setup() {
      const userStore = useUserStore();
      return {
        userStore,
        username: ref(''),
        password: ref(''),
        passwordVisibility: ref(false),
        errorSnackbarContent: '',
      };
    },
    mounted() {
      if (this.expiredError) this.$refs.dialogExpiredError.setDialogError(true);
      if (this.serverError) {
        resetPiniaStores();
        this.$refs.dialogServerError.setDialogError(true);
      }
    },
    methods: {
      async login() {
        try {
          await this.userStore.login(this.username, this.password);
          await router.push('/home');
        } catch (error) {
          if (error instanceof ValidationError) {
            this.errorSnackbarContent = error.message;
            this.$refs.errorSnackbar.setSnackbarError(true);
          } else {
            console.error('Error while joining session:', error);
            this.$refs.dialogError.setDialogError(true);
          }
        }
      },
      togglePasswordVisibility() {
        this.passwordVisibility = !this.passwordVisibility;
      },
    },
  };
</script>

<template>
  <error-dialog
    title="The Server is offline"
    content="Please, try later."
    ref="dialogServerError"></error-dialog>

  <error-dialog
    title="Session expired"
    content="Please, reconnect yourself."
    ref="dialogExpiredError"></error-dialog>

  <error-snackbar
    title="Error while login"
    :content="errorSnackbarContent"
    ref="errorSnackbar"></error-snackbar>

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
