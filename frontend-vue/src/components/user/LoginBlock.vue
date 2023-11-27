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
      <v-btn color="primary" type="submit">
        <p class="text-white font-weight-bold">Login</p>
      </v-btn>
    </v-form>
  </v-sheet>
</template>

<script>
  import ErrorDialog from '@/components/commun/ErrorDialog.vue';
  import ErrorSnackbar from '@/components/commun/ErrorSnackbar.vue';
  import { useUserStore } from '@/stores/userStore';
  import { ref } from 'vue';
  import { resetPiniaStores } from '@/utils/piniaUtils';
  import router from '@/router';
  import { ValidationError } from '@/utils/valdiationError';

  export default {
    name: 'LoginBlock',
    components: { ErrorDialog, ErrorSnackbar },
    props: {
      expiredError: Boolean,
      serverError: Boolean,
      ticket: null,
    },
    setup() {
      const userStore = useUserStore();
      return {
        userStore,
        username: ref(''),
        password: ref(''),
        passwordVisibility: ref(false),
        errorSnackbarContent: ref(''),
      };
    },
    async mounted() {
      if (this.expiredError) this.$refs.dialogExpiredError.setDialogError(true);
      if (this.serverError) {
        resetPiniaStores();
        this.$refs.dialogServerError.setDialogError(true);
      }
      if (this.ticket) {
        await this.checkTicket();
      }
    },
    methods: {
      getServiceURL() {
        return window.location.origin + this.$route.path;
      },
      login() {
        window.location.href =
          import.meta.env.VITE_CAS_URL +
          import.meta.env.VITE_CAS_LOGIN_ROUTE +
          '?service=' +
          encodeURI(this.getServiceURL());
      },
      async checkTicket() {
        try {
          await this.userStore.login(this.ticket, this.getServiceURL());
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

<style scoped></style>
