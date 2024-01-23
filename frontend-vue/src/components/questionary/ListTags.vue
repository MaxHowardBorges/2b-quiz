<template>
  <v-sheet
    rounded="lg"
    width="70%"
    class="mt-5 px-6 py-8 mx-auto mb-5 d-flex flex-column align-center"
    elevation="5">
    <v-btn id="ic" icon="undo" @click="returnToEdit"></v-btn>
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

    <v-sheet class="list" v-for="(tag, index) in paginatedTags()" :key="index">
      <tag-item
        :tag="tag"
        @updateTag="UpdateTag"
        @deleteTag="DeleteTag"></tag-item>
    </v-sheet>

    <v-pagination
      v-if="totalPages() > 1"
      v-model="currentPage"
      :length="totalPages()"></v-pagination>
  </v-sheet>
</template>

<script>
  import TagItem from '@/components/questionary/TagItem.vue';
  import { useQuestionnaryStore } from '@/stores/questionnaryStore';

  export default {
    components: {
      TagItem,
    },
    emits: ['toggleTagPanel'],
    setup() {
      const questionnaryStore = useQuestionnaryStore();
      return {
        questionnaryStore,
      };
    },
    data() {
      this.loadData();
      return {
        tags: [],
        searchQuery: '',
        itemsPerPage: 9,
        currentPage: 1,
      };
    },
    methods: {
      async loadData() {
        await this.questionnaryStore.getTags();
        this.tags = this.questionnaryStore.tagList;
      },
      filterTags() {
        this.currentPage = 1;
      },
      filteredTags() {
        const query = this.searchQuery.toLowerCase();
        let filtered = this.tags;
        if (query !== '') {
          filtered = filtered.filter((tag) =>
            tag.description.toLowerCase().includes(query),
          );
        }
        return filtered;
      },
      paginatedTags() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        return this.filteredTags().slice(startIndex, endIndex);
      },
      totalPages() {
        return Math.ceil(this.filteredTags().length / this.itemsPerPage);
      },
      returnToEdit() {
        this.$emit('toggleTagPanel');
      },
      async UpdateTag(tag) {
        await this.questionnaryStore.updateTag(tag);
        this.tags = this.questionnaryStore.tagList;
      },
      async DeleteTag(tag) {
        await this.questionnaryStore.deleteTag(tag);
        this.tags = this.questionnaryStore.tagList;
      },
    },
  };
</script>
