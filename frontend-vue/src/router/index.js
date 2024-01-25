import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import SessionView from '@/views/SessionView.vue';
import { useUserStore } from '@/stores/userStore';
import QuestionaryView from '@/views/QuestionaryView.vue';
import DisplayView from '@/views/DisplayView.vue';
import { UserRoles } from '@/utils/userRoles';
import SessionHistoryView from '@/views/SessionHistoryView.vue';
import SessionHandleResults from '@/components/session/SessionHandleResults.vue';

const routes = [
  {
    path: '/',
    name: 'menu.home',
    props: (route) => ({
      errorSnackbar: route.query.errorSnackbar,
      expiredError: !!route.query.expiredError,
      serverError: !!route.query.serverError,
      ticket: route.query.ticket,
      sessionError: route.query.sessionError,
      from: decodeURIComponent(route.query.from),
    }),
    component: HomeView,
    meta: { public: true, inMenu: true },
  },
  {
    path: '/session/:idSession',
    name: 'menu.SessionRouted',
    component: SessionView,
    meta: { inMenu: false },
    props: (route) => ({
      isCreating: !!route.query.isCreating,
      idSession: route.params.idSession,
      errorSnackbar: route.query.errorSnackbar,
      serverError: !!route.query.serverError,
    }),
  },
  {
    path: '/session/',
    name: 'menu.session',
    component: SessionView,
    meta: { inMenu: true },
    props: (route) => ({
      isCreating: !!route.query.isCreating,
      errorSnackbar: route.query.errorSnackbar,
      serverError: !!route.query.serverError,
    }),
  },
  {
    path: '/history/:idSession',
    name: 'menu.SessionHandleResults',
    component: SessionHandleResults, //
    props: (route) => ({
      idSession: route.params.idSession,
    }),
  },
  {
    path: '/history',
    name: 'menu.history',
    component: SessionHistoryView, // Assurez-vous d'ajuster le chemin du composant
    meta: { inMenu: true },
  },
  {
    path: '/user',
    name: 'menu.user',
    meta: { inMenu: true },
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/UserView.vue'),
  },
  {
    path: '/questionnary',
    name: 'menu.questionnary',
    props: (route) => ({
      toCreateBool: route.query.toCreateBool === 'true',
      toBankBool: route.query.toBankBool === 'true',
    }),
    component: QuestionaryView,
    meta: { inMenu: true, roles: [UserRoles.TEACHER] },
  },
  {
    path: '/public',
    name: 'menu.public',
    component: DisplayView,
    meta: { inMenu: false },
    props: (route) => ({
      idSession: route.query.idSession,
    }),
  },
  {
    path: '/group',
    name: 'menu.group',
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/GroupView.vue'),
    meta: { inMenu: true, roles: [UserRoles.TEACHER] },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  if (to.meta.disabled) {
    from();
    return;
  }
  if (to.meta.public) {
    next();
    return;
  }
  if (!userStore.isAuthenticated) {
    next({ name: 'menu.home', query: { from: encodeURIComponent(to.fullPath) } });
    return;
  }
  next();
});

export default router;
