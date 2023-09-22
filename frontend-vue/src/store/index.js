import { createStore } from 'vuex';

export default createStore({
  state: {
    success: null,
    rechercheSession: null,
    reponseList: null,
    idSession: null,
  },
  getters: {
    getSuccess: (state) => {
      return state.success;
    },
    getQuestion: (state) => {
      return state.reponseList;
    },
    getIdSession: (state) => {
      return state.idSession;
    },
  },
  mutations: {
    setSuccess(state, success) {
      state.success = success;
    },
    setQuestion(state, question) {
      state.reponseList = question;
    },
    setIdSession(state, idSession) {
      state.idSession = idSession;
    },
  },
  actions: {
    async joinSession({ commit }, id) {
      const body = { id: id };
      try {
        const response = await fetch(
          process.env.VUE_APP_API_URL + '/session/join',
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

        const success = await response.json();

        commit('setSuccess', success);
        commit('setIdSession', id);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    async getQuestions({ commit }, id) {
      const body = { id: id };
      console.log(JSON.stringify(body));
      console.log(id);
      try {
        const response = await fetch(
          process.env.VUE_APP_API_URL + '/session/question/current',
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
        console.log(question);
        commit('setQuestion', question);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  },
  modules: {},
});
