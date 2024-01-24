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
        @deleteTag="showConfirmDeletion"></tag-item>
    </v-sheet>

    <v-pagination
      v-if="totalPages() > 1"
      v-model="currentPage"
      :length="totalPages()"></v-pagination>
  </v-sheet>

  <v-dialog v-model="confirmationDialog" max-width="600">
    <v-card v-if="!!this.selectedTag">
      <v-card-title class="headline">Confirmation</v-card-title>
      <v-card-text>
        Are you sure you want to delete the tag
        {{ this.selectedTag.description }}
        ?
      </v-card-text>
      <v-card-text v-if="this.selectedTag.questionsName.length > 0">
        this tag belong to the following questions :
        <ul v-for="questionName in this.selectedTag.questionsName">
          <li>
            {{ questionName }}
          </li>
        </ul>
      </v-card-text>
      <v-card-text v-else>It is not assigned to any questions</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="confirmationDialog = false" color="error">Cancel</v-btn>
        <v-btn @click="DeleteTag" color="success">confirm</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
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
        selectedTag: null,
        confirmationDialog: false,
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
      showConfirmDeletion(tag) {
        this.selectedTag = tag;
        this.confirmationDialog = true;
      },
      async DeleteTag() {
        await this.questionnaryStore.deleteTag(this.selectedTag);
        this.confirmationDialog = false;
        this.selectedTag = null;
        this.tags = this.questionnaryStore.tagList;
      },
    },
  };
</script>
