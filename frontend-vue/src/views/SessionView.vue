<template>
  <error-dialog
    title="The Server is offline"
    content="Please, try later."
    ref="dialogError"></error-dialog>

  <error-snackbar
    title="Error while connecting to the session"
    :content="errorSnackbarContent"
    ref="errorSnackbar"></error-snackbar>

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
      min-width="400px"
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

          <action-teacher
            @session-end="ended = true"
            v-if="!waiting && !ended"></action-teacher>
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
      class="mt-4 h-100 d-flex align-center justify-center ma-2 flex-column w-100">
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
        <join-form @joined-session="prepareSession"></join-form>
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
  import ActionTeacher from '@/components/session/ActionTeacher.vue';
  import JoinForm from '@/components/session/JoinForm.vue';
  import CreateSession from '@/components/session/CreateSession.vue';
  import { useSessionEventStore } from '@/stores/sessionEventStore';
  import { ValidationError } from '@/utils/valdiationError';
  import ErrorSnackbar from '@/components/commun/ErrorSnackbar.vue';
  import ErrorDialog from '@/components/commun/ErrorDialog.vue';
  import router from '@/router';

  export default {
    name: 'SessionView',
    props: {
      isCreating: Boolean || false,
      idSession: String || null,
      serverError: Boolean || false,
      errorSnackbar: String || false,
    },
    components: {
      ErrorDialog,
      ErrorSnackbar,
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
      sessionStore.$reset();
      const userStore = useUserStore();
      return {
        sessionStore,
        userStore,
      };
    },
    data() {
      return {
        errorSnackbarContent: '',
        snackbarError: ref(false),
        subscribe: null,
        ended: false,
        waitingSessionStart: ref(true),
        echoQuestion: this.sessionStore.question,
        waiting: true,
        toggleValue: 'true',
      };
    },
    beforeMount() {
      if (this.idSession) {
        if (this.sessionStore.idSession !== this.idSession) {
          this.joinSession();
        }
      }
      this.toggleValue = this.isCreating ? 'true' : 'false';
      if (!!this.sessionStore.idSession) {
        this.subscribeToEvents();
      }
    },
    mounted() {
      console.log('joinSession', this.idSession);
      console.log('isCreating', this.isCreating);
      console.log('serverError', this.serverError);
      console.log('errorSnackbar', this.errorSnackbar);
      if (this.errorSnackbar) {
        this.errorSnackbarContent = this.errorSnackbar;
        this.$refs.errorSnackbar.setSnackbarError(true);
      } else if (this.serverError) {
        this.$refs.dialogError.setDialogError(true);
      }
    },
    methods: {
      async joinSession() {
        try {
          const isStarted = await this.sessionStore.joinSession(this.idSession);
          await this.prepareSession(isStarted, this.idSession);
          const sessionEventStore = useSessionEventStore();
          sessionEventStore.connectToSSEStudent();
        } catch (error) {
          if (error instanceof ValidationError) {
            await router.replace({
              name: 'Session',
              query: { errorSnackbar: error.message },
            });
            router.go(0);
          } else {
            await router.replace({
              name: 'Session',
              query: { serverError: error.message },
            });
            router.go(0);
          }
        }
      },
      subscribeToEvents() {
        this.subscribe = this.sessionStore.$subscribe((mutation, state) => {
          console.log(this.ended, state.ended);
          if (state.ended !== this.ended) {
            this.ended = true;
          } else if (
            this.echoQuestion !== state.question &&
            this.sessionStore.isParticipant
          ) {
            this.echoQuestion = state.question;
            this.waitingSessionStart = false;
            this.waiting = false;
          }
        });
      },
      reset() {
        this.ended = false;
        this.sessionStore.setEnded(false);
        this.waiting = true;
        this.waitingSessionStart = true;
        this.echoQuestion = this.sessionStore.question;
        this.subscribe = null;
      },
      async prepareSession(isStarted, idSession) {
        this.sessionStore.setIdSession(idSession);
        if (isStarted) {
          await this.sessionStore.getCurrentQuestions();
          this.waiting = false;
          this.waitingSessionStart = false;
          this.echoQuestion = this.sessionStore.question;
        } else {
          this.reset();
        }
        this.subscribeToEvents();
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
    min-width: 350px;
  }

  .right-panel {
    flex-basis: 30%;
  }
</style>
