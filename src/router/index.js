import { createRouter, createWebHistory } from 'vue-router'
// 制定路由规则
const routes = [
    {
        path: '/',
        name: 'main',
        component:()=>import('@/views/Main.vue'),
        redirect:'/login',
        children:[
            {
                path: '/home',
                name: 'home',
                // 路由懒加载
                component: () => import('@/views/Home.vue'),
            },
            {
                path: '/page2',
                name: 'page2',
                component: () => import('@/views/Page2.vue'),
            }
        ]
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/Login.vue')
    },
    { 
        path: '/register',
         name: 'Register',
          component: () => import('@/views/Register.vue') 
    },
    {
        path: "/404",
        name: "404",
        component: () => import("@/views/404.vue"),
    },
]
const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router;