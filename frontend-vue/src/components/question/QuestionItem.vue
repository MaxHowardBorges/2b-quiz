<template>
  <v-sheet elevation="5" rounded="lg" class="d-flex flex-column my-2 pa-3">
    <div class="mb-4"></div>
    <span class="spacer"></span>
    <span class="spacer"></span>
    <v-btn id="ic" @click="showGlobalResults" text>
      Voir les résultats globaux
    </v-btn>
    <v-btn id="ic" @click="toggleDropdown" text>
      Voir les réponses correctes
    </v-btn>
    <v-btn id="ic" @click="showStudentResponses" text>
      Voir les réponses des étudiants
    </v-btn>
  </v-sheet>
</template>

<script>
  import { ref } from 'vue';

  export default {
    name: 'QuestionItem',
    props: {
      questionName: String,
      questionnaryId: Number,
    },
    methods: {
      toggleDropdown() {
        this.showDropdown = !this.showDropdown;
      },
      showGlobalResults() {
        this.showGlobal = !this.showGlobal;
      },
      showStudentResponses() {
        this.showStudentResponsesTable = !this.showStudentResponsesTable;
      },
    },
  };
</script>

<style scoped>
  /* Ajoutez du style au besoin */
</style>
