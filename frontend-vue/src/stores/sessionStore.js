import { defineStore } from 'pinia';
import {
  createSession,
  getCurrentQuestion,
  getNextQuestion,
  getSessionResults,
  joinSession,
  sendAnswer,
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
    start: false,
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
    setStart(oui){
      this.start = true;
    },
    setTabResult(results) {
      this.results = results;
    },
    async joinSession(body) {
      this.setEnded(false);
      const response = await joinSession(body);
      await throwIfNotOK(response, 204);
      this.setIdSession(body.idSession);
      const userStore = useUserStore();
      userStore.setUsername(body.username);
      const sessionEventStore = useSessionEventStore();
      sessionEventStore.connectToSSE();
    },
    async getQuestions() {
      const body = { idSession: this.idSession };
      try {
        const response = await getCurrentQuestion(body);
        if (!response.ok) {
          throw new Error('Erreur de chargement de la question'); // TODO manage error
        }
        this.setQuestion(await response.json());
      } catch (error) {
        console.error(error);
      }
    },
    async sendAnswer(idAnswer) {
      const userStore = useUserStore();
      const body = {
        idSession: this.idSession,
        answer: idAnswer,
        username: userStore.username,
      };
      try {
        const response = await sendAnswer(body);

        if (!response.ok || response.status !== 204) {
          throw new Error('Erreur de réponse'); // TODO manage error
        }
      } catch (error) {
        console.error(error);
      }
    },
    async createSession() {
      this.setEnded(false);
      this.setStart(true);
      const response = await createSession(this.questionnary);
      await throwIfNotOK(response);
      const content = await response.json();
      this.setIdSession(content.id);
    },
    async nextQuestion() {
      const body = { idSession: this.idSession };
      try {
        const response = await getNextQuestion(body);
        if (!response.ok) {
          throw new Error('Erreur de chargement de la question'); // TODO manage error
        }
        const question = await response.json();
        if (Object.entries(question).length === 0) {
          await this.fetchResults();
          this.setEnded(true);
        } else this.setQuestion(question);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    async fetchResults() {
      try {
        const response = await getSessionResults(this.idSession);
        if (!response.ok) {
          throw new Error('Erreur de chargement de la question'); // TODO manage error
        }
        this.setTabResult(await response.json());
      } catch (error) {
        console.error(error);
      }
    },
  },
});
