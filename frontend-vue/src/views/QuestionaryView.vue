<template>
  <ListOfQuestionnary v-if='iflist'></ListOfQuestionnary>
  <QuestionnaryEdit v-if='!iflist'></QuestionnaryEdit>
</template>

<script>
  // @ is an alias to /src
  import QuestionnaryEdit from '@/components/questionary/QuestionnaryEdit.vue';
  import ListOfQuestionnary from '@/components/questionary/ListOfQuestionnary.vue';
  import { useQuestionnaryStore } from '@/stores/questionnaryStore';


  export default {
    data() {
      return {
        iflist: true,
      };
    },
    setup() {
      const useQ = useQuestionnaryStore();
      return {
        useQ
      };
    },
    name: 'QuestionaryView',
    components: {
      QuestionnaryEdit,
      ListOfQuestionnary,
    },
  }
</script>

<style>

</style>
