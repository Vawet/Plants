import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView,
    },
    {
      path: '/plantfamily/:sid', 
      name: 'PlantFamilyDetail',
      component:()=>import('@/views/PlantFamilyDetailView.vue'), //懒加载组件
      props: true, // 允许将路由参数作为 props 传入组件
    },
  ],
})

export default router
