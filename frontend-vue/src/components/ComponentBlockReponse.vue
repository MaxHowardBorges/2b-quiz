

<template>
  <div>
    <ReponseComp
      v-for="(reponse, index) in questionr.answers"
      :key="index"
      :reponseQuest="reponse.content"
      :backgroundColor="getColor(index)"
    />
  </div>
</template>

<style scoped>
  * {
    text-align: center;
    max-width: 450px;
    min-width: 75px;
    font-size: 18px;
    font-size-adjust: initial;
    margin: 0 auto;
    min-height: 50px;
  }

</style>
<script>
  import ReponseComp from '@/components/ReponseComp.vue';
  import {  mapGetters } from 'vuex';

  export default {
    name: 'ComponentBlockReponse',
    components: {
      ReponseComp,
    },
    data() {
      return {
        // Liste de couleurs prédéfinies
        couleurs: ['lightskyblue', 'lightcoral', 'lightgreen', 'lightpink', 'lightyellow', 'lightblue', 'lightsalmon', 'lightpink','lightseagreen'],
        questionr: this.getAnswers()
      };
    },
    computed: {
    },
    methods: {
      ...mapGetters(['actualQuestion']),
      getAnswers(){
        return this.actualQuestion();
      },
      getColor(index) {
        return this.couleurs[index % this.couleurs.length];
      },
    },
  };
</script>