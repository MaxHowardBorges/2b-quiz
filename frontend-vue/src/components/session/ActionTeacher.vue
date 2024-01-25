<template>
  <v-dialog v-model="dialogVisible" max-width="500">
    <v-card>
      <v-card-title>{{ $t('session.ConfirmationTitle') }}</v-card-title>

      <v-card-text>
        {{ $t('session.ConfirmationDescription') }}
      </v-card-text>
      <v-card-actions class="text-center">
        <v-btn @click="yesCancel">{{ $t('session.YesButton') }}</v-btn>
        <v-btn @click="noCancel">{{ $t('session.NoButton') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <div class="action-block">
    <div v-if="sessionStore.status.nbAnswered !== null">
      idSession: {{ sessionStore.idSession }}
    </div>
    <div>
      <p v-if="sessionStore.status.nbAnswered !== null">
        {{
          sessionStore.status.nbAnswered ? sessionStore.status.nbAnswered : 0
        }}/{{ sessionStore.status.nbJoined }}
        {{ $t('session.UsersAnswered')}}
      </p>
      <p v-else>{{ sessionStore.status.nbJoined }} {{ $t('session.UserJoined') }}</p>
    </div>
    <v-btn @click="cancelSession" class="btn" color="primary">
      {{ $t('session.EndSession') }}
    </v-btn>
    <v-btn
      @click="nextQuestion"
      class="btn"
      color="success"
      :loading="loadingNextQuestion">
      {{ $t('session.NextQuestion') }}
    </v-btn>
    <v-btn @click="openSettings" class="btn" color="info">
      {{ $t('session.Settings') }}
    </v-btn>

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
        loadingNextQuestion: false,
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
        this.loadingNextQuestion = true;
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
        this.loadingNextQuestion = false;
      },
      openSettings() {
        this.$refs.settingsDialog.openSettings();
      },
    },
    emits: ['session-end'],
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
