<template>
  <div class="home">
    <h2 onload="loadQuestion"><b>Question</b></h2>
    <QuestionComp
      :quest= question />
  </div>
  <div class="reponseQ">
    <BlockReponse />
  </div>
  <btn nomB="Question suivante" />
  <div class="btnD">
    <div class="button-group">
      <router-link to="/findesession"><btn nomB="Arrêter la session" /></router-link>
      <btn nomB="Changer la langue" />
    </div>
  </div>
</template>

<script>
  import QuestionComp from '@/components/QuestionComp.vue';
  import BlockReponse from '@/components/ComponentBlockReponse.vue';
  import btn from '@/components/BoutonComp.vue';
  import { mapState, mapActions } from 'vuex';

  export default {
    name: 'QuestionReponseView',
    components: {
      QuestionComp,
      BlockReponse,
      btn,
    },
    data() {
      return {
        questi : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. sed do eiusmod ?"
      };
    },
    computed: {
      ...mapState(['question']),
    },
    methods: {
      ...mapActions(['getQuestion']),
      loadQuestion() {
        this.getQuestion();
      },
    },
    created() {
      this.loadQuestion();
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
    min-height: 250px;
  }


  QuestionComp {
    margin-left: 10px;
    margin-right: 10px;
  }

  .reponseQ {
    margin-top: -2%;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    max-width: 2000px;
    border: 4px solid #f6c70a;
    background-color: #fcfcfc;
    min-width: 150px;
  }

  .btnD {
    margin-top: 5%;
    display: flex;
    justify-content: flex-end; /* Align children to the right */
    align-items: center; /* Vertically center children */

  }

</style>
