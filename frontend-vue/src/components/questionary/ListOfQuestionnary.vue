<template>
  <v-sheet
    rounded="lg"
    width="70%"
    class="mt-5 px-6 py-8 mx-auto d-flex flex-column align-center"
    elevation="5"
  >

    <h1>Consulter les questionnaires</h1>

    <v-sheet class="list">
      <v-sheet v-for="(questionnary, index) in this.useQ.questionnaryList" :key="index">
        <QuestionnaryItem :questionnaryName=questionnary.title :questionnaryId=questionnary.id></QuestionnaryItem>
      </v-sheet>
    </v-sheet>

    <v-card
    class='mt-25'>
      <v-btn >Back to home</v-btn>
      <v-btn >New Questionnary</v-btn>
    </v-card>


  </v-sheet >


</template>

<script>
  // @ is an alias to /src
  import { useQuestionnaryStore } from '@/stores/questionnaryStore';
  import QuestionnaryItem from '@/components/questionary/QuestionnaryItem.vue';
  import QuestionnaryListOne from '@/components/questionary/QuestionnaryList.vue';

  export default {
    data() {
      return {
        iflist: true,
      };
    },
    setup() {
      const useQ = useQuestionnaryStore();
      useQ.getQuestionnaryFromUser(0); //TODO get user id
      return {
        useQ
      };
    },
    name: 'ListOfQuestionnary',
    components: {
      QuestionnaryListOne,
      QuestionnaryItem
    },
  }
</script>

<style>

</style>
