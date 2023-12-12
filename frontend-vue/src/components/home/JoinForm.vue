<template>
  <error-dialog
    :title="$t('home.ServOffline')"
    :content="$t('home.PTL')"
    ref="dialogError"></error-dialog>

  <error-snackbar
    :title="$t('home.errorS')"
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
        :label ="$t('home.username')"></v-text-field>
      <v-text-field
        id="idSession"
        v-model="idSession"
        :label ="$t('home.SessionID')" ></v-text-field>
      <v-btn
        type="submit"
        block=""
        class="mt-2"
        color="primary"
        :loading="loading">
        <p class="text-white font-weight-bold">{{ $t('home.join') }}</p>
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
  import { useUserStore } from '@/stores/userStore';
  import { UserRoles } from '@/utils/userRoles';
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
        errorSnackbarContent: '',
        idSession: ref(''),
        loading: false,
        snackbarError: ref(false),
        username: ref(''),
      };
    },
    methods: {
      async handleJoinSession() {
        this.loading = true;
        try {
          const body = { idSession: this.idSession, username: this.username };
          await this.sessionStore.joinSession(body);
          const userStore = useUserStore(); //TODO replace
          userStore.setUserRoles(UserRoles.STUDENT);
          await router.push('/session');
        } catch (error) {
          if (error instanceof ValidationError) {
            this.errorSnackbarContent = error.message;
            this.$refs.errorSnackbar.setSnackbarError(true);
          } else {
            console.error( this.$t('home.errorS'), error);
            this.$refs.dialogError.setDialogError(true);
          }
        }
        this.loading = false;
      },
    },
  };
</script>

<style scoped></style>
