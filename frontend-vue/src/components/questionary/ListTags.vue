<template>
  <v-sheet
    rounded="lg"
    width="70%"
    class="mt-5 px-6 py-8 mx-auto mb-5 d-flex flex-column align-center"
    elevation="5">
    <h1>Tags list</h1>

    <div style="display: flex; margin: 20px 0; width: 50%">
      <v-text-field
        id="search"
        v-model="searchQuery"
        label="Search"
        @input="filterTags()"></v-text-field>
    </div>

    <v-pagination
      v-if="totalPages() > 1"
      v-model="currentPage"
      :length="totalPages()"></v-pagination>

    <v-sheet class="list">
      <TagItem
        v-for="(q, index) in paginatedTags()"
        :key="index"
        :tags="q"></TagItem>
    </v-sheet>

    <v-pagination
      v-if="totalPages() > 1"
      v-model="currentPage"
      :length="totalPages()"></v-pagination>
  </v-sheet>
</template>

<script>
  import TagItem from '@/components/questionary/TagItem.vue';

  export default {
    components: {
      TagItem,
    },
    // props: {
    //   tags: {
    //     type: Array,
    //     required: true,
    //   },
    // },
    data() {
      return {
        tags: [
          'Maths',
          'Dev',
          'BDD',
          'Culture',
          'Sport',
          'Arts',
          'Politique',
          'Histoire',
          'Logique',
          'Science',
          'Geographie',
          'Gastronomie',
          'Comédie',
          'Cinéma',
        ],
        searchQuery: '',
        itemsPerPage: 9,
        currentPage: 1,
      };
    },
    methods: {
      filterTags() {
        this.currentPage = 1;
      },
      filteredTags() {
        const query = this.searchQuery.toLowerCase();
        // let filtered = this.tags;
        // if (this.query !== '') {
        //   filtered = filtered.filter((q) => q.toLowerCase().includes(query));
        // }
        // return filtered;
        if (query.trim() === '') {
          return this.tags;
        } else {
          return this.tags.filter((q) => q.toLowerCase().includes(query));
        }
      },
      paginatedTags() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        return this.filteredTags().slice(startIndex, endIndex);
      },
      totalPages() {
        return Math.ceil(this.filteredTags.length / this.itemsPerPage);
      },
    },
  };
</script>
