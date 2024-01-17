<script>
  import QuestionResult from '@/components/results/QuestionResult.vue';

  export default {
    components: { QuestionResult },
    data() {
      return {
        question: 'Est-ce que Elias est arabe ?',
      };
    },
  };
</script>

<template>
  <QuestionResult :question="question"></QuestionResult>
</template>

<style scoped></style>
