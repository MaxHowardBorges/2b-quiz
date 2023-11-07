<template>
  <div class="create-questionnaire-page">
    <h1>Quiz creation</h1>

    <!-- Sélection du type de question -->
    <div class="question-type">
      <button @click="selectQuestionType('true-or-false')">True or False</button>
      <button @click="selectQuestionType('open-question')">Open question</button>
      <button @click="selectQuestionType('multiple-choice-question')">Multiple Choice Question</button>
    </div>



    <!-- Nom du questionnaire -->
    <div v-if='selectedQuestionType==="multiple-choice-question" || this.selectedQuestionType===null'>
    <div >
      <label for="questionnaire-name">Quiz's name : </label>
      <input type="text" id="questionnaire-name" v-model="questionnaireName">
    </div>
    <!-- Création de question -->
    <div class="create-question">
      <label for="question">Question : </label>
      <input type="text" id="question" v-model="question">
    </div>
    <!-- Réponses possibles -->
    <div class="answers">
      <div v-for="(answer, index) in answers" :key="index">
        <label :for="'answer-' + index">Answer {{ index + 1 }} : </label>
        <input type="text" :id="'answer-' + index" v-model="answers[index].text">
        <input type="radio" :id="'correct-answer-' + index" v-model="correctAnswer" :value="index">
        <label :for="'correct-answer-' + index">Correct</label>
      </div>
    </div>
  </div>


    <div v-if='this.selectedQuestionType==="open-question"'>
    <div>
      <label for="questionnaire-name">Quiz's name : </label>
      <input type="text" id="questionnaire-name" v-model="questionnaireName">
    </div>

    <!-- Création de question -->
    <div class="create-question">
      <label for="question">Question : </label>
      <input type="text" id="question" v-model="question">
    </div>

    </div>


    <div v-if='this.selectedQuestionType==="true-or-false"'>
    <div>
      <label for="questionnaire-name">Quiz's name : </label>
      <input type="text" id="questionnaire-name" v-model="questionnaireName">
    </div>

    <!-- Création de question -->
    <div class="create-question">
      <label for="question">Question : </label>
      <input type="text" id="question" v-model="question">
    </div>

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
    <button @click="addAnswer">Add an answer</button>

    <button @click="removeAnswer(index)">Delete an answer</button>

    <!-- Valider et créer -->
    <button @click="createQuestionnaire">Validate</button>
  </div>
</template>

<script >
  export default {
    data() {
      return {
        selectedQuestionType: null,
        questionnaireName: '',
        question: '',
        answers: [{ text: '', correct: false }],
        correctAnswer: null,
      };
    },
    methods: {
      selectQuestionType(type) {
        this.selectedQuestionType = type;
      },
      addAnswer() {
        this.answers.push({ text: '', correct: false });
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
