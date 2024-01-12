<script>
  import QuestionItem from '@/components/question/QuestionItem.vue';
  import { useQuestionnaryStore } from '@/stores/questionnaryStore';

  export default {
    components: {
      QuestionItem,
    },
    setup() {
      const questionnaryStore = useQuestionnaryStore();
      return {
        questionnaryStore,
      };
    },
    data() {
      this.questionnaryStore.getQuestionsFromUser(); //TODO add user id
      let questions = this.questionnaryStore.privateQuestions;
      return {
        questions,
        selectedQuestion: null,
        dialogVisible: false,
        questionnaries: [],
        selectedQuestionnaries: [],
        author: '111111', // TODO get id author
        searchQuery: '',
        itemsPerPage: 9,
        currentPage: 1,
        selectedType: [],
        selectedTags: [],
        tags: [],
        typeOptions: [
          { typeLabel: 'Unique', typeCode: 'qcu' },
          { typeLabel: 'Multiple', typeCode: 'qcm' },
          { typeLabel: 'Open-Ended', typeCode: 'ouv' },
          { typeLabel: 'True-False', typeCode: 'tof' },
          { typeLabel: 'Open-Ended-Constraint', typeCode: 'qoc' },
        ],
      };
    },
    emits: ['modifyQuestionFromBank', 'toggleVisibility'],
    computed: {},
    methods: {
      toggleVisibility() {
        this.$emit('toggleVisibility');
      },
      modifyQuestionFromBank(questionId, questionType) {
        this.$emit('modifyQuestionFromBank', questionId, questionType);
      },
      async showQuestionnaryList(question) {
        this.questionnaries = [];
        this.selectedQuestionnaries = [];
        this.selectedQuestion = question;

        await this.questionnaryStore.getQuestionnariesFromUser(); //TODO get id user
        let questionnaries = this.questionnaryStore.questionnaryList;
        for (const questionnary of questionnaries) {
          this.questionnaryStore.idQuestionnary = questionnary.id;
          await this.questionnaryStore.getQuestions();
          this.questionnaryStore.idQuestionnary = null;

          let bool = this.questionnaryStore.questions.some(
            (question) => question.id === this.selectedQuestion.id,
          );

          if (!bool) {
            this.questionnaries.push(questionnary);
          }
        }

        this.dialogVisible = true;
      },
      toggleQuestion(index) {
        if (this.selectedQuestionnaries.includes(index)) {
          this.selectedQuestionnaries = this.selectedQuestionnaries.filter(
            (i) => i !== index,
          );
        } else {
          this.selectedQuestionnaries.push(index);
        }
      },
      async AddQuestion() {
        for (const index of this.selectedQuestionnaries) {
          this.questionnaryStore.idQuestionnary = this.questionnaries[index].id;
          this.selectedQuestion.author = this.author;
          await this.questionnaryStore.addQuestion(this.selectedQuestion);
        }
        this.questionnaryStore.idQuestionnary = null;
        this.dialogVisible = false;
      },
      filteredQuestions() {
        let filtered = this.questions;

        // Filtrer par type
        if (this.selectedType.length > 0) {
          filtered = filtered.filter((f) => this.selectedType.includes(f.type));
        }

        // Filtrer par tag
        if (this.selectedTags.length > 0) {
          filtered = filtered.filter((f) =>
            f.tags.some((t) =>
              this.selectedTags
                .map((st) => st.description)
                .includes(t.description),
            ),
          );
        }

        //Recherche par nom
        const query = this.searchQuery.toLowerCase();
        if (query.trim() !== '') {
          filtered = filtered.filter((f) =>
            f.content.toLowerCase().includes(query.toLowerCase()),
          );
        }
        return filtered;
      },
      paginatedQuestions() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        return this.filteredQuestions().slice(startIndex, endIndex);
      },
      totalPages() {
        return Math.ceil(this.filteredQuestions.length / this.itemsPerPage);
      },
    },
  };
</script>

<template>
  <v-sheet
    rounded="lg"
    width="70%"
    class="mt-5 px-6 py-8 mx-auto mb-5 d-flex flex-column align-center"
    elevation="5">
    <div style="display: flex">
      <div style="align-self: start" id="divButton">
        <v-btn id="ic" icon="undo" @click="toggleVisibility"></v-btn>
      </div>
      <h1>Private Question Bank</h1>
    </div>

    <div style="display: flex; margin: 20px 0; width: 50%">
      <div id="divDrop1">
        <v-select
          v-model="selectedType"
          :items="typeOptions"
          item-title="typeLabel"
          item-value="typeCode"
          label="Types"
          :multiple="true"
          style="width: 180%"
          @change="filteredQuestions"></v-select>
      </div>
      <v-text-field
        id="search"
        v-model="this.searchQuery"
        label="Search"
        @input="filteredQuestions"></v-text-field>
      <div id="divDrop2">
        <v-select
          v-model="selectedTags"
          :items="tags"
          label="Tags"
          style="width: 180%"
          @change="filteredQuestions"></v-select>
      </div>
    </div>

    <v-pagination
      v-if="this.totalPages() > 1"
      v-model="currentPage"
      :length="this.totalPages()"></v-pagination>

    <v-sheet
      class="list"
      v-for="(q, index) in this.paginatedQuestions()"
      :key="index">
      <QuestionItem
        :question="q"
        @modifyQuestionFromBank="modifyQuestionFromBank"
        @showQuestionnaryList="showQuestionnaryList"></QuestionItem>
    </v-sheet>

    <!-- Pagination controls -->
    <v-pagination
      v-if="this.totalPages() > 1"
      v-model="currentPage"
      :length="this.totalPages()"></v-pagination>

    <v-card class="mt-25">
      <!--<v-btn @click="">Done</v-btn>-->
    </v-card>
  </v-sheet>
  <v-dialog v-model="dialogVisible" max-width="500">
    <v-card>
      <v-card-title>Bank Private Questions</v-card-title>

      <v-card-text>
        <v-list>
          <v-list-item v-if="this.questionnaries.length < 1">
            No questionnaries
          </v-list-item>
          <v-list-item
            v-else
            v-for="(questionnary, index) in questionnaries"
            :key="index"
            @click="toggleQuestion(index)"
            :class="{
              'selected-question': selectedQuestionnaries.includes(index),
            }">
            <v-list-item-title>{{ questionnary.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-actions class="text-center">
        <v-btn @click="AddQuestion">Add</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
  #divButton {
    position: absolute;
    left: 18%;
  }

  #divDrop1 {
    position: absolute;
    left: 75%;
  }

  #divDrop2 {
    position: absolute;
    right: 75%;
  }

  .selected-question {
    background-color: #bbfcc2;
  }
</style>
