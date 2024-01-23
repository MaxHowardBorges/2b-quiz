<template>
  <v-sheet elevation="5" rounded="lg" class="d-flex flex-column my-2 pa-3">
    <div class="mb-4">
      <div
        style="align-self: start"
        id="divButton"
        class="d-flex justify-start">
        <v-btn id="ic" icon="undo" @click="returnHome"></v-btn>
      </div>
      <b>{{ question }}</b>
      <div class="mt-4 mb-4">
        <v-row>
          <v-col>
            <span>
              <b>Date de création:</b>
              {{ parseDate(results.sessionDate).replace(' ', '&nbsp;') }}
              à&nbsp;{{
                getTimeFromDate(results.sessionDate).replace(' ', '&nbsp;')
              }}
            </span>
          </v-col>
          <v-col>
            <span>
              <b>Créé par:</b>
              {{ getSurname() }}
            </span>
          </v-col>
        </v-row>
        <div class="mt-4 mb-4" v-if="!isHost">
          <v-row>
            <v-col>
              <span>
                <b>Voici ta note :</b>
                {{ results.personnalResult }}% de réussite
              </span>
            </v-col>
          </v-row>
        </div>
        <span class="spacer"></span>
        <span class="spacer"></span>
      </div>
      <span class="spacer"></span>
      <span class="spacer"></span>
      <v-btn-toggle color="primary" border="sm">
        <v-btn id="ic" @click="showGlobalResults">
          Voir les résultats globaux
        </v-btn>
        <v-btn id="ic" @click="toggleDropdown">
          Voir les réponses correctes
        </v-btn>
        <v-btn id="ic" @click="showStudentResponses">
          Voir les réponses des étudiants
        </v-btn>
      </v-btn-toggle>
    </div>

    <v-sheet class="list">
      <!-- Dropdown menu -->
      <v-list v-if="showDropdown" id="dropdown" class="mt-2">
        <v-list-item v-for="(answer, index) in answers" :key="index">
          <template #default>
            <v-list-item-title class="text-h5">
              Question {{ index + 1 }}
            </v-list-item-title>
            {{ answer }}
          </template>
        </v-list-item>
      </v-list>

      <!-- Global Results -->
      <v-sheet v-if="showGlobal" class="mt-2">
        <v-list-item>
          <template #default>
            <v-list-item-title class="text-h5">
              Résultats globaux :
            </v-list-item-title>
            {{ results.globalResult }}% de réussite
          </template>
        </v-list-item>
      </v-sheet>

      <!-- Tableau des réponses des étudiants -->
      <v-sheet v-if="showStudentResponsesTable" class="mt-2">
        <v-data-table :headers="getHeaders()" :items="results.usersResults">
          <template
            v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort }">
            <tr>
              <template v-for="column in columns" :key="column.key">
                <td>
                  <span
                    class="mr-2 cursor-pointer"
                    @click="() => toggleSort(column)">
                    N°{{ column.key }}
                    <v-tooltip activator="parent" location="bottom">
                      {{ column.title.content }}
                    </v-tooltip>
                  </span>
                  <template v-if="isSorted(column)">
                    <v-fade-transition>
                      <v-icon :icon="getSortIcon(column)"></v-icon>
                    </v-fade-transition>
                  </template>
                </td>
              </template>
            </tr>
          </template>
          <template v-slot:item="{ item }">
            <tr>
              <td>{{ item.username }}</td>
              <td
                v-for="question in item.questions"
                :class="
                  question.studentAnswers.length === 0 ||
                  !question.hasAnsweredCorrectly
                    ? 'bg-error'
                    : 'bg-success'
                ">
                <template v-if="question.studentAnswers.length === 0">
                  Aucune réponse
                </template>
                <template v-else>
                  {{ question.studentAnswers.join(', ') }}
                </template>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-sheet>
    </v-sheet>
    <!-- New switches added below -->
    <v-switch
      label="Visibility Results"
      class="mx-2 my-3"
      v-model="switch1Value"
      @change="handleSwitchChange"></v-switch>
    <v-switch
      label="Visibility Responses"
      class="mx-2 my-3"
      v-model="switch2Value"
      @change="handleSwitchChange"></v-switch>
    <v-switch
      label="Visibility Globals"
      class="mx-2 my-3"
      v-model="switch3Value"
      @change="handleSwitchChange"></v-switch>
  </v-sheet>
