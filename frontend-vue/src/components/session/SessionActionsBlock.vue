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
  <v-btn
    @click="handleSubmit"
    color="primary"
    v-if="sessionStore.isParticipant">
    <p class="text-white font-weight-bold">{{ $t('session.SendAnswer') }}</p>
  </v-btn>

  <v-divider v-if="sessionStore.isHost" class="mx-6 my-5"></v-divider>
  <div class="d-flex flex-row justify-center" v-if="sessionStore.isHost">
    <v-btn
      @click="handleStop"
      color="primary"
      max-width="250"
      class="mx-6 my-3 flex-grow-1">
      <p class="text-white font-weight-bold">
        {{ $t('session.StopTheSession') }}
      </p>
    </v-btn>
    <v-btn
      @click="handleNextQuestion"
      color="primary"
      max-width="250"
      class="mx-6 my-3 flex-grow-1">
      <p class="text-white font-weight-bold">
        {{ $t('session.NextQuestion') }}
      </p>
    </v-btn>
  </div>
</template>

<script>
  import { ref } from 'vue';
  import router from '@/router';
  import { useSessionStore } from '@/stores/sessionStore';
  import { useUserStore } from '@/stores/userStore';
  import { ValidationError } from '@/utils/valdiationError';

  export default {
    name: 'SessionActionsBlock',
    setup() {
      const selectedValue = ref('');
      const sessionStore = useSessionStore();
      const userStore = useUserStore();
      return {
        selectedValue,
        sessionStore,
        userStore,
      };
    },
    data() {
      return {
        dialogVisible: false,
      };
    },
    emits: ['answer-sent'],
    methods: {
      async handleNextQuestion() {
        try {
          const response = await this.sessionStore.nextQuestion();
          await this.sessionStore.getCurrentQuestionForTeacher(response);
        } catch (e) {
          this.sessionStore.disconnectFromSession(
            'Error handling next question: ' + e.message,
          );
        }
      },
      handleStop() {
        this.dialogVisible = true;
      },
      noCancel() {
        this.dialogVisible = false;
      },
      async yesCancel() {
        this.sessionStore.sessionEnd();
        await router.push('/');
        await this.sessionStore.stopSession();
      },
      async handleSubmit() {
        if (this.selectedValue !== '') {
          try {
            await this.sessionStore.sendAnswer(this.selectedValue);
            this.$emit('answer-sent');
          } catch (e) {
            if (e instanceof ValidationError) {
              this.sessionStore.disconnectFromSession(
                'Error while sending answer: ' + e.message,
              );
            } else {
              this.sessionStore.disconnectFromSession(
                'Error while sending answer',
              );
            }
          }
        }
      },
    },
  };
</script>

<style scoped></style>
