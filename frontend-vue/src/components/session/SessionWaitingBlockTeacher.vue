<template>
  <v-sheet
    rounded="lg"
    width="70%"
    class="mt-5 px-6 py-8 mx-auto"
    max-width="600px"
    elevation="5">
    <h1>Waiting participants...</h1>
    <div class="session-info">
      <p>Session ID: {{ sessionStore.idSession }}</p>
      <img alt="Qr code" src="../../assets/QR_CODE.png" style="width: 200px" />
    </div>

    <p>{{ participantsCount }} participant joined the session !</p>
    <v-btn color="primary" class="mx-6 my-3" @click='launchWindows'>
      <p class="text-white font-weight-bold pa-2">Launch 3rd screen</p>
    </v-btn>
    <div>
      <v-btn color="primary" class="mx-6 my-3" @click="cancelSession">
        <p class="text-white font-weight-bold pa-2">Cancel session</p>
      </v-btn>
      <v-btn
        color="primary"
        class="mx-6 my-3"
        :loading="loading"
        @click="handleLaunch">
        <p class="text-white font-weight-bold pa-2">Start session</p>
      </v-btn>

    </div>
  </v-sheet>
</template>

<script>
  import { ref } from 'vue';
  import router from '@/router';
  import { useSessionStore } from '@/stores/sessionStore';

  export default {
    name: 'SessionWaitingBlockTeacher',
    setup() {
      const sessionStore = useSessionStore();
      return {
        loading: ref(false),
        participantsCount: ref(''), // TODO get update nb
        sessionStore,
      };
    },
    emits: ['session-start'],
    methods: {
      async cancelSession() {
        //TODO call api/store
        await router.push('/');
      },
      async handleLaunch() {
        this.loading = true;
        await this.sessionStore.nextQuestion();
        this.$emit('session-start');
        this.loading = false;
        // try {
        //   console.log(this.sessionStore);
        //   await this.sessionStore.nextQuestion();
        //   this.$emit('session-start');
        // } catch (error) {
        //   console.error("Erreur lors de la requête nextQuestion:", error);
        // } finally {
        //   this.loading = false;
        // }
      },
      launchWindows() {
        console.log(this.sessionStore);
        const routeData = router.resolve({name: 'public', query: {idSession: this.sessionStore.idSession}});
        window.open(routeData.href, '_blank');
      }
    },
  };
</script>
