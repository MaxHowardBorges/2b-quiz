<template>
  <template v-if="!!sessionStore.idSession">
    <template v-if="sessionStore.isParticipant">
      <session-waiting-block-student
        v-if="waiting && !ended"
        :id-session="sessionStore.idSession.toString()"
        :waiting-session-start="waitingSessionStart" />

      <session-question-block
        @answer-sent-relay="waiting = true"
        v-if="!waiting && !ended" />

      <session-ended-block @reset="reset" v-if="ended" />
    </template>

    <v-sheet
      v-else-if="sessionStore.isHost"
      rounded="lg"
      width="90%"
      class="mt-5 px-6 py-8 mx-auto d-flex flex-row main-block"
      elevation="5">
      <div class="left-panel h-100">
        <div class="leftRight mt-5">
          <session-waiting-block-teacher
            v-if="waiting"
            @session-start="waiting = false" />

          <session-question-block
            class="w-75"
            @answer-sent-relay="waiting = true"
            v-if="!waiting && !ended" />

          <session-ended-block @reset="reset" v-if="ended" />

          <ActionTeacher v-if="!waiting"></ActionTeacher>
        </div>
      </div>
      <v-divider :vertical="true"></v-divider>
      <event-session
        class="w-100 right-panel h-100"
        v-if="sessionStore.isHost"></event-session>
    </v-sheet>
  </template>
  <template v-else>
    <div
      class="mt-6 h-100 d-flex align-center justify-center ma-2 flex-column w-100">
      <v-btn-toggle
        v-if="userStore.isTeacher"
        v-model="toggleValue"
        mandatory
        variant="outlined"
        class="mb-4"
        color="primary">
        <v-btn value="true" @click="isCreating = true">Create a session</v-btn>
        <v-btn value="false" @click="isCreating = false">Join a session</v-btn>
      </v-btn-toggle>
      <template
        v-if="isCreating && userStore.isTeacher"
        class="d-block w-100 flex-1-1 mx-auto">
        <create-session></create-session>
      </template>
      <template v-else>
        <join-form></join-form>
      </template>
    </div>
  </template>
</template>

<script>
  import { ref } from 'vue';
  import SessionEndedBlock from '@/components/session/SessionEndedBlock.vue';
  import SessionQuestionBlock from '@/components/session/SessionQuestionBlock.vue';
  import SessionWaitingBlockStudent from '@/components/session/SessionWaitingBlockStudent.vue';
  import SessionWaitingBlockTeacher from '@/components/session/SessionWaitingBlockTeacher.vue';
  import { useSessionStore } from '@/stores/sessionStore';
  import { useUserStore } from '@/stores/userStore';
  import EventSession from '@/components/public/EventSession.vue';
  import ActionTeacher from '@/components/public/ActionTeacher.vue';
  import JoinForm from '@/components/session/JoinForm.vue';
  import CreateSession from '@/components/session/CreateSession.vue';

  export default {
    beforeRouteUpdate(to, from, next) {
      this.waiting = to.query.key !== 'display';
      next();
    },
    name: 'SessionView',
    props: {
      isCreating: Boolean || false,
    },
    components: {
      CreateSession,
      JoinForm,
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
      let waiting = ref(true);
      let toggleValue = 'true';

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
        toggleValue,
        ended,
        sessionStore,
        userStore,
        waiting,
        waitingSessionStart,
      };
    },
    beforeMount() {
      this.toggleValue = this.isCreating ? 'true' : 'false';
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
  .leftRight {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-items: center;
  }

  .left-panel {
    flex-basis: 70%;
  }

  .right-panel {
    flex-basis: 30%;
  }

  .main-block {
    height: 70vh;
  }
</style>
