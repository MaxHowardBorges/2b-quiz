import { defineStore } from 'pinia';
import { getCurrentQuestion, joinSession, sendAnswer } from '@/api/session';
import { throwIfNotOK } from '@/utils/apiUtils';
import { useSessionEventStore } from '@/stores/sessionEventStore';

export const useSessionStore = defineStore('session', {
  state: () => ({
    idSession: String,
    question: null,
    username: String, //TODO move to user
    ended: Boolean,
  }),
  actions: {
    setQuestion(question) {
      this.question = question;
    },
    setIdSession(idSession) {
      this.idSession = idSession;
    },
    setUsername(idSession) {
      this.username = idSession;
    },
    setEnded(ended) {
      this.ended = ended;
    },
    async joinSession(body) {
      const response = await joinSession(body);
      await throwIfNotOK(response, 204);
      this.setIdSession(body.idSession);
      this.setUsername(body.username);
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
        const question = await response.json();
        this.setQuestion(question);
      } catch (error) {
        console.error(error);
      }
    },
    async sendAnswer(idAnswer) {
      const body = {
        idSession: this.idSession,
        answer: idAnswer,
        username: this.username,
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
  },
});
