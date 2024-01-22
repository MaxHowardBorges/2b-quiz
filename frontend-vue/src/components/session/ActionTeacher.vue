<template>
  <v-dialog v-model="dialogVisible" max-width="500">
    <v-card>
      <v-card-title>Are you sure ?</v-card-title>

      <v-card-text>
        If you stop the session, all of results will be lost !
      </v-card-text>
      <v-card-actions class="text-center">
        <v-btn @click="yesCancel">Yes</v-btn>
        <v-btn @click="noCancel">No</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <div class="action-block">
    <div v-if="!sessionStore.status.nbAnswered">
      idSession: {{ sessionStore.idSession }}
    </div>
    <div>
      <p v-if="!sessionStore.status.nbAnswered">
        {{ sessionStore.status.nbJoined }} user joined
      </p>
      <p v-else>
        {{ sessionStore.status.nbAnswered }}/{{ sessionStore.status.nbJoined }}
        user answered
      </p>
    </div>
    <v-btn @click="cancelSession" class="btn" color="primary">
      Fin de la session
    </v-btn>
    <v-btn @click="nextQuestion" class="btn" color="success">
      Question suivante
    </v-btn>
    <v-btn @click="openSettings" class="btn" color="info">Settings</v-btn>

    <set-settings-dialog ref="settingsDialog"></set-settings-dialog>
  </div>
</template>

<script>
  import router from '@/router';
  import { useSessionStore } from '@/stores/sessionStore';
  import SetSettingsDialog from '@/components/session/SetSettingsDialog.vue';

  export default {
    name: 'ActionBlock',
    components: { SetSettingsDialog },
    setup() {
      const sessionStore = useSessionStore();
      return {
        sessionStore,
      };
    },
    data() {
      return {
        dialogVisible: false,
      };
    },
    methods: {
      async endSession() {
        this.sessionStore.sessionEnd();
        await router.push('/');
        //TODO to finish
      },
      async cancelSession() {
        this.dialogVisible = true;
      },
      async noCancel() {
        this.dialogVisible = false;
      },
      async yesCancel() {
        await this.sessionStore.stopSession();
        this.sessionStore.sessionEnd();
        await router.push('/');
      },
      async nextQuestion() {
        try {
          const response = await this.sessionStore.nextQuestion();
          await this.sessionStore.getCurrentQuestionForTeacher(response);
          if (this.sessionStore.ended) {
            this.$emit('session-end');
          }
        } catch (e) {
          this.sessionStore.disconnectFromSession(
            'Error handling next question: ' + e.message,
          );
        }
      },
      openSettings() {
        this.$refs.settingsDialog.openSettings();
      },
    },
    emits: ['session-end'],
  };
</script>

<style scoped>
  .action-block {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    align-items: center;
    margin: 10px;
  }
</style>
