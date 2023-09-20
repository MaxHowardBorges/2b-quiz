import { createStore } from 'vuex'
// index.js (fichier principal du store Vuex)
import questionModule from './questionModule';

export default createStore({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    question: questionModule, // Enregistrez le module sous un espace de noms "question"
  }
})
