<template>
  <div class="w-75 mx-5">
    <h2 class="text-center">Création d'une session</h2>

    <table class="questionnary-table mx-auto w-100">
      <thead>
        <tr>
          <th>Questionnaire</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(questionnary, index) in questionnaries" :key="index">
          <td>
            <span>{{ questionnary.title }}</span>
          </td>
          <td class="text-center">
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
    </table>

    <!-- Bouton pour ouvrir la fenêtre pop-up -->
    <v-btn @click="openPopup" class="mt-4">Ajouter Questionnaire</v-btn>

    <v-select
      v-model="selected"
      :items="items"
      label="Type de session"
      class="mt-4 w-25 mx-auto"
      outlined
      dense
      required></v-select>

    <v-select
      v-model="selectedAcces"
      :items="itemsAcces"
      label="Type d'accès"
      class="mt-4 w-25 mx-auto"
      outlined
      dense
      required></v-select>

    <v-btn
      v-if="selectedAcces === 'privé'"
      @click="openSelectionDialog"
      class="mt-4">
      Choisir étudiants
    </v-btn>
    <!--    TODO choisir les membres à ajouter en cours de route -->

    <v-btn @click="handleCreateSession" class="mt-4">Lancer la session</v-btn>

    <v-dialog v-model="SelectionDialog" max-width="600">
      <v-card>
        <v-card-title>Choisir des membres</v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item></v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="">Ajouter</v-btn>
          <v-btn @click="closeSelectionDialog">Fermer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Fenêtre pop-up -->
    <v-dialog v-model="popup" max-width="600">
      <v-card>
        <v-card-title>Ajouter un questionnaire</v-card-title>
        <v-card-text>
          <!-- Contenu de votre fenêtre pop-up (peut inclure une barre de recherche, etc.) -->
          <v-text-field
            v-model="searchQuery"
            label="Rechercher un questionnaire"></v-text-field>
          <!-- Liste des questionnaires disponibles (peut provenir de votre API, etc.) -->
          <v-list>
            <v-list-item
              v-for="(availableQuestionnaire, i) in availableQuestionnaires"
              :key="i">
              <v-list-item-title>
                {{ availableQuestionnaire.title }}
              </v-list-item-title>
              <v-list-item-action>
                <v-btn @click="addQuestionnaire(availableQuestionnaire)">
                  Ajouter
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="closePopup">Fermer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import { ref } from 'vue';
  import router from '@/router';
  import { useSessionStore } from '@/stores/sessionStore';
  import { useQuestionnaryStore } from '@/stores/questionnaryStore';
  import { ValidationError } from '@/utils/valdiationError';
  import ErrorSnackbar from '@/components/commun/ErrorSnackbar.vue';
  import ErrorDialog from '@/components/commun/ErrorDialog.vue';

  export default {
    name: 'CreateSession',
    components: { ErrorSnackbar, ErrorDialog },
    async mounted() {
      await this.questionnaryStore.getQuestionnariesFromUser();
      this.questionnaries = this.questionnaryStore.questionnaryList;
      console.log(this.questionnaries);
    },
    data() {
      const sessionStore = useSessionStore();
      const questionnaryStore = useQuestionnaryStore();
      return {
        questionnaryStore,
        sessionStore,
        questionnaries: [
          { name: 'Questionnaire 1' },
          { name: 'Questionnaire 2' },
          { name: 'Questionnaire 3' },
          { name: 'Questionnaire 4' },
          { name: 'Questionnaire 5' },
        ],
        items: ['piloté', 'libre', 'chronometré'],
        selected: ref('piloté'),
        itemsAcces: ['fermé', 'public', 'privé'],
        selectedAcces: ref('fermé'),
        SelectionDialog: ref(false),
        popup: ref(false),
        searchQuery: '',
        availableQuestionnaires: [],
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
      openSelectionDialog() {
        this.SelectionDialog = true;
      },
      closeSelectionDialog() {
        this.SelectionDialog = false;
      },
      addQuestionnaire(selectedQuestionnaire) {
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
