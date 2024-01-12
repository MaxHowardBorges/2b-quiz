import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import SessionView from '@/views/SessionView.vue';
import { useUserStore } from '@/stores/userStore';
import QuestionaryView from '@/views/QuestionaryView.vue';

const routes = [
  {
    path: '/session',
    name: 'Session',
    component: SessionView,
  },
  {
    path: '/',
    name: 'Home',
    props: (route) => ({
      errorSnackbar: route.query.errorSnackbar,
      expiredError: !!route.query.expiredError,
      serverError: !!route.query.serverError,
      ticket: route.query.ticket,
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
    meta: { inMenu: true },
  },
  {
    path: '/group',
    name: 'group',
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/GroupView.vue'),
    meta: { inMenu: true },
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
