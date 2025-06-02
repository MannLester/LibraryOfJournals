import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import WritingPage from '../views/WritingPage.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/write',
    name: 'Write',
    component: WritingPage
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
