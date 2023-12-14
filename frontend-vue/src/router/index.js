import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import SessionView from '@/views/SessionView.vue';
import TeacherHomeView from '@/views/TeacherHomeView.vue';
import { useUserStore } from '@/stores/userStore';

const routes = [
  {
    path: '/teacher-home-page',
    name: 'Teacher home',
    props: (route) => ({
      errorSnackbar: route.query.errorSnackbar,
      dialogError: !!route.query.dialogError,
    }),
    component: TeacherHomeView,
    meta: { inMenu: true },
  },
  {
    path: '/session',
    name: 'Session',
    component: SessionView,
  },
  {
    path: '/',
    name: 'Home',
    props: (route) => ({
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
    path: '/admin',
    name: 'Admin',
    meta: { inMenu: true },
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/AdminView.vue'),
  },
  {
    path: '/user',
    name: 'User',
    meta: { inMenu: true ,public: true},
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/UserView.vue'),
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
