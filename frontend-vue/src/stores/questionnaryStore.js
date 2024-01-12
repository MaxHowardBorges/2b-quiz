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
  getQuestionsFromUser,
  createTag,
  getTags,
  UpdateTag,
  DeleteTag,
} from '@/api/questionnary';
import { useUserStore } from '@/stores/userStore';
import { getAnswersFromQuestion, getQuestionFromId } from '@/api/question';

export const useQuestionnaryStore = defineStore('questionnary', {
  state: () => ({
    idQuestionnary: null,
    questionnary: null,
    questionnaryList: [],
    questions: [],
    answers: [],
    privateQuestions: [],
    tagList: [],
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
    async getQuestionsFromUser(idUser = 0) {
      //TODO get user id
      this.privateQuestions = [];
      try {
        const response = await getQuestionsFromUser(idUser);
        if (!response.ok || response.status !== 200) {
          throw new Error('Erreur de réponse'); // TODO manage error
        } else {
          for (const q of JSON.parse(await response.text())) {
            this.privateQuestions.push(q);
          }
        }
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
    async getQuestion(idQuestion) {
      this.answers = [];
      try {
        const response = await getQuestionFromId(idQuestion);
        if (!response.ok || response.status !== 200) {
          throw new Error('Erreur de réponse'); // TODO manage error
        } else {
          return JSON.parse(await response.text());
        }
      } catch (error) {
        console.error(error);
      }
    },
    async getAnswers(idQuestion) {
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
    },
    async addQuestion(question) {
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
    },
    async modifyQuestion(idQuestion, question) {
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
    async getTags(id) {
      this.tagList = [];
      try {
        const response = await getTags(id);
        if (!response.ok || response.status !== 200) {
          throw new Error('Erreur de réponse'); // TODO manage error
        } else {
          for (const t of JSON.parse(await response.text())) {
            this.tagList.push(t);
          }
        }
      } catch (error) {
        console.error(error);
      }
    },
    async createTag(tag) {
      try {
        const response = await createTag(tag);
        if (!response.ok || response.status !== 201) {
          throw new Error('Erreur de réponse'); // TODO manage error
        } else {
          await this.getTags(tag.author);
        }
      } catch (error) {
        console.error(error);
      }
    },
    async UpdateTag(tag) {
      try {
        const response = await UpdateTag(tag);
        if (!response.ok || response.status !== 200) {
          throw new Error('Erreur de réponse'); // TODO manage error
        } else {
          await this.getTags(tag.author);
        }
      } catch (error) {
        console.error(error);
      }
    },
    async DeleteTag(tag) {
      try {
        const response = await DeleteTag(tag.id);
        if (!response.ok || response.status !== 200) {
          throw new Error('Erreur de réponse'); // TODO manage error
        } else {
          await this.getTags(tag.author);
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
});
