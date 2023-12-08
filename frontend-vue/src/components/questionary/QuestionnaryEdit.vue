<template>
  <v-sheet
    rounded="lg"
    width="70%"
    class="mt-5 px-6 py-8 mx-auto d-flex flex-column align-center"
    elevation="5">
    <input
      v-if="OnList"
      id="title"
      type="text"
      v-model="questionnaryName"
      @change="changeName"
      required />
    <div v-else id="title">
      {{ this.questionnaryName }}
      <br />
      Question N°{{
        this.idQuestion
          ? this.useQ.questionnary.questions.findIndex(
              (question) => question.id === this.idQuestion,
            ) + 1
          : !!this.useQ.questionnary
          ? this.useQ.questionnary.questions.length + 1
          : 1
      }}
    </div>

    <v-select
      @change="changeType"
      v-if="showTypeSelector"
      v-model="selectedType"
      :items="typeOptions.map((option) => option.typeLabel)"
      label="Select Question Type"
      class="custom-select"
      dense
      outlined></v-select>

    <v-btn
      class="mb-5"
      v-if="OnList"
      icon="add"
      @click="toggleTypeSelector"></v-btn>

    <CreateQuestionnary
      ref="questionnaryComponent"
      id="quest"
      v-if="!OnList"
      :selectedQuestionType="selectedType"
      :idQuestion="idQuestion" />

    <div class="blocklist" v-if="!this.useQ.isCreated && this.OnList">
      <b>
        Pas encore de questions.. Cliquez sur le + pour ajouter une question
      </b>
    </div>

    <v-sheet class="questions" v-if="this.OnList && this.useQ.isCreated">
      <v-sheet
        v-if="this.useQ.questionnary"
        v-for="(question, index) in this.useQ.questionnary.questions"
        :key="index">
        <QuestionnaryListOne
          :numberLabel="question.content"
          :typeLabel="question.type"
          {{TODO
          question
          type}}
          :idQuestion="question.id"
          @ChangeStatuss="ChangeStatus" />
      </v-sheet>
    </v-sheet>

    <div v-if="!OnList" class="button-container">
      <v-btn icon="done" @click="validQuestion"></v-btn>
      <v-btn icon="reply" @click="showConfirmationDialog"></v-btn>
    </div>

    <v-dialog v-model="confirmationDialog" max-width="600">
      <v-card>
        <v-card-title class="headline">Confirmation</v-card-title>
        <v-card-text>
          Are you sure you want to leave without saving?
        </v-card-text>
        <v-card-actions>
          <v-btn @click="confirmationDialog = false">Cancel</v-btn>
          <v-btn @click="leaveWithoutSaving">confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-btn text="done" class="mt-5" @click="EmitGoList"></v-btn>
  </v-sheet>
</template>

<script>
  // @ is an alias to /src
  import QuestionnaryListOne from '@/components/questionary/QuestionnaryList.vue';
  import CreateQuestionnary from '@/components/questionary/CreateQuestionary.vue';
  import { useQuestionnaryStore } from '@/stores/questionnaryStore';

  export default {
    data() {
      return {
        OnList: true,
        showTypeSelector: false,
        selectedType: 'Unique',
        typeOptions: [
          { typeLabel: 'Unique', typeCode: 'qcu' },
          { typeLabel: 'Multiple', typeCode: 'qcm' },
          { typeLabel: 'Open-Ended', typeCode: 'ouv' },
          { typeLabel: 'True-False', typeCode: 'tof' },
          { typeLabel: 'Nuage de mots', typeCode: 'ndm' },
        ],
        confirmationDialog: false,
        baseQuestionnaryName: '[Questionnary name]',
        questionnaryName: '',
        statusQ: 'add',
        idQuestion: null,
      };
    },
    setup() {
      const useQ = useQuestionnaryStore();
      return {
        useQ,
      };
    },
    async mounted() {
      if (this.useQ.isCreated) {
        await this.useQ.getQuestionnary();
        this.questionnaryName = this.useQ.questionnary.title;
      } else this.questionnaryName = this.baseQuestionnaryName;
    },
    name: 'QuestionnaryEdit',
    components: {
      CreateQuestionnary,
      QuestionnaryListOne,
    },
    methods: {
      toggleTypeSelector() {
        this.statusQ = 'add';
        this.showTypeSelector = !this.showTypeSelector;
        this.OnList = !this.OnList;
      },
      ChangeStatus(idQuestion) {
        this.showTypeSelector = !this.showTypeSelector;
        this.OnList = !this.OnList;
        this.statusQ = 'modify';
        this.idQuestion = idQuestion;
        this.question = this.useQ.getQuestion(this.idQuestion);
      },
      async validQuestion() {
        const index = this.$refs.questionnaryComponent.correct;
        const content = this.$refs.questionnaryComponent.question.content;
        const answers = this.$refs.questionnaryComponent.getAnswers();
        const type = this.typeOptions.find(
          (option) => option.typeLabel === this.selectedType,
        ).typeCode;

        for (let i = 0; i < answers.length; i++) {
          answers[i].isCorrect = i === index;
        }

        if (content && answers) {
          if (this.useQ.idQuestionnary == null) {
            await this.useQ.createQuestionnary({
              author: 'author_default',
              title: this.questionnaryName,
              questions: [],
            }); //TODO get author
            await this.useQ.addQuestion({ content, type, answers });
          } else if (this.statusQ === 'modify') {
            await this.useQ.modifyQuestion(this.idQuestion, {
              content,
              type,
              answers,
            });
            this.idQuestion = null;
          } else {
            await this.useQ.addQuestion({ content, type, answers });
          }
          this.showTypeSelector = !this.showTypeSelector;
          this.OnList = !this.OnList;
        } else alert('Remplissez les champs vide avant de valider');
      },
      changeType() {
        this.selectedQuestionType = this.selectedType;
      },
      showConfirmationDialog() {
        this.confirmationDialog = true;
      },
      leaveWithoutSaving() {
        this.idQuestion = null;
        this.question = this.useQ.getQuestion(this.idQuestion);
        this.OnList = !this.OnList;
        this.confirmationDialog = false;
        this.showTypeSelector = !this.showTypeSelector;
      },
      EmitGoList() {
        if (
          !this.useQ.isCreated ||
          (this.useQ.isCreated &&
            this.questionnaryName !== this.baseQuestionnaryName)
        ) {
          this.useQ.idQuestionnary = null;
          this.$emit('GoList');
        } else alert('Veuillez changer le nom du questionnaire');
      },
      changeName() {
        if (this.useQ.isCreated) {
          this.useQ.modifyQuestionnary(this.questionnaryName);
        }
      },
    },
  };
</script>

<style>
  #title {
    margin-bottom: 10px;
    padding: 8px;
    font-size: 40px !important;
    font-weight: bold !important;
    text-align: center;
    border: 1px solid black;
  }

  v-btn {
    margin-bottom: 20px;
  }

  v-select {
    width: auto;
  }

  .custom-select {
    width: 300px;
    margin-bottom: 5px;
  }

  .button-container {
    display: flex;
  }
</style>
