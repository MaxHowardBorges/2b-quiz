<template>
  <v-sheet class="mt-20px align-center" v-if="question">
    <v-text-field
      type="text"
      id="question"
      v-model="question.content"
      required
      label="Question :"
      :value="question.content"
      :style="{ 'min-width': '200px' }"></v-text-field>

    <v-sheet
      v-if="
        selectedQuestionType === 'Unique' || this.selectedQuestionType === null
      ">
      <v-sheet class="answers">
        <div
          v-for="(answer, index) in question.answers"
          :key="index"
          class="d-flex"
          id="tabCorrect">
          <v-text-field
            :label="'Answer ' + (index + 1) + ' :'"
            :id="'answer-' + index"
            :value="answer.content"
            v-model="answer.content"
            required></v-text-field>
          <div class="align-content-end">
            <v-radio-group v-model="correct">
              <v-radio
                :id="'correct-answer-' + index"
                :label="'Correct'"
                :value="index"></v-radio>
            </v-radio-group>
          </div>
        </div>
      </v-sheet>
    </v-sheet>

    <v-sheet
      v-if="
        selectedQuestionType === 'Open-Ended' ||
        this.selectedQuestionType === null
      "></v-sheet>

    <v-sheet v-if="selectedQuestionType === 'Multiple'">
      <v-sheet class="answers">
        <div
          v-for="(answer, index) in question.answers"
          :key="index"
          class="d-flex"
          id="tabCorrect">
          <v-text-field
            :label="'Answer ' + (index + 1) + ' :'"
            :id="'answer-' + index"
            :value="answer.content"
            v-model="answer.content"
            required></v-text-field>

          <div class="align-content-end">
            <v-checkbox
              v-model="correctMultiple"
              :id="'correct-answer-' + index"
              :label="'Correct'"
              :value="index"></v-checkbox>
          </div>
        </div>
      </v-sheet>
    </v-sheet>

    <v-sheet
      v-if="this.selectedQuestionType === 'True-False'"
      class="centered-sheet">
      <!-- Réponses possibles -->
      <div class="answers">
        <v-radio-group v-model="correct">
          <v-radio :id="'correct-answer-1'" :value="0">True</v-radio>
          <v-radio :id="'correct-answer-2'" :value="1">False</v-radio>
        </v-radio-group>
      </div>
    </v-sheet>

    <!-- Ajouter une réponse -->
    <v-sheet
      v-if="
        this.selectedQuestionType === 'Unique' ||
        this.selectedQuestionType === 'Multiple'
      "
      class="mb-3">
      <v-btn color="primary" @click="addAnswer" class="mr-2">
        Add an answer
      </v-btn>
      <v-btn color="error" @click="removeAnswer()">Delete an answer</v-btn>
    </v-sheet>
  </v-sheet>
</template>

<script>
  import { useQuestionnaryStore } from '@/stores/questionnaryStore';

  export default {
    props: {
      isFromBank: { Boolean, default: false },
      selectedQuestionType: { String, default: 'Unique' },
      idQuestion: { Number, default: null },
    },
    setup() {
      const questionnaryStore = useQuestionnaryStore();
      return {
        questionnaryStore,
      };
    },
    data() {
      let question = this.isFromBank
        ? this.getQuestionFromBank()
        : this.getQuestion();
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
        if (this.idQuestion) {
          let question = this.questionnaryStore.questions.find(
            (question) => question.id === this.idQuestion,
          );
          question.answers = this.questionnaryStore.answers;
          return question;
        }
        let initQuestion = {
          content: '',
          answers: [],
        };
        if (
          this.selectedQuestionType === 'Multiple' ||
          this.selectedQuestionType === 'Unique'
        ) {
          initQuestion.answers.push({ content: '', isCorrect: true });
          initQuestion.answers.push({ content: '', isCorrect: false });
        }
        return initQuestion;
      },
      getQuestionFromBank() {
        let questionFromBank = this.questionnaryStore.privateQuestions.find(
          (question) => question.id === this.idQuestion,
        );
        this.questionnaryStore.idQuestionnary = questionFromBank.questionnaryId;
        return questionFromBank;
      },
      getAnswers() {
        if (this.selectedQuestionType === 'True-False') {
          this.question.answers = [];
          this.question.answers.push({
            content: 'true',
            isCorrect: false,
          });
          this.question.answers.push({
            content: 'false',
            isCorrect: false,
          });
        } else if (
          this.selectedQuestionType === 'Open-Ended' ||
          this.selectedQuestionType === 'Open-Ended-Constraint'
        ) {
          this.question.answers = [];
        }
        return this.question.answers;
      },
      addAnswer() {
        this.question.answers.length < 9
          ? this.question.answers.push({ content: '', isCorrect: false })
          : alert("You can't add more answer");
      },

      removeAnswer() {
        if (
          this.selectedQuestionType === 'Unique' ||
          this.selectedQuestionType === 'Multiple'
        ) {
          this.question.answers.length > 2
            ? this.question.answers.splice(this.question.answers.length - 1, 1)
            : '';
        }
      },
    },
  };
</script>

<style scoped>
  h1 {
    font-size: 24px;
    margin-bottom: 20px;
  }
  label {
    font-size: 16px;
    color: #00afd7; /* Couleur de texte normale */
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
  #tabCorrect {
    display: flex !important;
    align-content: center;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    flex-direction: row;
  }
  .centered-sheet {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
