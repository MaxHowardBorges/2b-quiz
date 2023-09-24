import { createStore } from 'vuex';
import { socketModule } from '@/store/socket.store';
import { fetchAPIModule } from '@/store/fetchAPI.store';

export default createStore({
  state: {
    router: null,
    success: null,
    idSession: null,
    username: null,
  },
  getters: {
    getRouter: (state) => {
      return state.router;
    },
    getSuccess: (state) => {
      return state.success;
    },
    getIdSession: (state) => {
      return state.idSession;
    },
    getUsername: (state) => {
      return state.username;
    },
  },
  mutations: {
    setRouter(state, router) {
      state.router = router;
    },
    setSuccess(state, success) {
      state.success = success;
    },
    setIdSession(state, idSession) {
      state.idSession = idSession;
    },
    setUsername(state, idSession) {
      state.username = idSession;
    },
    changePage(state, pageLink) {
      state.router.push(pageLink);
    },
  },
  actions: {},
  modules: { socketModule, fetchAPIModule },
});
