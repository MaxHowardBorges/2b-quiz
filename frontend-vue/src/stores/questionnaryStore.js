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
import { useUserStore } from '@/stores/userStore';

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
    async getQuestionnariesFromUser() {
      //TODO get user id
      this.questionnaryList = [];
      try {
        const userStore = useUserStore();
        const response = await getQuestionnariesFromUser(userStore.token);
        if (!response.ok || response.status !== 200) {
          throw new Error('Erreur de réponse'); // TODO manage error
        }
        for (const q of JSON.parse(await response.text())) {
          this.questionnaryList.push(q);
        }
        userStore.updateToken(response.headers.get('Authorization'));
      } catch (error) {
        console.error(error);
      }
    },
    async createQuestionnary(questionnary) {
      try {
        const userStore = useUserStore();
        const response = await createQuestionnary(
          questionnary,
          userStore.token,
        );
        if (!response.ok || response.status !== 201) {
          throw new Error('Erreur de réponse'); // TODO manage error
        }
        userStore.updateToken(response.headers.get('Authorization'));
        this.idQuestionnary = JSON.parse(await response.text()).id;
        await this.getQuestionnary();
      } catch (error) {
        console.error(error);
      }
    },
    async getQuestionnary() {
      if (this.isCreated) {
        try {
          const userStore = useUserStore();
          const response = await getQuestionnary(
            this.idQuestionnary,
            userStore.token,
          );
          if (!response.ok || response.status !== 200) {
            throw new Error('Erreur de réponse'); // TODO manage error
          }
          userStore.updateToken(response.headers.get('Authorization'));
          this.questionnary = JSON.parse(await response.text());
        } catch (error) {
          console.error(error);
        }
      }
    },
    async getQuestions() {
      this.questions = [];
      try {
        const userStore = useUserStore();
        const response = await getQuestionsFromQuestionnary(
          this.idQuestionnary,
          userStore.token,
        );
        if (!response.ok || response.status !== 200) {
          throw new Error('Erreur de réponse'); // TODO manage error
        }
        userStore.updateToken(response.headers.get('Authorization'));
        for (const q of JSON.parse(await response.text())) {
          this.questions.push(q);
        }
      } catch (error) {
        console.error(error);
      }
    },
    async getAnswers(idQuestion) {
      if (this.isCreated) {
        this.answers = [];
        try {
          const userStore = useUserStore();
          const response = await getAnswersFromQuestion(
            idQuestion,
            userStore.token,
          );
          if (!response.ok || response.status !== 200) {
            throw new Error('Erreur de réponse'); // TODO manage error in component
          }
          userStore.updateToken(response.headers.get('Authorization'));
          for (const a of JSON.parse(await response.text())) {
            this.answers.push(a);
          }
        } catch (error) {
          console.error(error);
        }
      }
    },
    async addQuestion(question) {
      if (this.isCreated) {
        try {
          const userStore = useUserStore();
          const response = await addQuestion(
            question,
            this.idQuestionnary,
            userStore.token,
          );
          if (!response.ok || response.status !== 201) {
            throw new Error('Erreur de réponse'); // TODO manage error
          }
          userStore.updateToken(response.headers.get('Authorization'));
          await this.getQuestions();
        } catch (error) {
          console.error(error);
        }
      }
    },
    async modifyQuestion(idQuestion, question) {
      if (this.isCreated) {
        try {
          const userStore = useUserStore();
          const response = await modifyQuestion(
            this.idQuestionnary,
            idQuestion,
            question,
            userStore.token,
          );
          if (!response.ok || response.status !== 200) {
            throw new Error('Erreur de réponse'); // TODO manage error
          }
          userStore.updateToken(response.headers.get('Authorization'));
          await this.getQuestions();
        } catch (error) {
          console.error(error);
        }
      }
    },
    async modifyQuestionnary(questionnaryName) {
      if (this.isCreated) {
        try {
          const userStore = useUserStore();
          const response = await modifyQuestionnary(
            this.idQuestionnary,
            questionnaryName,
            userStore.token,
          );
          if (!response.ok || response.status !== 200) {
            throw new Error('Erreur de réponse'); // TODO manage error
          }
          userStore.updateToken(response.headers.get('Authorization'));
          await this.getQuestionnary();
        } catch (error) {
          console.error(error);
        }
      }
    },
    async deleteQuestion(idQuestion) {
      if (this.isCreated) {
        try {
          const userStore = useUserStore();
          const response = await deleteQuestion(
            this.idQuestionnary,
            idQuestion,
            userStore.token,
          );
          if (!response.ok || response.status !== 200) {
            throw new Error('Erreur de réponse'); // TODO manage error
          }
          userStore.updateToken(response.headers.get('Authorization'));
          await this.getQuestions();
        } catch (error) {
          console.error(error);
        }
      }
    },
    async deleteQuestionnary(idQuestionnary) {
      try {
        const userStore = useUserStore();
        const response = await deleteQuestionnary(
          idQuestionnary,
          userStore.token,
        );
        if (!response.ok || response.status !== 200) {
          throw new Error('Erreur de réponse'); // TODO manage error
        }
        userStore.updateToken(response.headers.get('Authorization'));
        this.questionnaryList = [];
        await this.getQuestionnariesFromUser(); //TODO get user id
      } catch (error) {
        console.error(error);
      }
    },
  },
});
