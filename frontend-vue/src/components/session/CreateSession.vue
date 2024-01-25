<template>
  <v-sheet
    min-width="450px"
    width="90%"
    class="mt-4 px-6 py-8 mx-auto d-flex flex-row mb-5"
    elevation="4"
    rounded="lg">
    <div class="w-75 mx-auto">
      <h2 class="text-center text-h2">{{ $t('session.CreateSessionTitle') }}</h2>

      <table class="questionnary-table mx-auto w-100">
        <thead>
          <tr>
            <th colspan="3">{{ $t('session.Questionnaire') }}</th>
            <th>{{ $t('session.NumQuestions') }}</th>
            <th colspan="2">
              <template class="d-flex justify-end">
                <!-- Bouton pour ouvrir la fenêtre pop-up -->
                <v-btn @click="openPopup" class="d-flex justify-center">
                  {{ $t('session.AddQuestionnaireButton') }}
                </v-btn>
              </template>
            </th>
          </tr>
        </thead>
        <tbody v-if="questionnaries.length !== 0">
          <tr v-for="(questionnary, index) in questionnaries" :key="index">
            <td colspan="3">
              <span>{{ questionnary.title }}</span>
            </td>
            <td class="text-center">
              <span>{{ questionnary.nbQuestion }}</span>
            </td>
            <td class="text-center" colspan="2">
              <v-btn
                icon="keyboard_arrow_up"
                @click="moveQuestionnaryUp(index)"
                :disabled="index === 0"></v-btn>
              <v-btn
                icon="keyboard_arrow_down"
                @click="moveQuestionnaryDown(index)"
                :disabled="index === questionnaries.length - 1"></v-btn>
              <v-btn icon="delete" @click="removeQuestionnary(index)"></v-btn>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="6" class="text-center text-warning">
              {{ $t('session.NoQuestionnarySelected') }}
            </td>
          </tr>
        </tbody>
      </table>

      <v-sheet border="sm" rounded="lg" class="px-4">
        <p class="text-h4 mt-2">{{ $t('session.SessionSettingsTitle') }}</p>
        <session-setting
          ref="sessionSettings"
          :isInSession="false"></session-setting>
      </v-sheet>

      <v-btn
        @click="handleCreateSession"
        class="mt-4"
        :loading="loadingStart"
        color="primary">
        {{ $t('session.StartSessionButton') }}
      </v-btn>

      <!-- Fenêtre pop-up -->
      <v-dialog v-model="popup" max-width="600">
        <v-card>
          <v-card-title>{{ $t('session.AddQuestionnaireTitle') }}</v-card-title>
          <v-card-text>
            <!-- Contenu de votre fenêtre pop-up (peut inclure une barre de recherche, etc.) -->
            <v-text-field
              v-model="searchQuery"
              @update:model-value="updateSearchQuery"
              :label="$t('session.SearchQuestionnaire')"></v-text-field>
            <!-- Liste des questionnaires disponibles (peut provenir de votre API, etc.) -->
            <v-list>
              <v-list-item
                v-for="(
                  availableQuestionnaire, i
                ) in displayedAvailableQuestionnaires"
                :key="i">
                <v-list-item-title>
                  {{ availableQuestionnaire.title }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ $t('session.ComposedOfNumQuestions')}} {{ availableQuestionnaire.nbQuestion }} {{ $t('session.questions')}}
                </v-list-item-subtitle>
                <template v-slot:append>
                  <v-btn @click="addQuestionnaire(availableQuestionnaire, i)">
                    {{ $t('session.AddButton') }}
                  </v-btn>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="closePopup">{{ $t('session.CloseButton') }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-sheet>
</template>

<script>
  import { ref } from 'vue';
  import { useSessionStore } from '@/stores/sessionStore';
  import { useQuestionnaryStore } from '@/stores/questionnaryStore';
  import { ValidationError } from '@/utils/valdiationError';
  import SessionSetting from '@/components/session/SessionSetting.vue';
  import { AccessType } from '@/utils/accesType';
  import router from '@/router';

  export default {
    name: 'CreateSession',
    components: { SessionSetting },
    async beforeMount() {
      await this.questionnaryStore.getQuestionnariesFromUser();
      this.availableQuestionnaires = this.questionnaryStore.questionnaryList;
      this.updateSearchQuery();
    },
    data() {
      const sessionStore = useSessionStore();
      const questionnaryStore = useQuestionnaryStore();
      return {
        questionnaryStore,
        sessionStore,
        questionnaries: [],
        popup: ref(false),
        searchQuery: '',
        availableQuestionnaires: [],
        displayedAvailableQuestionnaires: [],
        selectedQuestionnary: [],
        loadingStart: false,
      };
    },
    methods: {
      moveQuestionnaryUp(index) {
        if (index > 0) {
          const temp = this.questionnaries[index];
          this.questionnaries[index] = this.questionnaries[index - 1];
          this.questionnaries[index - 1] = temp;
        }
      },
      updateSearchQuery() {
        const searchRegex = new RegExp(this.searchQuery, 'i');
        if (this.searchQuery === '')
          this.displayedAvailableQuestionnaires = this.availableQuestionnaires;
        else {
          this.displayedAvailableQuestionnaires =
            this.availableQuestionnaires.filter(
              (questionnary) => questionnary.title.search(searchRegex) !== -1,
            );
        }
      },
      moveQuestionnaryDown(index) {
        if (index < this.questionnaries.length - 1) {
          const temp = this.questionnaries[index];
          this.questionnaries[index] = this.questionnaries[index + 1];
          this.questionnaries[index + 1] = temp;
        }
      },
      removeQuestionnary(index) {
        this.availableQuestionnaires.push(this.questionnaries[index]);
        this.questionnaries.splice(index, 1);
      },
      openPopup() {
        this.popup = true;
      },
      closePopup() {
        this.popup = false;
      },
      addQuestionnaire(selectedQuestionnaire, index) {
        this.availableQuestionnaires.splice(index, 1);
        this.questionnaries.push(selectedQuestionnaire);
        this.closePopup();
      },
      async addSelectId() {
        for (let i = 0; i < this.questionnaries.length; i++) {
          this.selectedQuestionnary.push({ id: this.questionnaries[i].id });
        }
      },
      async handleCreateSession() {
        this.loadingStart = true;
        await this.addSelectId();
        if (this.selectedQuestionnary.length > 0) {
          const settings = this.$refs.sessionSettings.getSettings();

          if (
            settings.accessType === AccessType.PRIVATE &&
            this.$refs.sessionSettings.getSelectedUsersId().length === 0 &&
            this.$refs.sessionSettings.getSelectedGroupsId().length === 0
          ) {
            alert('Aucun utilisateur ou groupe ont été sélectionné');
          } else {
            this.sessionStore.questionnary = this.selectedQuestionnary;
            this.loadingStart = true;
            try {
              if (settings.accessType === AccessType.PRIVATE) {
                const selectedUsersId =
                  this.$refs.sessionSettings.getSelectedUsersId();
                const selectedGroupsId =
                  this.$refs.sessionSettings.getSelectedGroupsId();
                await this.sessionStore.createSession(
                  settings,
                  selectedUsersId,
                  selectedGroupsId,
                );
                await router.replace({
                  name: 'menu.SessionRouted',
                  params: { idSession: this.sessionStore.idSession },
                });
              } else {
                await this.sessionStore.createSession(settings);
                await router.replace({
                  name: 'menu.SessionRouted',
                  params: { idSession: this.sessionStore.idSession },
                });
              }
            } catch (error) {
              if (error instanceof ValidationError) {
                this.errorSnackbarContent = error.message;
                this.$refs.errorSnackbar.setSnackbarError(true);
              } else {
                console.error('Error while creating session:', error);
                this.$refs.dialogError.setDialogError(true);
              }
            }
          }
          this.loadingStart = false;
        } else alert('Selectionnez au moins 1 questionnaire');
        this.loadingStart = false;
      },
    },
  };
</script>

<style scoped>
  .questionnary-table {
    width: 70%;
    margin: 20px auto;
    border-collapse: collapse;
    background-color: #fff;
  }

  .questionnary-table th,
  .questionnary-table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }

  table.questionnary-table tr td:nth-child(2) {
    width: 20% !important;
  }

  table.questionnary-table tr td:nth-child(3) {
    width: 35% !important;
  }

  table.questionnary-table tr th:nth-child(2) {
    width: 20% !important;
  }

  table.questionnary-table tr th:nth-child(3) {
    width: 35% !important;
  }

  .questionnary-table th {
    background-color: #f2f2f2;
  }

  .questionnary-table span {
    display: inline-block;
  }
</style>
