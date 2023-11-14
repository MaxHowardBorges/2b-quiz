<template>
  <div class="create-questionnaire-page">

    <div class="create-question">
      <label for="question">Question : </label>
      <input type="text" id="question" v-model="question" required>
    </div>

    <!-- Nom du questionnaire -->
    <div v-if='selectedQuestionType==="Multiple" || this.selectedQuestionType===null'>
    <!-- Réponses possibles -->
    <div class="answers">
      <div v-for="(answer, index) in answers" :key="index">
        <label :for="'answer-' + index">Answer {{ index + 1 }} : </label>
        <input type="text" :id="'answer-' + index" v-model="answers[index].content" required>
        <input type="radio" :id="'correct-answer-' + index" v-model="correctAnswer" :value="index">
        <label>Correct</label>
      </div>
    </div>
  </div>


    <div v-if='this.selectedQuestionType==="True-False"'>
    <!-- Réponses possibles -->
    <div class="answers">
      <div>
        <input type="radio" :id="true" v-model="correctAnswer" :value="true">
        <label>True</label>
        <input type="radio" :id="false" v-model="correctAnswer" :value="false">
        <label>False</label>

      </div>
    </div>
    </div>




    <!-- Ajouter une réponse -->
    <div v-if='this.selectedQuestionType==="Multiple" || this.selectedQuestionType===null'>

    <button @click="addAnswer" >Add an answer</button>

    <button @click="removeAnswer(index)">Delete an answer</button>

    </div>
  </div>
</template>

<script >
  export default {
    props: {
      selectedQuestionType: String, default : "Multiple"
    },
    data() {
      return {
        indexD : 0,
        questionnaryName: '',
        question: '',
        answers: [{ content: '', isCorrect: false }],
        correctAnswer: null,
        questionnary: {
          author: null,
          title: '',
          questions: [{
            content: '',
            answers: [{
              content: '',
              isCorrect: false
            }]
          }]
        },
      };
    },
    methods: {
      selectQuestionType(type) {
        this.selectedQuestionType = type;
      },
      getAnswers() {
        this.answers[this.correctAnswer].isCorrect=true
        return this.answers;
      },
      addAnswer() {
        this.answers.push({ content: '', isCorrect: false });
      },

      removeAnswer(index) {
        // Utilisez splice pour supprimer la réponse de la liste des réponses
        this.answers.splice(index, 1);
      },

      createQuestionnaire() {
        // Logique pour créer le questionnaire avec les données saisies
        console.log('Questionnaire créé !');
      },

    },
  };
</script>

<style scoped>
  .create-questionnaire-page {
    text-align: center;
    margin-top: 20px;
    background-color: white;
  }

  h1 {
    font-size: 24px;
    margin-bottom: 20px;
  }

  button {
    background-color: #FFD700; /* Jaune */
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

  input[type="text"] {

    padding: 5px;
    margin: 15px 0;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
  }

  input[type="radio"] {
    margin-left: 10px;
  }

</style>
