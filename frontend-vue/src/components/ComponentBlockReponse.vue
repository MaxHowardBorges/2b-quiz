<script>
  import ReponseComp from '@/components/ReponseComp.vue';

  export default {
    name: 'ComponentBlockReponse',
    components: {
      ReponseComp,
    },
  };
</script>

<template>
  <div>
    <ReponseComp reponseQuest="Lorem" />
    <ReponseComp reponseQuest="ipsum" />
    <ReponseComp reponseQuest="dolor" />
    <ReponseComp reponseQuest="sit amet" />
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
