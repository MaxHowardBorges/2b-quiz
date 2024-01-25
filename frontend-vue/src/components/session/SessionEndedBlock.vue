<template>
  <h1>{{ $t('session.SessionEnded') }}</h1>
  <h2 v-if="sessionStore.isParticipant">{{ $t('session.Thanks') }}</h2>

  <div class="mt-3 d-flex flex-wrap"></div>
  <div class="mb-4">
    <span class="spacer"></span>
    <span class="spacer"></span>
    <v-btn v-if="sessionStore.isHost" @click="handleManageResults">
      Gérer les résultats
    </v-btn>
    <v-btn v-if="sessionStore.isParticipant" @click="seeResults">
      Voir les résultats
    </v-btn>
    <v-btn
      min-width="190px"
      @click="returnToMenu"
      color="primary"
      class="pa-2 ma-2 flex-1-1"
      style="flex-basis: 0 !important">
      <p class="text-white font-weight-bold">{{ $t('session.ReturnMenu') }}</p>
    </v-btn>
  </div>
</template>

<script>
  import { ref } from 'vue';
  import ResultTable from '@/components/results/ResultTable.vue';
  import router from '@/router';
  import { useSessionStore } from '@/stores/sessionStore';
  import { useUserStore } from '@/stores/userStore';

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
      seeResults() {
        this.sessionStore.sessionEnd();
        router.push('/history');
      },
      returnToMenu() {
        this.sessionStore.sessionEnd();
        router.push('/');
      },
    },
    emits: ['reset'],
  };
</script>

<style scoped></style>
