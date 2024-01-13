<template>
  <v-sheet
    rounded="lg"
    width="70%"
    class="mt-5 px-6 py-8 mb-2 mx-auto d-flex flex-column align-center"
    elevation="5">
    <h1>View questionnary</h1>

    <v-sheet class="list">
      <v-sheet
        v-if="this.useQ.questionnaryList.length > 0"
        v-for="(questionnary, index) in this.useQ.questionnaryList"
        :key="index">
        <QuestionnaryItem
          :questionnaryName="questionnary"
          :questionnaryId="questionnary.id"
          @nextQuestionE="edit"></QuestionnaryItem>
      </v-sheet>
      <v-sheet v-else>No Questionnaries</v-sheet>
    </v-sheet>

    <v-card class="mt-25">
      <v-btn @click="backHome">Back to home</v-btn>
      <v-btn @click="bank">Private question bank</v-btn>
      <v-btn @click="edit">New Questionnary</v-btn>
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
      edit() {
        this.$emit('edit');
      },

      backHome() {
        router.push('/');
      },
      bank() {
        this.$emit('bank');
      },
    },
    name: 'ListOfQuestionnary',
    components: {
      QuestionnaryListOne,
      QuestionnaryItem,
    },
  };
</script>

<style></style>
