<template>
  <session-waiting-block-student
    v-if="waiting && !ended && userStore.isStudent"
    :id-session="sessionStore.idSession.toString()"
    :waiting-session-start="waitingSessionStart" />

  <session-waiting-block-teacher
    v-if="userStore.isTeacher && waiting"
    @session-start="waiting = false" />

  <session-question-block
    @answer-sent-relay="waiting = true"
    v-if="!waiting && !ended" />

  <session-ended @reset="reset" v-if="ended" />
</template>

<script>
  import { ref } from 'vue';
  import { useSessionStore } from '@/stores/sessionStore';
  import { useUserStore } from '@/stores/userStore';
  import SessionWaitingBlockStudent from '@/components/session/SessionWaitingBlockStudent.vue';
  import SessionQuestionBlock from '@/components/session/SessionQuestionBlock.vue';
  import SessionEnded from '@/components/session/SessionEnded.vue';
  import SessionWaitingBlockTeacher from '@/components/session/SessionWaitingBlockTeacher.vue';
  import router from '@/router';

  export default {
    name: 'Session',
    components: {
      SessionWaitingBlockTeacher,
      SessionEnded,
      SessionQuestionBlock,
      SessionWaitingBlockStudent,
    },
    setup() {
      const sessionStore = useSessionStore();
      const userStore = useUserStore();

      let waiting = ref(true);
      let ended = ref(false);
      let waitingSessionStart = ref(true);

      sessionStore.$subscribe((mutation) => {
        if (
          mutation.events.key === 'ended' &&
          mutation.events.newValue === true
        ) {
          ended.value = true;
        } else if (mutation.events.key === 'question' && userStore.isStudent) {
          waitingSessionStart.value = false;
          waiting.value = false;
        }
      });
      return {
        userStore,
        waitingSessionStart,
        waiting,
        sessionStore,
        ended,
      };
    },
    mounted() {
      if (!this.sessionStore.idSession) router.replace('/');
    },
    methods: {
      reset() {
        this.waiting = true;
        this.waitingSessionStart = true;
        this.ended = false;
        this.sessionStore.setEnded(false);
      },
    },
  };
</script>

<style scoped></style>
