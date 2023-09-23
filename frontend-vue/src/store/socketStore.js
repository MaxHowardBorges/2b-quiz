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
      const socket = new io(process.env.VUE_APP_WS_URL);
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
    async loadNextQuestion({ dispatch, getters }) {
      await dispatch('getQuestions');
      getters.getRouter.push('/reponse');
    },
    loadEnd() {},
  },
  getters: {
    getSocket: (state) => state.socket,
  },
};
