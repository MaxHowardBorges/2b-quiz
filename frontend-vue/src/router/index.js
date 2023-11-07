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
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
