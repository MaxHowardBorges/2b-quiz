<template>
  <v-sheet
    rounded="lg"
    width="70%"
    class="mt-5 px-6 py-8 mx-auto d-flex flex-column align-center"
    elevation="5"
  >
    <input
      v-if="OnList"
      id="title"
      type="text"
      v-model="questionnaryName"
      @change="changeName"
      required
    />
    <div v-else id="title">
      {{ this.questionnaryName }}
      <br />
      Question N°{{
        this.idQuestion
          ? this.useQ.questionnary.questions.findIndex(
          (question) => question.id === this.idQuestion
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
      :items="typeOptions"
      label="Select Question Type"
      class="custom-select"
      dense
      outlined
      readonly=""
    ></v-select>

    <v-select
      v-if="!OnList"
      v-model="selectedTags"
      :items="tagOptions"
      label="Select Tags"
      style="width: 200px;"
      multiple
      outlined
      dense
    ></v-select>

    <v-row v-if="!OnList" class="mt-3">
      <v-col>
        <v-text-field
          v-model="newTag"
          label="New Tag"
          style="width: 200px;"
          outlined
          dense
        ></v-text-field>
      </v-col>
      <v-col>
        <v-btn @click="createNewTag"  icon="done">
        </v-btn>
      </v-col>
    </v-row>

    <div>
    <v-btn
      class="mb-5"
      v-if="OnList"
      icon="add"
      @click="toggleTypeSelector"
    ></v-btn>

    <v-btn
      class="mb-5"
      v-if="OnList"
      icon="quiz"
      @click="toggleBank"
    ></v-btn>
    </div>

    <v-dialog v-model="dialogVisible" max-width="500">
      <v-card>
        <v-card-title>Bank Private Questions</v-card-title>

        <v-card-text>
          <v-list>
            <v-list-item v-for="(question, index) in questions" :key="index" @click="toggleQuestion(index)" :class="{ 'selected-question': selectedQuestions.includes(index) }">
              <v-list-item-content>
                <v-list-item-title>{{ question }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>

        <v-card-actions class="text-center">
          <v-btn @click="">Add</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <CreateQuestionnary
      ref="questionnaryComponent"
      id="quest"
      v-if="!OnList"
      :selectedQuestionType="selectedType"
      :idQuestion="idQuestion"
    />

    <div class="blocklist" v-if="!this.useQ.isCreated && this.OnList">
      <b>
        Pas encore de questions.. Cliquez sur le + pour ajouter une question
      </b>
    </div>



    <v-sheet class="questions" v-if="this.OnList && this.useQ.isCreated">
      <v-sheet
        v-if="this.useQ.questionnary"
        v-for="(question, index) in this.useQ.questionnary.questions"
        :key="index"
      >
        <QuestionnaryListOne
          :numberLabel="question.content"
          typeLabel="Multiple"
          :idQuestion="question.id"
          @ChangeStatuss="ChangeStatus"
        />
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
  import QuestionnaryListOne from '@/components/questionary/QuestionnaryList.vue';
  import CreateQuestionnary from '@/components/questionary/CreateQuestionary.vue';
  import { useQuestionnaryStore } from '@/stores/questionnaryStore';

  export default {
    data() {
      return {
        newTag:"",
        OnList: true,
        showTypeSelector: false,
        selectedType: 'Multiple',
        typeOptions: ['Multiple', 'Open-Ended', 'True-False'],
        confirmationDialog: false,
        baseQuestionnaryName: '[Questionnary name]',
        questionnaryName: '',
        selectedTags: [],
        tagOptions: ['Tag1', 'Tag2', 'Tag3'], // Remplacez par vos tags réels
        statusQ: 'add',
        idQuestion: null,
        dialogVisible: false,

        questions: ['Question 1', 'Question 2', 'Question 3'],
        selectedQuestions: [],
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

      createNewTag() {
        const tagToAdd = this.newTag.trim();
        if (tagToAdd && !this.tagOptions.includes(tagToAdd)) {
          this.tagOptions.push(tagToAdd);
          this.selectedTags.push(tagToAdd);
          this.newTag = ''; // Réinitialisez le champ du nouveau tag après l'ajout
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
        this.dialogVisible = true;
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

        for (let i = 0; i < answers.length; i++) {
          answers[i].isCorrect = i === index;
        }

        if (content && answers) {
          if (this.useQ.idQuestionnary == null) {
            await this.useQ.createQuestionnary({
              author: 'author_default',
              title: this.questionnaryName,
              questions: [],
            });
            await this.useQ.addQuestion({ content, answers });
          } else if (this.statusQ === 'modify') {
            await this.useQ.modifyQuestion(this.idQuestion, {
              content,
              answers,
            });
            this.idQuestion = null;
          } else {
            await this.useQ.addQuestion({ content, answers });
          }
          this.showTypeSelector = !this.showTypeSelector;
          this.OnList = !this.OnList;
        } else alert('Remplissez les champs vides avant de valider');
      },
      changeType() {
        this.selectedQuestionType = this.selectedType;
      },
      changeTags() {
        // Traitez les tags sélectionnés ici
        console.log('Selected Tags:', this.selectedTags);
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

      toggleQuestion(index) {
        if (this.selectedQuestions.includes(index)) {
          this.selectedQuestions = this.selectedQuestions.filter((i) => i !== index);
        } else {
          this.selectedQuestions.push(index);
        }
      },
    },
  };
</script>

<style>
  /* Styles personnalisés */
  .selected-question {
    background-color: #bbfcc2;
  }
</style>
