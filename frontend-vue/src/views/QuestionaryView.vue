<template>
  <ListOfQuestionnary
    v-if="toggleList"
    @edit="toCreate"
    @bank="toBank"></ListOfQuestionnary>
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
    @returnToBank="toBank"></QuestionnaryEdit>
</template>

<script>
  // @ is an alias to /src
  import QuestionnaryEdit from '@/components/questionary/QuestionnaryEdit.vue';
  import ListOfQuestionnary from '@/components/questionary/ListOfQuestionnary.vue';
  import { useQuestionnaryStore } from '@/stores/questionnaryStore';
  import QuestionResult from '@/components/results/QuestionResult.vue';
  import ListOfQuestion from '@/components/question/ListOfQuestion.vue';
  import { ref } from 'vue';

  export default {
    props: {
      toCreateBool: { type: Boolean, default: false },
      toBankBool: { type: Boolean, default: false },
    },
    data() {
      return {
        toggleList: ref(true),
        toggleEdit: ref(false),
        toggleBank: ref(false),
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
      if (this.toCreateBool) {
        this.toCreate();
      }
      if (this.toBankBool) {
        this.toBank();
      }
    },
    methods: {
      triggerChangeStatus(questionId, questionType) {
        this.toggleVisibilityfromBank(false);
        this.$nextTick(() => {
          this.$refs.questionnaryEditRef.changeStatus(
            questionId,
            questionType,
            true,
          );
        });
      },
      toBank() {
        this.toggleBank = true;
        this.toggleList = false;
        this.toggleEdit = false;
      },
      toCreate() {
        this.toggleBank = false;
        this.toggleList = false;
        this.toggleEdit = true;
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
      QuestionResult,
      ListOfQuestion,
      QuestionnaryEdit,
      ListOfQuestionnary,
    },
  };
</script>

<style></style>
