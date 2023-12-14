<template>
  <div class="blocklist">
    <b>{{ questionnaryName.title }}</b>
    <span class="spacer"></span>
    <span class="spacer"></span>
    <!--    <v-btn icon="play_arrow" @click='startQuestionnary'></v-btn>-->
    <v-btn icon="edit" @click="modifyQuestionnary"></v-btn>
    <v-btn icon="delete" @click="deleteQuestionnary"></v-btn>
  </div>

  <v-dialog v-model="alertQuestionnaryDelete" max-width="600">
    <v-card>
      <v-card-title class="headline">Confirmation</v-card-title>
      <v-card-text>
        Are you sure to delete the questionnary : <b> " {{questionnaryName.title}} " </b> ?
      </v-card-text>
      <v-card-actions>
        <v-btn @click="alertQuestionnaryDelete = false">Cancel</v-btn>
        <v-btn @click="deleteQuestionnary">confirm</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import { useQuestionnaryStore } from '@/stores/questionnaryStore';

  export default {
    data() {
      return {
        iflist: true,
        alertQuestionnaryDelete: false
      };
    },
    setup() {
      const useQ = useQuestionnaryStore();
      return {
        useQ,
      };
    },
    props: {
      questionnaryId: { type: Number, default: null },
      questionnaryName: {},
      author: {},
    },
    methods: {
      deleteQuestionnary() {
        if(!this.alertQuestionnaryDelete){
          this.alertQuestionnaryDelete=true;
        }
        else{
          this.useQ.deleteQuestionnary(this.questionnaryId);
        }

      },
      modifyQuestionnary() {
        this.useQ.idQuestionnary = this.questionnaryName.id;
        this.useQ.getQuestionnary();
        this.useQ.getQuestions();
        this.$emit('nextQuestionE');
      },
      startQuestionnary() {
        const list = ['En attente', 'Mise à jour bientôt'];
        alert(list[Math.floor(Math.random() * list.length)]);
      },
    },
    name: 'QuestionnaryItem',
  };
</script>

<style scoped>
  .blocklist {
    display: flex;
    align-items: center;
    padding: 15px;
    border: 1px solid #ddd;
    margin-bottom: 15px;
  }

  .blocklist b {
    margin-right: 20px;
  }

  .blocklist .spacer {
    flex: 1;
  }

  .blocklist v-btn {
    margin-left: 20px;
  }
</style>
