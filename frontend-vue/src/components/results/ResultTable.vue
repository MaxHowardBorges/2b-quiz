<template>
  <v-table class="mt-7" hover="">
    <thead>
    <tr>
      <th rowspan='2' class='text-center'>Participant</th>
      <th v-for="(questionnary, index) in sessionStore.results[0]" :key="index" :colspan="questionnary.questions.length" class='text-left'>
        {{ questionnary.title }}
      </th>
    </tr>
    <th id='questions' v-for="(question, index) in this.sessionStore.results[0].flatMap(questionnary => questionnary.questions)" :key="index">
      <th class='text-left text-truncate'>{{ question.content }}</th>
    </th>
    </thead>
    <tbody>
    <tr v-for="(participant, index) in sessionStore.results[1]" :key="index">
      <td v-if="participant" class="text-center">{{ participant.username }}</td>
      <td v-else class="text-center">No participant data available</td>
      <td
        id='answers'
        v-for="(question, index) in sessionStore.results[0].flatMap(questionnary => questionnary.questions)"
        :key="index"
        :style="{
            'background-color': isAnswerCorrect(
              getAnswer(question.id, participant),
            )
              ? 'lightgreen'
              : 'tomato',
          }"
        class="text-left text-truncate">
        {{ getAnswerContent(getAnswer(question.id, participant)) }}
      </td>
    </tr>
    </tbody>
  </v-table>
</template>

<script>
  import { useSessionStore } from '@/stores/sessionStore';

  export default {
    name: 'ResultTable',
    setup() {
      const sessionStore = useSessionStore();
      return {
        sessionStore,
      };
    },
    methods: {
      getAnswer(idQuestion, participant) {
        const question = this.getQuestion(idQuestion);
        const answerQuestion = participant.tab.find(
          (participantAnswer) => participantAnswer.idQuestion === question.id,
        );
        if (!answerQuestion) return null;
        return answerQuestion;
      },
      getAnswerContent(answerQuestion) {
        if (!answerQuestion) return '-';
        const question = this.getQuestion(answerQuestion.idQuestion);
        return (
          question?.answers.find(
            (answer) => answer.id === answerQuestion.idAnswer,
          ).content || 'error'
        );
      },
      getQuestion(idQuestion) {
        return this.sessionStore.results[0].flatMap(questionnary => questionnary.questions).find(
          (question) => question.id === idQuestion,
        );
      },
      isAnswerCorrect(answerQuestion) {
        if (!answerQuestion) return false;
        const question = this.getQuestion(answerQuestion.idQuestion);
        return question.answers.find(
          (answer) => answer.id === answerQuestion.idAnswer,
        ).isCorrect;
      },
    },
  };
</script>

<style scoped></style>
