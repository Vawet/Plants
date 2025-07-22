import { defineStore } from 'pinia'
import { ref, watch } from "vue"

function initState() {
    // 返回一个对象，包含以下属性
    return {
        // 是否折叠
        isCollapse: false,
        // 当前菜单
        currentMenu: null,
        // 菜单列表
        menuList: [],
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
export const useAllDataStore = defineStore("allData", () => {
    // ref state 
    // computed getters
    // function actions
    const state = ref(initState());
    state.value.token = localStorage.getItem("token") || "";

    function selectMenu(val) {
        if (val.name === 'home') {
            state.value.currentMenu = null;
        } else {
            let index = state.value.tags.findIndex(item => item.name === val.name)
            index === -1 ? state.value.tags.push(val) : "";
        }
    }
    // 点击标签右侧的叉叉删除掉这个tab
    function updateTags(tag) {
        let index = state.value.tags.findIndex(item => item.name === tag.name);
        state.value.tags.splice(index, 1);
    }
    function updateImg(val) {
        state.value.avatar =val;
        // console.log(state.value.avatar)
    }
    // 给菜单赋值新的值！
    function updateMenuList(val) {
        state.value.menuList = val;
    }
    function addMenu(router, type) {
        if (type === 'refresh') {
            if (JSON.parse(localStorage.getItem('store'))) {
                state.value = JSON.parse(localStorage.getItem("store"));
                state.value.routerList = []
            } else {
                return;
            }
        }
        const menu = state.value.menuList;
        const module = import.meta.glob('../views/**/*.vue')
        const routeArr = []
        menu.forEach(item => {
            if (item.children) {
                item.children.forEach(val => {
                    let url = `../views/${val.url}.vue`
                    val.component = module[url];
                    if (module[url]) {
                        val.component = module[url];
                    } else {
                        console.error(`组件不存在:${url}`);
                        return
                    }
                    routeArr.push(...item.children)
                })
            } else {
                let url = `../views/${item.url}.vue`
                if (module[url]) {
                    item.component = module[url];
                } else {
                    console.error(`组件不存在:${url}`);
                    return
                }
                routeArr.push(item)
            }
        })
        state.value.routerList = [];
        let routers = router.getRoutes();
        // console.log(routers)
        // console.log(router.removeRoute)
        routers.forEach((item) => {
            if (item.name == "main" || item.name == "login" || item.name == "404") {
                return;
            } else {
                router.removeRoute(item.name);
                // 一会儿是routers，参数是router，太容易搞混了吧
            }
        })
        routeArr.forEach((item) => {
            state.value.routerList.push(router.addRoute("main", item))
        })
    }
    function clean() {
        state.value.routerList.forEach((item) => {
            // console.log(item)因为控制台上是removeRouter
            if (item) item();
        });
        state.value = initState();
        // 删除本地的缓存
        localStorage.removeItem("store")
    }
    // 可以用store来接收，不仅有state还有函数方法！！
    function toggleTheme() {
        state.value.theme = state.value.theme === 'light' ? 'dark' : 'light';
    }

    return {
        state,
        selectMenu,
        updateTags,
        updateImg,
        updateMenuList,
        addMenu,
        clean,
        toggleTheme
    };
})