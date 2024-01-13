import { Events } from '@/utils/events';
import { defineStore } from 'pinia';
import { useSessionStore } from '@/stores/sessionStore';
import { useUserStore } from '@/stores/userStore';

export const useSessionEventStore = defineStore('sessionEvent', {
  state: () => ({
    eventSource: null,
  }),
  actions: {
    setEventSource(eventSource) {
      this.eventSource = eventSource;
    },
    connectToSSE() {
      //TODO catch error if SSE fails
      const sessionStore = useSessionStore();
      const userStore = useUserStore();
      const url =
        import.meta.env.VITE_API_URL +
        '/event/' +
        sessionStore.idSession +
        '/student?token=' +
        userStore.token;
      const eventSource = new EventSource(url);

      this.setEventSource(eventSource);
      this.listenToEvents();
    },
    listenToEvents() {
      const eventSource = this.eventSource;
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
      const sessionStore = useSessionStore();
      await sessionStore.getQuestions();
    },
    loadEnd() {
      const sessionStore = useSessionStore();
      sessionStore.setEnded(true);
      this.eventSource.close();
    },
    socketDisconnect() {
      this.eventSource.close();
    },
  },
});
