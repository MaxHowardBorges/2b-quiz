<template>
  <error-dialog
    :title="$t('home.TheServerOffline')"
    :content="$t('home.PleaseTryLater')"
    ref="dialogError"></error-dialog>

  <error-snackbar
    :title="$t('home.ErrorConnectingSession')"
    :content="errorSnackbarContent"
    ref="errorSnackbar"></error-snackbar>

  <session-activity></session-activity>

  <v-sheet
    min-width="150px"
    class="pa-7 d-block my-6 mx-auto"
    elevation="3"
    rounded="lg"
    width="70%"
    position="relative">
    <h1 class="mb-6">{{ $t('menu.menuTeacher') }}</h1>

    <div class="">
      <v-btn
        @click="handleCreateSession"
        color="primary"
        class="mx-6 my-3 w-100"
        max-width="250px">
        <p class="text-white font-weight-bold pa-2">{{ $t('teacher.createSess') }}</p>
      </v-btn>
    </div>

    <div class="">
      <v-btn
        @click="handleJoinSession"
        color="primary"
        class="mx-6 my-3 w-100"
        max-width="250px">
        <p class="text-white font-weight-bold pa-2">{{ $t('home.JoinSession') }}</p>
      </v-btn>
    </div>

    <div class="text-truncate">
      <v-btn
        @click="handleCreateQuestionnary"
        color="primary"
        class="mx-6 my-3 w-100"
        max-width="250px">
        <p class="text-white font-weight-bold pa-2">{{ $t('teacher.CreateNewQuestionnary') }}</p>
      </v-btn>
    </div>
    <div class="">
      <v-btn
        @click="redirectToSessionHistory"
        color="primary"
        class="mx-6 my-3 w-100"
        max-width="250px">
        <p class="text-white font-weight-bold pa-2">{{ $t('teacher.SessionHist') }}</p>
      </v-btn>
    </div>
    <div class="">
      <v-btn
        @click="handleGoToQuestionBank"
        color="primary"
        class="mx-6 my-3"
        max-width="250px">
        <p class="text-white font-weight-bold pa-2">
          {{ $t('question.PrivateQuestionBankTitle') }}
        </p>
      </v-btn>
    </div>
  </v-sheet>
</template>

<script>
  import ErrorDialog from '@/components/commun/ErrorDialog.vue';
  import ErrorSnackbar from '@/components/commun/ErrorSnackbar.vue';
  import { useSessionStore } from '@/stores/sessionStore';
  import router from '@/router';
  import { ref } from 'vue';
  import { useQuestionnaryStore } from '@/stores/questionnaryStore';
  import SessionActivity from '@/components/session/activity/SessionActivity.vue';

  export default {
    name: 'MenuTeacherBlock',
    components: { SessionActivity, ErrorSnackbar, ErrorDialog },
    props: {
      dialogError: { type: Boolean, default: false },
      errorSnackbar: { type: Boolean, default: false },
    },
    setup() {
      const sessionStore = useSessionStore();
      const questionnaryStore = useQuestionnaryStore();
      return {
        sessionStore,
        questionnaryStore,
        errorSnackbarContent: ref(''),
      };
    },

    async mounted() {
      if (this.errorSnackbar) {
        this.errorSnackbarContent = this.errorSnackbar;
        this.$refs.errorSnackbar.setSnackbarError(true);
      }
      if (this.dialogError) {
        this.$refs.dialogError.setDialogError(true);
      }
      await this.questionnaryStore.getQuestionnariesFromUser();
      this.choosedQuestionnary = this.questionnaryStore.questionnaryList;
    },
    data() {
      return {
        choosedQuestionnary: [],
        selectedQuestionnary: [],
      };
    },
    methods: {
      async handleCreateSession() {
        await router.push({
          path: '/session',
          query: {
            isCreating: 'true',
          },
        });
        // this.loading = false;
        // await router.push('/order-questionnary');
        // if (this.selectedQuestionnary.length > 0) {
        //   this.sessionStore.questionnary = this.selectedQuestionnary;
        //
        //   try {
        //     await this.sessionStore.createSession();
        //     await router.push('/session');
        //     //await router.push('/order-questionnary');
        //   } catch (error) {
        //     if (error instanceof ValidationError) {
        //       this.errorSnackbarContent = error.message;
        //       this.$refs.errorSnackbar.setSnackbarError(true);
        //     } else {
        //       console.error('Error while creating session:', error);
        //       this.$refs.dialogError.setDialogError(true);
        //     }
        //   }
        //   this.loading = false;
        // } else await router.push('/order-questionnary'); //else alert('Selectionnez au moins 1 questionnaire');
      },
      handleJoinSession() {
        router.push({
          path: '/session',
        });
      },
      handleCreateQuestionnary() {
        router.push({
          name: 'menu.questionnary',
          query: { toCreateBool: true, toBankBool: false },
        });
      },
      handleGoToQuestionBank() {
        router.push({
          name: 'menu.questionnary',
          query: { toCreateBool: false, toBankBool: true },
        });
      },
      redirectToSessionHistory() {
        router.push('/history');
      },
    },
  };
</script>

<style scoped>
  v-select {
    width: auto;
  }

  * {
    align-items: center;
    align-content: center;
    align-self: center;
  }

  v-select {
    color: blue;
  }

  v-list {
    background-color: #007ea1 !important;
    color: #00afd7 !important;
  }

  v-list-item {
    color: #ffffff !important;
  }
</style>
