import { defineStore } from 'pinia';

export const mainStore = defineStore('main', {
  state: () => ({
    router: null,
    question: null,
    idSession: null,
    success: null,
    username: null,
    tabResult: null,
  }),
  getters: {
    getQuestion: (state) => {
      return state.question;
    },
    getRouter: (state) => {
      return state.router;
    },
    getSuccess: (state) => {
      return state.success;
    },
    getIdSession: (state) => {
      return state.idSession;
    },
    getUsername: (state) => {
      return state.username;
    },
    getTabResult: (state) => {
      return state.tabResult;
    },
  },
  actions: {
    setRouter(router) {
      this.router = router;
    },
    setQuestion(question) {
      this.question = question;
    },
    setIdSession(idSession) {
      this.idSession = idSession;
    },
    setSuccess(success) {
      this.success = success;
    },
    setUsername(idSession) {
      this.username = idSession;
    },
    changePage(pageLink) {
      this.router.push(pageLink);
    },
    setTabResult(tabResult) {
      this.tabResult = tabResult;
    },
    async createSession() {
      try {
        const response = await fetch(
          import.meta.env.VITE_API_URL + '/session/create',
          { method: 'POST' },
        );
        if (!response.ok) {
          throw new Error('Erreur de chargement de la question');
        }
        const idSession = await response.json();
        this.setIdSession(idSession.id);
      } catch (error) {
        console.error(error);
      }
    },

    async nextQuestion() {
      const body = { id: this.getIdSession };
      try {
        const response = await fetch(
          import.meta.env.VITE_API_URL + '/session/nextQuestion',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          },
        );

        if (!response.ok) {
          throw new Error('Erreur de chargement de la question');
        }

        const question = await response.json();
        if (Object.entries(question).length === 0) {
          this.getRouter.push('end-of-session');
        }
        this.setQuestion(question);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    async getResults() {
      const body = { id: this.getIdSession };
      try {
        const response = await fetch(
          import.meta.env.VITE_API_URL + '/session/getMap?idsession=' + body.id,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
        if (!response.ok) {
          throw new Error('Erreur de chargement de la question');
        }
        const tabResult = await response.json();
        this.setTabResult(tabResult);
      } catch (error) {
        console.error(error);
      }
    },
  },
});
