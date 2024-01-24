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
  <v-btn
    @click="handleSubmit"
    color="primary"
    v-if="sessionStore.isParticipant">
    <p class="text-white font-weight-bold">Send answer</p>
  </v-btn>

  <v-divider v-if="sessionStore.isHost" class="mx-6 my-5"></v-divider>
  <div class="d-flex flex-row justify-center" v-if="sessionStore.isHost">
    <v-btn
      @click="handleStop"
      color="primary"
      max-width="250"
      class="mx-6 my-3 flex-grow-1">
      <p class="text-white font-weight-bold">Stop the session</p>
    </v-btn>
    <v-btn
      @click="handleNextQuestion"
      color="primary"
      max-width="250"
      class="mx-6 my-3 flex-grow-1">
      <p class="text-white font-weight-bold">Next question</p>
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
      },
    },
  };
</script>

<style scoped></style>
