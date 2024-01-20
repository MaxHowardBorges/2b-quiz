<template>
  <h1>Waiting participants...</h1>
  <div class="session-info">
    <p>Session ID: {{ sessionStore.idSession }}</p>
    <img alt="Qr code" src="../../assets/QR_CODE.png" style="width: 200px" />
  </div>

  <div>
    <p>{{ sessionStore.status.nbJoined }} user joined</p>
  </div>
  <v-btn color="primary" class="mx-6 my-3" @click="launchWindows">
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
        this.sessionStore.sessionEnd();
        //TODO call api/store
        await router.push('/');
      },
      async handleLaunch() {
        // this.loading = true;
        // await this.sessionStore.nextQuestion();
        // this.$emit('session-start');
        // this.loading = false;
        try {
          try {
            const response = await this.sessionStore.nextQuestion();
            await this.sessionStore.getCurrentQuestionForTeacher(response);
          } catch (error) {
            console.log('Error while launching session', error);
            this.sessionStore.disconnectFromSession(
              'Error while launching session',
            );
          }
          this.$emit('session-start');
        } catch (error) {
          console.error('Erreur lors de la requête nextQuestion:', error);
        } finally {
          this.loading = false;
        }
      },
      launchWindows() {
        const routeData = router.resolve({
          name: 'public',
          query: { idSession: this.sessionStore.idSession },
        });
        window.open(routeData.href, '_blank');
      },
    },
  };
</script>
