import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import WaitingQuestion from '@/views/WaitingQuestion.vue';
import StudentAnswer from '@/views/StudentAnswer.vue';
import EndSession from '@/views/EndSession.vue';
import WaitingSession from '@/views/WaitingSession.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/about',
    name: 'about',
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/AboutView.vue'),
  },
  {
    path: '/waiting',
    name: 'waiting',
    component: WaitingQuestion,
  },
  {
    path: '/waiting-session',
    name: 'waiting-session',
    component: WaitingSession,
  },
  {
    path: '/answer',
    name: 'answer',
    component: StudentAnswer,
  },
  {
    path: '/end',
    name: 'end',
    component: EndSession,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
