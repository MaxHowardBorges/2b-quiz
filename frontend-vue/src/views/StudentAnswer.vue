<template>
  <div class="home">
    <h2><b>Question</b></h2>
    <QuestionComp :quest="getActualQuestion.content" />
  </div>
  <div class="reponseQ">
    <ComponentBlockReponseStudent :answers="getActualQuestion.answers" />
  </div>
  <div class="btnD"></div>
</template>

<script>
  import QuestionComp from '@/components/QuestionComp.vue';
  import { ref } from 'vue';
  import ComponentBlockReponseStudent from '@/components/student/ComponentBlockReponseStudent.vue';
  import { mapStores } from 'pinia';
  import { mainStore } from '@/stores/main.store';

  export default {
    name: 'QuestionReponseView',
    computed: {
      ...mapStores(mainStore),
      getActualQuestion() {
        return this.mainStore.getQuestion;
      },
    },
    components: {
      ComponentBlockReponseStudent,
      QuestionComp,
    },
    methods: {
      async handleGetQuestion() {
        try {
          this.questionData = this.mainStore.getQuestion; // Supposons que les données sont dans response.data
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
