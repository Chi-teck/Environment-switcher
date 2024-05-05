import './assets/main.css';

import { createRouter, createWebHashHistory } from 'vue-router';

import { createApp } from 'vue';
import Home from './components/Home.vue';
import Project from './components/Project.vue';
import NotFound from './components/NotFound.vue';

import App from './App.vue';

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/project/:id', name: 'project', component: Project, props: true },
  { path: '/:catchAll(.*)', component: NotFound },
];

const router = createRouter(
  { history: createWebHashHistory(), routes, linkActiveClass: 'active' },
);

createApp(App).use(router).mount('#app');
