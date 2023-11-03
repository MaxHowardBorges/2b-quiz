<template>
  <div class="d-inline-flex w-100 align-center flex-column px-6">
    <v-card
      min-width="200px"
      max-width="1000px"
      border="lg primary"
      border-color="primary"
      class="mt-5 mb-6 px-6 py-8 w-100">
      <question-block
        @new-selected-value-relay="updateSelectedValue"
        :question="question"></question-block>

      <session-actions-block
        @answer-sent="$emit('answer-sent')"
        ref="session-actions-block"></session-actions-block>
    </v-card>
  </div>
</template>

<script>
  import AnswerGroup from '@/components/question/AnswerGroup.vue';
  import SessionActionsBlock from '@/components/session/SessionActionsBlock.vue';
  import QuestionBlock from '@/components/question/QuestionBlock.vue';

  export default {
    name: 'SessionQuestionBlockStudent',
    components: {
      QuestionBlock,
      SessionActionsBlock,
      AnswerGroup,
    },
    props: {
      question: {
        answers: Array,
        content: String,
      },
    },
    methods: {
      updateSelectedValue(value) {
        this.$refs['session-actions-block'].selectedValue =
          this.question.answers[value].id;
      },
    },
  };
</script>

<style scoped></style>
