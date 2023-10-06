import { createRouter, createWebHashHistory } from 'vue-router';


const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "about" */ '../views/HomeView.vue')
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
    component: () => import(/* webpackChunkName: "about" */ '../views/TeacherQuestionView.vue')
  },

  {
    path: '/end-of-session',
    name: 'end-of-session',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/EndOfSessionView.vue')//EndOfSessionView//FinDeSessionView
  },

  {
    path: '/waiting-participant',//waiting-participant
    name: 'waiting-participant',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/WaitingParticipantView.vue')// WaitingParticipantView //AttenteParticipantView
  },
  {
    path: '/teacher-home-page',//teacher-home-page
    name: 'teacher-home-page',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/TeacherHomeView.vue')//TeacherHomeView//MenuEnseignantView
  },
  {
    path: '/waiting',
    name: 'waiting',
    component: () => import(/* webpackChunkName: "about" */ '../views/WaitingQuestion.vue')
  },
  {
    path: '/waiting-session',
    name: 'waiting-session',
    component: () => import(/* webpackChunkName: "about" */ '../views/WaitingSession.vue')
  },
  {
    path: '/answer',
    name: 'answer',
    component: () => import(/* webpackChunkName: "about" */ '../views/StudentAnswer.vue')
  },
  {
    path: '/end',
    name: 'end',
    component: () => import(/* webpackChunkName: "about" */ '../views/EndSession.vue')
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
