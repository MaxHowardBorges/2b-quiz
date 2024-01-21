<template>
  <v-sheet
    rounded="lg"
    width="70%"
    class="mt-5 px-6 py-8 mx-auto"
    max-width="600px"
    elevation="5"
  >
    <h1>Waiting participants...</h1>
    <div class="session-info">
      <p>Session ID: {{ sessionStore.idSession }}</p>
      <img alt="Qr code" src="../../assets/QR_CODE.png" style="width: 200px" />
    </div>

    <p>{{ participantsCount }} participant joined the session !</p>

    <div>
      <v-btn color="primary" class="mx-6 my-3" @click="cancelSession">
        <p class="text-white font-weight-bold pa-2">Cancel session</p>
      </v-btn>
      <v-btn
        color="primary"
        class="mx-6 my-3"
        :loading="loading"
        @click="handleLaunch"
      >
        <p class="text-white font-weight-bold pa-2">Start session</p>
      </v-btn>

      <!-- New switches added below -->
      <v-switch
        label="Visibility Results"
        class="mx-2 my-3"
        v-model="switch1Value"
        @change="handleSwitchChange"
      ></v-switch>
      <v-switch
        label="Visibility Responses"
        class="mx-2 my-3"
        v-model="switch2Value"
        @change="handleSwitchChange"
      ></v-switch>
      <v-switch
        label="Visibility Globals"
        class="mx-2 my-3"
        v-model="switch3Value"
        @change="handleSwitchChange"
      ></v-switch>
    </div>
  </v-sheet>
</template>

<script>
  import { ref } from 'vue';

  import { useSessionStore } from '@/stores/sessionStore';

  export default {
    name: 'SessionWaitingBlockTeacher',
    setup() {
      const sessionStore = useSessionStore();

      return {
        loading: ref(false),
        participantsCount: ref(''), // TODO get update nb
        sessionStore,
        switch1Value: ref(false),
        switch2Value: ref(false),
        switch3Value: ref(false),
      };
    },
    emits: ['session-start'],
    methods: {
      async cancelSession() {
        //TODO call api/store
        await this.sessionStore.stopSession();
        await router.push('/');
      },
      async handleLaunch() {
        this.loading = true;
        await this.sessionStore.nextQuestion();
        this.$emit('session-start');
        this.loading = false;
      },
      handleSwitchChange() {
        // Handle switch changes here
        console.log('Switch 1:', this.switch1Value);
        console.log('Switch 2:', this.switch2Value);
        console.log('Switch 3:', this.switch3Value);
      },
    },
  };
</script>
