import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import AttenteQuestion from '@/views/AttenteQuestion.vue';
import ReponseEtudiant from '@/views/ReponseEtudiant.vue';
import FinQuestionnaire from '@/views/FinQuestionnaire.vue';

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
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/AboutView.vue'),
  },
  {
    path: '/attente',
    name: 'attente',
    component: AttenteQuestion,
  },
  {
    path: '/reponse',
    name: 'reponse',
    component: ReponseEtudiant,
  },
  {
    path: '/fin',
    name: 'fin',
    component: FinQuestionnaire,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
