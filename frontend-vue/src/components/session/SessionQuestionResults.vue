<script>
  import QuestionResult from '@/components/results/QuestionResult.vue';

  // UNUSED COMPONENT
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
  <!--  UNUSED COMPONENT-->
  <QuestionResult :question="question"></QuestionResult>
</template>

<style scoped></style>