</template>

<script>
  import { ref } from 'vue';
  import router from '@/router';
  import { useSessionStore } from '@/stores/sessionStore';
  import { useUserStore } from '@/stores/userStore';
  import { getTimeFromDate, parseDate } from 'frontend-vue/src/utils/dates';

  export default {
    name: 'SessionResult',
    props: {
      idSession: String,
    },
    setup() {
      const sessionStore = useSessionStore();
      const userStore = useUserStore();
      return {
        sessionStore,
        userStore,
        switch1Value: ref(false),
        switch2Value: ref(false),
        switch3Value: ref(false),
        question: ref('Session 1'),
        creationDate: ref('2024-01-11'),
        createdBy: ref('Nom Prénom'),
        showDropdown: ref(false),
        showGlobal: ref(false),
        showStudentResponsesTable: ref(false),
        answers: ['Réponse 1', 'Réponse 2', 'Réponse 3'],
        answers2: [
          '30 % ont répondu A',
          '25 % ont répondu B',
          '45 % ont répondu C',
        ],
        studentResponsesHeaders: [
          { text: 'Étudiant', value: 'studentName' },
          { text: 'Réponse 1', value: 'answer1' },
          { text: 'Réponse 2', value: 'answer2' },
          { text: 'Réponse 3', value: 'answer3' },
        ],
        studentResponses: [
          {
            studentName: 'Étudiant 1',
            answer1: 'Réponse A',
            answer2: 'Réponse B',
            answer3: 'Réponse C',
          },
          {
            studentName: 'Étudiant 2',
            answer1: 'Réponse B',
            answer2: 'Réponse C',
            answer3: 'Réponse A',
          },
          // Ajoutez d'autres lignes d'étudiants avec leurs réponses
        ],
      };
    },
    data() {
      return {
        results: {
          sessionDate: '',
          teacherSurname: '',
          globalResults: '',
          questions: [],
          usersResults: [],
        },
        user: {
          username: '',
          surname: '',
        },
      };
    },
    async beforeMount() {
      await this.loadData();
    },
    methods: {
      getTimeFromDate,
      parseDate,
      async loadData() {
        this.results = await this.sessionStore.getResults(this.idSession);
        this.user = await this.userStore.getSelf();
        console.log(this.results);
      },
      isHost() {
        return this.results.teacherUsername === this.user.username;
      },
      toggleDropdown() {
        this.showDropdown = true;
        this.showGlobal = false;
        this.showStudentResponsesTable = false;
      },
      showGlobalResults() {
        this.showDropdown = false;
        this.showGlobal = true;
        this.showStudentResponsesTable = false;
      },
      showStudentResponses() {
        this.showDropdown = false;
        this.showGlobal = false;
        this.showStudentResponsesTable = true;
      },
      getHeaders() {
        const headers = [{ title: 'Étudiant', key: 'studentName' }];
        for (const question of this.results.questions) {
          headers.push({ title: question, key: question.id });
        }
        return headers;
      },
      handleSwitchChange() {
        // Handle switch changes here
        console.log('Switch 1:', this.switch1Value);
        console.log('Switch 2:', this.switch2Value);
        console.log('Switch 3:', this.switch3Value);
      },
      async returnHome() {
        await router.push({
          name: 'Session History',
        });
      },
      getSurname() {
        if (this.isHost()) {
          return 'Vous';
        } else {
          return this.results.teacherSurname;
        }
      },
    },
  };
</script>

<style scoped>
  /* Ajoutez du style au besoin */
</style>
