<template>
  <v-dialog v-model="setting" max-width="600px">
    <v-card class="pa-4 px-6">
      <v-card-title>
        <span class="headline">{{ $t('session.SettingsTitle') }}</span>
      </v-card-title>

      <v-card-text>{{ $t('session.CompletedText') }}</v-card-text>

      <session-setting
        :isInSession="true"
        ref="sessionSetting"></session-setting>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="this.setting = false">{{ $t('session.CancelButton') }}</v-btn>
        <v-btn color="primary" @click="saveSettings">{{ $t('session.SaveButton') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import SessionSetting from '@/components/session/SessionSetting.vue';
  import { useSessionStore } from '@/stores/sessionStore';
  import { AccessType } from '@/utils/accesType';

  export default {
    name: 'SetSettingsDialog',
    components: { SessionSetting },
    setup() {
      const sessionStore = useSessionStore();
      return { sessionStore };
    },
    data() {
      return {
        setting: false,
      };
    },
    methods: {
      openSettings() {
        this.setting = true;
      },
      saveSettings() {
        const sessionSettings = this.$refs.sessionSetting.getSettings();
        this.sessionStore.setSettings(sessionSettings);
        if (sessionSettings.selectedAcces === AccessType.PRIVATE) {
          const selectedUsersId =
            this.$refs.sessionSettings.getSelectedUsersId();
          const selectedGroupsId =
            this.$refs.sessionSettings.getSelectedGroupsId();
          if (selectedUsersId.length > 0)
            this.sessionStore.addToWhiteList(selectedUsersId);
          if (selectedGroupsId.length > 0)
            this.sessionStore.addToWhiteListGroup(selectedGroupsId);
        }
        this.setting = false;
      },
    },
  };
</script>

<style scoped></style>
