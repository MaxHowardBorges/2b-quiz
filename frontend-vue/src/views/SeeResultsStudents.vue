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
      <v-btn id="ic" @click="showGlobalResults" text>
        Voir les résultats globaux
      </v-btn>
      <v-btn id="ic" @click="toggleDropdown" text>
        Voir les réponses correctes
      </v-btn>
      <v-btn id="ic" @click="showStudentResponses" text>
        Voir les réponses des étudiants
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
                  Question {{ index + 1 }}
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
                  Question {{ index + 1 }}
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
            <td>
              <v-text-field
                v-model="props.item.grade"
                label="Grade"
                outlined></v-text-field>
            </td>
          </template>
        </v-data-table>
      </v-sheet>

      <!-- Average Grade -->
      <v-row v-if="showStudentResponsesTable" class="mt-2">
        <v-col>
          <v-text-field
            v-model="averageGrade"
            label="Average Grade"
            readonly
            outlined></v-text-field>
        </v-col>
      </v-row>

      <!-- Button for the First Question -->
      <v-btn @click="handleFirstQuestionClick" class="mt-2">
        Go to First Question
      </v-btn>
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

  export default {
    name: 'QuestionItem',
    setup() {
      return {
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
            grade: '',
          },
          {
            studentName: 'Étudiant 2',
            answer1: 'Réponse B',
            answer2: 'Réponse C',
            answer3: 'Réponse A',
            grade: '',
          },
          // Ajoutez d'autres lignes d'étudiants avec leurs réponses
        ],
        averageGrade: 0,
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
        this.calculateAverageGrade();
      },
      handleSwitchChange() {
        // Handle switch changes here
        console.log('Switch 1:', this.switch1Value);
        console.log('Switch 2:', this.switch2Value);
        console.log('Switch 3:', this.switch3Value);
      },
      handleFirstQuestionClick() {
        // Handle the button click for the first question
        // You can navigate to the first question or perform any other action here
        console.log('Navigating to the first question...');
      },
      calculateAverageGrade() {
        // Calculate the average grade of all students
        const totalGrades = this.studentResponses.reduce(
          (total, student) => total + parseFloat(student.grade || 0),
          0,
        );
        this.averageGrade =
          this.studentResponses.length > 0
            ? totalGrades / this.studentResponses.length
            : 0;
      },
    },
  };
</script>

<style scoped>
  /* Ajoutez du style au besoin */
</style>
