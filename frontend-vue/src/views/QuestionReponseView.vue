<template>
  <div class="home">
    <h2><b>Question</b></h2>
    <QuestionComp
      :quest= actualQuestion.content />
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
  import { mapGetters } from 'vuex';

  export default {
    name: 'QuestionReponseView',
    components: {
      QuestionComp,
      BlockReponse,
      btn,
    },
    // data() {
    //   return {
    //     question:  null
    //   };
    // },
    methods: {
      ...mapGetters(['actualQuestion']),
      async getActualQuestion() {
        await this.actualQuestion;
      },
    },
    created() {
      console.log(this.getActualQuestion());
    },
    computed:{
      ...mapGetters(['actualQuestion']),
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
