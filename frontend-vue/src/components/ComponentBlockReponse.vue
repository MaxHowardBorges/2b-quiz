<script>
  import ReponseComp from '@/components/ReponseComp.vue';

  export default {
    name: 'ComponentBlockReponse',
    components: {
      ReponseComp,
    },
    props: {
      question: Object, // Prop pour stocker les données de la question
      answers: Array, // Prop pour stocker les données des réponses
    },
  };
</script>

<template>
  <div>
    <ReponseComp
      v-for="(reponse, index) in answers"
      :key="index"
      :reponseQuest="reponse.content" />
  </div>
</template>

<style scoped>
  * {
    text-align: center;
    max-width: 300px;
    min-width: 75px;
    font-size: 18px;
    font-size-adjust: initial;
    margin: 0 auto;
  }
</style>
