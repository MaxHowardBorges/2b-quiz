<script>
  import QuestionItem from '@/components/question/QuestionItem.vue';
  import { useQuestionnaryStore } from '@/stores/questionnaryStore';

  export default {
    components: {
      QuestionItem,
    },
    props: {
      selectedQuestionType: { String, default: 'Unique' },
      idQuestion: { Number, default: null },
    },
    setup() {
      const questionnaryStore = useQuestionnaryStore();
      return {
        questionnaryStore,
      };
    },
    data() {
      this.questionnaryStore.getQuestionsFromUser(); //TODO add user id
      let question = this.questionnaryStore.privateQuestions;
      return {
        question,
      };
    },
    emits: ['modifyQuestionFromBank', 'toggleVoir'],
    methods: {
      toggleVoirVisibility() {
        this.$emit('toggleVoir');
      },
      modifyQuestionFromBank(questionId, questionType) {
        this.$emit('modifyQuestionFromBank', questionId, questionType);
      },
    },
  };
</script>

<template>
  <v-sheet
    rounded="lg"
    width="70%"
    class="mt-5 px-6 py-8 mx-auto mb-5 d-flex flex-column align-center"
    elevation="5">
    <div style="display: flex">
      <div style="align-self: start" id="divButton">
        <v-btn id="ic" icon="undo" @click="toggleVoirVisibility"></v-btn>
      </div>
      <h1>Private Question Bank</h1>
    </div>

    <div style="display: flex; margin: 20px 0px; width: 50%">
      <div id="divDrop1">
        <v-select label="Types" style="width: 180%"></v-select>
      </div>
      <v-text-field
        id="search"
        v-model="searchQuery"
        label="Search"></v-text-field>
      <div id="divDrop2">
        <v-select label="Tags" style="width: 180%"></v-select>
      </div>
    </div>

    <v-sheet class="list">
      <v-sheet v-for="(q, index) in this.question" :key="index">
        <QuestionItem
          :question="q"
          @modifyQuestionFromBank="modifyQuestionFromBank"></QuestionItem>
      </v-sheet>
    </v-sheet>

    <v-card class="mt-25">
      <!--<v-btn @click="">Done</v-btn>-->
    </v-card>
  </v-sheet>
</template>

<style scoped>
  #divButton {
    position: absolute;
    left: 18%;
  }

  #divDrop1 {
    position: absolute;
    left: 75%;
  }

  #divDrop2 {
    position: absolute;
    right: 75%;
  }
</style>
