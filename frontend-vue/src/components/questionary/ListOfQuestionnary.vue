<template>
  <v-sheet
    rounded="lg"
    width="70%"
    class="mt-5 px-6 py-8 mb-2 mx-auto d-flex flex-column align-center"
    elevation="5">
    <h1>{{ $t('questionnary.viewquestionnary') }}</h1>

    <v-sheet class="list w-75 mt-2">
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

    <v-sheet class="d-flex flex-row w-100">
      <v-btn @click="backHome" class="flex-1-1 ma-2">{{$t('questionnary.BackHome')}}</v-btn>
      <v-btn @click="bank" class="flex-1-1 ma-2">Private question bank</v-btn>
      <v-btn @click="edit" class="flex-1-1 ma-2">{{$t('questionnary.newquestionnary')}}</v-btn>
    </v-sheet>
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

<style scoped>
  * {
    color: #007ea1;
  }

  h1 {
    color: black;
  }
</style>
