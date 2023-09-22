import { createStore, mapActions } from 'vuex';
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
    async getQuestion({ commit }) {
      try {
        const requestBody = '{"id":'+JSON.stringify(this.state.idSession)+'}';
        console.log(requestBody);
        const response = await fetch(process.env.VUE_APP_API_URL + "/session/currentQuestion",{method:"POST",
          headers: {
            "Content-Type": "application/json", // Indiquez que vous envoyez du JSON
          },
          body: requestBody, // Utilisez le corps de la requête JSON que vous avez créé
        });
        console.log(requestBody);
        if (!response.ok) {
          throw new Error('Erreur de chargement de la question');
        }
        const actualQuestion = await response.json();
        commit('setQuestion', actualQuestion);
        console.log(actualQuestion);
      } catch (error) {
        console.error(error);
      }
    },
    ...mapActions(['nextQuestion']),
    async nextQuestion({ commit }, id) {
      const body = { id: id };
      console.log(JSON.stringify(body));
      console.log(id);
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

        const success = await response.json();

        commit('setQuestion', success);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  },
  modules: {
  }
})
