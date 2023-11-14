import { defineStore } from 'pinia';
import {
  createQuestionnary,
  getQuestionnary,
  addQuestion
} from '@/api/questionnary';

export const useQuestionnaryStore = defineStore('questionnary', {
  state: () => ({
    idQuestionnary : null,
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
    setQuestionnary(questionnary) {
      this.questionnary = questionnary;
    },
    isCreated(){
      return this.idQuestionnary != null;
    },
    async createQuestionnary(questionnary) {
      const body = {
        body: questionnary
      };
      try {
        const response = await createQuestionnary(body);

        if (!response.ok || response.status !== 204) {
          throw new Error('Erreur de réponse'); // TODO manage error
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
        const body = {
          question: question
        };
        try {
          const response = await addQuestion(body, this.idQuestionnary);

          if (!response.ok || response.status !== 204) {
            throw new Error('Erreur de réponse'); // TODO manage error
          }
        } catch (error) {
          console.error(error);
        }
      }
    },
  },
});
