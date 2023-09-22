// questionModule.js

const state = {
  currentQuestion: null, // La question actuellement affichée
};

const mutations = {
  SET_CURRENT_QUESTION(state, question) {
    state.currentQuestion = question;
  },
};

const actions = {
  async fetchQuestion({ commit }) {
    try {
      // Effectuez une requête HTTP avec fetch API pour obtenir la question du serveur
      const response = await fetch('URL_DE_VOTRE_API/questions'); // Remplacez par l'URL réelle de votre API
      if (!response.ok) {
        throw new Error('Échec de la récupération de la question.');
      }
      const questionData = await response.json();
      // Utilisez la mutation pour mettre à jour la question dans le store
      commit('SET_CURRENT_QUESTION', questionData);
    } catch (error) {
      console.error('Erreur lors de la récupération de la question:', error);
    }
  },
};

export default {
  state,
  mutations,
  actions,
};
