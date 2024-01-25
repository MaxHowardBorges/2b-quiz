<template>
  <v-sheet
    max-width="450px"
    min-width="150px"
    class="pa-5 d-block w-100"
    elevation="3"
    rounded="lg"
    position="relative">
    <v-form @submit.prevent="handleJoinSession">
      <v-text-field
        id="idSession"
        v-model="idSession"
        label="Session ID"></v-text-field>
      <v-btn
        type="submit"
        block=""
        class="mt-2"
        color="primary"
        :loading="loading">
        <p class="text-white font-weight-bold">Join</p>
      </v-btn>
      <v-btn
        @click="redirectToSessionHistory"
        color="primary"
        class="mx-6 my-3"
        max-width="250px">
        <p class="text-white font-weight-bold pa-2">Session history</p>
      </v-btn>
    </v-form>
  </v-sheet>
</template>

<script>
  import { ref } from 'vue';
  import { useSessionStore } from '@/stores/sessionStore';
  import router from '@/router';

  export default {
    name: 'JoinForm',
    setup() {
      const sessionStore = useSessionStore();
      return {
        sessionStore,
      };
    },
    data() {
      return {
        idSession: ref(''),
        loading: false,
      };
    },
    emits: ['joined-session'],
    methods: {
      async handleJoinSession() {
        this.loading = true;
        await router.replace({
          name: 'SessionRouted',
          params: { idSession: this.idSession.toString() },
        });
        router.go(0);
        this.loading = false;
      },
      async redirectToSessionHistory() {
        await router.push('/history');
      },
    },
  };
</script>
