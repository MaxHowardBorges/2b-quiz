<script setup>

import QuestionItem from '@/components/question/QuestionItem.vue';
</script>

<template>



  <v-sheet
    rounded="lg"
    width="70%"
    class="mt-5 px-6 py-8 mx-auto d-flex flex-column align-center"
    elevation="5">

    <div style='display: flex'>
      <div style='align-self:start' id='divButton'>
      <v-btn id='ic' icon="undo" @click=""></v-btn>
      </div>
    <h1>Private Question Bank</h1>
    </div>

    <v-text-field
      id="search"
      v-model="searchQuery"
      style='margin: 20px 0px; width: 50%'
      label="Search"></v-text-field>

    <v-sheet class="list">
      <!--<v-sheet
       v-for="(questionnary, index) in this.useQ.questionnaryList"
       :key="index">-->
       <QuestionItem
         :questionName="questionnary"
         :questionnaryId="1"
         @nextQuestionE="emitNextQuestion"></QuestionItem>
      <QuestionItem
        :questionName="questionnary"
        :questionnaryId="1"
        @nextQuestionE="emitNextQuestion"></QuestionItem>
      <QuestionItem
        :questionName="questionnary"
        :questionnaryId="1"
        @nextQuestionE="emitNextQuestion"></QuestionItem>
      <!--</v-sheet>-->
   </v-sheet>

   <v-card class="mt-25">
     <!--<v-btn @click="">Done</v-btn>-->
   </v-card>
 </v-sheet>
</template>

<style scoped>
  #search{
    width: 100%;
  }

  #divButton{
    position: absolute;
    left: 18%;
  }
</style>