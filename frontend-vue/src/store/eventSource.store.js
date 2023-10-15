import { Events } from '@/store/events';

export const eventSourceModule = {
  state: {
    eventSource: null,
  },
  mutations: {
    setEventSource(state, eventSource) {
      state.eventSource = eventSource;
    },
  },
  actions: {
    connectToSSE({ commit, getters, dispatch }) {
      console.log('attempt to connect to ' + import.meta.env.VITE_API_URL);
      const eventSource = new EventSource(
        import.meta.env.VITE_API_URL + '/event/' + getters.getIdSession,
      );
      commit('setEventSource', eventSource);
      console.log('connected to ' + import.meta.env.VITE_API_URL);
      dispatch('listenToEvents');
    },
    listenToEvents({ getters, dispatch }) {
      const eventSource = getters.getEventSource;
      console.log(eventSource);
      if (eventSource) {
        eventSource.onmessage = (message) => {
          console.log(message.data);
          switch (message.data) {
            case Events.NEXT_QUESTION:
              dispatch('loadNextQuestion');
              break;
            case Events.END_SESSION:
              dispatch('loadEnd');
              break;
            default:
              console.log(message.data);
              break;
          }
        };
      }
    },
    async loadNextQuestion({ dispatch, commit }) {
      await dispatch('getQuestions');
      commit('changePage', '/answer');
    },
    loadEnd({ commit, getters }) {
      const eventSource = getters.getEventSource;
      eventSource.close();
      commit('changePage', '/end');
    },
    socketDisconnect({ commit, getters }) {
      const eventSource = getters.getEventSource;
      eventSource.close();
      commit('changePage', '/');
    },
  },
  getters: {
    getEventSource: (state) => state.eventSource,
  },
};
