<template>
  <v-navigation-drawer
    :style="!rail ? 'min-width: 300px' : ''"
    location="right"
    v-model="drawer"
    :permanent="true"
    :rail="rail"
    @click="rail = false">
    <v-list>
      <v-list-item :nav="true">
        <v-list-item-title class="text-h4 py-4">Invitations</v-list-item-title>
        <template v-slot:prepend>
          <v-btn variant="text" @click.stop="rail = !rail" icon>
            <v-fade-transition>
              <v-badge
                color="primary"
                :content="sessions.length"
                :floating="true"
                max="9"
                overlap>
                <v-icon :class="!rail ? 'rotated rotate' : 'rotate'">
                  arrow_back_ios
                </v-icon>
              </v-badge>
            </v-fade-transition>
          </v-btn>
        </template>
      </v-list-item>
      <v-list-item v-for="session in sessions" :key="session.idSession">
        <session-activity-item v-if="!rail" :session="session" />
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
  import SessionActivityItem from '@/components/session/activity/SessionActivityItem.vue';
  import { useSessionStore } from '@/stores/sessionStore';

  export default {
    name: 'SessionActivity',
    components: { SessionActivityItem },
    data() {
      const sessionStore = useSessionStore();
      return {
        drawer: true,
        rail: true,
        sessionStore,
        sessions: [],
      };
    },
    async mounted() {
      await this.getSessions();
    },
    methods: {
      async getSessions() {
        try {
          this.sessions = await this.sessionStore.getCurrentSessions();
        } catch (error) {}
      },
    },
  };
</script>

<style scoped>
  .rotated {
    transform: rotate(180deg) !important;
  }
  .rotate {
    transition: transform 0.3s;
  }
</style>
