import { Events, HostEvents } from '@/utils/events';
import { defineStore } from 'pinia';
import { useSessionStore } from '@/stores/sessionStore';
import { useUserStore } from '@/stores/userStore';

export const useSessionEventStore = defineStore('sessionEvent', {
  state: () => ({
    eventSource: null,
    eventList: [],
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
    connectToSSEHost() {
      const sessionStore = useSessionStore();
      const userStore = useUserStore();
      this.eventList = [];
      const url =
        import.meta.env.VITE_API_URL +
        '/event/' +
        sessionStore.idSession +
        '/host?token=' +
        userStore.getToken();
      const eventSource = new EventSource(url);
      eventSource.onerror = () => {
        sessionStore.disconnectFromSession('Error on SSE');
      };
      this.setEventSource(eventSource);
      this.listenToHostEvents();
    },
    listenToHostEvents() {
      const eventSource = this.eventSource;
      const sessionStore = useSessionStore();
      if (eventSource) {
        eventSource.onmessage = async (message) => {
          message = JSON.parse(message.data);
          let user = message.payload;
          switch (message.event) {
            case HostEvents.NEW_ANSWER:
              user = message.payload.user;
              this.eventList.push(
                user.username + ' answered ' + message.payload.answer.content,
              );
              await sessionStore.getSessionStatus();
              break;
            case HostEvents.NEW_CONNECTION:
              user = message.payload;
              this.eventList.push(user.username + ' joined the session');
              await sessionStore.getSessionStatus();
              //TODO GET nb of connection
              break;
            default:
              console.error('not used data ' + message.data);
              break;
          }
        };
      }
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
