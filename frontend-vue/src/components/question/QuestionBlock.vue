<template>
  <v-card-title>
    <div
      v-if="
        !sessionStore.isDisplay || sessionStore.displaySettings.displayQuestion
      "
      class="text-h5 text-center"
      style="white-space: normal">
      <p>{{ sessionStore.question.content }}</p>
    </div>
  </v-card-title>
  <answer-group
    v-if="!sessionStore.isDisplay || sessionStore.displaySettings.displayAnswer"
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
