<template>
  <v-sheet elevation="5" rounded="lg" class="d-flex flex-column my-2 pa-3">
    <div class="mb-4">
      <b>{{ question }}</b>
      <div class="mt-4 mb-4">
        <v-row>
          <v-col>
            <span>
              <b>Date de création:</b>
              {{ creationDate }}
            </span>
          </v-col>
          <v-col>
            <span>
              <b>Créé par:</b>
              {{ createdBy }}
            </span>
          </v-col>
        </v-row>
      </div>
      <span class="spacer"></span>
      <span class="spacer"></span>

      <!-- Un seul bouton pour gérer les résultats -->
      <v-btn v-if="userStore.isTeacher" @click="handleManageResults">
        Gérer les résultats
      </v-btn>
      <v-btn v-if="userStore.isStudent" @click="SeeResults">
        Voir les résultats
      </v-btn>
    </div>

    <v-sheet class="list">
      <!-- Dropdown menu -->
      <v-list v-if="showDropdown" id="dropdown" class="mt-2">
        <v-list-item v-for="(answer, index) in answers" :key="index">
          <template #default>
            <v-list-item-title class="text-h6">
              Question {{ index + 1 }}
            </v-list-item-title>
            {{ answer }}
          </template>
        </v-list-item>
      </v-list>

      <!-- Global Results -->
      <v-sheet v-if="showGlobal" class="mt-2">
        <v-list-item v-for="(answer, index) in answers2" :key="index">
          <template #default>
            <v-list-item-title class="text-h6">
              Question {{ index + 1 }}
            </v-list-item-title>
            {{ answer }}
          </template>
        </v-list-item>
      </v-sheet>

      <!-- Tableau des réponses des étudiants -->
      <v-sheet v-if="showStudentResponsesTable" class="mt-2">
        <v-data-table
          :headers="studentResponsesHeaders"
          :items="studentResponses"
          hide-default-footer>
          <template v-slot:items="props">
            <td>{{ props.item.studentName }}</td>
            <td>{{ props.item.answer1 }}</td>
            <td>{{ props.item.answer2 }}</td>
            <td>{{ props.item.answer3 }}</td>
          </template>
        </v-data-table>
      </v-sheet>
    </v-sheet>
  </v-sheet>
</template>

<script>
  import { onMounted, ref } from 'vue';
  import router from '@/router';
  import { useUserStore } from '@/stores/userStore';
  import { useSessionStore } from '@/stores/sessionStore';

  export default {
    name: 'QuestionItem',
    setup() {
      const userStore = useUserStore();
      const sessionStore = useSessionStore();
      return {
        userStore,
        sessionStore,
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

    methods: {
      handleManageResults() {
        router.push('/session-handle-results');
      },
      SeeResults() {
        router.push('/session-question-results');
      },
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
