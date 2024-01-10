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



  <session-ended-block @reset="reset" v-if="ended" />
</template>

<script>
  import { ref } from 'vue';
  import SessionEndedBlock from '@/components/session/SessionEndedBlock.vue';
  import SessionQuestionBlock from '@/components/session/SessionQuestionBlock.vue';
  import SessionWaitingBlockStudent from '@/components/session/SessionWaitingBlockStudent.vue';
  import SessionWaitingBlockTeacher from '@/components/session/SessionWaitingBlockTeacher.vue';
  import { useSessionStore } from '@/stores/sessionStore';
  import { useUserStore } from '@/stores/userStore';
  import router from '@/router';

  let waiting;
  export default {
    beforeRouteUpdate(to, from, next) {
      waiting = true;
      console.log(to.query.key);
      if (to.query.key === 'display') {
        waiting = false;
      }
      next();
    },
    name: 'SessionView',
    components: {
      SessionEndedBlock,
      SessionQuestionBlock,
      SessionWaitingBlockStudent,
      SessionWaitingBlockTeacher,
    },
    setup() {
      const sessionStore = useSessionStore();
      const userStore = useUserStore();

      let ended = ref(false)
      let waitingSessionStart = ref(true);
      let echoQuestion = ref(null);
      waiting = ref(true);


      sessionStore.$subscribe((mutation, state) => {
        if (state.ended !== ended.value) {
          ended.value = true;
        } else if (
          echoQuestion.value !== state.question &&
          userStore.isStudent
        ) {
          echoQuestion.value = state.question;
          waitingSessionStart.value = false;
          waiting.value = false;
        }
      });
      return {
        ended,
        sessionStore,
        userStore,
        waiting,
        waitingSessionStart,
      };
    },
    mounted() {
      const info = this.$route.query.key;
      console.log(info);
      if (!this.sessionStore.idSession) router.replace('/');

    },
    methods: {
      reset() {
        this.ended = false;
        this.sessionStore.setEnded(false);
        this.waiting = true;
        this.waitingSessionStart = true;
      },
    },
  };
</script>

<style scoped></style>
