<script setup></script>

<template>
  <div
    class="d-flex justify-space-between align-center"
    style="margin-top: 100px">
    <v-sheet border rounded="lg" class="pa-3 mx-auto my-4" style="width: 70%">
      <v-card-title>
        <div
          class="flex-wrap text-h5 text-center align-center"
          style="white-space: normal">
          <v-btn
            icon="chevron_left "
            @click="previousQuestion"
            style="margin-right: 30%"></v-btn>
          <b>{{ question }}</b>
          <v-btn
            icon="chevron_right "
            @click="nextQuestion"
            style="margin-left: 30%"></v-btn>
        </div>
      </v-card-title>

      <div class="d-flex flex-wrap" style="margin-left: 15px">
        <QuestionResultItem
          v-for="(answer, index) in answers"
          :key="index"
          :answer="answer"
          class="mr-2 mb-2"></QuestionResultItem>
      </div>
      <div style="margin-top: 20px">
        <b>Résultats Session : 9/20</b>
      </div>
      <b>Résultat Utilisateur : Bonne réponse</b>
    </v-sheet>
  </div>
</template>

<script>
  import QuestionResultItem from '@/components/results/QuestionResultItem.vue';

  export default {
    components: {
      QuestionResultItem,
    },

    data() {
      return {
        answers: [
          'Oui',
          'Non',
          '*blague sur les chauves*',
          '*blague sur mouvement de main*',
        ],
        colors: ['Oui', 'Non'],
      };
    },
    props: {
      question: {
        type: String,
        required: true,
      },
    },
    methods: {
      previousQuestion() {
        // Implémentez la logique pour passer à la question précédente
      },
      nextQuestion() {
        // Implémentez la logique pour passer à la question suivante
      },
    },
  };
</script>
