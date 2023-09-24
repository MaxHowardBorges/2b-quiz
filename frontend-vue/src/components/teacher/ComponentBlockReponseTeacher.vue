<template>
  <div>
    <ReponseCompTeacher
      v-for="(answer, index) in questionr.answers"
      :key="index"
      :backgroundColor="getColor(index)"
      :answer-content="answer.content" />
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import ReponseCompTeacher from '@/components/teacher/ReponseCompTeacher.vue';

  export default {
    name: 'ComponentBlockReponseTeacher',
    components: {
      ReponseCompTeacher,
    },
    data() {
      return {
        // Liste de couleurs prédéfinies
        couleurs: [
          'lightskyblue',
          'lightcoral',
          'lightgreen',
          'lightpink',
          'lightyellow',
          'lightblue',
          'lightsalmon',
          'lightpink',
          'lightseagreen',
        ],
        questionr: this.getQuestion(),
        selectedOption: null,
      };
    },
    props: {
      question: Object, // Prop pour stocker les données de la question
      answers: Array, // Prop pour stocker les données des réponses
    },
    methods: {
      ...mapGetters(['getQuestion']),
      getColor(index) {
        return this.couleurs[index % this.couleurs.length];
      },
    },
    computed: {},
  };
</script>

<style scoped>
  * {
    text-align: center;
    max-width: 450px;
    min-width: 75px;
    font-size: 18px;
    font-size-adjust: initial;
    margin: 0 auto;
    min-height: 50px;
  }

  div {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  input[type='submit'] {
    background-color: #4ac2e8;
    border: none;
    color: white;
    padding: 14px 20px;
    text-align: center;
    text-decoration: none;
    border-radius: 8px;
    margin: 8px 0;
    font-size: 15px;
    cursor: pointer;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  }

  input[type='submit']:hover {
    transform: scale(1.06);
    background-position: -60px;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  }

  input[type='submit']:active {
    transform: scale(1);
    background-position: 500px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  }
</style>
