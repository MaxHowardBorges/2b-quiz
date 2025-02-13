<template>
  <v-sheet class="mx-auto bg-transparent d-flex flex-wrap justify-center">
    <v-sheet
      max-width="1400px"
      min-width="400px"
      elevation="5"
      rounded="lg"
      class="d-flex flex-column my-2 pa-3 mx-4 align-center flex-1-0-100">
      <div class="mb-4">
        <div
          style="align-self: start"
          id="divButton"
          class="d-flex justify-center">
          <v-btn id="ic" icon="undo" @click="returnHistory"></v-btn>
        </div>
        <b>{{ question }}</b>
        <div class="mt-4 mb-4">
          <v-row>
            <v-col>
              <span>
                <b>{{ $t('session.CreatedDateLabel') }}:</b>
                {{ parseDate(results.sessionDate).replace(' ', '&nbsp;') }}
                -&nbsp;{{
                  getTimeFromDate(results.sessionDate).replace(' ', '&nbsp;')
                }}
              </span>
            </v-col>
            <v-col>
              <span>
                <b>{{ $t('session.CreatedByLabel') }}:</b>
                {{ getSurname() }}
              </span>
            </v-col>
          </v-row>
          <div class="mt-4 mb-4" v-if="!isHost()">
            <v-row>
              <v-col>
                <span v-if="results.personnalResult !== null">
                  <b>{{ $t('session.YourGradeLabel') }} :</b>
                  {{ Math.round(results.personnalResult * 100) / 100 }}%
                  {{ $t('session.SuccessRateLabel') }}
                </span>
                <span v-else>
                  <b>{{ $t('session.YourGradeLabel') }} :</b>
                  {{ $t('session.UnavailableLabel') }}
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
              {{ $t('session.ShowGlobalResultsLabel') }}
            </v-btn>
            <v-btn id="ic" @click="showStudentResponses">
              {{ $t('session.ShowStudentResponsesLabel') }}
            </v-btn>
          </v-btn-toggle>
          <v-btn
            class="ml-2"
            color="primary"
            icon="settings"
            @click="() => (viewSettings = !viewSettings)"></v-btn>
        </template>
      </div>

      <v-expand-transition>
        <v-sheet
          border="sm"
          rounded="lg"
          max-width="800px"
          class="mx-auto"
          v-if="isHost() && viewSettings">
          <p class="mt-2 text-h5">{{ $t('session.Title') }}</p>
          <v-sheet class="d-flex mx-auto flex-wrap">
            <v-switch
              class="mx-5 mt-3"
              color="primary"
              :label="$t('session.DisplayPersonalResultLabel')"
              v-model="isResult"
              @update:model-value="isResponses = isResponses && isResult" />

            <v-switch
              class="mx-5"
              color="primary"
              :label="$t('session.DisplayCorrectResponsesLabel')"
              v-model="isResponses"
              :disabled="!isResult" />

            <v-switch
              class="mx-5"
              color="primary"
              :label="$t('session.DisplayGlobalResultLabel')"
              v-model="isGlobal" />
          </v-sheet>
          <v-expand-transition>
            <v-btn
              class="mb-3"
              v-if="!isEqualsToSettings()"
              @click="saveChanges()">
              {{ $t('session.SaveChangesButton') }}
            </v-btn>
          </v-expand-transition>
        </v-sheet>
      </v-expand-transition>

      <v-sheet class="list">
        <!-- Global Results -->
        <v-fade-transition>
          <v-sheet v-if="showGlobal || !isHost()" class="mt-2">
            <v-list-item v-if="results.globalResult">
              <template #default>
                <v-list-item-title class="text-h5">
                  {{ $t('session.GlobalResultsTitle') }} :
                </v-list-item-title>
                {{ results.globalResult }}% {{ $t('session.SuccessRate') }}
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
                  :total="
                    !isHost() ? results.totalUsers : results.usersResults.length
                  "></question-item>
              </v-sheet>
            </template>
          </v-sheet>
        </v-fade-transition>
        <v-fade-transition>
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
                    v-for="(question, index) in item.questions"
                    :key="index"
                    :class="
                      question.studentAnswers.length === 0 ||
                      !question.hasAnsweredCorrectly
                        ? 'bg-error'
                        : 'bg-success'
                    ">
                    <template v-if="question.studentAnswers.length === 0">
                      {{ $t('session.NoAnswer') }}
                    </template>
                    <template v-else>
                      {{ question.studentAnswers.join(', ') }}
                    </template>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-sheet>
        </v-fade-transition>
      </v-sheet>
    </v-sheet>
  </v-sheet>
