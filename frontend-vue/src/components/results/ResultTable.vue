<template>
  <v-sheet elevation="5" rounded="lg" class="d-flex flex-column my-2 pa-3">
    <div class="mb-4">
      <b>{{ question }}</b>
      <div class="mt-4 mb-4">
        <v-row>
          <v-col>
            <span>
              <b>{{ $t('Result.CreatedDate') }}:</b>
              {{ creationDate }}
            </span>
          </v-col>
          <v-col>
            <span>
              <b>{{ $t('Result.CreatedBy') }}:</b>
              {{ createdBy }}
            </span>
          </v-col>
        </v-row>
      </div>
      <span class="spacer"></span>
      <span class="spacer"></span>
      <v-btn id="ic" @click="showGlobalResults" text>
        {{ $t('Result.ViewGlobalResults') }}
      </v-btn>
      <v-btn id="ic" @click="toggleDropdown" text>
        {{ $t('Result.ViewCorrectAnswers') }}
      </v-btn>
      <v-btn id="ic" @click="showStudentResponses" text>
        {{ $t('Result.ViewStudentResponses') }}
      </v-btn>
    </div>

    <v-sheet class="list">
      <!-- Dropdown menu -->
      <v-list v-if="showDropdown" id="dropdown" class="mt-2">
        <v-list-item-group>
          <v-list-item v-for="(answer, index) in answers" :key="index">
            <template #default>
              <v-list-item-content>
                <v-list-item-title class="text-h6">
                  {{ $t('Result.Question') }} {{ index + 1 }}
                </v-list-item-title>
                {{ answer }}
              </v-list-item-content>
            </template>
          </v-list-item>
        </v-list-item-group>
      </v-list>

      <!-- Global Results -->
      <v-sheet v-if="showGlobal" class="mt-2">
        <v-list-item-group>
          <v-list-item v-for="(answer, index) in answers2" :key="index">
            <template #default>
              <v-list-item-content>
                <v-list-item-title class="text-h6">
                  {{ $t('Result.Question') }} {{ index + 1 }}
                </v-list-item-title>
                {{ answer }}
              </v-list-item-content>
            </template>
          </v-list-item>
        </v-list-item-group>
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
  import { ref } from 'vue';

  export default {
    name: 'QuestionItem',
    setup() {
      return {
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
