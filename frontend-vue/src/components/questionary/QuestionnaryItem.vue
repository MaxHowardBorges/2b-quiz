<template>

  <div class='blocklist'>
    <b>{{ questionnaryName.title }}</b>
    <span class="spacer"></span>
    <span class="spacer"></span>
    <v-btn icon="play_arrow" @click='startQuestionnary'></v-btn>
    <v-btn icon="edit" @click='modifyQuestionnary'></v-btn>
    <v-btn icon="delete" @click='deleteQuestionnary'></v-btn>
  </div>

</template>

<script>

  import { useQuestionnaryStore } from '@/stores/questionnaryStore';

  export default {
    data() {
      return {
        iflist: true,
      };
    },
    setup() {
      const useQ = useQuestionnaryStore();
      return {
        useQ
      };
    },
    props: {
      questionnaryId: { type: Number, default: null },
      questionnaryName: {},
    },
    methods: {
      deleteQuestionnary() {
        this.useQ.deleteQuestionnary(this.questionnaryId);
      },
      modifyQuestionnary() {
        //this.$emit('ChangeStatuss', this.idQuestion);
        this.useQ.idQuestionnary= this.questionnaryName.id;
        this.useQ.getQuestionnary();
        console.log(this.useQ.questionnaryList);
        this.$emit("nextQuestionE")
        //alert("axel doit faire une redirection sur la page de modification du questionnaire");
      },
      startQuestionnary(){
        const list = ["je te vois","tu travail moins que mathieu","tu as fait tes rolls ?","je sais pas"];
        alert(list[Math.floor(Math.random() * list.length)]);
      }
    },
    name: 'QuestionnaryItem',
  }

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