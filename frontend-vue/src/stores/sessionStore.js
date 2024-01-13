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
    isDisplay: false,
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
    setIsDisplay(oui) {
      this.start = oui;
    },
    setTabResult(results) {
      this.isDisplay = results;
    },
    async joinSession(body) {
      const userStore = useUserStore();
      userStore.reloadState();
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
      userStore.reloadState();
      const body = { idSession: this.idSession };
      try {
        const response = await getCurrentQuestion(body, userStore.token);
        if (!response.ok) {
          response.text().then((text) => console.log(text));
          throw new Error('Erreur de chargement de la question'); // TODO manage error
        }
        userStore.updateToken(response.headers.get('Authorization'));
        this.setQuestion(await response.json());
      } catch (error) {
        console.error(error);
      }
    },
    async sendAnswer(idAnswer) {
      const userStore = useUserStore();
      userStore.reloadState();
      const body = {
        idSession: this.idSession,
        answer: idAnswer,
      };
      try {
        const response = await sendAnswer(body, userStore.token);

        if (!response.ok || response.status !== 204) {
          throw new Error('Erreur de réponse:' + (await response.text())); // TODO manage error
        }
        userStore.updateToken(response.headers.get('Authorization'));
      } catch (error) {
        console.error(error);
      }
    },
    async createSession() {
      this.setEnded(false);
      //this.setIsDisplay(true);
      const userStore = useUserStore();
      userStore.reloadState();
      const response = await createSession(userStore.token, this.questionnary);
      await throwIfNotOK(response);
      userStore.updateToken(response.headers.get('Authorization'));
      const content = await response.json();
      this.setIdSession(content.id);
    },
    async nextQuestion() {
      const userStore = useUserStore();
      userStore.reloadState();
      const body = { idSession: this.idSession };
      try {
        console.log(body, userStore.token);
        const response = await getNextQuestion(body, userStore.token);
        console.log(response);
        if (!response.ok) {
          console.log(await response.text());
          throw new Error('Erreur de chargement de la question'); // TODO manage error
        }
        userStore.updateToken(response.headers.get('Authorization'));
        if (response.status === 204) {
          await this.fetchResults();
          this.setEnded(true);
        } else {
          const question = await response.json();
          this.setQuestion(question);
        }
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    async fetchResults() {
      const userStore = useUserStore();
      userStore.reloadState();
      try {
        const response = await getSessionResults(
          this.idSession,
          userStore.token,
        );
        if (!response.ok) {
          throw new Error('Erreur de chargement de la question'); // TODO manage error
        }
        userStore.updateToken(response.headers.get('Authorization'));
        this.setTabResult(await response.json());
      } catch (error) {
        console.error(error);
      }
    },
  },
});
