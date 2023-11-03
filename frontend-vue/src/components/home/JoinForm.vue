<template>
  <error-dialog
    title="The Server is offline"
    content="Please, try later."
    ref="dialogError"></error-dialog>

  <error-snackbar
    title="Error while connecting to the session"
    :content="errorSnackbarContent"
    ref="errorSnackbar"></error-snackbar>

  <v-sheet
    max-width="450px"
    min-width="150px"
    class="pa-5 d-block w-100"
    elevation="3"
    rounded="lg"
    position="relative">
    <v-form @submit.prevent="handleJoinSession">
      <v-text-field
        id="username"
        v-model="username"
        label="Username"></v-text-field>
      <v-text-field
        id="idSession"
        v-model="idSession"
        label="Session ID"></v-text-field>
      <v-btn
        type="submit"
        block=""
        class="mt-2"
        color="primary"
        :loading="loading">
        <p class="text-white font-weight-bold">Join</p>
      </v-btn>
    </v-form>
  </v-sheet>
</template>

<script>
  import { ref } from 'vue';
  import ErrorDialog from '@/components/commun/ErrorDialog.vue';
  import ErrorSnackbar from '@/components/commun/ErrorSnackbar.vue';
  import router from '@/router';
  import { useSessionStore } from '@/stores/sessionStore';
  import { ValidationError } from '@/utils/valdiationError';

  export default {
    name: 'JoinForm',
    setup() {
      const sessionStore = useSessionStore();
      return {
        sessionStore,
      };
    },
    components: { ErrorSnackbar, ErrorDialog },
    data() {
      return {
        loading: false,
        idSession: ref(''),
        username: ref(''),
        snackbarError: ref(false),
        errorSnackbarContent: '',
      };
    },
    methods: {
      async handleJoinSession() {
        this.loading = true;
        try {
          const body = { idSession: this.idSession, username: this.username };
          await this.sessionStore.joinSession(body);
          await router.push('/session');
        } catch (error) {
          if (error instanceof ValidationError) {
            this.errorSnackbarContent = error.message;
            this.$refs.errorSnackbar.setSnackbarError(true);
          } else {
            console.error('Error while joining session:', error);
            this.$refs.dialogError.setDialogError(true);
          }
        }
        this.loading = false;
      },
    },
  };
</script>

<style scoped></style>
