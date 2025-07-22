<template>
    <div class="header" :class="store.state.theme">
        <div class="l-content">
            <el-breadcrumb separator="/" class="bread">
                <el-breadcrumb-item :to="{ path: '/login' }" >返回登录页面</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <!-- 右侧放的是用户的头像  -->
        <div class="r-content">
            <el-dropdown>
                <span class="el-dropdown-link">
                    <img :src="getImageUrl" class="avatar">
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="handleUpdateAvatar">修改头像</el-dropdown-item>
                        <el-dropdown-item @click="handleLoginOut">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
            <el-upload
                class="avatar-uploader"
                action="#"
                :show-file-list="true"
                :on-change="handleAvatarChange"
                :before-upload="beforeAvatarUpload"
                style="display: none;"
                ref="uploadRef"
            >
                <!-- <el-button ref="btn" size="large" type="primary">选取文件</el-button> -->
            </el-upload>
        </div>
    </div>
</template>


<script setup>
import { ref, computed,nextTick } from 'vue'
import { useAllDataStore } from '../stores'
import { useRouter } from 'vue-router'
// import { ElMessage,ElUpload } from 'element-plus'
import { handleAvatarChange } from '@/services/editService.js'
const store = useAllDataStore()
const getImageUrl = computed(() => {
    return store.state.avatar; 
    //如果store.state.avatar存在则返回store.state.avatar，否则返回空字符串
})
// 监听状态变化（调试用）
watch(
  () => store.state.avatar,
  (newVal, oldVal) => {
    console.log('头像更新了:', newVal, oldVal)
  },
  { immediate: true } // 立即执行一次
)
const uploadRef = ref(null)
function handleUpdateAvatar() {
    console.log('handleUpdateAvatar')
    uploadRef.value.$el.querySelector('input').click()
}

// 上传前的校验，比如限制文件类型、大小等
function beforeAvatarUpload(file) {
    const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
    const isLt2M = file.size / 1024 / 1024 < 2; 
    if (!isJPG) {
        ElMessage.error('上传头像只能是 JPG/PNG 格式!');
    }
    if (!isLt2M) {
        ElMessage.error('上传头像大小不能超过 2MB!');
    }
    return isJPG && isLt2M;
}


//跨组件之间的传值  
const router = useRouter()
const handleLoginOut = () => {
    store.clean();
    router.push('/login')
}
</script>


<style lang="less" scoped>



.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    width: 100%;
}

.bread :deep(.el-breadcrumb__inner) {
  font-weight: bold;
}



.l-content {
    display: flex;
    align-items: center;

    .el-button {
        margin-right: 20px;
    }
}
.avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
    }
.r-content {
    .avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
    }
}

:deep(.bread span) {
    color: #ffffff !important;
    cursor: pointer !important;
    margin-right:10px;
}

</style>
