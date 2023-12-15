import { defineStore } from 'pinia';
import {
  createQuestionnary,
  getQuestionnary,
  addQuestion,
  modifyQuestion,
  deleteQuestion,
  deleteQuestionnary,
  modifyQuestionnary,
  getQuestionnariesFromUser,
  getQuestionsFromQuestionnary,
} from '@/api/questionnary';
import { getAnswersFromQuestion } from '@/api/question';

export const useQuestionnaryStore = defineStore('questionnary', {
  state: () => ({
    idQuestionnary: null,
    questionnary: null,
    questionnaryList: [],
    questions: [],
    answers: [],
  }),
  getters: {
    isCreated() {
      return this.idQuestionnary != null;
    },
  },
  actions: {
    async getQuestionnariesFromUser(idUser = 0) {
      //TODO get user id
      this.questionnaryList = [];
      try {
        const response = await getQuestionnariesFromUser(idUser);
        if (!response.ok || response.status !== 200) {
          throw new Error('Erreur de réponse'); // TODO manage error
        } else {
          for (const q of JSON.parse(await response.text())) {
            this.questionnaryList.push(q);
          }
        }
      } catch (error) {
        console.error(error);
      }
    },
    async createQuestionnary(questionnary) {
      try {
        const response = await createQuestionnary(questionnary);
        if (!response.ok || response.status !== 201) {
          throw new Error('Erreur de réponse'); // TODO manage error
        } else {
          this.idQuestionnary = JSON.parse(await response.text()).id;
          await this.getQuestionnary();
        }
      } catch (error) {
        console.error(error);
      }
    },
    async getQuestionnary() {
      if (this.isCreated) {
        try {
          const response = await getQuestionnary(this.idQuestionnary);
          if (!response.ok || response.status !== 200) {
            throw new Error('Erreur de réponse'); // TODO manage error
          } else {
            this.questionnary = JSON.parse(await response.text());
          }
        } catch (error) {
          console.error(error);
        }
      }
    },
    async getQuestions() {
      this.questions = [];
      try {
        const response = await getQuestionsFromQuestionnary(
          this.idQuestionnary,
        );
        if (!response.ok || response.status !== 200) {
          throw new Error('Erreur de réponse'); // TODO manage error
        } else {
          for (const q of JSON.parse(await response.text())) {
            this.questions.push(q);
          }
        }
      } catch (error) {
        console.error(error);
      }
    },
    async getAnswers(idQuestion) {
      if (this.isCreated) {
        this.answers = [];
        try {
          const response = await getAnswersFromQuestion(idQuestion);
          if (!response.ok || response.status !== 200) {
            throw new Error('Erreur de réponse'); // TODO manage error
          } else {
            for (const a of JSON.parse(await response.text())) {
              this.answers.push(a);
            }
          }
        } catch (error) {
          console.error(error);
        }
      }
    },
    async addQuestion(question) {
      if (this.isCreated) {
        try {
          const response = await addQuestion(question, this.idQuestionnary);
          if (!response.ok || response.status !== 201) {
            throw new Error('Erreur de réponse'); // TODO manage error
          } else {
            await this.getQuestions();
          }
        } catch (error) {
          console.error(error);
        }
      }
    },
    async modifyQuestion(idQuestion, question) {
      if (this.isCreated) {
        try {
          const response = await modifyQuestion(
            this.idQuestionnary,
            idQuestion,
            question,
          );
          if (!response.ok || response.status !== 200) {
            throw new Error('Erreur de réponse'); // TODO manage error
          } else {
            await this.getQuestions();
          }
        } catch (error) {
          console.error(error);
        }
      }
    },
    async modifyQuestionnary(questionnaryName) {
      if (this.isCreated) {
        try {
          const response = await modifyQuestionnary(
            this.idQuestionnary,
            questionnaryName,
            //author,
          );
          if (!response.ok || response.status !== 200) {
            throw new Error('Erreur de réponse'); // TODO manage error
          } else {
            await this.getQuestionnary();
          }
        } catch (error) {
          console.error(error);
        }
      }
    },
    async deleteQuestion(idQuestion) {
      if (this.isCreated) {
        try {
          const response = await deleteQuestion(
            this.idQuestionnary,
            idQuestion,
          );
          if (!response.ok || response.status !== 200) {
            throw new Error('Erreur de réponse'); // TODO manage error
          } else {
            await this.getQuestions();
          }
        } catch (error) {
          console.error(error);
        }
      }
    },
    async deleteQuestionnary(idQuestionnary) {
      try {
        const response = await deleteQuestionnary(idQuestionnary);
        if (!response.ok || response.status !== 200) {
          throw new Error('Erreur de réponse'); // TODO manage error
        } else {
          this.questionnaryList = [];
          await this.getQuestionnariesFromUser(); //TODO get user id
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
});
