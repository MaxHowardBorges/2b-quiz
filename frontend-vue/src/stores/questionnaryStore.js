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
          this.idQuestionnary = JSON.parse(await response.text()).id;
          console.log("create");
          console.log(this.idQuestionnary);
        }
      } catch (error) {
        console.error(error);
      }
    },
    async getQuestionnary() {
      if(this.isCreated()){
        try {
          const response = await getQuestionnary(this.idQuestionnary);
          if (!response.ok || response.status !== 200) {
            throw new Error('Erreur de réponse'); // TODO manage error
          }
          else {
            this.questionnary = JSON.parse(await response.text());
            console.log("get");
            console.log(this.questionnary);
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
    async modifyQuestion(idQuestion, question) {
      if(this.isCreated()){
        try {
          const response = await modifyQuestion(this.idQuestionnary, idQuestion, question);
          console.log(response.status);
          if (!response.ok || response.status !== 201) {
            throw new Error('Erreur de réponse'); // TODO manage error
          }
          else {
            console.log("modify");
            console.log(response.text());
          }
        } catch (error) {
          console.error(error);
        }
      }
    },
    async deleteQuestion(idQuestion) {
      if(this.isCreated()){
        try {
          console.log(this.idQuestionnary + " <|°_°|> " + idQuestion);
          const response = await deleteQuestion(this.idQuestionnary, idQuestion);
          console.log(response.status);
          if (!response.ok || response.status !== 200) {
            throw new Error('Erreur de réponse'); // TODO manage error
          }
          else {
            console.log("delete");
            console.log(response.text());
          }
        } catch (error) {
          console.error(error);
        }
      }
    },
  },
});
