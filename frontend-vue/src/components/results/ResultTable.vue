<template>
  <v-table class="mt-7" hover="">
    <thead>
      <tr>
        <th class="text-left">Participant</th>
        <th v-for="(question, index) in sessionStore.results[0]" :key="index">
          {{ question.content }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(participant, index) in sessionStore.results[1]" :key="index">
        <td v-if="participant">{{ participant.username }}</td>
        <td v-else>No participant data available</td>
        <td
          v-for="(question, index) in sessionStore.results[0]"
          :key="index"
          :style="{
            'background-color': isAnswerCorrect(
              getAnswer(question.id, participant),
            )
              ? 'lightgreen'
              : 'tomato',
          }">
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
        return this.sessionStore.results[0].find(
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
