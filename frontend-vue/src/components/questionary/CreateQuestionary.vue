<template>
  <v-sheet class="mt-20px align-center">
    <v-text-field
      type="text"
      id="question"
      v-model="question.content"
      required
      label="Question :"
      :value="question.content"
      :style="{ 'min-width': '200px' }"
    ></v-text-field>

    <v-sheet
      v-if="
        selectedQuestionType === 'Unique' || this.selectedQuestionType === null
      ">
      <v-sheet class="answers">
        <v-sheet v-for="(answer, index) in question.answers" :key="index">
          <v-text-field
            :label="'Answer ' + (index + 1) + ' :'"
            :id="'answer-' + index"
            :value="answer.content"
            v-model="answer.content"
            required></v-text-field>
          <v-radio-group v-model="correct">
            <v-radio
              :id="'correct-answer-' + index"
              :label="'Correct'"
              :value="index"></v-radio>
          </v-radio-group>
        </v-sheet>
      </v-sheet>
    </v-sheet>

    <v-sheet
      v-if="
        selectedQuestionType === 'Open-Ended' ||
        this.selectedQuestionType === null
      "></v-sheet>

    <v-sheet v-if="selectedQuestionType === 'Multiple'">
      <v-sheet class="answers">
        <v-sheet v-for="(answer, index) in question.answers" :key="index">
          <v-text-field
            :label="'Answer ' + (index + 1) + ' :'"
            :id="'answer-' + index"
            :value="answer.content"
            v-model="answer.content"
            required></v-text-field>

          <v-checkbox
            v-model="correctMultiple"
            :id="'correct-answer-' + index"
            :label="'Correct'"
            :value="index"></v-checkbox>
        </v-sheet>
      </v-sheet>
    </v-sheet>

    <v-sheet v-if="this.selectedQuestionType === 'True-False'">
      <!-- Réponses possibles -->
      <v-sheet class="answers">
        <v-sheet>
          <v-radio-group v-model="correct">
            <v-radio :id="'correct-answer-1'" :value="0">True</v-radio>
            <v-radio :id="'correct-answer-2'" :value="1">False</v-radio>
          </v-radio-group>
        </v-sheet>
      </v-sheet>
    </v-sheet>

    <!-- Ajouter une réponse -->
    <v-sheet
      v-if="
        this.selectedQuestionType === 'Unique' ||
        this.selectedQuestionType === 'Multiple'
      ">
      <button @click="addAnswer">Add an answer</button>

      <button @click="removeAnswer()">Delete an answer</button>
    </v-sheet>
  </v-sheet>
</template>

<script>
  import { useQuestionnaryStore } from '@/stores/questionnaryStore';

  export default {
    props: {
      selectedQuestionType: { String, default: 'Unique' },
      idQuestion: { Number, default: null },
    },
    setup() {
      const questionnaryStore = useQuestionnaryStore();
      return {
        questionnaryStore,
      };
    },
    computed() {},
    data() {
      let question = this.getQuestion();
      return {
        question,
        indexD: 0,
        correctMultiple: [],
        correct: 0,
        questionnaryName: '',
        answers: [{ content: '', isCorrect: false }],
        correctAnswer: null,
      };
    },
    methods: {
      getQuestion() {
        if (!!this.idQuestion) {
          let question = this.questionnaryStore.questions.find(
            (question) => question.id === this.idQuestion,
          );
          question.answers = this.questionnaryStore.answers;
          return question;
        }
        return {
          content: '',
          answers: [],
        };
      },
      getAnswers() {
        switch (this.selectedQuestionType) {
          case 'True-False':
            this.question.answers = [];
            this.question.answers.push({ content: 'true', isCorrect: false });
            this.question.answers.push({ content: 'false', isCorrect: false });
            break;
        }
        return this.question.answers;
      },
      addAnswer() {
        this.question.answers.push({ content: '', isCorrect: false });
      },

      removeAnswer(index) {
        // Utilisez splice pour supprimer la réponse de la liste des réponses
        this.question.answers.splice(index, 1);
      },
    },
  };
</script>

<style scoped>
  h1 {
    font-size: 24px;
    margin-bottom: 20px;
  }
  button {
    background-color: #ffd700; /* Jaune */
    color: #fff; /* Texte blanc */
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    margin: 10px;
    cursor: pointer;
  }
  label {
    font-size: 16px;
    color: #333; /* Couleur de texte normale */
  }
  input[type='text'] {
    padding: 5px;
    margin: 15px 0;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
    min-width: 50px;
  }
  input[type='radio'] {
    margin-left: 10px;
  }
</style>
