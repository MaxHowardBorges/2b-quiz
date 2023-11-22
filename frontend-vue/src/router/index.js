import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import SessionView from '@/views/SessionView.vue';
import TeacherHomeView from '@/views/TeacherHomeView.vue';
import LoginView from '@/views/LoginView.vue';
import { useUserStore } from '@/stores/userStore';

const routes = [
  {
    path: '/home',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/teacher-home-page',
    name: 'Teacher home',
    props: (route) => ({
      errorSnackbar: route.query.errorSnackbar,
      dialogError: !!route.query.dialogError,
    }),
    component: TeacherHomeView,
  },
  {
    path: '/session',
    name: 'Session',
    component: SessionView,
  },
  {
    path: '/',
    name: 'Login',
    props: (route) => ({
      expiredError: !!route.query.expiredError,
      serverError: !!route.query.serverError,
      ticket: route.query.ticket,
    }),
    component: LoginView,
    meta: { public: true },
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
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/AdminView.vue'),
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
