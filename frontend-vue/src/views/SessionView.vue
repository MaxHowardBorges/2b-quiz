<template>
  <div class='displayNormal'>
  <div class="left-panel">
  <div class='gaucheDroite mt-5'>
  <session-waiting-block-student
    v-if="waiting && !ended && userStore.isStudent"
    :id-session="sessionStore.idSession.toString()"
    :waiting-session-start="waitingSessionStart" />

  <session-waiting-block-teacher
    v-if="userStore.isTeacher && waiting"
    @session-start="waiting = false" />

  <session-question-block
    @answer-sent-relay="waiting = true"
    v-if="!waiting && !ended && userStore.isStudent" />

    <session-question-block
      class='w-75'
      @answer-sent-relay="waiting = true"
      v-if="!waiting && !ended && userStore.isTeacher" />

  <session-ended-block @reset="reset" v-if="ended" />

    <ActionTeacher v-if="userStore.isTeacher && !waiting" ></ActionTeacher>
  </div>
  </div>
  <div class="right-panel">
  <EventSession class='w-100' v-if="userStore.isTeacher && !waiting" ></EventSession>
  </div>

  </div>
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
  import EventSession from '@/components/public/EventSession.vue';
  import ActionTeacher from '@/components/public/ActionTeacher.vue';

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
      EventSession,
      SessionEndedBlock,
      SessionQuestionBlock,
      SessionWaitingBlockStudent,
      SessionWaitingBlockTeacher,
      ActionTeacher,
    },
    setup() {
      const sessionStore = useSessionStore();
      const userStore = useUserStore();

      let ended = ref(false);
      let waitingSessionStart = ref(true);
      let echoQuestion = ref(null);
      waiting = ref(true);

      sessionStore.$subscribe((mutation, state) => {
        if (state.ended !== ended.value) {
          ended.value = true;
          this.sessionStore.sessionEnd();
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

<style scoped>



  .gaucheDroite {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-items: center;
  }

  .displayNormal {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
  }


  * {
    color: #007ea1;
  }

  .left-panel {
    flex-basis: 75%;
  }

  .right-panel {
    flex-basis: 25%;
  }

</style>
