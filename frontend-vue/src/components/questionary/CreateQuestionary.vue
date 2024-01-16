<template>
  <v-sheet class="mt-20px align-center">
    <v-text-field
      type="text"
      id="question"
      v-model="question.content"
      required
      :label="$t('questionnary.question')"
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
            :label="$t('question.answer') + (index + 1) + ' :'"
            :id="'answer-' + index"
            :value="answer.content"
            v-model="answer.content"
            required></v-text-field>
          <div class="align-content-end">
            <v-radio-group v-model="correct">
              <v-radio
                :id="'correct-answer-' + index"
                :label="$t('question.correct')"
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
      ">
      <button @click="addAnswer"><p class="text-white font">{{ $t('questionnary.addAnswer') }}</p></button>

      <button @click="removeAnswer()"><p class="text-white font">{{ $t('questionnary.deleteAnswer') }}</p></button>
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
        this.question.answers.push({ content: '', isCorrect: false });
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
