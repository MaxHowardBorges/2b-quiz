

<template>
  <div>
    <ReponseComp
      v-for="(reponse, index) in actualQuestion().answers"
      :key="index"
      :reponseQuest="reponse.content"
      :backgroundColor="getColor(index)"
    />
  </div>
</template>

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

</style>
<script>
  import ReponseComp from '@/components/ReponseComp.vue';
  import {  mapGetters } from 'vuex';

  export default {
    name: 'ComponentBlockReponse',
    components: {
      ReponseComp,
    },
    data() {
      return {
        // Liste de couleurs prédéfinies
        couleurs: ['lightskyblue', 'lightcoral', 'lightgreen', 'lightpink', 'lightyellow', 'lightblue', 'lightsalmon', 'lightpink','lightseagreen'],
        questionr: this.getAnswers()
      };
    },
    computed: {
    },
    methods: {
      ...mapGetters(['actualQuestion']),
      getAnswers(){
        return this.actualQuestion();
      },
      getColor(index) {
        return this.couleurs[index % this.couleurs.length];
      },
    },
  };
</script>

<script>
  import ReponseComp from '@/components/ReponseComp.vue';

export default {
name: 'ComponentBlockReponse',
components: {
ReponseComp,
},
    props: {
      question: Object, // Prop pour stocker les données de la question
      answers: Array, // Prop pour stocker les données des réponses
    },
    methods: {
      updateSelectedOption(value) {
        this.selectedOption = value;
      },
      async handleSubmit() {
        console.log(this.selectedOption);
        try {
          await this.$store.dispatch('sendAnswer', this.selectedOption);
          this.$router.push('/waiting');
        } catch (e) {
          console.error(e);
        }
      },
    },
    data() {
      return {
        selectedOption: null,
      };
    },
  };
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <div>
      <ReponseComp
        v-for="(answer, index) in answers"
        :key="index"
        :answer="answer"
        field="quizz"
        @selected-option-changed="updateSelectedOption" />
    </div>
    <input type="submit" value="Submit" />
  </form>
</template>

<style scoped>
  * {
    text-align: center;
    max-width: 300px;
    min-width: 75px;
    font-size: 18px;
    font-size-adjust: initial;
    margin: 0 auto;
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
