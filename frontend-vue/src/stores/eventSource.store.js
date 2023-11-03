import { Events } from '@/utils/events';
import { mainStore } from '@/stores/main.store';
import { fetchAPIStore } from '@/stores/fetchAPI.store';
import { defineStore } from 'pinia';

export const eventSourceStore = defineStore('eventSource', {
  state: () => ({
    eventSource: null,
  }),
  getters: {
    getEventSource: (state) => {
      return state.eventSource;
    },
  },
  actions: {
    setEventSource(eventSource) {
      this.eventSource = eventSource;
    },
    connectToSSE() {
      const store = mainStore();
      console.log('attempt to connect to ' + import.meta.env.VITE_API_URL);
      const eventSource = new EventSource(
        import.meta.env.VITE_API_URL + '/event/' + store.getIdSession,
      );
      console.log('connected to ' + import.meta.env.VITE_API_URL);
      this.setEventSource(eventSource);
      this.listenToEvents();
    },
    listenToEvents() {
      const eventSource = this.getEventSource;
      if (eventSource) {
        eventSource.onmessage = async (message) => {
          switch (message.data) {
            case Events.NEXT_QUESTION:
              await this.loadNextQuestion();
              break;
            case Events.END_SESSION:
              this.loadEnd();
              break;
            default:
              console.error('not used data ' + message.data);
              break;
          }
        };
      }
    },
    async loadNextQuestion() {
      const storeAPI = fetchAPIStore();
      const store = mainStore();
      await storeAPI.getQuestions();
      store.changePage('/answer');
    },
    loadEnd() {
      const store = mainStore();
      const eventSource = this.getEventSource;
      eventSource.close();
      store.changePage('/end');
    },
    socketDisconnect() {
      const store = mainStore();
      const eventSource = this.getEventSource;
      eventSource.close();
      store.changePage('/');
    },
  },
});
