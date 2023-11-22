import { defineStore } from 'pinia';
import {
  createQuestionnary,
  getQuestionnary,
  addQuestion, modifyQuestion, deleteQuestion,
} from '@/api/questionnary';

export const useQuestionnaryStore = defineStore('questionnary', {
  state: () => ({
    idQuestionnary :null,
    questionnary: null,
  }),
  getters:{
    isCreated(){
      return (this.idQuestionnary != null);
    },
    getQuestion(state){
      return (id) => this.questionnary.questions.find((question) => question.id === id)
    }
  },
  actions: {
    setIdQuestionnary(idQuestionnary) {
      this.idQuestionnary = idQuestionnary;
    },
    async createQuestionnary(questionnary) {
      try {
        const response = await createQuestionnary(questionnary);
        if (!response.ok || response.status !== 201) {
          throw new Error('Erreur de réponse'); // TODO manage error
        }
        else {
          this.idQuestionnary = JSON.parse(await response.text()).id;
        }
      } catch (error) {
        console.error(error);
      }
    },
    async getQuestionnary() {
      if(this.isCreated){
        try {
          const response = await getQuestionnary(this.idQuestionnary);
          if (!response.ok || response.status !== 200) {
            throw new Error('Erreur de réponse'); // TODO manage error
          }
          else {
            this.questionnary = JSON.parse(await response.text());
          }
        } catch (error) {
          console.error(error);
        }
      }
    },
    async addQuestion(question) {
      if(this.isCreated){
        try {
          const response = await addQuestion(question, this.idQuestionnary);
          if (!response.ok || response.status !== 201) {
            throw new Error('Erreur de réponse'); // TODO manage error
          }
          else {
            await this.getQuestionnary();
          }
        } catch (error) {
          console.error(error);
        }
      }
    },
    async modifyQuestion(idQuestion,question) {
      if(this.isCreated){
        try {
          console.log("modify");
          console.log(question);
          const response = await modifyQuestion(this.idQuestionnary, idQuestion, question);
          if (!response.ok || response.status !== 200) {
            throw new Error('Erreur de réponse'); // TODO manage error
          }
          else {
            await this.getQuestionnary();
          }
        } catch (error) {
          console.error(error);
        }
      }
    },
    async deleteQuestion(idQuestion) {
      if(this.isCreated){
        try {
          const response = await deleteQuestion(this.idQuestionnary, idQuestion);
          if (!response.ok || response.status !== 200) {
            throw new Error('Erreur de réponse'); // TODO manage error
          }
          else {
            await this.getQuestionnary();
          }
        } catch (error) {
          console.error(error);
        }
      }
    },
  },
});
