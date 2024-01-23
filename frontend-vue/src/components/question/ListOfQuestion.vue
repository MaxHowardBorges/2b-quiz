<template>
  <v-sheet
    min-width="400px"
    rounded="lg"
    width="70%"
    class="mt-5 px-6 py-8 mx-auto mb-5 d-flex flex-column align-center"
    elevation="5">
    <div style="display: flex">
      <div style="align-self: start" id="divButton">
        <v-btn id="ic" icon="undo" @click="toggleVisibility"></v-btn>
      </div>
      <h1>{{ $t('question.PrivateQuestionBankTitle') }}</h1>
    </div>

    <div class="d-flex justify-center flex-column w-75">
      <div class="w-100">
        <v-text-field
          v-model="this.searchQuery"
          min-width="200px"
          label="Search"
          @input="filteredQuestions"></v-text-field>
      </div>
      <v-sheet class="d-flex justify-center" min-width="200px">
        <v-sheet min-width="200px" class="w-100">
          <v-autocomplete
            class="mr-2"
            :clearable="true"
            v-model="selectedType"
            :items="typeOptions"
            :chips="true"
            :closable-chips="true"
            item-title="typeLabel"
            item-value="typeCode"
            label="Types"
            multiple=""
            variant="outlined"
            @change="filteredQuestions"></v-autocomplete>
        </v-sheet>
        <v-sheet min-width="200px" class="w-100">
          <v-autocomplete
            v-model="selectedTags"
            :clearable="true"
            :items="tags"
            :chips="true"
            :closable-chips="true"
            min-width="200px"
            item-title="description"
            multiple=""
            return-object=""
            label="Tags"
            variant="outlined"
            @change="filteredQuestions"></v-autocomplete>
        </v-sheet>
      </v-sheet>
    </div>

    <v-pagination
      v-if="this.totalPages() > 1"
      v-model="currentPage"
      :length="this.totalPages()"></v-pagination>
    <div>
      <v-sheet
        class="list"
        v-for="(q, index) in this.paginatedQuestions()"
        :key="index">
        <question-item
          class="w-100 my-3"
          :question="q"
          @modifyQuestionFromBank="modifyQuestionFromBank"
          @showQuestionnaryList="showQuestionnaryList"></question-item>
      </v-sheet>
    </div>

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
      <v-card-title>{{ $t('question.QuestionnaryListTitle') }}</v-card-title>

      <v-card-text>
        <v-list>
          <v-list-item v-if="this.questionnaries.length < 1">
            {{ $t('question.NoQuestionnariesMessage') }}
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
        <v-btn @click="AddQuestion">{{ $t('group.AddButton') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

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
      this.loadData();
      return {
        questions: [],
        selectedQuestion: null,
        dialogVisible: false,
        questionnaries: [],
        selectedQuestionnaries: [],
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
      async loadData() {
        await this.questionnaryStore.getQuestionsFromUser();
        this.questions = this.questionnaryStore.privateQuestions;

        await this.questionnaryStore.getTags();
        this.tags = this.questionnaryStore.tagList;
      },
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

        await this.questionnaryStore.getQuestionnariesFromUser();
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
              this.selectedTags.some((st) => st.description === t.description),
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

<style scoped>
  #divButton {
    position: absolute;
    left: 18%;
  }

  .selected-question {
    background-color: #bbfcc2;
  }
</style>
