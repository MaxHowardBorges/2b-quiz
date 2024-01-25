<template>
  <v-sheet
    elevation="3"
    rounded="lg"
    max-width="800px"
    class="d-flex flex-column my-2 pa-3 w-100 mx-auto">
    <div class="mb-4">
      <b>Session</b>
      <div class="mt-4 mb-4">
        <v-row>
          <v-col class="text-left ml-1">
            <span>
              <b>{{ $t('session.CreatedDateLabel') }}:</b>
              {{ parseDate(session.date).replace(' ', '&nbsp;') }} - &nbsp;{{
                getTimeFromDate(session.date).replace(' ', '&nbsp;')
              }}
            </span>
          </v-col>
          <v-col class="text-right mr-1">
            <span>
              <b>{{ $t('session.CreatedByLabel') }}:</b>
              {{ isHost() ? $t('session.You') : session.teacher.username }}
            </span>
          </v-col>
        </v-row>
      </div>
      <span class="spacer"></span>
      <span class="spacer"></span>

      <!-- Un seul bouton pour gérer les résultats -->
      <v-btn v-if="isHost()" @click="handleManageResults" color="primary">
        {{ $t('session.ManageResultsButton') }}
      </v-btn>
      <v-btn v-else @click="SeeResults" color="primary">
        {{ $t('session.ViewResultsButton') }}
      </v-btn>
    </div>
  </v-sheet>
</template>

<script>
  import { ref } from 'vue';
  import router from '@/router';
  import { useUserStore } from '@/stores/userStore';
  import { useSessionStore } from '@/stores/sessionStore';
  import { getTimeFromDate, parseDate } from '@/utils/dates';

  export default {
    name: 'SessionItem',
    props: {
      session: {
        date: String,
      },
      idSession: String,
    },
    setup() {
      const userStore = useUserStore();
      const sessionStore = useSessionStore();
      return {
        userStore,
        sessionStore,
        question: ref('Session 1'),
        showDropdown: ref(false),
        showGlobal: ref(false),
        showStudentResponsesTable: ref(false),
      };
    },
    methods: {
      getTimeFromDate,
      parseDate,
      isHost() {
        return this.session.userSession;
      },
      handleManageResults() {
        router.push({
          name: 'menu.SessionHandleResults',
          params: { idSession: this.session.id },
        });
      },
      SeeResults() {
        router.push({
          name: 'menu.SessionHandleResults',
          params: { idSession: this.session.id },
        });
      },
    },
  };
</script>

<style scoped>
  /* Ajoutez du style au besoin */
</style>
