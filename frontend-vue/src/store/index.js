import { createStore } from 'vuex';
import { socketModule } from '@/store/socketStore';

export default createStore({
  state: {
    router: null,
    success: null,
    reponseList: null,
    idSession: null,
  },
  getters: {
    getRouter: (state) => {
      return state.router;
    },
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
    setRouter(state, router) {
      state.router = router;
    },
    setSuccess(state, success) {
      state.success = success;
    },
    setQuestion(state, question) {
      state.reponseList = question;
    },
    setIdSession(state, idSession) {
      state.idSession = idSession;
    },
    changePage(state, pageLink) {
      state.router.push(pageLink);
    },
  },
  actions: {
    async joinSession({ commit, dispatch }, id) {
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

        dispatch('connectToWebSocket');
        commit('setIdSession', id);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    async getQuestions({ commit, state }) {
      const body = { id: state.idSession };
      console.log(JSON.stringify(body));
      console.log(state.idSession);
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
    async sendAnswer({ getters }, idAnswer) {
      const body = { id: getters.getIdSession, answer: idAnswer };
      console.log(JSON.stringify(body));
      try {
        const response = await fetch(
          process.env.VUE_APP_API_URL + '/session/respond',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          },
        );

        if (!response.ok) {
          throw new Error('Erreur de réponse'); //TODO
        }
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  },
  modules: { socketModule },
});
