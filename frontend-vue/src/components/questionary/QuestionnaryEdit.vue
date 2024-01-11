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
          ? this.useQ.questions.findIndex(
              (question) => question.id === this.idQuestion,
            ) + 1
          : !!this.useQ.questionnary
          ? this.useQ.questions.length + 1
          : 1
      }}
    </div>

    <v-select
      v-if="showTypeSelector"
      v-model="selectedType"
      :items="typeOptions.map((option) => option.typeLabel)"
      label="Select Question Type"
      class="custom-select"
      dense
      outlined></v-select>

    <v-select
      v-if="!OnList"
      v-model="selectedTags"
      :items="this.tagList"
      item-title="description"
      return-object
      label="Select Tags"
      style="width: 200px"
      multiple
      outlined
      dense></v-select>

    <v-row v-if="!OnList" class="mt-3">
      <v-col>
        <v-text-field
          v-model="newTag"
          label="New Tag"
          style="width: 200px"
          outlined
          dense></v-text-field>
      </v-col>
      <v-col>
        <v-btn @click="createNewTag" icon="done"></v-btn>
      </v-col>
    </v-row>

    <div>
      <v-btn
        class="mb-5"
        v-if="OnList"
        icon="add"
        @click="toggleTypeSelector"></v-btn>

      <v-btn class="mb-5" v-if="OnList" icon="quiz" @click="toggleBank"></v-btn>
    </div>

    <CreateQuestionnary
      ref="questionnaryComponent"
      id="quest"
      v-if="!OnList"
      :is-from-bank="isFromBank"
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
          @ChangeStatuss="changeStatus" />
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
  import QuestionnaryListOne from '@/components/questionary/QuestionnaryList.vue';
  import CreateQuestionnary from '@/components/questionary/CreateQuestionary.vue';
  import { useQuestionnaryStore } from '@/stores/questionnaryStore';

  export default {
    /*props: {
      ChangeStatus: String,
    },*/ //USE IF WARNING IN CONSOLE
    data() {
      return {
        newTag: '',
        OnList: true,
        showTypeSelector: false,
        isFromBank: false,
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
        tagList: [],
        selectedTags: [],
        statusQ: 'add',
        idQuestion: null,
        alertQuestionnaryNull: false,
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
      await this.useQ.getTags();
      this.tagList = this.useQ.tagList;
      console.log(this.tagList);
      this.selectedTags = [];
    },
    name: 'QuestionnaryEdit',
    components: {
      CreateQuestionnary,
      QuestionnaryListOne,
    },
    methods: {
      async createNewTag() {
        const tagToAdd = this.newTag.trim();
        if (
          tagToAdd &&
          !this.useQ.tagList.some((t) => t.description === tagToAdd)
        ) {
          await this.useQ.createTag(tagToAdd);
          this.tagList = this.useQ.tagList;
          this.newTag = '';
        } else {
          alert('Le tag est vide ou existe déjà.');
        }
      },
      toggleTypeSelector() {
        this.statusQ = 'add';
        this.showTypeSelector = !this.showTypeSelector;
        this.OnList = !this.OnList;
      },
      toggleBank() {
        this.returnToBank();
      },
      changeStatus(idQuestion, typeL, fromBank = false) {
        this.isFromBank = fromBank;
        this.isFromBank ? (this.questionnaryName = '') : '';
        this.showTypeSelector = !this.showTypeSelector;
        this.OnList = !this.OnList;
        this.statusQ = 'modify';
        this.idQuestion = idQuestion;
        this.selectedType = this.typeOptions.filter(
          (type) => type.typeCode === typeL,
        )[0].typeLabel;
        !this.isFromBank ? this.useQ.getAnswers(idQuestion) : '';
      },
      async validQuestion() {
        const author = '111111'; // TODO get id author
        const index = this.$refs.questionnaryComponent.correct;
        const content = this.$refs.questionnaryComponent.question.content;
        const answers = this.$refs.questionnaryComponent.getAnswers();
        const type = this.typeOptions.find(
          (option) => option.typeLabel === this.selectedType,
        ).typeCode;
        const tags = this.selectedTags;
        console.log(tags);

        for (let i = 0; i < answers.length; i++) {
          answers[i].isCorrect = i === index;
        }

        if (content && answers) {
          if (this.useQ.idQuestionnary == null && !this.isFromBank) {
            await this.useQ.createQuestionnary({
              author: author,
              title: this.questionnaryName,
              questions: [],
            }); //TODO get author
            await this.useQ.addQuestion({
              content,
              type,
              author,
              answers,
              tags,
            });
          } else if (this.statusQ === 'modify') {
            await this.useQ.modifyQuestion(this.idQuestion, {
              content,
              type,
              author,
              answers,
              tags,
            });
            this.idQuestion = null;
          } else {
            await this.useQ.addQuestion({
              content,
              type,
              author,
              answers,
              tags,
            });
          }
          this.showTypeSelector = !this.showTypeSelector;
          this.OnList = !this.OnList;
          this.selectedType = 'Unique';
          this.isFromBank ? this.returnToBank() : '';
        } else alert('Remplissez les champs vide avant de valider');
      },
      changeTags() {
        // Traitez les tags sélectionnés ici
        console.log('Selected Tags:', this.selectedTags);
      },
      showConfirmationDialog() {
        this.confirmationDialog = true;
      },
      leaveWithoutSaving() {
        this.selectedType = 'Unique';
        this.idQuestion = null;
        this.OnList = !this.OnList;
        this.confirmationDialog = false;
        this.showTypeSelector = !this.showTypeSelector;
        this.isFromBank ? this.returnToBank() : '';
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
        if (this.useQ.isCreated) {
          this.useQ.modifyQuestionnary(this.questionnaryName);
        }
      },
      returnToBank() {
        this.useQ.idQuestionnary = null;
        this.$emit('returnToBank');
      },
    },
  };
</script>
