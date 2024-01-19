import { defineStore } from 'pinia';
import {
  createSession,
  getCurrentQuestion,
  getNextQuestion,
  startEndingSession,
  joinSession,
  sendAnswer,
  getResults,
} from '@/api/session';
import { throwIfNotOK } from '@/utils/apiUtils';
import { useSessionEventStore } from '@/stores/sessionEventStore';
import { useUserStore } from '@/stores/userStore';

export const useSessionStore = defineStore('session', {
  state: () => ({
    idSession: null,
    questionnary: [],
    question: { content: '', answers: [], type: '' },
    ended: false,
    results: [],
  }),
  actions: {
    setQuestion(question) {
      this.question = question;
    },
    setIdSession(idSession) {
      this.idSession = idSession;
    },
    setEnded(ended) {
      this.ended = ended;
    },
    setTabResult(results) {
      this.results = results;
    },
    async joinSession(body) {
      const userStore = useUserStore();
      this.setEnded(false);
      const response = await joinSession(body, userStore.token);
      await throwIfNotOK(response, 204);
      userStore.updateToken(response.headers.get('Authorization'));
      this.setIdSession(body.idSession);
      const sessionEventStore = useSessionEventStore();
      sessionEventStore.connectToSSE();
    },
    async getQuestions() {
      const userStore = useUserStore();
      const body = { idSession: this.idSession };
      const response = await getCurrentQuestion(body, userStore.token);
      await throwIfNotOK(response);
      userStore.updateToken(response.headers.get('Authorization'));
      this.setQuestion(await response.json());
    },
    async sendAnswer(idAnswer) {
      const userStore = useUserStore();
      const body = {
        idSession: this.idSession,
        answer: idAnswer,
      };
      const response = await sendAnswer(body, userStore.token);
      await throwIfNotOK(response, 204);
      userStore.updateToken(response.headers.get('Authorization'));
    },
    async createSession() {
      const userStore = useUserStore();
      this.setEnded(false);
      const isResult = true;
      const isGlobal = true;
      const isResponses = true;
      const response = await createSession(userStore.token, {
        ...this.questionnary,
        idsQuestionnarys: this.questionnary,
        isResult,
        isGlobal,
        isResponses,
      });
      await throwIfNotOK(response);
      userStore.updateToken(response.headers.get('Authorization'));
      const content = await response.json();
      this.setIdSession(content.id);
    },
    async nextQuestion() {
      const userStore = useUserStore();
      const body = { idSession: this.idSession };
      const response = await getNextQuestion(body, userStore.token);
      await throwIfNotOK(response);
      userStore.updateToken(response.headers.get('Authorization'));
      if (response.status === 204) {
        await this.endSession();
        this.setEnded(true);
      } else {
        const question = await response.json();
        this.setQuestion(question);
      }
    },
    async endSession() {
      const userStore = useUserStore();
      const response = await startEndingSession(this.idSession, userStore.token);
      await throwIfNotOK(response);
      userStore.updateToken(response.headers.get('Authorization'));
      this.setTabResult(await response.json());
    },
    async getResults() {
      const userStore = useUserStore();
      try {
        const response = await getResults(1, userStore.token);
        console.log(await response.json());
        if (!response.ok) {
          throw new Error('Erreur de chargement de la question'); // TODO manage error
        }
        userStore.updateToken(response.headers.get('Authorization'));
      } catch (error) {
        console.error(error);
      }
    },
  },
});
