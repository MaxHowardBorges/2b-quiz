<template>
  <div class="d-inline-flex align-center flex-column px-6 widthQuest">
    <v-card
      min-width="200px"
      max-width="1000px"
      border="lg primary"
      border-color="primary"
      class="mt-5 mb-6 px-6 py-8 w-100">
      <question-block
        @new-selected-value-relay="updateSelectedValue"
        :disabled="
          userStore.isTeacher || sessionStore.isDisplay
        "></question-block>

      <session-actions-block
        v-if="!sessionStore.isDisplay"
        @answer-sent="relayEvent"
        ref="session-actions-block"></session-actions-block>
    </v-card>
  </div>
</template>

<script>
  import AnswerGroup from '@/components/question/AnswerGroup.vue';
  import SessionActionsBlock from '@/components/session/SessionActionsBlock.vue';
  import QuestionBlock from '@/components/question/QuestionBlock.vue';
  import { useSessionStore } from '@/stores/sessionStore';
  import { useUserStore } from '@/stores/userStore';

  export default {
    name: 'SessionQuestionBlock',
    components: {
      QuestionBlock,
      SessionActionsBlock,
      AnswerGroup,
    },
    emits: ['answer-sent-relay'],
    setup() {
      const userStore = useUserStore();
      const sessionStore = useSessionStore();
      return {
        sessionStore,
        userStore,
      };
    },
    methods: {
      async updateSelectedValue(value) {
        if (typeof value === 'string') {
          this.$refs['session-actions-block'].selectedValue = value;
        } else if (Array.isArray(value)) {
          const tab = [];
          for (let i = 0; i <= value.length - 1; i++) {
            tab[i] = this.sessionStore.question.answers[value[i]].id;
          }
          this.$refs['session-actions-block'].selectedValue = tab;
        } else {
          this.$refs['session-actions-block'].selectedValue =
            this.sessionStore.question.answers[value].id;
        }
      },
      async relayEvent() {
        this.$emit('answer-sent-relay');
      },
    },
  };
</script>

<style scoped>
  .widthQuest {
    width: 100%;
  }
</style>
