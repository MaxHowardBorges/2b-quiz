import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import SessionView from '@/views/SessionView.vue';
import TeacherHomeView from '@/views/TeacherHomeView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/teacher-home-page',
    name: 'teacher-home-page',
    props: (route) => ({
      errorSnackbar: route.query.errorSnackbar,
      dialogError: !!route.query.dialogError,
    }),
    component: TeacherHomeView,
  },
  {
    path: '/session',
    name: 'session',
    component: SessionView,
  },
  //loginView
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "about" */ '../views/loginView.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import(/* webpackChunkName: "about" */ '../views/NewAccountView.vue')
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import(/* webpackChunkName: "about" */ '../views/AdminView.vue')
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
