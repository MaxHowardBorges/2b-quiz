<template>
  <error-dialog
    title="The Server is offline"
    content="Please, try later."
    ref="dialogError"></error-dialog>

  <error-snackbar
    title="Error while register user"
    :content="errorSnackbarContent"
    ref="errorSnackbar"></error-snackbar>

  <v-sheet
    max-width="500px"
    rounded="lg"
    width="70%"
    class="mt-5 mb-8 px-6 py-8 mx-auto"
    elevation="5">
    <p class="text-lg-h2 text-sm-h3 text-h4 mb-5">Register</p>
    <register-form @error-register="errorCaught" />
  </v-sheet>
</template>

<script>
  import RegisterForm from '@/components/user/RegisterForm.vue';
  import ErrorSnackbar from '@/components/commun/ErrorSnackbar.vue';
  import ErrorDialog from '@/components/commun/ErrorDialog.vue';
  import { ref } from 'vue';
  import { ValidationError } from '@/utils/valdiationError';

  export default {
    name: 'RegisterView',
    components: { ErrorDialog, ErrorSnackbar, RegisterForm },
    setup() {
      return {
        errorSnackbarContent: ref(''),
      };
    },
    methods: {
      errorCaught(error) {
        console.log(error);
        if (error instanceof ValidationError) {
          this.errorSnackbarContent = error.message;
          this.$refs.errorSnackbar.setSnackbarError(true);
        } else {
          console.error('Error while register user:', error);
          this.$refs.dialogError.setDialogError(true);
        }
      },
    },
  };
</script>

<style scoped></style>
