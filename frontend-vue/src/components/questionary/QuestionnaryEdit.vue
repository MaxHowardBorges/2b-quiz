<template>
  <v-sheet
    v-if="!showTagPanel"
    rounded="lg"
    width="70%"
    class="mt-5 px-6 py-8 mx-auto d-flex flex-column align-center"
    elevation="5">
    <template v-if="!OnListQuestion && !showTagPanel">
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
            {{ $t('questionnary.question') }} N°{{
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
    </template>

    <div class="w-75 d-flex flex-row">
      <v-spacer></v-spacer>
      <v-btn
        v-if="OnListQuestion"
        style="margin-bottom: 30px"
        text="See Tags"
        class="mt-5"
        @click="toggleTagPanel"></v-btn>
    </div>
    <v-select
      v-if="showTypeSelector"
      v-model="selectedType"
      :items="typeOptions.map((option) => option.typeLabel)"
      :label="$t('questionnary.selectquestion')"
      class="custom-select"
      dense
      outlined></v-select>

    <v-autocomplete
      ref="tagSelect"
      v-if="OnListQuestion"
      v-model="selectedTags"
      v-model:search="searchTags"
      :items="this.tagList"
      item-title="description"
      return-object
      :chips="true"
      :closable-chips="true"
      label="Select Tags"
      class="w-33"
      style="min-width: 200px"
      multiple=""
      outlined
      dense>
      <template v-slot:prepend-item class="w-100 overflow-x-hidden">
        <div
          v-if="this.searchTags !== ''"
          class="d-flex justify-center w-100 flex-wrap overflow-x-hidden">
          <v-btn
            :loading="loadingTag"
            @click="createNewTagSelect"
            class="text-caption ma-2 overflow-x-hidden">
            create tag
            <span class="text-info ml-1">{{ this.searchTags }}</span>
          </v-btn>
        </div>
      </template>
    </v-autocomplete>

    <!--    <v-row v-if="OnListQuestion" class="mt-3">-->
    <!--      <v-col>-->
    <!--        <v-text-field-->
    <!--          v-model="newTag"-->
    <!--          label="New Tag"-->
    <!--          style="width: 200px"-->
    <!--          outlined-->
    <!--          dense></v-text-field>-->
    <!--      </v-col>-->
    <!--      <v-col>-->
    <!--        <v-btn @click="createNewTag" icon="done"></v-btn>-->
    <!--      </v-col>-->
    <!--    </v-row>-->

    <div v-if="OnListQuestionnary">
      <v-btn class="mb-5 mr-2" icon="add" @click="toggleTypeSelector"></v-btn>
      <v-btn class="mb-5" icon="quiz" @click="toggleBank"></v-btn>
    </div>

    <create-questionnary
      ref="questionnaryComponent"
      id="quest"
      v-if="OnListQuestion"
      @sendModifyingQuestion="sendModifyingQuestion"
      :is-from-bank="isFromBank"
      :selectedQuestionType="selectedType"
      :idQuestion="idQuestion" />

    <div
      class="blocklist"
      v-if="!this.useQ.isCreated && this.OnListQuestionnary">
      <b>
        {{ $t('questionnary.zeroquestion') }}
      </b>
    </div>

    <v-sheet
      class="questions"
      v-if="this.OnListQuestionnary && this.useQ.isCreated">
      <v-sheet v-for="(question, index) in this.useQ.questions" :key="index">
        <questionnary-list-one
          :numberLabel="question.content"
          :typeLabel="
            typeOptions.filter((type) => type.typeCode === question.type)[0]
              .typeLabel
          "
          :typeCode="question.type"
          :idQuestion="question.id"
          @ChangeStatuss="changeStatus" />
      </v-sheet>
    </v-sheet>

    <div v-if="OnListQuestion" class="button-container">
      <v-btn icon="done" @click="validQuestion" class="mr-2"></v-btn>
      <v-btn icon="reply" @click="showConfirmationDialog"></v-btn>
    </div>

    <v-dialog v-model="confirmationDialog" max-width="600">
      <v-card>
        <v-card-title class="headline">
          {{ $t('questionnary.Confirmation') }}
        </v-card-title>
        <v-card-text>
          {{ $t('questionnary.confirmLeave') }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="confirmationDialog = false" color="error">
            {{ $t('user.cancel') }}
          </v-btn>
          <v-btn @click="leaveWithoutSaving" color="success">
            {{ $t('user.confirm') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-btn v-if="OnListQuestionnary" class="mt-5" @click="EmitGoList">
      {{ $t('questionnary.done') }}
    </v-btn>
  </v-sheet>

  <list-tags v-if="showTagPanel" @toggleTagPanel="toggleTagPanel"></list-tags>
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
    emits: ['returnToBank', 'GoList', 'child-mounted', 'sendModifyingQuestion'],
    data() {
      return {
        // questionnary
        baseQuestionnaryName: '[Questionnary name]',
        questionnaryName: '',
        // question
        statusQ: 'add',
        idQuestion: null,
        modifyingQuestion: null,
        isFromBank: false,
        // type
        OnList: true,
        clickedOnChange: false,
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
        searchTags: '',
        loadingTag: false,
        // show attribute
        OnListQuestionnary: true,
        OnListQuestion: false,
        showTypeSelector: false,
        showTagPanel: false,
        dialogVisible: false,
        alertQuestionnaryNull: false,
        required: (value) => !!value || 'Field is required',
        confirmationDialog: false,
      };
    },
    setup() {
      const useQ = useQuestionnaryStore();
      return {
        useQ,
      };
    },
    name: 'QuestionnaryEdit',
    components: {
      ListTags,
      CreateQuestionnary,
      QuestionnaryListOne,
    },
    beforeMount() {
      this.loadData();
    },
    methods: {
      async loadData() {
        if (this.useQ.isCreated) {
          this.questionnaryName = this.useQ.questionnary.title;
        } else this.questionnaryName = this.baseQuestionnaryName;
      },
      async createNewTagSelect() {
        this.loadingTag = true;
        const tagToAdd = this.searchTags.trim();
        if (
          tagToAdd &&
          !this.useQ.tagList.some((t) => t.description === tagToAdd)
        ) {
          await this.useQ.createTag({
            description: tagToAdd,
          });
          this.tagList = this.useQ.tagList;
          this.newTag = '';
          this.selectedTags.push(
            this.tagList.find((t) => t.description === tagToAdd),
          );
          this.searchTags = '';
          this.loadingTag = false;
        } else {
          this.loadingTag = false;
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
      async changeStatus(idQuestion, typeL, fromBank = false) {
        this.isFromBank = fromBank;
        this.isFromBank ? (this.questionnaryName = '') : '';
        this.selectedType = this.typeOptions.filter(
          (type) => type.typeCode === typeL,
        )[0].typeLabel;
        this.statusQ = 'modify';
        this.idQuestion = idQuestion;
        !this.isFromBank ? await this.useQ.getAnswers(idQuestion) : '';

        this.showTypeSelector = !this.showTypeSelector;
        this.OnListQuestionnary = !this.OnListQuestionnary;
        this.OnListQuestion = !this.OnListQuestion;

        await this.useQ.getTags();
        this.tagList = this.useQ.tagList;
        this.selectedTags = [];

        const questionsList = this.isFromBank
          ? this.useQ.privateQuestions
          : this.useQ.questions;
        this.selectedTags =
          questionsList.length > 0
            ? this.tagList.filter((tl) =>
                questionsList
                  .find((q) => q.id === this.idQuestion)
                  .tags.map((t) => t.description)
                  .some((questionTag) => questionTag === tl.description),
              )
            : [];
      },
      sendModifyingQuestion(question) {
        this.modifyingQuestion = question;
      },
      async validQuestion() {
        const type = this.typeOptions.find(
          (option) => option.typeLabel === this.selectedType,
        ).typeCode;
        const content = this.$refs.questionnaryComponent.question.content;
        const answers = this.$refs.questionnaryComponent.getAnswers();
        const tags = this.selectedTags;

        let index = this.$refs.questionnaryComponent.correct;
        if (type === 'qcm') {
          index = this.$refs.questionnaryComponent.correctMultiple;
          for (let i = 0; i < answers.length; i++) {
            answers[i].isCorrect = index.some(
              (idIsCorrect) => idIsCorrect === i,
            );
          }
        } else {
          for (let i = 0; i < answers.length; i++) {
            answers[i].isCorrect = i === index;
          }
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
        // const content = this.$refs.questionnaryComponent.question.content;
        // const answers = this.$refs.questionnaryComponent.getAnswers();
        // const type = this.typeOptions.find(
        //   (option) => option.typeLabel === this.selectedType,
        // ).typeCode;
        //
        // if (
        //   this.modifyingQuestion.content !== content ||
        //   this.modifyingQuestion.type !== type ||
        //   JSON.stringify(this.modifyingQuestion.answers) !==
        //     JSON.stringify(answers)
        // ) {
        //   this.confirmationDialog = true;
        // } else {
        //   this.leaveWithoutSaving();
        // }
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
        if (this.clickedOnChange) {
          this.clickedOnChange = false;
          if (this.useQ.isCreated) {
            this.useQ.modifyQuestionnary(this.questionnaryName);
          }
        } else {
          this.clickedOnChange = true;
        }
      },
      returnToBank() {
        this.useQ.idQuestionnary = null;
        this.$emit('returnToBank');
      },
      async toggleTagPanel() {
        const questionsList = this.isFromBank
          ? this.useQ.privateQuestions
          : this.useQ.questions;
        this.selectedTags =
          questionsList.length > 0
            ? this.tagList.filter((tl) =>
                questionsList
                  .find((q) => q.id === this.idQuestion)
                  .tags.map((t) => t.description)
                  .some((questionTag) => questionTag === tl.description),
              )
            : [];
        this.showTypeSelector = !this.showTypeSelector;
        this.OnListQuestion = !this.OnListQuestion;
        this.showTagPanel = !this.showTagPanel;
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
