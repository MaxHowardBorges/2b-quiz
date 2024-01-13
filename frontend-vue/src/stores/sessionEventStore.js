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
    connectToSSEStudent() {
      const sessionStore = useSessionStore();
      const userStore = useUserStore();
      const url =
        import.meta.env.VITE_API_URL +
        '/event/' +
        sessionStore.idSession +
        '/student?token=' +
        userStore.getToken();
      const eventSource = new EventSource(url);
      eventSource.onerror = () => {
        sessionStore.disconnectFromSession('Error on SSE');
      };
      this.setEventSource(eventSource);
      this.listenToEvents();
    },
    connectToSSEObserver() {
      const sessionStore = useSessionStore();
      const userStore = useUserStore();
      const url =
        import.meta.env.VITE_API_URL +
        '/event/' +
        sessionStore.idSession +
        '/observer?token=' +
        userStore.getToken();
      const eventSource = new EventSource(url);
      eventSource.onerror = () => {
        sessionStore.disconnectFromSession('Error on SSE');
      };
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
      try {
        await sessionStore.getCurrentQuestions();
      } catch (error) {
        sessionStore.disconnectFromSession(error.message);
      }
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
