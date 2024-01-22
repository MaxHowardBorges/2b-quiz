<template>
  <v-sheet
    rounded="lg"
    width="70%"
    class="mt-5 px-6 py-8 mx-auto mb-5 d-flex flex-column align-center"
    elevation="5">
    <div style="display: flex">
      <div style="align-self: start" id="divButton">
        <v-btn id="ic" icon="undo" @click="returnHome"></v-btn>
      </div>
      <h1>Session History</h1>
    </div>

    <v-sheet class="list" v-for="(session, index) in sessions" :key="index">
      <HistoryItem :session="session"></HistoryItem>
    </v-sheet>
  </v-sheet>
</template>

<style scoped>
  #divButton {
    position: absolute;
    left: 18%;
  }
</style>

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
      console.log(this.sessions);
    },
    methods: {
      async returnHome() {
        await router.push('/');
      },
      //Get all session where user is participant
      async getSessionList() {
        return await this.sessionStore.getSessions();
      },
    },
  };
</script>
