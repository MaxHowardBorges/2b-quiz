import { createStore } from 'vuex';
// index.js (fichier principal du store Vuex)

export default createStore({
  state: {
    router: null,
    question: null,
    idSession: null,
  },
  getters: {
    getRouter: (state) => {
      return state.router;
    },

    actualQuestion: (state) => state.question,
    actualSession: (state) => state.idSession,
  },
  mutations: {
    setRouter(state, router) {
      state.router = router;
    },
    setQuestion(state, question) {
      state.question = question;
    },
    setIdSession(state, idSession) {
      state.idSession = idSession;
    },
  },
  actions: {
    /*async fetchQuestion({ commit }) {
      try {
        const response = await fetch(process.env.VUE_APP_API_URL+"/session/question");
        if (!response.ok) {
          throw new Error('Erreur de chargement de la question');
        }
        const question = await response.json();
        commit('setQuestion', question);
      } catch (error) {
        console.error(error);
      }
    },*/

    async createSession({ commit }) {
      try {
        const response = await fetch(
          process.env.VUE_APP_API_URL + '/session/create',
          { method: 'POST' },
        );
        if (!response.ok) {
          throw new Error('Erreur de chargement de la question');
        }
        const idSession = await response.json();
        commit('setIdSession', idSession.id);
        console.log(idSession.id);
      } catch (error) {
        console.error(error);
      }
    },
    async nextQuestion({ commit, getters }) {
      const body = { id: getters.actualSession };
      console.log(JSON.stringify(body));
      console.log(getters.actualSession);
      try {
        const response = await fetch(
          process.env.VUE_APP_API_URL + '/session/nextQuestion',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          },
        );

        console.log(response);
        if (!response.ok) {
          throw new Error('Erreur de chargement de la question');
        }

        const question = await response.json();
        if (Object.entries(question).length === 0) {
          getters.getRouter.push('findesession');
        }
        commit('setQuestion', question);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  },
  modules: {},
});
