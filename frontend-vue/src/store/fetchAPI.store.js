export const fetchAPIModule = {
  state: {
    reponseList: null,
  },
  getters: {
    getQuestion: (state) => {
      return state.reponseList;
    },
  },
  mutations: {
    setQuestion(state, question) {
      state.reponseList = question;
    },
  },
  actions: {
    async joinSession({ commit, dispatch }, body) {
      const response = await fetch(
        import.meta.env.VITE_API_URL + '/session/join',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        },
      );

      if (!response.ok || response.status !== 204) {
        throw new Error('Erreur de chargement de la question');
      }

      commit('setIdSession', body.idSession);
      dispatch('connectToSSE');
      commit('setUsername', body.username);
    },
    async getQuestions({ commit, getters }) {
      const body = { idSession: getters.getIdSession };
      console.log(JSON.stringify(body));
      console.log(getters.getIdSession);
      try {
        const response = await fetch(
          import.meta.env.VITE_API_URL + '/session/question/current',
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
          throw new Error('Erreur de chargement de la question'); // TODO manage error
        }

        const question = await response.json();
        console.log(question);
        commit('setQuestion', question);
      } catch (error) {
        console.error(error);
      }
    },
    async sendAnswer({ getters }, idAnswer) {
      const body = {
        idSession: getters.getIdSession,
        answer: idAnswer,
        username: getters.getUsername,
      };
      console.log(JSON.stringify(body));
      try {
        const response = await fetch(
          import.meta.env.VITE_API_URL + '/session/respond',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          },
        );

        if (!response.ok || response.status !== 204) {
          throw new Error('Erreur de réponse'); // TODO manage error
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
};
