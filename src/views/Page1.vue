<template>
  <el-upload
    class="avatar-uploader"
    action="#"
    :show-file-list="false"
    :on-change="handleChange"
  >
    <!-- <img v-if="imageUrl" :src="imageUrl" class="avatar" /> -->
    <div v-if="imageUrl" class="image-container">
      <img :src="imageUrl" class="avatar" />
      <div class="image-overlay">
        <el-icon class="delete-icon" @click.stop="handleRemoveImage">
          <Delete />
        </el-icon>
      </div>
    </div>
    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
  </el-upload>
</template>

<script lang="js" setup>
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { handleAvatarChange } from '@/services/editService'
import {useAllDataStore} from '@/stores/index.js'
const store=useAllDataStore();
const imageUrl = ref('')

// 文件选择时触发 - 用于立即预览
const handleChange = async (uploadFile) => {
  // 创建本地预览（不等待上传完成）
  if (uploadFile.raw) {
    imageUrl.value = URL.createObjectURL(uploadFile.raw)
  }
  await handleAvatarChange(uploadFile)
  // 如果服务器返回了图片URL，使用服务器的URL
  imageUrl.value = store.state.avatar
}

const handleRemoveImage = (event) => {
  // 阻止事件冒泡，防止触发上传
  if (event) {
    event.stopPropagation()
  }
  imageUrl.value = ''
}
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
.image-container {
  position: relative;
  display: inline-block;
}

.image-overlay {
  position: absolute;
  top: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.delete-icon {
  color: white;
  font-size: 14px;
}

.delete-icon:hover {
  color: #f56c6c;
}
</style>
