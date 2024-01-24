<template>
  <v-sheet class="mx-auto bg-transparent">
    <v-sheet
      max-width="1400px"
      min-width="400px"
      elevation="5"
      rounded="lg"
      class="d-flex flex-column my-2 pa-3 mx-4">
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
          <div class="mt-4 mb-4" v-if="!isHost()">
            <v-row>
              <v-col>
                <span v-if="results.personnalResult !== null">
                  <b>Voici ta note :</b>
                  {{ Math.round(results.personnalResult * 100) / 100 }}% de
                  réussite
                </span>
                <span v-else>
                  <b>Voici ta note :</b>
                  Indisponible
                </span>
              </v-col>
            </v-row>
          </div>
          <span class="spacer"></span>
          <span class="spacer"></span>
        </div>
        <span class="spacer"></span>
        <span class="spacer"></span>
        <template v-if="isHost()">
          <v-btn-toggle color="primary" border="sm">
            <v-btn id="ic" @click="showGlobalResults">
              Voir les résultats globaux
            </v-btn>
            <v-btn id="ic" @click="showStudentResponses">
              Voir les réponses des étudiants
            </v-btn>
          </v-btn-toggle>
        </template>
      </div>

      <v-sheet class="list">
        <!-- Global Results -->
        <v-sheet v-if="showGlobal || !isHost()" class="mt-2">
          <v-list-item v-if="results.globalResult">
            <template #default>
              <v-list-item-title class="text-h5">
                Résultats globaux :
              </v-list-item-title>
              {{ results.globalResult }}% de réussite
            </template>
          </v-list-item>
          <template v-if="this.results.questions.length > 0">
            <v-sheet
              max-width="1000px"
              class="list mx-auto"
              v-for="(question, index) in this.results.questions"
              :key="index">
              <question-item
                class="w-100 my-3"
                :isHost="isHost()"
                :question="question"
                :global="getAverage(question.id)"
                :total="results.totalUsers"></question-item>
            </v-sheet>
          </template>
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
                      v-if="column.key !== 'studentName'"
                      class="mr-2 cursor-pointer"
                      @click="() => toggleSort(column)">
                      N°{{ column.key }}
                      <v-tooltip activator="parent" location="bottom">
                        {{ column.title.content }}
                      </v-tooltip>
                    </span>
                    <span v-else>
                      {{ column.title }}
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
      <v-sheet
        max-width="800px"
        class="d-flex flex-row justify-center align-content-center align-self-center flex-wrap"
        v-if="isHost()">
        <v-switch
          class="mx-5"
          color="primary"
          label="Visibility Results"
          v-model="switch1Value"
          @change="handleSwitchChange"></v-switch>
        <v-switch
          class="mx-5"
          color="primary"
          label="Visibility Responses"
          v-model="switch2Value"
          @change="handleSwitchChange"></v-switch>
        <v-switch
          class="mx-5"
          color="primary"
          label="Visibility Globals"
          v-model="switch3Value"
          @change="handleSwitchChange"></v-switch>
      </v-sheet>
    </v-sheet>
  </v-sheet>
</template>

<script>
  import { ref } from 'vue';
  import router from '@/router';
  import { useSessionStore } from '@/stores/sessionStore';
  import { useUserStore } from '@/stores/userStore';
  import { getTimeFromDate, parseDate } from 'frontend-vue/src/utils/dates';
  import QuestionItem from '@/components/question/QuestionItem.vue';

  export default {
    name: 'SessionResult',
    components: { QuestionItem },
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
      };
    },
    data() {
      return {
        results: {
          sessionDate: '',
          teacherSurname: '',
          globalResult: null,
          questions: [],
          usersResults: [],
          averagePerQuestion: [],
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
        if (this.results.username) return false;
        return this.results.teacherUsername === this.user.username;
      },
      getAverage(id) {
        if (!this.isHost() && !this.results.globalResult) return null;
        if (!this.isHost() && !this.results.averagePerQuestion) return null;
        return this.results.averagePerQuestion.find((q) => q.question === id)
          .average;
      },
      showGlobalResults() {
        this.showGlobal = true;
        this.showStudentResponsesTable = false;
      },
      showStudentResponses() {
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
