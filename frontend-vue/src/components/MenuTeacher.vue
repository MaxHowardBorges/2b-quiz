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
    min-width="150px"
    class="pa-7 d-block my-6 mx-auto"
    elevation="3"
    rounded="lg"
    width="70%"
    position="relative">
    <h1 class="mb-6">Teacher Menu</h1>

    <div class="">
      <v-btn
        @click="handleCreateSession"
        color="primary"
        class="mx-6 my-3"
        max-width="250px">
        <p class="text-white font-weight-bold pa-2">Create session</p>
      </v-btn>
    </div>
    <div class="">
      <v-btn color="primary" class="mx-6 my-3" max-width="250px">
        <p class="text-white font-weight-bold pa-2">Session history</p>
      </v-btn>
    </div>
  </v-sheet>
</template>

<script>
  import ErrorDialog from '@/components/commun/ErrorDialog.vue';
  import ErrorSnackbar from '@/components/commun/ErrorSnackbar.vue';
  import { useSessionStore } from '@/stores/sessionStore';
  import router from '@/router';
  import { ValidationError } from '@/utils/valdiationError';
  import { ref } from 'vue';
  import { useUserStore } from '@/stores/userStore';
  import { UserRoles } from '@/utils/userRoles';

  export default {
    components: { ErrorSnackbar, ErrorDialog },
    props: {
      dialogError: false,
      errorSnackbar: false,
    },
    setup() {
      const sessionStore = useSessionStore();
      return {
        sessionStore,
        errorSnackbarContent: ref(''),
      };
    },
    mounted() {
      if (this.errorSnackbar) {
        this.errorSnackbarContent = this.errorSnackbar;
        this.$refs.errorSnackbar.setSnackbarError(true);
      }
      if (this.dialogError) {
        this.$refs.dialogError.setDialogError(true);
      }
    },
    methods: {
      async handleCreateSession() {
        this.loading = true;
        try {
          await this.sessionStore.createSession();
          const userStore = useUserStore(); //TODO replace
          userStore.setUserRoles(UserRoles.TEACHER);
          await router.push('/session');
        } catch (error) {
          if (error instanceof ValidationError) {
            this.errorSnackbarContent = error.message;
            this.$refs.errorSnackbar.setSnackbarError(true);
          } else {
            console.error('Error while creating session:', error);
            this.$refs.dialogError.setDialogError(true);
          }
        }
        this.loading = false;
      },
    },
  };
</script>

<style scoped></style>
