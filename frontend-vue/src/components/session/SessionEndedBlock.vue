<template>
  <v-sheet
    rounded="lg"
    width="90%"
    class="mt-5 px-6 py-8 mx-auto"
    elevation="5">
    <h1>{{ $t('session.SessionEnded') }}</h1>
    <h2 v-if="userStore.isStudent">{{ $t('session.Thanks') }}</h2>

    <div class="mt-3 d-flex flex-wrap">
      <v-btn
        min-width="190px"
        v-if="userStore.isTeacher"
        @click="handleCreateSession"
        color="primary"
        class="pa-2 ma-2 flex-1-1"
        style="flex-basis: 0 !important"
        :loading="loading">
        <p class="text-white font-weight-bold">{{ $t('session.StartNewSession') }}</p>
      </v-btn>
      <v-btn
        min-width="190px"
        @click="returnToMenu"
        color="primary"
        class="pa-2 ma-2 flex-1-1"
        style="flex-basis: 0 !important">
        <p class="text-white font-weight-bold">{{ $t('session.ReturnMenu') }}</p>
      </v-btn>
      <v-btn
        min-width="190px"
        color="primary"
        class="pa-2 ma-2 flex-1-1"
        style="flex-basis: 0 !important">
        <p class="text-white font-weight-bold">{{ $t('Result.Setting') }}</p>
      </v-btn>
    </div>
    <result-table v-if="userStore.isTeacher" />
  </v-sheet>
</template>

<script>
  import { ref } from 'vue';
  import ResultTable from '@/components/results/ResultTable.vue';
  import router from '@/router';
  import { useSessionStore } from '@/stores/sessionStore';
  import { useUserStore } from '@/stores/userStore';
  import { ValidationError } from '@/utils/valdiationError';

  export default {
    name: 'SessionEndedBlock',
    components: { ResultTable },
    setup() {
      const sessionStore = useSessionStore();
      const userStore = useUserStore();
      return {
        loading: ref(false),
        sessionStore,
        userStore,
      };
    },
    methods: {
      returnToMenu() {
        router.push('/');
      },
      async handleCreateSession() {
        this.loading = true;
        try {
          await this.sessionStore.createSession();
          this.$emit('reset');
        } catch (error) {
          if (error instanceof ValidationError) {
            await router.push({
              path: '/',
              query: { errorSnackbar: error.message },
            });
          } else {
            console.error('Error while creating session:', error);
            await router.push({
              path: '/',
              query: { serverError: 'true' },
            });
          }
        }
        this.loading = false;
      },
    },
  };
</script>

<style scoped></style>
