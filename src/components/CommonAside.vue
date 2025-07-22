<template>
    <el-aside :width="width" class="aside">
        <!-- 宽度会根据isCollapse进行变化 -->
        <el-menu 
            background-color="#545c64" 
            text-color="#fff" 
            :collapse="isCollapse" 
            :collapse-transition="false"
            :default-active="activeMenu"
        >
            <!-- 为什么这里的样式要加冒号呢？然后transition为false就可以让过渡的过程消失化 -->
            <h3 v-show="!isCollapse">通用后台管理系统</h3>
            <h3 v-show="isCollapse">后台</h3>
            <el-menu-item 
                v-for="item in noChildren" 
                :index="item.path" 
                :key="item.path"
                @click="handleMenu(item)"
            >
                <!-- 加了:index点击就会字体变蓝 -->
                <component class="icons" :is="item.icon"></component>
                <span>{{ item.label }}</span>
            </el-menu-item>
            <el-sub-menu 
                v-for="item in hasChildren" 
                :index="item.path" 
                :key="item.path"
            >
                <template #title>
                    <component class="icons" :is="item.icon"></component>
                    <span>{{ item.label }}</span>
                </template>
                <!-- #title表示插槽 -->
                <!-- 有子目录的菜单 -->
                <el-menu-item-group>
                    <el-menu-item 
                        v-for="(subItem, subIndex) in item.children" 
                        :index="subItem.path"
                        :key="subItem.path"
                        @click="handleMenu(subItem)"
                    >
                        <component class="icons" :is="subItem.icon"></component>
                        <span>{{ subItem.label }}</span>
                    </el-menu-item>
                </el-menu-item-group>
            </el-sub-menu>
        </el-menu>
    </el-aside>
</template>



<script setup>
import { ref, computed } from 'vue'
// 从这里开始建立与pinia的联系
import {useAllDataStore} from '@/stores/index'
import {useRouter,useRoute} from 'vue-router'



// 如果没有children 那么就是undefined
const noChildren = computed(() => list.value.filter(item => !item.children))
const hasChildren = computed(() => list.value.filter(item => item.children))
const store=useAllDataStore()
const isCollapse=computed(()=>store.state.isCollapse)
const width=computed(()=>store.state.isCollapse?'64px':'180px');
const router=useRouter()
const route=useRoute()
const activeMenu=computed(()=>route.path)
// 点击触发左侧的菜单的跳转
//router.push()
const handleMenu=(item)=>{
    router.push(item.path)
    store.selectMenu(item)
}
const list=computed(()=>{console.log('菜单数据:', store.state.menuList);
return store.state.menuList;});
</script>


<style lang="less" scoped>

// 所有小图标的样式
.icons {
    width: 18px;
    height: 18px;
    margin-right: 5px;
}

.el-menu {
    border-right: none;
    h3 {
        color: #fff;
        text-align: center; // 居中
        line-height: 48px;
        font-size: 16px;
        font-weight: normal;
    }
}

.aside {
    height: 100%;
    background-color: #545c64;
}
</style>