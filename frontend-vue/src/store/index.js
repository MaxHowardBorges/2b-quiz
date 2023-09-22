import { createStore } from 'vuex'
// index.js (fichier principal du store Vuex)

export default createStore({
  state: {
    question: null,
    idSession: null
  },
  getters: {
    actualQuestion: (state) => state.question,
    actualSession: (state) => state.idSession
  },
  mutations: {
    setQuestion(state, question) {
      state.question = question;
    },
    setIdSession(state, idSession) {
      state.idSession = idSession;
    },
  },
  actions: {
    async fetchQuestion({ commit }) {
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
    },

    async createSession({ commit }) {
      try {
        const response = await fetch(process.env.VUE_APP_API_URL + "/session/create",{method:"POST"});
        if (!response.ok) {
          throw new Error('Erreur de chargement de la question');
        }
        const idSession = await response.json();
        commit('setIdSession', idSession.id);
        console.log(idSession.id);
      } catch (error) {
        console.error(error);
      }
    }
    ,
  },
  modules: {
  }
})
