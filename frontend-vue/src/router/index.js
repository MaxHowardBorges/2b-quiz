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
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/question',
    name: 'question',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/QuestionReponseView.vue')
  },

  {
    path: '/end-of-session',
    name: 'end-of-session',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/EndOfSessionView.vue')
  },

  {
    path: '/attenteparticipant',
    name: 'attenteparticipant',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AttenteParticipantView.vue')
  },
  {
    path: '/menuteacher',
    name: 'menuteacher',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/MenuTeacherView.vue')
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
