import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/video',
      name: 'video',
      component: () => import('@/views/VideoView.vue'),
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('@/views/SearchView.vue'),
    },
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue'),
    },
    {
      path: '/create',
      name: 'create',
      component: () => import('@/views/CreateView.vue'),
    },
    {
      path: '/history',
      name: 'history',
      component: () => import('@/views/HistoryPage.vue'),
    },
    {
      path: '/space',
      name: 'space',
      component: () => import('@/views/SpaceView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
    },
  ],
});

export default router;
