import { defineStore } from 'pinia';
import { socketStore } from '@/stores/socket.store';
import { mainStore } from '@/stores/main.store';

export const fetchAPIStore = defineStore('fetchAPI', {
  state: () => ({
    reponseList: null,
  }),
  getters: {},
  actions: {
    async joinSession(body) {
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
      const webSocketStore = socketStore();
      webSocketStore.connectToWebSocket();
      const store = mainStore();
      store.setIdSession(body.idSession);
      store.setUsername(body.username);
    },
    async getQuestions() {
      const store = mainStore();
      const body = { idSession: store.getIdSession };
      console.log(JSON.stringify(body));
      console.log(store.getIdSession);
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
        store.setQuestion(question);
      } catch (error) {
        console.error(error);
      }
    },
    async sendAnswer(idAnswer) {
      const store = mainStore();
      const body = {
        idSession: store.getIdSession,
        answer: idAnswer,
        username: store.getUsername,
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
});
