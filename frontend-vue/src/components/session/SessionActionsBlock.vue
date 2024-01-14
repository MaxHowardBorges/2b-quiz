<template>
  <v-btn @click="handleSubmit" color="primary" v-if="userStore.isStudent">
    <p class="text-white font-weight-bold">Send answer</p>
  </v-btn>

  <v-divider v-if="userStore.isTeacher" class="mx-6 my-5"></v-divider>
  <div class="d-flex flex-row justify-center" v-if="userStore.isTeacher">
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
      async handleStop() {
        this.sessionStore.sessionEnd();
        await router.push('/');
        //TODO to finish
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
