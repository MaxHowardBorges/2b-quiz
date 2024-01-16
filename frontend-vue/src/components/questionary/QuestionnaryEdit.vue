<template>
  <v-sheet
    rounded="lg"
    width="70%"
    class="mt-5 px-6 py-8 mx-auto d-flex flex-column align-center"
    elevation="5">
    <input
      v-if="OnListQuestionnary"
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

    <v-btn
      v-if="OnListQuestion"
      style="margin-bottom: 30px"
      text="Tags"
      class="mt-5"
      @click="toggleTagPanel"></v-btn>

    <v-select
      v-if="OnListQuestion"
      v-model="selectedTags"
      :items="this.tagList"
      item-title="description"
      return-object
      label="Select Tags"
      style="width: 200px"
      multiple=""
      outlined
      dense></v-select>

    <v-row v-if="OnListQuestion" class="mt-3">
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

    <div v-if="OnListQuestionnary">
      <v-btn class="mb-5" icon="add" @click="toggleTypeSelector"></v-btn>
      <v-btn class="mb-5" icon="quiz" @click="toggleBank"></v-btn>
    </div>

    <CreateQuestionnary
      ref="questionnaryComponent"
      id="quest"
      v-if="OnListQuestion"
      :is-from-bank="isFromBank"
      :selectedQuestionType="selectedType"
      :idQuestion="idQuestion" />

    <div
      class="blocklist"
      v-if="!this.useQ.isCreated && this.OnListQuestionnary">
      <b>
        Pas encore de questions.. Cliquez sur le + pour ajouter une question
      </b>
    </div>

    <v-sheet
      class="questions"
      v-if="this.OnListQuestionnary && this.useQ.isCreated">
      <v-sheet v-for="(question, index) in this.useQ.questions" :key="index">
        <QuestionnaryListOne
          :numberLabel="question.content"
          :typeLabel="question.type"
          :idQuestion="question.id"
          @ChangeStatuss="changeStatus" />
      </v-sheet>
    </v-sheet>

    <div v-if="OnListQuestion" class="button-container">
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
      v-if="OnListQuestionnary"
      text="return to questionnary list"
      class="mt-5"
      @click="EmitGoList"></v-btn>
  </v-sheet>

  <ListTags v-if="showTagPanel" @toggleTagPanel="toggleTagPanel"></ListTags>
</template>

