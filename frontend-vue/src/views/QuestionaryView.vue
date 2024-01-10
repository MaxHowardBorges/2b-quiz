<template>
  <ListOfQuestionnary
    v-if="toggleList"
    @edit="
      toggleList = false;
      toggleEdit = true;
    "
    @bank="toggleVisibility"></ListOfQuestionnary>
  <ListOfQuestion
    v-if="toggleBank"
    @toggleVisibility="toggleVisibilityfromBank"
    @modifyQuestionFromBank="triggerChangeStatus"></ListOfQuestion>
  <QuestionnaryEdit
    v-if="toggleEdit"
    @GoList="
      toggleEdit = false;
      toggleList = true;
    "
    ref="questionnaryEditRef"
    @returnToBank="toggleVisibility"></QuestionnaryEdit>
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
        toggleList: true,
        toggleEdit: false,
        toggleBank: false,
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
        this.toggleVisibilityfromBank(false);
        console.log(await this.$refs.questionnaryEditRef);
        await this.$refs.questionnaryEditRef.ChangeStatus(
          questionId,
          questionType,
          true,
        );
      },
      toggleVisibility() {
        this.toggleBank = true;
        this.toggleList = false;
        this.toggleEdit = false;
      },
      toggleVisibilityfromBank(toList = true) {
        this.toggleBank = false;
        if (toList) {
          this.toggleList = true;
          this.toggleEdit = false;
        } else {
          this.toggleList = false;
          this.toggleEdit = true;
        }
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
