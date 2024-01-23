import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import SessionView from '@/views/SessionView.vue';
import { useUserStore } from '@/stores/userStore';
import QuestionaryView from '@/views/QuestionaryView.vue';
import DisplayView from '@/views/DisplayView.vue';
import { UserRoles } from '@/utils/userRoles';
import SessionHistoryView from '@/views/SessionHistoryView.vue';
import SessionHandleResults from '@/components/session/SessionHandleResults.vue';
import SeeResultsStudents from '@/views/SeeResultsStudents.vue';
import SessionQuestionResults from '@/components/session/SessionQuestionResults.vue';

const routes = [
  {
    path: '/see-results-students',
    name: SeeResultsStudents,
    component: SeeResultsStudents, //
  },

  {
    path: '/history/:idSession',
    name: 'Session Handle Results',
    component: SessionHandleResults, //
    props: (route) => ({
      idSession: route.params.idSession,
    }),
  },
  {
    path: '/session-question-results',
    name: 'SessionQuestionResults',
    component: SessionQuestionResults, //
  },
  {
    path: '/history',
    name: 'Session History',
    component: SessionHistoryView, // Assurez-vous d'ajuster le chemin du composant
    meta: { inMenu: true },
  },

  {
    path: '/session',
    name: 'Session',
    component: SessionView,
    meta: { inMenu: true },
    props: (route) => ({
      isCreating: !!route.query.isCreating,
    }),
  },
  {
    path: '/',
    name: 'Home',
    props: (route) => ({
      errorSnackbar: route.query.errorSnackbar,
      expiredError: !!route.query.expiredError,
      serverError: !!route.query.serverError,
      ticket: route.query.ticket,
      sessionError: route.query.sessionError,
    }),
    component: HomeView,
    meta: { public: true, inMenu: true },
  },
  {
    path: '/user',
    name: 'User',
    meta: { inMenu: true },
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/UserView.vue'),
  },
  {
    path: '/questionary',
    name: 'questionary',
    props: (route) => ({
      toCreateBool: route.query.toCreateBool === 'true',
      toBankBool: route.query.toBankBool === 'true',
    }),
    component: QuestionaryView,
    meta: { inMenu: true, roles: [UserRoles.TEACHER] },
  },
  {
    path: '/public',
    name: 'public',
    component: DisplayView,
    meta: { inMenu: false },
    props: (route) => ({
      idSession: route.query.idSession,
    }),
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
    next({ name: 'Login' });
    return;
  }
  next();
});

export default router;
