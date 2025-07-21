<!-- 这是在导入组件合成首页的页面的
 包括侧边的菜单栏、顶部的框子，还有页面顶部的面包屑吧（会根据菜单栏发生变化） -->
<script setup>
import { defineAsyncComponent } from 'vue'
import CommonAside from '@/components/CommonAside.vue';
// const CommonHeader = defineAsyncComponent({
//   loader: () => import('@/components/CommonHeader.vue'),
//   errorComponent: () => <div>加载失败</div>,
//   loadingComponent: () => <div>加载中...</div>
// })
import CommonHeader from '@/components/CommonHeader.vue';
</script>

<template>
    <div class="common-layout">
        <el-container class="lay-container">
            <CommonAside />
            <el-container>
                <el-header>
                    <CommonHeader />
                </el-header>
                <el-main class="right-main">
                     <!-- 只缓存指定的组件 -->
                        <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<style scoped lang="less">
.common-layout,
.lay-container {
    height: 100vh;
}

.el-header {
    background-color: #333;
}
</style>
