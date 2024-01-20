<template>
  <v-sheet
    min-width="450px"
    width="90%"
    class="mt-5 px-6 py-8 mx-auto d-flex flex-row"
    elevation="4"
    rounded="lg">
    <div class="w-75 mx-auto">
      <h2 class="text-center text-h2">Create a session</h2>

      <table class="questionnary-table mx-auto w-100">
        <thead>
          <tr>
            <th colspan="3">Questionnaire</th>
            <th>Nombre de question</th>
            <th>Actions</th>
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
              No questionnary selected
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Bouton pour ouvrir la fenêtre pop-up -->
      <v-btn @click="openPopup" class="mt-4">Add Questionnaire</v-btn>

      <session-setting></session-setting>
      <v-btn @click="handleCreateSession" class="mt-4">Start the session</v-btn>

      <!-- Fenêtre pop-up -->
      <v-dialog v-model="popup" max-width="600">
        <v-card>
          <v-card-title>Ajouter un questionnaire</v-card-title>
          <v-card-text>
            <!-- Contenu de votre fenêtre pop-up (peut inclure une barre de recherche, etc.) -->
            <v-text-field
              v-model="searchQuery"
              @update:model-value="updateSearchQuery"
              label="Rechercher un questionnaire"></v-text-field>
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
                  composé de {{ availableQuestionnaire.nbQuestion }} questions
                </v-list-item-subtitle>
                <template v-slot:append>
                  <v-btn @click="addQuestionnaire(availableQuestionnaire, i)">
                    Ajouter
                  </v-btn>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="closePopup">Fermer</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-sheet>
</template>

<script>
  import { ref } from 'vue';
  import router from '@/router';
  import { useSessionStore } from '@/stores/sessionStore';
  import { useQuestionnaryStore } from '@/stores/questionnaryStore';
  import { ValidationError } from '@/utils/valdiationError';
  import ErrorSnackbar from '@/components/commun/ErrorSnackbar.vue';
  import ErrorDialog from '@/components/commun/ErrorDialog.vue';
  import SessionSetting from '@/components/session/SessionSetting.vue';

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
      async addselectID() {
        for (let i = 0; i < this.questionnaries.length; i++) {
          this.selectedQuestionnary.push({ id: this.questionnaries[i].id });
        }
      },
      async handleCreateSession() {
        await this.addselectID();
        if (this.selectedQuestionnary.length > 0) {
          console.log(this.selectedQuestionnary);
          this.sessionStore.questionnary = this.selectedQuestionnary;
          console.log(this.sessionStore.questionnary);
          try {
            await this.sessionStore.createSession();
            await router.push('/session');
          } catch (error) {
            if (error instanceof ValidationError) {
              this.errorSnackbarContent = error.message;
              this.$refs.errorSnackbar.setSnackbarError(true);
            } else {
              console.error('Error while creating session:', error);
              this.$refs.dialogError.setDialogError(true);
            }
          }
          this.loading = false;
        } else alert('Selectionnez au moins 1 questionnaire');
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

  .questionnary-table th {
    background-color: #f2f2f2;
  }

  .questionnary-table span {
    display: inline-block;
  }
</style>
