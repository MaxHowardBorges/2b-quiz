import { Events } from '@/stores/events';
import io from 'socket.io-client';
import { defineStore } from 'pinia';
import { fetchAPIStore } from './fetchAPI.store';
import { mainStore } from '@/stores/main.store';

export const socketStore = defineStore('socket', {
  state: () => ({
    socket: null,
  }),
  actions: {
    setSocket(socket) {
      this.socket = socket;
    },
    connectToWebSocket() {
      console.log('attempt to connect to ' + import.meta.env.VITE_WS_URL);
      const socket = io(import.meta.env.VITE_WS_URL);
      socket.on('connect', () => {
        console.log('connected to ' + import.meta.env.VITE_WS_URL);
        this.setSocket(socket);
        this.listenToEvents();
      });
    },
    listenToEvents() {
      const socket = this.getSocket;
      const store = mainStore();
      console.log(socket);
      if (socket) {
        socket.on(store.getIdSession, async (message) => {
          console.log(message);
          switch (message) {
            case Events.NEXT_QUESTION:
              await this.loadNextQuestion();
              break;
            case Events.END_SESSION:
              this.loadEnd();
              break;
            default:
              console.log(message);
              break;
          }
        });
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
      const socket = this.getSocket;
      socket.disconnect();
      store.changePage('/end');
    },
    socketDisconnect() {
      const store = mainStore();
      const socket = this.getSocket;
      socket.disconnect();
      store.changePage('/');
    },
  },
  getters: {
    getSocket: (state) => state.socket,
  },
});