</template>

<script>
  import { ref } from 'vue';
  import router from '@/router';
  import { useSessionStore } from '@/stores/sessionStore';
  import { useUserStore } from '@/stores/userStore';
  import { getTimeFromDate, parseDate } from '@/utils/dates';
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
        question: ref('Session 1'),
        showDropdown: ref(false),
        showGlobal: ref(true),
        showStudentResponsesTable: ref(false),
      };
    },
    data() {
      return {
        viewSettings: false,
        isGlobal: false,
        isResult: false,
        isResponses: false,
        results: {
          sessionDate: '',
          teacherSurname: '',
          globalResult: null,
          questions: [],
          usersResults: [],
          averagePerQuestion: [],
          teacherUsername: '',
          totalUsers: 0,
        },
        user: {
          username: '',
          surname: '',
        },
        settings: {
          isGlobal: false,
          isResult: false,
          isResponses: false,
        },
      };
    },
    async beforeMount() {
      await this.loadData();
    },
    methods: {
      getTimeFromDate,
      parseDate,
      roundNumber() {
        if (this.results.usersResults !== undefined) {
          this.results.globalResult = Math.round(this.results.globalResult);
          this.results.averagePerQuestion = this.results.averagePerQuestion.map(
            (q) => {
              q.average = Math.round(q.average);
              return q;
            },
          );
          this.results.usersResults = this.results.usersResults.map((u) => {
            u.personnalResult = Math.round(u.personnalResult);
            return u;
          });
        } else {
          this.results.globalResult = Math.round(this.results.globalResult);
          this.results.personnalResult = Math.round(
            this.results.personnalResult,
          );
          this.results.averagePerQuestion = this.results.averagePerQuestion.map(
            (q) => {
              q.average = Math.round(q.average);
              return q;
            },
          );
        }
      },
      async loadData() {
        try {
          this.results = await this.sessionStore.getResults(this.idSession);
          this.roundNumber();
          this.user = await this.userStore.getSelf();
          if (this.isHost()) {
            const settings = await this.sessionStore.getSessionResultSettings(
              this.idSession,
            );
            this.settings = settings;
            this.isGlobal = settings.isGlobal;
            this.isResult = settings.isResult;
            this.isResponses = settings.isResponses;
          }
        } catch (e) {
          alert('Erreur lors du chargement des résultats');
        }
      },
      isHost() {
        if (this.results.username) return false;
        return this.results.teacherUsername === this.user.username;
      },
      getAverage(id) {
        if (!this.isHost() && !this.results.globalResult) return null;
        if (!this.results.averagePerQuestion) return null;
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
      isEqualsToSettings() {
        return (
          this.isGlobal === this.settings.isGlobal &&
          this.isResult === this.settings.isResult &&
          this.isResponses === this.settings.isResponses
        );
      },
      async returnHistory() {
        await router.push({
          name: 'menu.history',
        });
      },
      getSurname() {
        if (this.isHost()) {
          return 'Vous';
        } else {
          return this.results.teacherSurname;
        }
      },
      saveChanges() {
        try {
          this.settings.isGlobal = this.isGlobal;
          this.settings.isResult = this.isResult;
          this.settings.isResponses = this.isResponses;
          this.sessionStore.setSessionResultSettings(
            this.idSession,
            this.settings,
          );
        } catch (e) {
          alert('Erreur lors de la sauvegarde des paramètres');
        }
      },
    },
  };
</script>

<style scoped>
  /* Ajoutez du style au besoin */
</style>
