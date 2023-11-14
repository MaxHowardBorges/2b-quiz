import { defineStore } from 'pinia';
import {
  createQuestionnary,
  getQuestionnary,
  addQuestion
} from '@/api/questionnary';

export const useQuestionnaryStore = defineStore('questionnary', {
  state: () => ({
    idQuestionnary :null,
    questionnary: {
      author: null,
      title: '',
      questions: [{
        content: '',
        answers: [{
          content: '',
          isCorrect: false
        }]
      }]
    },



  }),
  actions: {
    setIdQuestionnary(idQuestionnary) {
      this.idQuestionnary = idQuestionnary;
    },
    isCreated(){
      return (this.idQuestionnary != null);
    },
    async createQuestionnary(questionnary) {
      try {
        const response = await createQuestionnary(questionnary);
        if (!response.ok || response.status !== 201) {
          throw new Error('Erreur de réponse'); // TODO manage error
        }
        else {
          return await response.text();
        }
      } catch (error) {
        console.error(error);
      }
    },
    async getQuestionnary() {
      if(this.isCreated()){
        try {
          const response = await getQuestionnary(this.idQuestionnary);
          if (!response.ok || response.status !== 204) {
            throw new Error('Erreur de réponse'); // TODO manage error
          }
        } catch (error) {
          console.error(error);
        }
      }
    },
    async addQuestion(question) {
      if(this.isCreated()){
        try {
          const response = await addQuestion(question, this.idQuestionnary);

          if (!response.ok || response.status !== 201) {
            throw new Error('Erreur de réponse'); // TODO manage error
          }
        } catch (error) {
          console.error(error);
        }
      }
    },
  },
});
