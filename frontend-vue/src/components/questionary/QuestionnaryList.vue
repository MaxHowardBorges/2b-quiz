<script>
  import { useQuestionnaryStore } from '@/stores/questionnaryStore';

  export default {
    emits: ['ChangeStatuss'],
    data() {
      return {
        alertQuestionDelete: false,
      };
    },
    setup() {
      const useQ = useQuestionnaryStore();
      return {
        useQ,
      };
    },
    props: {
      numberLabel: { type: String, default: 'N°' },
      typeLabel: { type: String, default: 'Unique' },
      typeCode: { type: String, default: 'qcu' },
      idQuestion: { type: Number, default: null },
    },
    methods: {
      deleteQuest() {
        if (!this.alertQuestionDelete) {
          this.alertQuestionDelete = true;
        } else {
          this.alertQuestionDelete = false;
          this.useQ.deleteQuestion(this.idQuestion);
        }
      },
      modifyQuest() {
        this.$emit('ChangeStatuss', this.idQuestion, this.typeCode);
      },
    },
  };
</script>

<template>
  <div class="blocklist">
    <b>{{ numberLabel }}</b>
    <v-spacer></v-spacer>
    <b>
      {{ typeCode.toLocaleUpperCase() }}
      <v-tooltip activator="parent" location="top end" origin="bottom center">
        {{ typeLabel.toLocaleUpperCase() }}
      </v-tooltip>
    </b>
    <v-btn icon="edit" @click="modifyQuest" class="mx-2"></v-btn>
    <v-btn
      elevation="2"
      icon="delete"
      @click="deleteQuest"
      color="error"
      variant="text"></v-btn>
  </div>

  <v-dialog v-model="alertQuestionDelete" max-width="600">
    <v-card>
      <v-card-title class="headline">{{$t('questionnary.confirmation')}}</v-card-title>
      <v-card-text>

        {{$t('questionnary.AreSureDeleteQuestion')}}
        <b>" {{ numberLabel }} "</b>
        ?
      </v-card-text>
      <v-card-actions>
        <v-btn @click="alertQuestionDelete = false">{{$t('user.cancel')}}</v-btn>
        <v-btn @click="deleteQuest">{{$t('user.confirm')}}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

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

  .blocklist v-btn {
    margin-left: 20px;
  }
</style>
