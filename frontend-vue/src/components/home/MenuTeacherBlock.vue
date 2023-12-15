<template>
  <error-dialog
    title="The Server is offline"
    content="Please, try later."
    ref="dialogError"></error-dialog>

  <error-snackbar
    title="Error while connecting to the session"
    :content="errorSnackbarContent"
    ref="errorSnackbar"></error-snackbar>

  <v-sheet
    min-width="150px"
    class="pa-7 d-block my-6 mx-auto"
    elevation="3"
    rounded="lg"
    width="70%"
    position="relative">
    <h1 class="mb-6">{{ $t('menu.menuTeacher') }}</h1>

    <v-select
      v-model="selectedQuestionnary"
      :items="choosedQuestionnary"
      item-title="title"
      item-value="id"
      return-object
      multiple=""
      label="Select Questionnary"
      dense
      outlined></v-select>

    <div class="">
      <v-btn
        @click="handleCreateSession"
        color="primary"
        class="mx-6 my-3"
        max-width="250px">
        <p class="text-white font-weight-bold pa-2">{{ $t('teacher.createSess') }}</p>
      </v-btn>
    </div>

    <div class="text-truncate">
      <v-btn
        @click="handleCreateQuestionnary"
        color="primary"
        class="mx-6 my-3"
        max-width="250px">
        <p class="text-white font-weight-bold pa-2">Create new Questionnary</p>
      </v-btn>
    </div>
    <div class="">
      <v-btn color="primary" class="mx-6 my-3" max-width="250px">
        <p class="text-white font-weight-bold pa-2">{{ $t('teacher.SessionHist') }}</p>
      </v-btn>
    </div>
  </v-sheet>
</template>

<script>
  import ErrorDialog from '@/components/commun/ErrorDialog.vue';
  import ErrorSnackbar from '@/components/commun/ErrorSnackbar.vue';
  import { useSessionStore } from '@/stores/sessionStore';
  import router from '@/router';
  import { ValidationError } from '@/utils/valdiationError';
  import { ref } from 'vue';
  import { useUserStore } from '@/stores/userStore';
  import { UserRoles } from '@/utils/userRoles';
  import { useQuestionnaryStore } from '@/stores/questionnaryStore';

  export default {
    name: 'MenuTeacherBlock',
    components: { ErrorSnackbar, ErrorDialog },
    props: {
      dialogError: false,
      errorSnackbar: false,
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
      await this.questionnaryStore.getQuestionnaryFromUser();
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
        this.loading = true;
        if (this.selectedQuestionnary.length > 0) {
          this.sessionStore.questionnary = this.selectedQuestionnary;
          try {
            await this.sessionStore.createSession();
            const userStore = useUserStore(); //TODO replace
            userStore.setUserRoles(UserRoles.TEACHER);
            await router.push('/session');
          } catch (error) {
            if (error instanceof ValidationError) {
              this.errorSnackbarContent = error.message;
              this.$refs.errorSnackbar.setSnackbarError(true);
            } else {
              console.error('Error while creating session:', error);
              this.$refs.dialogError.setDialogError(true);
            }
          }
          this.loading = false;
        } else alert('Selectionnez au moins 1 questionnaire');
      },
      handleCreateQuestionnary() {
        router.push('/questionary');
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
</style>
