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
import { useUserStore } from '@/stores/userStore';
import {
  getAnswersFromQuestion,
  getQuestionFromId,
  getQuestionsFromUser,
  createTag,
  getTags,
  updateTag,
  deleteTag,
} from '@/api/question';
import { throwIfNotOK } from '@/utils/apiUtils';

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
      this.questionnaryList = [];
      const userStore = useUserStore();
      const response = await getQuestionnariesFromUser(userStore.token);
      await throwIfNotOK(response, 200);
      userStore.updateToken(response.headers.get('Authorization'));
      for (const q of await response.json()) {
        this.questionnaryList.push(q);
      }
    },
    async getQuestionsFromUser() {
      this.privateQuestions = [];
      const userStore = useUserStore();
      const response = await getQuestionsFromUser(userStore.token);
      await throwIfNotOK(response, 200);
      userStore.updateToken(response.headers.get('Authorization'));
      for (const q of await response.json()) {
        this.privateQuestions.push(q);
      }
    },
    async createQuestionnary(questionnary) {
      const userStore = useUserStore();
      const response = await createQuestionnary(questionnary, userStore.token);
      await throwIfNotOK(response, 201);
      userStore.updateToken(response.headers.get('Authorization'));
      this.idQuestionnary = await response.json().id;
      await this.getQuestionnary();
    },
    async getQuestionnary() {
      if (this.isCreated) {
        const userStore = useUserStore();
        const response = await getQuestionnary(
          this.idQuestionnary,
          userStore.token,
        );
        await throwIfNotOK(response, 200);
        userStore.updateToken(response.headers.get('Authorization'));
        this.questionnary = await response.json();
      }
    },
    async getQuestions() {
      this.questions = [];
      const userStore = useUserStore();
      const response = await getQuestionsFromQuestionnary(
        this.idQuestionnary,
        userStore.token,
      );
      await throwIfNotOK(response, 200);
      userStore.updateToken(response.headers.get('Authorization'));
      for (const q of await response.json()) {
        this.questions.push(q);
      }
    },
    async getQuestion(idQuestion) {
      this.answers = [];
      const userStore = useUserStore();
      const response = await getQuestionFromId(idQuestion, userStore.token);
      await throwIfNotOK(response, 200);
      userStore.updateToken(response.headers.get('Authorization'));
      return await response.json();
    },
    async getAnswers(idQuestion) {
      this.answers = [];
      const userStore = useUserStore();
      const response = await getAnswersFromQuestion(
        idQuestion,
        userStore.token,
      );
      await throwIfNotOK(response, 200);
      userStore.updateToken(response.headers.get('Authorization'));
      for (const a of await response.json()) {
        this.answers.push(a);
      }
    },
    async addQuestion(question) {
      const userStore = useUserStore();
      const response = await addQuestion(
        question,
        this.idQuestionnary,
        userStore.token,
      );
      await throwIfNotOK(response, 201);
      userStore.updateToken(response.headers.get('Authorization'));
      await this.getQuestions();
    },
    async modifyQuestion(idQuestion, question) {
      const userStore = useUserStore();
      const response = await modifyQuestion(
        this.idQuestionnary,
        idQuestion,
        question,
        userStore.token,
      );
      await throwIfNotOK(response, 200);
      userStore.updateToken(response.headers.get('Authorization'));
      await this.getQuestions();
    },
    async modifyQuestionnary(questionnaryName) {
      if (this.isCreated) {
        const userStore = useUserStore();
        const response = await modifyQuestionnary(
          this.idQuestionnary,
          questionnaryName,
          userStore.token,
        );
        await throwIfNotOK(response, 200);
        userStore.updateToken(response.headers.get('Authorization'));
        await this.getQuestionnary();
      }
    },
    async deleteQuestion(idQuestion) {
      if (this.isCreated) {
        const userStore = useUserStore();
        const response = await deleteQuestion(
          this.idQuestionnary,
          idQuestion,
          userStore.token,
        );
        await throwIfNotOK(response, 200);
        userStore.updateToken(response.headers.get('Authorization'));
        await this.getQuestions();
      }
    },
    async deleteQuestionnary(idQuestionnary) {
      const userStore = useUserStore();
      const response = await deleteQuestionnary(
        idQuestionnary,
        userStore.token,
      );
      await throwIfNotOK(response, 200);
      userStore.updateToken(response.headers.get('Authorization'));
      this.questionnaryList = [];
      await this.getQuestionnariesFromUser();
    },
    async getTags() {
      this.tagList = [];
      const userStore = useUserStore();
      const response = await getTags(userStore.token);
      await throwIfNotOK(response, 200);
      userStore.updateToken(response.headers.get('Authorization'));
      this.tagList = await response.json();
    },
    async createTag(tag) {
      const userStore = useUserStore();
      const response = await createTag(tag, userStore.token);
      await throwIfNotOK(response, 201);
      userStore.updateToken(response.headers.get('Authorization'));
      await this.getTags();
    },
    async updateTag(tag) {
      const userStore = useUserStore();
      const response = await updateTag(tag, userStore.token);
      await throwIfNotOK(response, 200);
      userStore.updateToken(response.headers.get('Authorization'));
      await this.getTags();
    },
    async deleteTag(tag) {
      const userStore = useUserStore();
      const response = await deleteTag(tag, userStore.token);
      await throwIfNotOK(response, 200);
      userStore.updateToken(response.headers.get('Authorization'));
      await this.getTags();
    },
  },
});
