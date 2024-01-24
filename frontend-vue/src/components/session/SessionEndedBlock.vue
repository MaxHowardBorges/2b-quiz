<template>
  <h1>Session ended</h1>
  <h2 v-if="sessionStore.isParticipant">Thanks for participating</h2>

  <div class="mt-3 d-flex flex-wrap">
    <!--    <v-btn-->
    <!--      min-width="190px"-->
    <!--      v-if="sessionStore.isHost"-->
    <!--      @click="handleCreateSession"-->
    <!--      color="primary"-->
    <!--      class="pa-2 ma-2 flex-1-1"-->
    <!--      style="flex-basis: 0 !important"-->
    <!--      :loading="loading">-->
    <!--      <p class="text-white font-weight-bold">Start a new session</p>-->
    <!--    </v-btn>-->
  </div>
  <div class="mb-4">
    <b>{{ question }}</b>
    <div class="mt-4 mb-4">
      <v-row>
        <v-col>
          <span>
            <b>Date de création:</b>
            {{ creationDate }}
          </span>
        </v-col>
        <v-col>
          <span>
            <b>Créé par:</b>
            {{ createdBy }}
          </span>
        </v-col>
      </v-row>
    </div>
    <span class="spacer"></span>
    <span class="spacer"></span>
    <v-btn v-if="sessionStore.isHost" @click="handleManageResults">
      Gérer les résultats
    </v-btn>
    <v-btn v-if="sessionStore.isParticipant" @click="SeeResults">
      Voir les résultats
    </v-btn>
    <v-btn
      min-width="190px"
      @click="returnToMenu"
      color="primary"
      class="pa-2 ma-2 flex-1-1"
      style="flex-basis: 0 !important">
      <p class="text-white font-weight-bold">Return to menu</p>
    </v-btn>
  </div>
</template>

<script>
  import { ref } from 'vue';
  import ResultTable from '@/components/results/ResultTable.vue';
  import router from '@/router';
  import { useSessionStore } from '@/stores/sessionStore';
  import { useUserStore } from '@/stores/userStore';
  import { ValidationError } from '@/utils/valdiationError';

  export default {
    name: 'SessionEndedBlock',
    components: { ResultTable },
    setup() {
      const sessionStore = useSessionStore();
      const userStore = useUserStore();
      return {
        question: ref('Session 1'),
        creationDate: ref('2024-01-11'),
        createdBy: ref('Nom Prénom'),
        loading: ref(false),
        sessionStore,
        userStore,
      };
    },
    data() {
      return {
        results: {
          sessionDate: '',
          teacherSurname: '',
          globalResults: '',
          questions: [],
          personalResult: '',
        },
      };
    },

    methods: {
      handleManageResults() {
        this.sessionStore.sessionEnd();
        router.push('/history');
      },
      SeeResults() {
        this.sessionStore.sessionEnd();
        router.push('/history');
      },
      returnToMenu() {
        this.sessionStore.sessionEnd();
        router.push('/');
      },
      async handleCreateSession() {
        this.loading = true;
        try {
          //await this.sessionStore.createSession();
          //TODO: remove this
          this.$emit('reset');
        } catch (error) {
          if (error instanceof ValidationError) {
            await router.push({
              path: '/',
              query: { errorSnackbar: error.message },
            });
          } else {
            console.error('Error while creating session:', error);
            await router.push({
              path: '/',
              query: { serverError: 'true' },
            });
          }
        }
        this.loading = false;
      },
    },
    emits: ['reset'],
  };
</script>

<style scoped></style>
