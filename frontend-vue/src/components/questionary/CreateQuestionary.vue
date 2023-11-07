<template>
  <div class="create-questionnaire-page">
    <h1>Création de Questionnaire</h1>

    <!-- Sélection du type de question -->
    <div class="question-type">
      <button @click="selectQuestionType('vrai-ou-faux')">Vrai ou Faux</button>
      <button @click="selectQuestionType('nuage-de-mots')">Nuage de mots</button>
      <button @click="selectQuestionType('reponse-multiple')">Question à choix multiple</button>
    </div>



    <!-- Nom du questionnaire -->
    <div v-if='selectedQuestionType==="reponse-multiple" || this.selectedQuestionType===null'>
    <div >
      <label for="questionnaire-name">Nom du Questionnaire : </label>
      <input type="text" id="questionnaire-name" v-model="questionnaireName">
    </div>
    <!-- Création de question -->
    <div class="create-question">
      <label for="question">Question : </label>
      <input type="text" id="question" v-model="question">
    </div>
    <!-- Réponses possibles -->
    <div class="answers">
      <div v-for="(index) in answers" :key="index">
        <label :for="'answer-' + index">Réponse {{ index + 1 }} : </label>
        <input type="text" :id="'answer-' + index" v-model="answers[index].text">
        <input type="radio" :id="'correct-answer-' + index" v-model="correctAnswer" :value="index">
        <label :for="'correct-answer-' + index">Correcte</label>
      </div>
    </div>
  </div>


    <div v-if='this.selectedQuestionType==="nuage-de-mots"'>
    <div>
      <label for="questionnaire-name">Nom du Questionnaire : </label>
      <input type="text" id="questionnaire-name" v-model="questionnaireName">
    </div>

    <!-- Création de question -->
    <div class="create-question">
      <label for="question">Question : </label>
      <input type="text" id="question" v-model="question">
    </div>

    </div>


    <div v-if='this.selectedQuestionType==="vrai-ou-faux"'>
    <div>
      <label for="questionnaire-name">Nom du Questionnaire : </label>
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
        <label>Vrai</label>
        <input type="radio" :id="false" v-model="correctAnswer" :value="false">
        <label>Faux</label>

      </div>
    </div>
    </div>




    <!-- Ajouter une réponse -->
    <button @click="addAnswer">Ajouter une Réponse</button>

    <button @click="removeAnswer(index)">Supprimer une Réponse</button>

    <!-- Valider et créer -->
    <button @click="createQuestionnaire">Valider et Créer</button>
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
