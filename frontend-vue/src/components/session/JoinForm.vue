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
  import { useSessionStore } from '@/stores/sessionStore';
  import { ValidationError } from '@/utils/valdiationError';
  import { useSessionEventStore } from '@/stores/sessionEventStore';

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
        username: ref(''),
        errorSnackbarContent: '',
        idSession: ref(''),
        loading: false,
        snackbarError: ref(false),
      };
    },
    emits: ['joined-session'],
    methods: {
      async handleJoinSession() {
        this.loading = true;
        try {
          const isStarted = await this.sessionStore.joinSession(this.idSession);
          this.$emit('joined-session', isStarted, this.idSession);
          const sessionEventStore = useSessionEventStore();
          sessionEventStore.connectToSSEStudent();
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
