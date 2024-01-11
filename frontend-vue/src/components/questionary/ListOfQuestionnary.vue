<template>
  <v-sheet
    rounded="lg"
    width="70%"
    class="mt-5 px-6 py-8 mx-auto d-flex flex-column align-center"
    elevation="5">
    <h1>View questionnary</h1>

    <v-sheet class="list">
      <v-sheet
        v-for="(questionnary, index) in this.useQ.questionnaryList"
        :key="index">
        <QuestionnaryItem
          :questionnaryName="questionnary"
          :questionnaryId="questionnary.id"
          @nextQuestionE="emitNextQuestion"></QuestionnaryItem>
      </v-sheet>
    </v-sheet>

    <v-card class="mt-25">
      <v-btn @click="backHome">Back to home</v-btn>
      <v-btn @click="emitNextQuestion">New Questionnary</v-btn>
    </v-card>
  </v-sheet>
</template>

<script>
  // @ is an alias to /src
  import { useQuestionnaryStore } from '@/stores/questionnaryStore';
  import QuestionnaryItem from '@/components/questionary/QuestionnaryItem.vue';
  import QuestionnaryListOne from '@/components/questionary/QuestionnaryList.vue';
  import router from '@/router';

  export default {
    //TODO Pas de questionnaire
    data() {
      return {};
    },
    setup() {
      const useQ = useQuestionnaryStore();
      useQ.getQuestionnariesFromUser();
      return {
        useQ,
      };
    },
    methods: {
      emitNextQuestion() {
        this.$emit('nextQuestion');
      },

      backHome() {
        router.push('/');
      },
    },
    name: 'ListOfQuestionnary',
    components: {
      QuestionnaryListOne,
      QuestionnaryItem,
    },
  };
</script>

<style scoped>
  * {
    color: #007EA1;
  }

  h1{
    color: black;
  }
</style>