<template>
  <div class="action-block">
    <div v-if="sessionStore.status.nbAnswered !== null">
      idSession: {{ sessionStore.idSession }}
    </div>
    <div>
      <p v-if="sessionStore.status.nbAnswered !== null">
        {{ sessionStore.status.nbAnswered }}/{{ sessionStore.status.nbJoined }}
        user answered
      </p>
      <p v-else>{{ sessionStore.status.nbJoined }} user joined</p>
    </div>
    <v-btn @click="endSession" class="btn" color="primary">
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
    methods: {
      async endSession() {
        this.sessionStore.sessionEnd();
        await router.push('/');
        //TODO to finish
      },
      async nextQuestion() {
        try {
          const response = await this.sessionStore.nextQuestion();
          await this.sessionStore.getCurrentQuestionForTeacher(response);
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
    watch: {
      'sessionStore.status.nbAnswered': true,
    },
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
