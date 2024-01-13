<script setup>
  import QuestionItem from '@/components/question/QuestionItem.vue';

</script>

<template>
  <v-sheet
    rounded="lg"
    width="70%"
    class="mt-5 px-6 py-8 mx-auto mb-5 d-flex flex-column align-center"
    elevation="5"
  >
    <div style="display: flex">
      <div style="align-self: start" id="divButton">
        <v-btn id="ic" icon="undo" @click=""></v-btn>
      </div>
      <h1>Session History</h1>
    </div>

    <v-sheet class="list">
      <QuestionItem
        :questionName="questionnary"
        :questionnaryId="1"
        @nextQuestionE="emitNextQuestion"
      ></QuestionItem>
    </v-sheet>


  </v-sheet>
</template>


  const handleManageResults = () => {
    // Ajoutez ici la logique pour gérer les résultats
    // Par exemple, rediriger vers une nouvelle page
    router.push('/chemin-de-gestion-des-resultats');
  };


<style scoped>
  #divButton {
    position: absolute;
    left: 18%;
  }
</style>