<script>
  import QuestionnaryListOne from '@/components/questionary/QuestionnaryList.vue';
  import CreateQuestionnary from '@/components/questionary/CreateQuestionary.vue';
  import { useQuestionnaryStore } from '@/stores/questionnaryStore';
  import ListTags from '@/components/questionary/ListTags.vue';

  export default {
    /*props: {
      ChangeStatus: String,
    },*/ //USE IF WARNING IN CONSOLE
    emits: ['returnToBank', 'GoList'],
    data() {
      return {
        // questionnary
        baseQuestionnaryName: '[Questionnary name]',
        questionnaryName: '',
        // question
        statusQ: 'add',
        idQuestion: null,
        isFromBank: false,
        // type
        selectedType: 'Unique',
        typeOptions: [
          { typeLabel: 'Unique', typeCode: 'qcu' },
          { typeLabel: 'Multiple', typeCode: 'qcm' },
          { typeLabel: 'Open-Ended', typeCode: 'ouv' },
          { typeLabel: 'True-False', typeCode: 'tof' },
          { typeLabel: 'Open-Ended-Constraint', typeCode: 'qoc' },
        ],
        // tag
        newTag: '',
        tagList: [],
        selectedTags: [],
        // show attribute
        OnListQuestionnary: true,
        OnListQuestion: false,
        showTypeSelector: false,
        showTagPanel: false,
        dialogVisible: false,
        alertQuestionnaryNull: false,
        confirmationDialog: false,
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
        this.questionnaryName = this.useQ.questionnary.title;
      } else this.questionnaryName = this.baseQuestionnaryName;
      await this.useQ.getTags();
      this.tagList = this.useQ.tagList;
      this.selectedTags = [];
    },
    name: 'QuestionnaryEdit',
    components: {
      ListTags,
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
          await this.useQ.createTag({
            description: tagToAdd,
          });
          this.tagList = this.useQ.tagList;
          this.newTag = '';
        } else {
          alert('Le tag est vide ou existe déjà.');
        }
      },
      toggleTypeSelector() {
        this.statusQ = 'add';
        this.showTypeSelector = !this.showTypeSelector;
        this.OnListQuestionnary = !this.OnListQuestionnary;
        this.OnListQuestion = !this.OnListQuestion;
      },
      toggleBank() {
        this.returnToBank();
      },
      changeStatus(idQuestion, typeL, fromBank = false) {
        this.isFromBank = fromBank;
        this.isFromBank ? (this.questionnaryName = '') : '';
        this.showTypeSelector = !this.showTypeSelector;
        this.OnListQuestionnary = !this.OnListQuestionnary;
        this.OnListQuestion = !this.OnListQuestion;
        this.statusQ = 'modify';
        this.idQuestion = idQuestion;
        this.selectedType = this.typeOptions.filter(
          (type) => type.typeCode === typeL,
        )[0].typeLabel;

        this.selectedTags = this.tagList.filter((tl) =>
          this.useQ.questions
            .find((q) => q.id === this.idQuestion)
            .tags.map((t) => t.description)
            .some((questionTag) => questionTag === tl.description),
        );

        !this.isFromBank ? this.useQ.getAnswers(idQuestion) : '';
      },
      async validQuestion() {
        const index = this.$refs.questionnaryComponent.correct;
        const content = this.$refs.questionnaryComponent.question.content;
        const answers = this.$refs.questionnaryComponent.getAnswers();
        const type = this.typeOptions.find(
          (option) => option.typeLabel === this.selectedType,
        ).typeCode;
        const tags = this.selectedTags;

        for (let i = 0; i < answers.length; i++) {
          answers[i].isCorrect = i === index;
        }

        if (content && answers) {
          if (this.useQ.idQuestionnary == null && !this.isFromBank) {
            await this.useQ.createQuestionnary({
              title: this.questionnaryName,
              questions: [],
            });
            await this.useQ.addQuestion({
              content: content,
              type: type,
              answers: answers,
              tags: tags,
            });
          } else if (this.statusQ === 'modify') {
            await this.useQ.modifyQuestion(this.idQuestion, {
              content: content,
              type: type,
              answers: answers,
              tags: tags,
            });
            this.idQuestion = null;
          } else {
            await this.useQ.addQuestion({
              content: content,
              type: type,
              answers: answers,
              tags: tags,
            });
          }
          this.showTypeSelector = !this.showTypeSelector;
          this.OnListQuestionnary = !this.OnListQuestionnary;
          this.OnListQuestion = !this.OnListQuestion;
          this.selectedType = 'Unique';
          this.isFromBank ? this.returnToBank() : '';
        } else alert('Remplissez les champs vide avant de valider');
      },
      showConfirmationDialog() {
        this.confirmationDialog = true;
      },
      leaveWithoutSaving() {
        this.selectedType = 'Unique';
        this.idQuestion = null;
        this.OnListQuestionnary = !this.OnListQuestionnary;
        this.OnListQuestion = !this.OnListQuestion;
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
      toggleTagPanel() {
        this.tagList = this.useQ.tagList;
        this.selectedTags = this.tagList.filter((tl) =>
          this.useQ.questions
            .find((q) => q.id === this.idQuestion)
            .tags.map((t) => t.description)
            .some((questionTag) => questionTag === tl.description),
        );
        this.showTypeSelector = !this.showTypeSelector;
        this.OnListQuestion = !this.OnListQuestion;
        this.showTagPanel = !this.showTagPanel;
      },
    },
  };
</script>
