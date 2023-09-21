import { createStore } from 'vuex'
// index.js (fichier principal du store Vuex)

export default createStore({
  state: {
    question: null,
  },
  getters: {
  },
  mutations: {
    setQuestion(state, question) {
      state.question = question;
    },
  },
  actions: {
    async fetchQuestion({ commit }) {
      try {
        const response = await fetch('https://localhost:8080');
        if (!response.ok) {
          throw new Error('Erreur de chargement de la question');
        }
        const question = await response.json();
        commit('setQuestion', question);
      } catch (error) {
        console.error(error);
      }
    },
  },
  modules: {
  }
})
