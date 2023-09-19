<template>
  <div class="home">
    <img src="../assets/logo.png" />
    <h2><b>Question</b></h2>
    <QuestionComp
      quest="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. sed do eiusmod ? " />
  </div>
  <div class="reponseQ">
    <BlockReponse />
  </div>
  <btn nomB="Question suivante" />
  <div class="btnD">
    <div class="button-group">
      <btn nomB="Arrêter la session" />
      <btn nomB="Changer la langue" />
    </div>
  </div>
</template>

<script>
  import QuestionComp from '@/components/QuestionComp.vue';
  import BlockReponse from '@/components/ComponentBlockReponse.vue';
  import btn from '@/components/BoutonComp.vue';

  export default {
    name: 'QuestionReponseView',
    components: {
      QuestionComp,
      BlockReponse,
      btn,
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
    margin-top: 2%;
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
