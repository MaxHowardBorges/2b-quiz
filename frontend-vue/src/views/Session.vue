<template>
  <session-waiting-block-student
    v-if="waiting && !ended"
    :id-session="idSession"
    :waiting-session-start="
      waitingSessionStart
    "></session-waiting-block-student>

  <session-question-block-student
    @answer-sent="waiting = true"
    v-if="!waiting && !ended"
    :question="question"></session-question-block-student>

  <session-ended v-if="ended"></session-ended>
</template>

<script>
  import { ref } from 'vue';
  import { useSessionStore } from '@/stores/sessionStore';
  import SessionWaitingBlockStudent from '@/components/session/SessionWaitingBlockStudent.vue';
  import SessionQuestionBlockStudent from '@/components/session/SessionQuestionBlockStudent.vue';
  import SessionEnded from '@/components/session/SessionEnded.vue';

  export default {
    components: {
      SessionEnded,
      SessionQuestionBlockStudent,
      SessionWaitingBlockStudent,
    },
    setup() {
      const sessionStore = useSessionStore();

      let question = ref({});
      let waiting = ref(true);
      let ended = ref(false);
      let waitingSessionStart = ref(true);

      sessionStore.$subscribe((mutation) => {
        if (mutation.events.key === 'ended') {
          ended.value = true;
        } else if (mutation.events.key === 'question') {
          waitingSessionStart.value = false;
          question.value = mutation.events.newValue;
          waiting.value = false;
        }
      });

      const idSession = sessionStore.idSession.toString();
      return {
        idSession,
        waitingSessionStart,
        waiting,
        question,
        sessionStore,
        ended,
      };
    },
  };
</script>

<style scoped></style>
