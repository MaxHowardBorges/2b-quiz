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
import router from '@/router';

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
    setIsDisplay(isDisplay) {
      this.isDisplay = isDisplay;
    },
    setTabResult(results) {
      this.isDisplay = results;
    },
    async joinSession(body) {
      const userStore = useUserStore();
      userStore.reloadState();
      this.setEnded(false);
      const response = await joinSession(body, userStore.getToken());
      await throwIfNotOK(response, 204);
      userStore.updateToken(response.headers.get('Authorization'));
      this.setIdSession(body.idSession);
      const sessionEventStore = useSessionEventStore();
      sessionEventStore.connectToSSEStudent();
    },
    async getCurrentQuestions() {
      const userStore = useUserStore();
      userStore.reloadState();
      const body = { idSession: this.idSession };
      const response = await getCurrentQuestion(body, userStore.getToken());
      if (!response.ok) {
        response.text().then((text) => console.log(text));
        throw new Error('Error on get current question');
      }
      userStore.updateToken(response.headers.get('Authorization'));
      this.setQuestion(await response.json());
    },
    async sendAnswer(idAnswer) {
      const userStore = useUserStore();
      userStore.reloadState();
      const body = {
        idSession: this.idSession,
        answer: idAnswer,
      };
      const response = await sendAnswer(body, userStore.getToken());
      if (!response.ok && response.status !== 408) {
        await throwIfNotOK(response, 204);
        if (response.status === 408) {
          //TODO Show error for late answer
        }
      }
      userStore.updateToken(response.headers.get('Authorization'));
    },
    async createSession() {
      this.setEnded(false);
      //this.setIsDisplay(true);
      const userStore = useUserStore();
      userStore.reloadState();
      const response = await createSession(
        userStore.getToken(),
        this.questionnary,
      );
      await throwIfNotOK(response);
      userStore.updateToken(response.headers.get('Authorization'));
      const content = await response.json();
      this.setIdSession(content.id);
      const sessionEventStore = useSessionEventStore();
      sessionEventStore.connectToSSEHost();
    },
    async nextQuestion() {
      const userStore = useUserStore();
      userStore.reloadState();
      const body = { idSession: this.idSession };
      const response = await getNextQuestion(body, userStore.getToken());
      await throwIfNotOK(response, 201);
      userStore.updateToken(response.headers.get('Authorization'));
      return await response.json();
    },
    async getCurrentQuestionForTeacher(responseText) {
      if (responseText.isEnded) {
        await this.fetchResults();
        this.setEnded(true);
        this.sessionEnd(); //TODO adapt to session result
      } else {
        await this.getCurrentQuestions();
      }
    },
    async fetchResults() {
      const userStore = useUserStore();
      const response = await getSessionResults(
        this.idSession,
        userStore.getToken(),
      );
      await throwIfNotOK(response);
      userStore.updateToken(response.headers.get('Authorization'));
      this.setTabResult(await response.json());
    },
    disconnectFromSession(error) {
      const sessionEventStore = useSessionEventStore();
      sessionEventStore.socketDisconnect();
      this.setIdSession(null);
      this.setQuestion({ content: '', answers: [], type: '' });
      router.push({ path: '/', query: { sessionError: error } }).then();
    },
    connectToSessionAsObserver(idSession) {
      this.setIsDisplay(true);
      this.setIdSession(idSession);
      this.setEnded(false);
      const sessionEventStore = useSessionEventStore();
      sessionEventStore.connectToSSEObserver();
    },
    sessionEnd() {
      this.setIdSession(null);
    },
  },
});
