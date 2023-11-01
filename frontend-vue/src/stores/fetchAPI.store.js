import { defineStore } from 'pinia';
import { mainStore } from '@/stores/main.store';
import { eventSourceStore } from '@/stores/eventSource.store';
import { joinSession } from '@/api/session';

export const fetchAPIStore = defineStore('fetchAPI', {
  actions: {
    async joinSession(body) {
      const response = await joinSession(body);

      console.log(response.body);
      if (!response.ok || response.status !== 204) {
        return (await response.json()).message;
      }
      const eventStore = eventSourceStore();
      const store = mainStore();
      store.setIdSession(body.idSession);
      eventStore.connectToSSE();
      store.setUsername(body.username);
      return true;
    },

    async getQuestions() {
      const store = mainStore();
      const body = { idSession: store.getIdSession };
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
        if (!response.ok) {
          throw new Error('Erreur de chargement de la question'); // TODO manage error
        }
        const question = await response.json();
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
