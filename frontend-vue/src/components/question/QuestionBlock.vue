<template>
  <v-card-title>
    <div class="text-h5 text-center" style="white-space: normal">
      <p>{{ question.content }}</p>
    </div>
  </v-card-title>
  <!--    <template v-slot:subtitle>some hint ??</template> TODO check utility -->
  <answer-group
    @new-selected-value="relayEvent"
    :answers="question.answers"></answer-group>
</template>

<script>
  import AnswerGroup from '@/components/question/AnswerGroup.vue';

  export default {
    name: 'QuestionBlock',
    components: { AnswerGroup },
    props: {
      question: {
        answers: Array,
        content: String,
      },
    },
    methods: {
      relayEvent(value) {
        this.$emit('new-selected-value-relay', value);
      },
    },
    emits: {
      'new-selected-value-relay'(value) {
        return value !== null;
      },
    },
  };
</script>

<style scoped></style>
