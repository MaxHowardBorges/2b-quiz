import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import SessionView from '@/views/SessionView.vue';
import { useUserStore } from '@/stores/userStore';
import QuestionaryView from '@/views/QuestionaryView.vue';
import DisplayView from '@/views/DisplayView.vue';
import OrderQuestionnary from '@/views/OrderQuestionnary.vue';
import { UserRoles } from '@/utils/userRoles';

const routes = [
  {
    path: '/session',
    name: 'Session',
    component: SessionView,
  },

  {
    path: '/order-questionnary',
    name: OrderQuestionnary,
    component: OrderQuestionnary, //
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
    path: '/register',
    name: 'Register',
    meta: { public: true, disabled: true },
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/RegisterView.vue'),
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
    component: QuestionaryView,
    meta: { inMenu: true, roles: [UserRoles.TEACHER] },
  },
  {
    path: '/public',
    name: 'public',
    component: DisplayView,
    meta: { inMenu: true },
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
