<template>
  <div class="home">
    <h2><b>Question</b></h2>
    <QuestionComp
      quest="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. sed do eiusmod ? " />
  </div>
  <div class="reponseQ">
    <BlockReponse
      v-if="getSuccess"
      :question="questionData.question"
      :answers="questionData.answers" />
  </div>
  <div class="btnD"></div>
</template>

<script>
  import QuestionComp from '@/components/QuestionComp.vue';
  import BlockReponse from '@/components/ComponentBlockReponse.vue';
  import { mapActions, mapGetters } from 'vuex';
  import { ref } from 'vue';

  export default {
    name: 'QuestionReponseView',
    components: {
      QuestionComp,
      BlockReponse,
    },
    methods: {
      ...mapGetters(['getQuestion', 'getIdSession']), // Utilisez le nom de votre getter ici
      ...mapActions(['getQuestions']),
      async handleGetQuestion() {
        try {
          await this.$store.dispatch('getQuestions', this.getIdSession());
          this.questionData = this.getQuestion(); // Supposons que les données sont dans response.data
          console.log(this.questionData);
        } catch (error) {
          console.error('Error while joining session');
        }
      },
    },
    data() {
      return {
        idSession: ref(''),
        questionData: null, // Initialisez la variable pour stocker les données de la question
      };
    },
    created() {
      this.handleGetQuestion();
    },
  };
</script>

<style scoped>
  .home {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  QuestionComp {
    margin-left: 10px;
    margin-right: 10px;
  }

  .reponseQ {
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    max-width: 600px;
    border: 4px solid #f6c70a;
    margin: 20px auto;
    background-color: #fcfcfc;
  }

  .btnD {
    display: flex;
    justify-content: flex-end; /* Align children to the right */
    align-items: center; /* Vertically center children */
  }
</style>
