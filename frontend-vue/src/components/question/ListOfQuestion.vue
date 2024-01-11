<template>
  <v-sheet
    rounded="lg"
    width="70%"
    class="mt-5 px-6 py-8 mx-auto mb-5 d-flex flex-column align-center"
    elevation="5"
  >
    <h1>Private Question Bank</h1>

    <div style='display: flex; margin: 20px 0; width: 50%'>
      <div id='divDrop1'>
        <v-select label='Types' style='width: 180%'></v-select>
      </div>
      <v-text-field
        id="search"
        v-model="searchQuery"
        label="Search"
        @input="filterQuestions"
      ></v-text-field>
      <div id='divDrop2'>
        <v-select label='Tags' style='width: 180%'></v-select>
      </div>
    </div>

    <v-sheet class="list">
      <QuestionItem
        v-for="(q, index) in filteredQuestions"
        :key="index"
        :question="q"
      ></QuestionItem>
    </v-sheet>

    <v-card class="mt-25">
      <!--<v-btn @click="">Done</v-btn>-->
    </v-card>
  </v-sheet>
</template>

<script>
  import QuestionItem from '@/components/question/QuestionItem.vue';

  export default {
    components: {
      QuestionItem,
    },
    data() {
      return {
        searchQuery: '',
        answers: [
          'Tu es clairement le goat',
          'Je ne suis pas sûr',
          'Tu es cringe',
        ],
        questions: [
          'A quoi joue Elias ?',
          'Qui est Miles Morales ?',
          'Sam va t-il percer ?',
        ],
        filteredQuestions: [], // Initialize with an empty array
      };
    },
    created() {
      // Initialize filteredQuestions with all questions when the component is created
      this.filterQuestions();
    },
    methods: {
      filterQuestions() {
        const query = this.searchQuery.toLowerCase();
        if (query.trim() === '') {
          // If the search bar is empty, show all questions
          this.filteredQuestions = this.questions;
        } else {
          // Otherwise, filter questions based on the search text
          this.filteredQuestions = this.questions.filter(q => q.toLowerCase().includes(query));
        }
      },
    },
  };
</script>

<style scoped>
  #divDrop1 {
    position: absolute;
    left: 75%;
  }

  #divDrop2 {
    position: absolute;
    right: 75%;
  }
</style>
