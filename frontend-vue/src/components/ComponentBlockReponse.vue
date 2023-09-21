

<template>
  <div>
    <ReponseComp
      v-for="(reponse, index) in reponses"
      :key="index"
      :reponseQuest="reponse"
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

  export default {
    name: 'ComponentBlockReponse',
    components: {
      ReponseComp,
    },
    data() {
      return {
        reponses: ['LoremLoremLorem LoremLoremLoremLorem LoremLoremLoremLorem ', 'ipsumLoremLoremLoremLorem', 'dolorLoremLoremLoremL', 'sit amet','Lorem', 'ipsum', 'dolor', 'sit amet' /* ... Add more responses here ... */],
        // Liste de couleurs prédéfinies
        couleurs: ['lightskyblue', 'lightcoral', 'lightgreen', 'lightpink', 'lightyellow', 'lightblue', 'lightsalmon', 'lightpink','lightseagreen'],
      };
    },
    methods: {
      getColor(index) {
        // Utilisation de l'opérateur modulo pour répéter les couleurs
        return this.couleurs[index % this.couleurs.length];
      },
    },
  };
</script>