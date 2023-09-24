import { Events } from '@/store/events';
import io from 'socket.io-client';

export const socketModule = {
  state: {
    socket: null,
  },
  mutations: {
    setSocket(state, socket) {
      state.socket = socket;
    },
  },
  actions: {
    connectToWebSocket({ commit, dispatch }) {
      console.log('attempt to connect to ' + process.env.VUE_APP_WS_URL);
      const socket = io(process.env.VUE_APP_WS_URL);
      socket.on('connect', () => {
        console.log('connected to ' + process.env.VUE_APP_WS_URL);
        commit('setSocket', socket);
        dispatch('listenToEvents');
      });
    },
    listenToEvents({ getters, dispatch }) {
      const socket = getters.getSocket;
      console.log(socket);
      if (socket) {
        socket.on(getters.getIdSession, (message) => {
          console.log(message);
          switch (message) {
            case Events.NEXT_QUESTION:
              dispatch('loadNextQuestion');
              break;
            case Events.END_SESSION:
              dispatch('loadEnd');
              break;
            default:
              console.log(message);
              break;
          }
        });
      }
    },
    async loadNextQuestion({ dispatch, commit }) {
      await dispatch('getQuestions');
      commit('changePage', '/answer');
    },
    loadEnd({ commit, getters }) {
      const socket = getters.getSocket;
      socket.disconnect();
      commit('changePage', '/end');
    },
  },
  getters: {
    getSocket: (state) => state.socket,
  },
};
