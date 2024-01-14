<template>
  <v-sheet
    rounded="lg"
    width="70%"
    class="mt-5 px-6 py-8 mx-auto mb-5 d-flex flex-column align-center"
    elevation="5">
    <h1>Private Question Bank</h1>

    <div style="display: flex; margin: 20px 0; width: 50%">
      <div id="divDrop1">
        <v-select
          v-model="selectedType"
          :items="types"
          label="Types"
          :multiple="true"
          style="width: 180%"
          @change="filterQuestions"></v-select>
      </div>
      <v-text-field
        id="search"
        v-model="searchQuery"
        label="Search"
        @input="filterQuestions"></v-text-field>
      <div id="divDrop2">
        <v-select
          v-model="selectedTag"
          :items="tags"
          label="Tags"
          style="width: 180%"
          @change="filterQuestions"></v-select>
      </div>
    </div>

    <v-pagination
      v-if="totalPages > 1"
      v-model="currentPage"
      :length="totalPages"></v-pagination>

    <v-sheet class="list">
      <QuestionItem
        v-for="(q, index) in paginatedQuestions"
        :key="index"
        :question="q"></QuestionItem>
    </v-sheet>

    <!-- Pagination controls -->
    <v-pagination
      v-if="totalPages > 1"
      v-model="currentPage"
      :length="totalPages"></v-pagination>

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
        questions: [
          'A quoi joue Elias ?',
          'Qui est Miles Morales ?',
          'Sam va t-il percer ?',
          'A quoi joue Elias ?',
          'Qui est Miles Morales ?',
          'Sam va t-il percer ?',
          'A quoi joue Elias ?',
          'Qui est Miles Morales ?',
          'Sam va t-il percer ?',
          'Bissap ou Butane ?',
          'hmmmmmm ?',
          'Que faire ?',
          'Bissap ou Butane ?',
          'Cest quoi les bails ?',
          'Que faire ?',
          'Lebron ou Jordan ?',
          // ... autres questions
        ],
        itemsPerPage: 9,
        currentPage: 1,
      };
    },
    computed: {
      filteredQuestions() {

        // Filtrer par type
        if (this.selectedType) {
          this.questions.filter((q) => q.type === this.selectedType);
        }

        // Filtrer par tag
        if (this.selectedTags) {
          this.questions.filter((q) => q.tags.includes(this.selectedTags));
        }

        //Recherche par nom
        const query = this.searchQuery.toLowerCase();
        if (query.trim() === '') {
          return this.questions;
        } else {
          return this.questions.filter((q) => q.toLowerCase().includes(query));
        }
      },
      paginatedQuestions() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        return this.filteredQuestions.slice(startIndex, endIndex);
      },
      totalPages() {
        return Math.ceil(this.filteredQuestions.length / this.itemsPerPage);
      },
    },
    methods: {
      filterQuestions() {
        // Reset current page to 1 when the search query changes
        this.currentPage = 1;
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
