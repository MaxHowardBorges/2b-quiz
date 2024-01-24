import { defineStore } from 'pinia';
import {
  addToWhitelist,
  createSession,
  getCurrentQuestion,
  getGlobalResults,
  getNextQuestion,
  getResults,
  getSessionDisplaySettings,
  getSessionList,
  getSessionResultSettings,
  getSessionStatus,
  joinSession,
  sendAnswer,
  setSessionResultSettings,
  setSessionSettings,
  startEndingSession,
  stopSession,
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
    isHost: false,
    isParticipant: false,
    status: { settings: null, nbJoined: null, nbAnswered: null },
    settings: null,
    whitelist: [],
    whitelistGroups: [],
    displaySettings: {
      displayQuestion: true,
      displayAnswer: true,
    },
  }),
  getters: {
    isInSession: (state) => state.idSession !== null && !state.ended,
  },
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
    async joinSession(idSession) {
      const userStore = useUserStore();
      userStore.reloadState();
      this.setEnded(false);
      const response = await joinSession(idSession, userStore.getToken());
      await throwIfNotOK(response, 201);
      userStore.updateToken(response.headers.get('Authorization'));
      const content = await response.json();
      this.isParticipant = true;
      console.log(content.isStarted);
      return content.isStarted;
    },
    async getCurrentQuestions() {
      const userStore = useUserStore();
      userStore.reloadState();
      const response = await getCurrentQuestion(
        this.idSession,
        userStore.getToken(),
      );
      await throwIfNotOK(response);
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
    async createSession(
      settings,
      selectedUsersId = null,
      selectedGroupsId = null,
    ) {
      this.setEnded(false);
      //this.setIsDisplay(true);
      const userStore = useUserStore();
      userStore.reloadState();
      let body;
      const questionnaryList = [];
      for (const question of this.questionnary) {
        questionnaryList.push(question.id);
      }
      if (selectedUsersId !== null && selectedGroupsId !== null) {
        body = {
          questionnaryList: questionnaryList,
          settings: settings,
          whitelist: selectedUsersId,
          whitelistGroups: selectedGroupsId,
        };
      } else {
        body = { questionnaryList: questionnaryList, settings: settings };
      }
      const response = await createSession(userStore.getToken(), body);
      await throwIfNotOK(response);
      userStore.updateToken(response.headers.get('Authorization'));
      const content = await response.json();
      this.isHost = true;
      this.setIdSession(content.id);
      await this.getSessionStatus();
      this.settings = settings;
      this.whitelist = selectedUsersId;
      this.whitelistGroups = selectedUsersId;
      const sessionEventStore = useSessionEventStore();
      sessionEventStore.connectToSSEHost();
    },
    async setSettings(settings) {
      try {
        const userStore = useUserStore();
        this.settings = settings;
        console.log(settings);
        const response = await setSessionSettings(
          userStore.getToken(),
          this.idSession,
          settings,
        );
        await throwIfNotOK(response, 204);
        userStore.updateToken(response.headers.get('Authorization'));
      } catch (e) {
        this.disconnectFromSession(e.message);
      }
    },
    async addToWhiteList(selectedUsersId) {
      try {
        const userStore = useUserStore();
        const response = await addToWhitelist(
          userStore.getToken(),
          this.idSession,
          {
            whitelist: selectedUsersId,
          },
        );
        await throwIfNotOK(response);
        userStore.updateToken(response.headers.get('Authorization'));
        this.whitelist.concat(selectedUsersId);
      } catch (e) {
        this.disconnectFromSession(e.message);
      }
    },
    async addToWhiteListGroup(selectedGroupsId) {
      //TODO call api
      this.whitelistGroups.concat(selectedGroupsId);
    },
    async nextQuestion() {
      const userStore = useUserStore();
      userStore.reloadState();
      const body = { idSession: this.idSession };
      const response = await getNextQuestion(body, userStore.getToken());
      await throwIfNotOK(response, 201);
      userStore.updateToken(response.headers.get('Authorization'));
      await this.getSessionStatus();
      return await response.json();
    },
    async getCurrentQuestionForTeacher(responseText) {
      if (responseText.isEnded) {
        await this.endSession();
        this.setEnded(true);
        //this.sessionEnd(); //TODO adapt to session result
      } else {
        await this.getCurrentQuestions();
      }
    },
    async endSession() {
      const userStore = useUserStore();
      const response = await startEndingSession(
        this.idSession,
        userStore.token,
      );
      await throwIfNotOK(response);
      userStore.updateToken(response.headers.get('Authorization'));
      this.setTabResult(await response.json());
    },
    //if stop session, delete questionnary compiled
    async stopSession() {
      const userStore = useUserStore();
      console.log(this.idSession);
      const response = await stopSession(this.idSession, userStore.getToken());
      await throwIfNotOK(response);
      userStore.updateToken(response.headers.get('Authorization'));
      this.setTabResult(await response.json());
    },
    async getSessionStatus() {
      const userStore = useUserStore();
      const response = await getSessionStatus(
        userStore.getToken(),
        this.idSession,
      );
      await throwIfNotOK(response);
      userStore.updateToken(response.headers.get('Authorization'));
      this.status = await response.json();
      console.log(this.status);
    },
    disconnectFromSession(error) {
      const sessionEventStore = useSessionEventStore();
      sessionEventStore.socketDisconnect();
      this.setIdSession(null);
      this.setQuestion({ content: '', answers: [], type: '' });
      router.push({ path: '/', query: { sessionError: error } }).then();
    },
    async connectToSessionAsObserver(idSession) {
      this.setIsDisplay(true);
      this.setIdSession(idSession);
      this.setEnded(false);
      const sessionEventStore = useSessionEventStore();
      sessionEventStore.connectToSSEObserver();
      await this.getSessionDisplaySettings();
    },
    async getSessionDisplaySettings() {
      try {
        const userStore = useUserStore();
        const response = await getSessionDisplaySettings(
          userStore.getToken(),
          this.idSession,
        );
        await throwIfNotOK(response);
        userStore.updateToken(response.headers.get('Authorization'));
        this.displaySettings = await response.json();
      } catch (e) {
        this.disconnectFromSession(e.message);
      }
    },
    sessionEnd() {
      this.isParticipant = null;
      this.isHost = null;
      this.settings = null;
      this.setIdSession(null);
    },
    async getResults(idSession) {
      const userStore = useUserStore();
      try {
        const response = await getResults(idSession, userStore.token);
        if (!response.ok) {
          throw new Error('Erreur de chargement de la question'); // TODO manage error
        }
        userStore.updateToken(response.headers.get('Authorization'));
        return await response.json();
      } catch (error) {
        console.error(error);
      }
    },
    async getGlobalResults(idSession) {
      const userStore = useUserStore();
      try {
        const response = await getGlobalResults(idSession, userStore.token);
        if (!response.ok) {
          throw new Error('Erreur de chargement de la question'); // TODO manage error
        }
        userStore.updateToken(response.headers.get('Authorization'));
        return await response.json();
      } catch (error) {
        console.error(error);
      }
    },
    async getSessions() {
      const userStore = useUserStore();
      try {
        const response = await getSessionList(userStore.token);
        if (!response.ok) {
          throw new Error('Erreur de chargement de la question'); // TODO manage error
        }
        userStore.updateToken(response.headers.get('Authorization'));
        return await response.json();
      } catch (error) {
        console.error(error);
      }
    },

    async getSession(idSession) {
      const userStore = useUserStore();
      try {
        const response = await getSessionList(userStore.token);
        if (!response.ok) {
          throw new Error('Erreur de chargement de la question'); // TODO manage error
        }
        userStore.updateToken(response.headers.get('Authorization'));
        return await response.json();
      } catch (error) {
        console.error(error);
      }
    },

    async getSessionResultSettings(idSession) {
      const userStore = useUserStore();
      const response = await getSessionResultSettings(
        userStore.getToken(),
        idSession,
      );
      await throwIfNotOK(response, 200);
      userStore.updateToken(response.headers.get('Authorization'));
      return await response.json();
    },
    async setSessionResultSettings(idSession, body) {
      const userStore = useUserStore();
      const response = await setSessionResultSettings(
        userStore.getToken(),
        idSession,
        body,
      );
      await throwIfNotOK(response, 204);
      userStore.updateToken(response.headers.get('Authorization'));
    },
  },
});
