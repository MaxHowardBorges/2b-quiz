<template>
  <v-card-title>
    <div class="text-h5 text-center" style="white-space: normal">
      <p>{{ sessionStore.question.content }}</p>
    </div>
  </v-card-title>
  <!--    <template v-slot:subtitle>some hint ??</template> TODO check utility -->
  <answer-group
    @new-selected-value="relayEvent"
    :type="sessionStore.question.type"
    :answers="sessionStore.question.answers"
    :disabled="disabled" />
</template>

<script>
  import AnswerGroup from '@/components/question/AnswerGroup.vue';
  import { useSessionStore } from '@/stores/sessionStore';

  export default {
    name: 'QuestionBlock',
    components: { AnswerGroup },
    setup() {
      const sessionStore = useSessionStore();
      return { sessionStore };
    },
    props: {
      disabled: Boolean,
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
