<template>
  <v-dialog v-model="dialogVisible" max-width="500">
    <v-card>
      <v-card-title>Are you sure ?</v-card-title>

      <v-card-text>
        If you stop the session, all of results will be lost !
      </v-card-text>
      <v-card-actions class="text-center">
        <v-btn @click="yesCancel">Yes</v-btn>
        <v-btn @click="noCancel">No</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- settings dialog-->
  <set-settings-dialog ref="settingsDialog"></set-settings-dialog>
  <h1>Waiting participants...</h1>
  <div class="session-info">
    <p>Session ID: {{ sessionStore.idSession }}</p>
    <qrcode-vue :value="value" :size="size" />
    <p>
      <a>{{ getCurrentLocation() }}</a>
    </p>
  </div>

  <div>
    <p>{{ sessionStore.status.nbJoined }} user joined</p>
  </div>
  <v-divider class="ma-3"></v-divider>
  <div>
    <v-btn color="primary" class="mx-6 my-3" @click="launchWindows">
      <p class="text-white font-weight-bold pa-2">Launch public screen</p>
    </v-btn>
    <v-btn color="primary" class="mx-6 my-3" @click="openSettings">
      Settings
    </v-btn>
  </div>
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

  import { useSessionStore } from '@/stores/sessionStore';
  import SessionSetting from '@/components/session/SessionSetting.vue';
  import SetSettingsDialog from '@/components/session/SetSettingsDialog.vue';
  import router from '@/router';
  import QrcodeVue from 'qrcode.vue';

  export default {
    name: 'SessionWaitingBlockTeacher',
    components: { SetSettingsDialog, SessionSetting, QrcodeVue },
    setup() {
      const sessionStore = useSessionStore();

      return {
        loading: ref(false),
        sessionStore,
        switch1Value: ref(false),
        switch2Value: ref(false),
        switch3Value: ref(false),
      };
    },
    data() {
      return {
        dialogVisible: false,
        value: this.getCurrentLocation() + this.sessionStore.idSession,
        size: 200,
      };
    },
    emits: ['session-start'],
    methods: {
      getCurrentLocation() {
        return window.location.origin + this.$route.path;
      },
      async copyLinkToClipboard() {
        await navigator.clipboard.writeText(this.value);
      },
      cancelSession() {
        this.dialogVisible = true;
      },
      noCancel() {
        this.dialogVisible = false;
      },
      async yesCancel() {
        await this.sessionStore.stopSession();
        this.sessionStore.sessionEnd();
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
      openSettings() {
        this.$refs.settingsDialog.openSettings();
      },
    },
  };
</script>
