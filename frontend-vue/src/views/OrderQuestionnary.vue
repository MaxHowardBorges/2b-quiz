<template>
  <div>
    <h2 class="text-center">Création d'une session</h2>

    <table class="questionnary-table mx-auto">
      <thead>
        <tr>
          <th>Questionnaire</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(questionnary, index) in questionnaries" :key="index">
          <td>
            <span>{{ questionnary.name }}</span>
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
      required
    ></v-select>

    <v-select
      v-model="selectedAcces"
      :items="itemsAcces"
      label="Type d'accès"
      class="mt-4 w-25 mx-auto"
      outlined
      dense
      required ></v-select>

    <v-btn v-if="selectedAcces === 'privé'" @click="openSelectionDialog" class="mt-4">Choisir étudiants</v-btn>
<!--    TODO choisir les membres à ajouter en cours de route -->

    <v-btn @click="" class="mt-4">Lancer la session</v-btn>
    <!--    TODO mettre le lien -->

    <v-dialog v-model="SelectionDialog" max-width="600">
      <v-card>
        <v-card-title>Choisir des membres</v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item>
            </v-list-item>
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
          <!-- Exemple : -->
          <v-text-field
            v-model="searchQuery"
            label="Rechercher un questionnaire"></v-text-field>
          <!-- Liste des questionnaires disponibles (peut provenir de votre API, etc.) -->
          <v-list>
            <v-list-item
              v-for="(availableQuestionnaire, i) in availableQuestionnaires"
              :key="i">
              <v-list-item-content>
                <v-list-item-title>
                  {{ availableQuestionnaire.name }}
                </v-list-item-title>
              </v-list-item-content>
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

<script setup>
  import { ref } from 'vue';

  const questionnaries = ref([
    { name: 'Questionnaire 1' },
    { name: 'Questionnaire 2' },
    { name: 'Questionnaire 3' },
    { name: 'Questionnaire 4' },
    { name: 'Questionnaire 5' },
  ]);

  const items = [
    'piloté',
    'libre',
    'chronometré',
  ];

  const selected = ref('piloté');

  const itemsAcces = [
    'fermé',
    'public',
    'privé',
  ];

  const selectedAcces = ref('fermé');


  const moveQuestionnaryUp = (index) => {
    if (index > 0) {
      const temp = questionnaries.value[index];
      questionnaries.value[index] = questionnaries.value[index - 1];
      questionnaries.value[index - 1] = temp;
    }
  };

  const moveQuestionnaryDown = (index) => {
    if (index < questionnaries.value.length - 1) {
      const temp = questionnaries.value[index];
      questionnaries.value[index] = questionnaries.value[index + 1];
      questionnaries.value[index + 1] = temp;
    }
  };

  const removeQuestionnary = (index) => {
    questionnaries.value.splice(index, 1);
  };

  // Variables pour la fenêtre pop-up
  const SelectionDialog = ref(false);
  const popup = ref(false);
  const searchQuery = ref('');
  const availableQuestionnaires = ref([
    { name: 'Questionnaire A' },
    { name: 'Questionnaire B' },
    { name: 'Questionnaire C' },
    // ... Ajoutez d'autres questionnaires disponibles ici
  ]);

  // Fonctions pour la fenêtre pop-up
  const openPopup = () => {
    popup.value = true;
  };

  const closePopup = () => {
    popup.value = false;
  };

  const openSelectionDialog = () => {
    SelectionDialog.value = true;
  };

  const closeSelectionDialog = () => {
    SelectionDialog.value = false;
  };

  const addQuestionnaire = (selectedQuestionnaire) => {
    questionnaries.value.push({ name: selectedQuestionnaire.name });
    closePopup();
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
