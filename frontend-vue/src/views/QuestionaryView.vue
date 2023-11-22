<template>
  <v-sheet
    rounded="lg"
    width="70%"
    class="mt-5 px-6 py-8 mx-auto d-flex flex-column align-center"
    elevation="5"
  >

    <input id='title' type="text" v-model="questionnaryName" required>

    <v-select
      @change="changeType"
      v-if="showTypeSelector"
      v-model="selectedType"
      :items="typeOptions"
      label="Select Question Type"
      class="custom-select"
      dense
      outlined
    ></v-select>

    <v-btn class="mb-5" v-if=OnList icon="add" @click="toggleTypeSelector"></v-btn>


    <CreateQuestionnary
      ref="questionnaryComponent"
      id='quest'
      v-if=!OnList
      :selectedQuestionType="selectedType"
      :idQuestion='idQuestion'
    />

    <div class='blocklist' v-if=!this.useQ.isCreated&&this.OnList>
      <b>Pas encore de questions.. Cliquez sur le + pour ajouter une question </b>
    </div>


    <v-sheet class="questions" v-if=this.OnList&&this.useQ.isCreated>
      <v-sheet v-for="(question, index) in this.useQ.questionnary.questions" :key="index">
        <QuestionnaryListOne :numberLabel=question.content typeLabel="Multiple" :idQuestion=question.id @ChangeStatuss="ChangeStatus"/>
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

  </v-sheet >
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
        selectedType: "Multiple",
        typeOptions: ["Multiple", "Open-Ended", "True-False"],
        confirmationDialog: false,
        questionnaryName : "[Questionnary name]",
        statusQ: "add",
        idQuestion: null,
      };
    },
    setup() {
      const useQ = useQuestionnaryStore();
      return {
        useQ
      };
    },
    name: 'QuestionaryView',
    components: {
      CreateQuestionnary,
      QuestionnaryListOne,
    },
    methods: {
      AddComponent() {
        this.OnList=!this.OnList;
      },
      toggleTypeSelector() {

        this.showTypeSelector = !this.showTypeSelector;
        this.OnList = !this.OnList;
      },
      ChangeStatus(idQuestion) {
        this.showTypeSelector = !this.showTypeSelector;
        this.OnList = !this.OnList;
        this.statusQ = "modify";
        this.idQuestion = idQuestion;
        this.question = this.useQ.getQuestion(this.idQuestion);
      },
      updateUseQ(){
        this.useQ = useQuestionnaryStore();
      },
      async validQuestion() {

        const content = this.$refs.questionnaryComponent.question.content;
        const answers = this.$refs.questionnaryComponent.getAnswers();
        console.log(content);
        console.log(answers);

        if (content && answers){
          if (this.useQ.idQuestionnary == null){
            await this.useQ.createQuestionnary({ author: 'Tamas Pâle aux tâches', title: this.questionnaryName, questions: []});//TODO get author
            await this.useQ.addQuestion({content,answers});
            console.log("#1#");
          }

          else if (this.statusQ === "modify"){//TODO pré remplir les champs
            await this.useQ.modifyQuestion(this.idQuestion,{content,answers});
            this.statusQ="add";
            this.idQuestion=null;
            console.log("#2#");
          }
          else{
            await this.useQ.addQuestion({content,answers});
            console.log("#3#");
          }
        }

        this.showTypeSelector = !this.showTypeSelector;
        this.OnList = !this.OnList;
      },
      changeType() {
        this.selectedQuestionType = this.selectedType ;
      },
      showConfirmationDialog() {
        this.confirmationDialog = true;
      },
      leaveWithoutSaving() {


        this.OnList = !this.OnList;
        this.confirmationDialog = false;
        this.showTypeSelector = !this.showTypeSelector;
      },
    },
  }
</script>
<!--  .endof-session {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background-color: rgb(255, 255, 255);

  }
-->
<style>


  #title {
    margin-bottom: 10px;
    padding: 8px;
    font-size: 40px !important;
    font-weight: bold !important;
  }

  v-btn {
    margin-bottom: 20px;
  }

  v-select{
    width: auto;
  }

  .custom-select {
    width: 300px;
    margin-bottom: 5px;
  }

  .button-container {
    display: flex;
  }

  .button-container .v-btn {
    margin-right: 10px;
    margin-top: 10px;
  }


</style>
