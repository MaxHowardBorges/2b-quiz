<template>
  <v-sheet elevation="5" rounded="lg" class="d-flex flex-column my-2 pa-3">
    <div class="mb-4">
      <b>{{ question }}</b>
      <div class="mt-4 mb-4">
        <v-row>
          <v-col>
            <span>
              <b>Voici ta note : 190/400</b>
              {{ studentGrade }}
            </span>
          </v-col>
          <v-col>
            <span>
              <b>La moyenne de cette session est de : 150/400</b>
              {{ sessionAverage }}
            </span>
          </v-col>
        </v-row>
      </div>
      <span class="spacer"></span>
      <span class="spacer"></span>
    </div>

    <v-sheet class="list">
      <!-- ... (rest of your code) ... -->
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

      <!-- Button for the First Question -->
      <v-btn @click="handleFirstQuestionClick" class="mt-2">Question 1</v-btn>
    </v-sheet>
  </v-sheet>
</template>

<script>
  import { ref } from 'vue';
  import router from '@/router';

  export default {
    name: 'seeResultsStudents',
    setup() {
      const studentGrade = ref(''); // Note de l'étudiant
      const sessionAverage = ref(''); // Moyenne de la session

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
        studentGrade,
        sessionAverage,
      };
    },
    methods: {
      handleFirstQuestionClick() {
        router.push('/');
      },
      calculateAverageGrade() {
        // Calculate the average grade of all students
        const totalGrades = this.studentResponses.reduce(
          (total, student) => total + parseFloat(student.grade || 0),
          0,
        );
        this.sessionAverage =
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
