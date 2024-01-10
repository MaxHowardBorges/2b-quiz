<template>
  <ListOfQuestionnary
    v-if="iflist"
    @nextQuestion="iflist = false"
    @toggleVoir="toggleVoirVisibility"></ListOfQuestionnary>
  <ListOfQuestion
    v-if="voir"
    @toggleVoir="toggleVoirVisibility"
    @modifyQuestionFromBank="triggerChangeStatus"></ListOfQuestion>
  <QuestionnaryEdit
    v-if="!iflist"
    @GoList="iflist = true"
    ref="questionnaryEditRef"></QuestionnaryEdit>
</template>

<script>
  // @ is an alias to /src
  import QuestionnaryEdit from '@/components/questionary/QuestionnaryEdit.vue';
  import ListOfQuestionnary from '@/components/questionary/ListOfQuestionnary.vue';
  import { useQuestionnaryStore } from '@/stores/questionnaryStore';
  import ListOfQuestion from '@/components/question/ListOfQuestion.vue';

  export default {
    data() {
      return {
        iflist: true,
        voir: false,
      };
    },
    setup() {
      const useQ = useQuestionnaryStore();
      return {
        useQ,
      };
    },
    mounted() {
      this.useQ.idQuestionnary = null;
    },
    methods: {
      async triggerChangeStatus(questionId, questionType) {
        this.toggleVoirVisibility();
        this.iflist = !this.iflist;
        console.log(await this.$refs.questionnaryEditRef);
        await this.$refs.questionnaryEditRef.ChangeStatus(
          questionId,
          questionType,
          true,
        );
      },
      toggleVoirVisibility() {
        this.voir = !this.voir;
      },
    },
    name: 'QuestionaryView',
    components: {
      ListOfQuestion,
      QuestionnaryEdit,
      ListOfQuestionnary,
    },
  };
</script>

<style></style>
