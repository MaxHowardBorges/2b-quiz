<template>
  <v-sheet
    rounded="lg"
    max-width="1000px"
    min-width="400px"
    class="mt-5 px-6 py-8 mx-auto mb-5 d-flex flex-column align-center"
    elevation="5">
    <div class="align-self-start mb-n4">
      <v-btn id="ic" icon="undo" @click="returnHome"></v-btn>
    </div>
    <div style="display: flex">
      <h1>Session History</h1>
    </div>

    <div class="w-100" v-for="(session, index) in sessions" :key="index">
      <history-item :session="session"></history-item>
    </div>
  </v-sheet>
</template>

<style scoped></style>

<script>
  import HistoryItem from '@/components/session/HistoryItem.vue';
  import { useSessionStore } from '@/stores/sessionStore';
  import router from '@/router';

  export default {
    name: 'SessionHistoryView',
    components: { HistoryItem },
    setup() {
      const sessionStore = useSessionStore();
      return {
        sessionStore,
      };
    },
    data() {
      return { sessions: null };
    },
    async mounted() {
      this.sessions = await this.getSessionList();
    },
    methods: {
      async returnHome() {
        await router.push('/');
      },
      //Get all session where user is participant
      async getSessionList() {
        try {
          return await this.sessionStore.getSessions();
        } catch (e) {
          alert('Error while getting session list');
        }
      },
    },
  };
</script>
