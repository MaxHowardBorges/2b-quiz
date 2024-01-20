<template>
  <v-sheet
    rounded="lg"
    width="70%"
    class="mt-5 px-6 py-8 mx-auto d-flex flex-column align-center"
    elevation="5">
    <div
      class="d-flex align-center flex-1-1 w-75 justify-center"
      id="title-input">
      <v-text-field
        id="title-input"
        v-if="!useQ.isCreated || (OnList && clickedOnChange)"
        :rules="[required]"
        class="text-h1 w-75"
        variant="outlined"
        v-model="questionnaryName"
        required />
      <div v-else>
        <div id="title" class="text-h1">
          {{ this.questionnaryName }}
        </div>
        <div v-if="!OnList">
          Question N°{{
            this.idQuestion
              ? this.useQ.questions.findIndex(
                  (question) => question.id === this.idQuestion,
                ) + 1
              : !!this.useQ.questionnary
              ? this.useQ.questions.length + 1
              : 1
          }}
        </div>
      </div>
      <v-btn
        v-if="OnList"
        :icon="clickedOnChange ? 'check' : 'edit'"
        class="ml-5"
        @click="changeName" />
    </div>

    <v-select
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

    <v-dialog v-model="alertQuestionnaryNull" max-width="600">
      <v-card>
        <v-card-title class="headline">Confirmation</v-card-title>
        <v-card-text>
          Please note that your questionnary has no questions if you leave it
          will not be saved.
        </v-card-text>
        <v-card-actions>
          <v-btn @click="alertQuestionnaryNull = false">Cancel</v-btn>
          <v-btn @click="EmitGoList">confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <div class="blocklist" v-if="!this.useQ.isCreated && this.OnList">
      <b>
        Pas encore de questions.. Cliquez sur le + pour ajouter une question
      </b>
    </div>

    <v-sheet class="questions" v-if="this.OnList && this.useQ.isCreated">
      <v-sheet v-for="(question, index) in this.useQ.questions" :key="index">
        <QuestionnaryListOne
          :numberLabel="question.content"
          :typeLabel="question.type"
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

    <v-btn
      v-if="OnList"
      text="return to questionnary list"
      class="mt-5"
      @click="EmitGoList"></v-btn>
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
        clickedOnChange: false,
        showTypeSelector: false,
        selectedType: 'Unique',
        typeOptions: [
          { typeLabel: 'Unique', typeCode: 'qcu' },
          { typeLabel: 'Multiple', typeCode: 'qcm' },
          { typeLabel: 'Open-Ended', typeCode: 'ouv' },
          { typeLabel: 'True-False', typeCode: 'tof' },
          { typeLabel: 'Open-Ended-Constraint', typeCode: 'qoc' },
        ],
        confirmationDialog: false,
        baseQuestionnaryName: '[Questionnary name]',
        questionnaryName: '',
        statusQ: 'add',
        idQuestion: null,
        alertQuestionnaryNull: false,
        required: (value) => !!value || 'Field is required',
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
      ChangeStatus(idQuestion, typeL) {
        this.showTypeSelector = !this.showTypeSelector;
        this.OnList = !this.OnList;
        this.statusQ = 'modify';
        this.idQuestion = idQuestion;
        this.selectedType = this.typeOptions.filter(
          (type) => type.typeCode === typeL,
        )[0].typeLabel;
        this.useQ.getAnswers(idQuestion);
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
              title: this.questionnaryName,
              questions: [],
            });
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
          this.selectedType = 'Unique';
        } else alert('Remplissez les champs vide avant de valider');
      },
      showConfirmationDialog() {
        this.confirmationDialog = true;
      },
      leaveWithoutSaving() {
        this.selectedType = 'Unique';
        this.idQuestion = null;
        //this.question = this.useQ.getQuestion(this.idQuestion);
        this.OnList = !this.OnList;
        this.confirmationDialog = false;
        this.showTypeSelector = !this.showTypeSelector;
      },
      EmitGoList() {
        if (
          this.useQ.questionnary === null &&
          this.alertQuestionnaryNull === false
        ) {
          this.alertQuestionnaryNull = true;
        } else {
          this.alertQuestionnaryNull = false;
          if (
            !this.useQ.isCreated ||
            (this.useQ.isCreated &&
              this.questionnaryName !== this.baseQuestionnaryName)
          ) {
            this.useQ.idQuestionnary = null;
            this.$emit('GoList');
          } else alert('Veuillez changer le nom du questionnaire');
        }
      },
      changeName() {
        if (this.clickedOnChange) {
          this.clickedOnChange = false;
          if (this.useQ.isCreated) {
            this.useQ.modifyQuestionnary(this.questionnaryName);
          }
        } else {
          this.clickedOnChange = true;
        }
      },
    },
  };
</script>

<style>
  #title {
    margin-bottom: 10px;
    padding: 8px;
    font-size: 50px !important;
    text-align: center;
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

  #title-input input {
    font-size: 50px !important;
    width: 75% !important;
  }
</style>
