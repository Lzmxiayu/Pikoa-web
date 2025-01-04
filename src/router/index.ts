import { createRouter, createWebHistory } from 'vue-router'
// @ts-ignore
import VideoView from '@/views/VideoView.vue'
// @ts-ignore
import SearchView from '@/views/SearchView.vue'
// @ts-ignore
import Home from '@/views/Home.vue'

import HistoryPage from '@/views/HistoryPage.vue'
import SpaceView from '@/views/SpaceView.vue'
import LoginView from '@/views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/video',
      name: 'video',
      component: VideoView,
    },
    {
      path: '/search',
      name: 'search',
      component: SearchView,
      // () => import('@/views/SearchView.vue'),
    },
    {
      path: '/',
      name: 'home',
      component: Home,
      // () => import('@/views/SearchView.vue'),
    },
    {
      path: '/history',
      name: 'history',
      component: HistoryPage,
      // () => import('@/views/SearchView.vue'),
    },
    {
      path: '/space',
      name: 'space',
      component: SpaceView,
      // () => import('@/views/SearchView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
  ],
})

export default router
