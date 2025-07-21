import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index.js'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createPinia } from "pinia";
import { useAllDataStore } from '@/stores/index.js';
import {createHead} from '@vueuse/head'
function isRoute(to) {
    // 获取所有路由
    let res = router.getRoutes();
    // 过滤出与传入路由相同的路由
    let resFil = res.filter((item) => item.path === to.path);
    // 如果存在相同路由，返回true，否则返回false
    return resFil.length > 0;
}
// 导航守卫中直接重定向到另一个路由。
router.beforeEach((to, from) => {
    if (!isRoute(to)) {
        return { name: "404" };
    }
    if (to.path !== '/login' && !store.state.token) {
        return { name: 'login' };
    }
})
const pinia = createPinia()
const app = createApp(App)
app.use(ElementPlus)
app.use(pinia)
const store = useAllDataStore(); // 调用store
store.addMenu(router, "refresh")
app.use(router)
app.use(createHead())
// 全局注册组件
// for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
//     app.component(key, component)
// }
app.mount('#app')
