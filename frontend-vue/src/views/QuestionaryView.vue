<template>
  <div class="endof-session">

    <input id='title' type="text" value="Name of questionnary..">

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

    <v-btn v-if=OnList icon="add" @click="toggleTypeSelector"></v-btn>

    <CreateQuestionnary
      v-if=!OnList
      :selectedQuestionType="selectedType"
    />

    <div class='blocklist' v-if=OnList>
      <b>Pas encore de questions.. Cliquez sur le + pour ajouter une question </b>
    </div>

    <div v-if=OnList>
    <QuestionnaryListOne numberLabel="Numéro 1" typeLabel="Multiple"/>
    <QuestionnaryListOne numberLabel="Numéro 2" typeLabel="True-False"/>
    <QuestionnaryListOne numberLabel="Numéro 3" typeLabel="Open-Ended"/>
    <QuestionnaryListOne numberLabel="Numéro 4" typeLabel="Multiple"/>
    <QuestionnaryListOne />
    </div>

    <div v-if="!OnList" class="button-container">
    <v-btn icon="done" @click="toggleTypeSelector"></v-btn>
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

  </div>
</template>

<script>
  // @ is an alias to /src
  import QuestionnaryListOne from '@/components/questionary/QuestionnaryList.vue';
  import CreateQuestionnary from '@/components/questionary/CreateQuestionary.vue'


  export default {
    data() {
      return {
        OnList: true,
        showTypeSelector: false,
        selectedType: "Multiple",
        typeOptions: ["Multiple", "Open-Ended", "True-False"],
        confirmationDialog: false,
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

<style>

  .endof-session {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background-color: rgb(255, 255, 255);

  }

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
    width: 300px; /* ajustez la largeur selon vos besoins */
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
