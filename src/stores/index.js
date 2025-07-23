import { defineStore } from 'pinia'
import { ref, watch } from "vue"

function initState() {
    // 返回一个对象，包含以下属性
    return {
        // 是否折叠
        isCollapse: false,
        // 菜单列表
        menuList: [
            {
        path: '/home',
        name: 'home',
        label: '首页',
        icon: 'house',
        url: 'Home'
    },
    {
        path: '/page2',
        name: 'page2',
        label: '个人信息编辑',
        icon: 'setting',
        url: 'Page2'
    },
        ],
        // 路由列表
        routerList: [],
        // token
        token: "",
        // 主题
        theme: 'light',
        // 默认主题是白天模式
        avatar: "",
    }
}
const baseMenu = [
    {
        path: '/home',
        name: 'home',
        label: '首页',
        icon: 'house',
        url: 'Home'
    },
    {
        path: '/page2',
        name: 'page2',
        label: '个人信息编辑',
        icon: 'setting',
        url: 'Page2'
    },
];
export const useAllDataStore = defineStore("allData", () => {
    // ref state 
    // computed getters
    // function actions
    const state = ref(initState());
    state.value.token = localStorage.getItem("token") || "";

    function updateImg(val) {
        state.value.avatar =val;
        // console.log(state.value.avatar)
    }
    // 给菜单赋值新的值！
    function updateMenuList(val) {
        state.value.menuList = val;
    }

 function addMenu(router, type) {
    const module = import.meta.glob('../views/**/*.vue');
    let routeArr = [];

    if (type !== 'refresh') {
        state.value.menuList.forEach(item => {
            const url = `../views/${item.url}.vue`;
            item.componentPath = url; // 存储组件路径
            routeArr.push(item);
        });
        localStorage.setItem('routeArr', JSON.stringify(routeArr));
    }

    // 清理旧路由（保留核心路由：main、login、404）
    const routers = router.getRoutes();
    console.log("清理旧路由之前：", routers);
    // routers.forEach(route => {
    //   if (['main', 'login', '404'].includes(route.name)) return;
    //   router.removeRoute(route.name);
    // });
    console.log("清理旧路由之后：", routers);
    console.log("routeArr", routeArr);

    // 添加新路由
    routeArr.forEach(item => {
        const component = module[item.componentPath];
        if (component) {
            item.component = component;
            state.value.routerList.push(router.addRoute('main', item));
        } else {
            console.error(`组件不存在: ${item.componentPath}`);
        }
    });

    // 【可选】结合 token 做登录态校验（示例逻辑，需根据实际调整）
    const token = localStorage.getItem('token');
    if (!token && type === 'refresh') {
        // 无 token 且是刷新，可跳转登录等
        router.push('/login');
    }
    console.log("menulist",state.value.menuList);
}

    function clean() {
        state.value.routerList.forEach((item) => {
            // console.log(item)因为控制台上是removeRouter
            if (item) item();
        });
        state.value = initState();
        localStorage.removeItem("store")
    }
    // 可以用store来接收，不仅有state还有函数方法！！
    function toggleTheme() {
        state.value.theme = state.value.theme === 'light' ? 'dark' : 'light';
    }
    return {
        state,
        updateImg,
        updateMenuList,
        addMenu,
        clean,
        toggleTheme
    };
})