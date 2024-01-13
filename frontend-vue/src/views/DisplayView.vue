<template>
  <h1>Public screen</h1>
  <div class="h-10 d-flex align-center justify-center ma-2">
    <session-waiting-block-student
      v-if="waiting && !ended"
      :id-session="idSession"
      :waitingSessionStart="true" />
    <session-question-block v-if="!waiting && !ended" />
  </div>
</template>

<script>
  import WaitForm from '@/components/home/WaitForm.vue';
  import SessionQuestionBlock from '@/components/session/SessionQuestionBlock.vue';
  import SessionWaitingBlockStudent from '@/components/session/SessionWaitingBlockStudent.vue';
  import { useSessionStore } from '@/stores/sessionStore';
  import { useUserStore } from '@/stores/userStore';

  export default {
    name: 'DisplayView',
    components: { SessionWaitingBlockStudent, SessionQuestionBlock, WaitForm },
    props: {
      idSession: String,
    },
    setup() {
      const sessionStore = useSessionStore();
      const userStore = useUserStore();
      return {
        sessionStore,
        userStore,
      };
    },
    data() {
      return {
        waiting: true,
        ended: false,
        echoQuestion: null,
      };
    },
    async mounted() {
      try {
        this.sessionStore.connectToSessionAsObserver(this.idSession);
      } catch (error) {
        this.sessionStore.disconnectFromSession(
          'Error while connecting to session',
        );
      }
      this.sessionStore.setIsDisplay(true);
      this.sessionStore.$subscribe((mutation, state) => {
        if (state.ended !== this.ended) {
          this.ended = true;
        } else if (
          this.echoQuestion !== state.question &&
          this.sessionStore.isDisplay
        ) {
          this.echoQuestion = state.question;
          this.waitingSessionStart = false;
          this.waiting = false;
        }
      });
    },
  };
</script>

<style scoped>
  * {
    color: #007ea1;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: #000000;
  }
</style>
