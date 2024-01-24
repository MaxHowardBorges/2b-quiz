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
      <v-btn
        @click="redirectToSessionHistory"
        color="primary"
        class="mx-6 my-3"
        max-width="250px">
        <p class="text-white font-weight-bold pa-2">Session history</p>
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
  import router from '@/router';

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
            this.$refs.dialogError.setDialogError(true);
          }
        }
        this.loading = false;
      },
      async redirectToSessionHistory() {
        await router.push('/session-history');
      },
    },
  };
</script>
