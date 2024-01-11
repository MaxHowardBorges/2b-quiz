<script>
  import QuestionItem from '@/components/question/QuestionItem.vue';
  import { useQuestionnaryStore } from '@/stores/questionnaryStore';

  export default {
    components: {
      QuestionItem,
    },
    props: {
      selectedQuestionType: { String, default: 'Unique' },
      idQuestion: { Number, default: null },
      searchQuery: String,
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
      };
    },
    emits: ['modifyQuestionFromBank', 'toggleVoir'],
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

    <div style="display: flex; margin: 20px 0px; width: 50%">
      <div id="divDrop1">
        <v-select label="Types" style="width: 180%"></v-select>
      </div>
      <v-text-field
        id="search"
        v-model="this.searchQuery"
        label="Search"></v-text-field>
      <div id="divDrop2">
        <v-select label="Tags" style="width: 180%"></v-select>
      </div>
    </div>

    <v-sheet class="list">
      <v-sheet v-for="(q, index) in this.questions" :key="index">
        <QuestionItem
          :question="q"
          @modifyQuestionFromBank="modifyQuestionFromBank"
          @showQuestionnaryList="showQuestionnaryList"></QuestionItem>
      </v-sheet>
    </v-sheet>

    <v-dialog v-model="dialogVisible" max-width="500">
      <v-card>
        <v-card-title>Bank Private Questions</v-card-title>

        <v-card-text>
          <v-list>
            <v-list-item
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
  </v-sheet>
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
