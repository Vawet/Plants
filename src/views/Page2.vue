<template>
  <div class="admin-container">
    <div class="admin-header">
      <div>
        <h1 class="admin-title">前台主页编辑</h1>
        <div class="admin-subtitle"></div>
      </div>
    </div>
    <div class="admin-main">
      <div class="form-container">
        
        <el-form ref="plantForm" :model="form" :rules="rules" label-position="top">
          <div class="form-grid">
            <!-- 左侧列：图片上传和植物系别 -->
            <div class="form-section">
              <h3 class="form-section-title">
                <el-icon><Picture /></el-icon>
                头像图片修改
              </h3>
              
              <el-form-item prop="images">
                <el-upload
                    class="avatar-uploader"
                    action="#"
                    :show-file-list="false"
                    :on-change="handleChange"
                  >
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
                <div class="el-upload__tip">
                  请选择一张头像上传，支持 JPG/PNG 格式，每张图片不超过 5MB
                </div>
              </el-form-item>
            </div>
            
            <!-- 右侧列：中英文介绍和个人信息 -->
            <div class="form-section">
              <!-- <h3 class="form-section-title">
                <el-icon><Notebook /></el-icon>
                植物介绍
              </h3>
               -->
              <!-- <div class="lang-container">
                <div class="lang-box">
                  <div class="lang-box-title">中文介绍</div>
                  <el-form-item prop="descriptionCn">
                    <el-input
                      v-model="form.descriptionCn"
                      type="textarea"
                      :rows="5"
                      placeholder="请输入植物中文介绍"
                      @input="translateToEnglish"
                    />
                  </el-form-item>
                </div>
                
                <div class="lang-box">
                  <div class="lang-box-title">英文介绍</div>
                  <el-form-item prop="descriptionEn">
                    <el-input
                      v-model="form.descriptionEn"
                      type="textarea"
                      :rows="5"
                      placeholder="植物英文介绍（自动生成，可修改）"
                    />
                  </el-form-item>
                </div>
              </div> -->
              
              <h3 class="form-section-title" style="margin-top: 30px;">
                <el-icon><User /></el-icon>
                添加者信息
              </h3>
              
              <el-form-item prop="author" label="您的姓名">
                <el-input 
                  v-model="form.author" 
                  placeholder="请输入您的姓名" 
                />
              </el-form-item>
              
              <el-form-item prop="authorBio" label="个人简介">
                <el-input
                  v-model="form.authorBio"
                  type="textarea"
                  :rows="4"
                  placeholder="请输入个人简介（不超过150字）"
                  show-word-limit
                  maxlength="150"
                />
                <div class="character-count" :class="{
                  'warning': bioCharCount >= 130 && bioCharCount < 145,
                  'error': bioCharCount >= 145
                }">
                  {{ bioCharCount }}/150
                </div>
              </el-form-item>
               <el-form-item prop="authorBioEn" label="英文介绍">
                <el-input
                  v-model="form.authorBioEn"
                  type="textarea"
                  :rows="4"
                  placeholder="请输入个人简介（不超过150字）"
                  show-word-limit
                  maxlength="150"
                />
                <div class="character-count" :class="{
                  'warning': bioCharCountEn >= 130 && bioCharCountEn < 145,
                  'error': bioCharCountEn >= 145
                }">
                  {{ bioCharCountEn }}/150
                </div>
              </el-form-item>
            </div>
          </div>
          
          <div class="form-actions">
            <el-button type="info" @click="resetForm" size="large">
              <el-icon><Refresh /></el-icon> 重置表单
            </el-button>
            <el-button type="primary" @click="submitForm" size="large">
              <el-icon><Upload /></el-icon> 提交信息
            </el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
// import { ElMessage, ElLoading } from 'element-plus'
import {handlePlantUpload} from '@/services/plantsService.js'
import { handlePersonUpload,handleAvatarChange } from '@/services/editService.js'
import {
  Plus,
  Picture,
  Menu,
  Notebook,
  User,
  View,
  Refresh,
  Upload,
  Camera,
  Close,
  Delete
} from '@element-plus/icons-vue'

// 表单数据
const form = ref({
  author: '',
  authorBio: '',
  authorBioEn: ''
})
const imageUrl = ref('') // 存储图片预览地址
// 表单验证规则
const rules = ref({
  author: [
    { required: true, message: '请输入您的姓名', trigger: 'blur' }
  ]
})

// 植物系别选项
const plantCategories = ref([
  { value: '1', label: '1: 草本植物' },
  { value: '2', label: '2: 木本植物' },
  { value: '3', label: '3: 多肉植物' },
  { value: '4', label: '4: 水生植物' },
  { value: '5', label: '5: 藤本植物' },
  { value: '6', label: '6: 食虫植物' },
  { value: '7', label: '7: 蕨类植物' },
  { value: '8', label: '8: 兰科植物' },
  { value: '9', label: '9: 苔藓植物' },
  { value: '10', label: '10: 珍稀植物' }
])

// // 计算属性：当前系别已上传图片数量
// const currentCategoryImageCount = computed(() => {
//   return form.value.images.length
// })

// 计算属性：个人简介中文字符数
const bioCharCount = computed(() => {
  return form.value.authorBio.length
})
const bioCharCountEn = computed(() => {
  return form.value.authorBioEn.length
})
const handleRemoveImage = (event) => {
  // 阻止事件冒泡，防止触发上传
  if (event) {
    event.stopPropagation()
  }
  imageUrl.value = ''
}

// 重置表单
const resetForm = () => {
  form.value = {
   avatar:'',
    author: '',
    authorBio: '',
    authorBioEn: ''
  }
  ElMessage.success('表单已重置')
}


// 提交表单
const submitForm =async () => {
//   console.log(form.value.images);
//   // 表单验证
//   if (!form.value.images.length) {
//     ElMessage.warning('请至少上传一张图片')
//     return
//   }

  
//   if (!form.value.category) {
//     ElMessage.warning('请选择植物系别')
//     return
//   }
  
//   if (!form.value.descriptionCn) {
//     ElMessage.warning('请填写植物中文介绍')
//     return
//   }
  
  if (!form.value.author) {
    ElMessage.warning('请填写您的姓名')
    return
  }
  
  // 显示加载状态
  const loading = ElLoading.service({
    lock: true,
    text: '正在提交数据...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  try {
   //  await Promise.all([handlePlantUpload(form.value),handlePersonUpload(form.value)]);
    // await Promise.all([handleAvatarChange(form.value.avatar),handlePersonUpload(form.value)]);
    await handlePersonUpload(form.value);
  } catch (error) {
    ElMessage.error('提交数据时出错，请稍后再试');
    console.error(error);
  } finally {
    loading.close();
    resetForm();
  }
}
// 头像选择时触发 - 用于立即预览
const handleChange = async (uploadFile) => {
  // 创建本地预览（不等待上传完成）
  if (uploadFile.raw) {
    imageUrl.value = URL.createObjectURL(uploadFile.raw)
  }
  await handleAvatarChange(uploadFile)
  // 如果服务器返回了图片URL，使用服务器的URL
  imageUrl.value = store.state.avatar
}

</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', Arial, sans-serif;
  background-color: #f5f7fa;
  color: #333;
  line-height: 1.5;
  padding: 20px;
  background: linear-gradient(135deg, #e6f7e0 0%, #f0f9eb 100%);
}

.admin-container {
  width: 100%;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  border: 1px solid #e4e7ed;
}

.admin-header {
  background: linear-gradient(135deg, #67c23a 0%, #85ce61 100%);
  color: white;
  padding: 25px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.admin-title {
  font-size: 28px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.admin-subtitle {
  font-size: 16px;
  opacity: 0.92;
  margin-top: 8px;
}

.admin-main {
  padding: 35px;
}

.form-container {
  background: white;
  border-radius: 10px;
  padding: 35px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  border: 1px solid #ebeef5;
}

.form-title {
  font-size: 24px;
  margin-bottom: 30px;
  color: #303133;
  position: relative;
  padding-bottom: 18px;
  font-weight: 600;
}

.form-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 4px;
  background: #67c23a;
  border-radius: 2px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 35px;
  margin-bottom: 30px;
}

.form-section {
  background: #fafdf7;
  border-radius: 10px;
  padding: 25px;
  border: 1px solid #e1f0d8;
}

.form-section-title {
  font-size: 18px;
  margin-bottom: 20px;
  color: #67c23a;
  display: flex;
  align-items: center;
  font-weight: 500;
}

.form-section-title i {
  margin-right: 10px;
  font-size: 20px;
}


.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 20px;
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px solid #ebeef5;
}

/* 头像上传部分 */
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
/* 预览部分 */
.preview-section {
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px dashed #e4e7ed;
}

.preview-title {
  font-size: 20px;
  margin-bottom: 25px;
  color: #303133;
  display: flex;
  align-items: center;
}

.preview-title i {
  margin-right: 10px;
  color: #67c23a;
}

.preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 25px;
}

.plant-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  background: white;
  border: 1px solid #e4e7ed;
}

.plant-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.plant-image {
  height: 160px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.plant-category {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(103, 194, 58, 0.92);
  color: white;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
}

.plant-details {
  padding: 18px;
}

.plant-name {
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 17px;
  color: #303133;
}

.plant-description {
  font-size: 14px;
  color: #606266;
  margin-bottom: 12px;
  line-height: 1.6;
}

.plant-intro {
  font-size: 13px;
  color: #909399;
  border-top: 1px dashed #ebeef5;
  padding-top: 12px;
  margin-top: 12px;
  line-height: 1.5;
}

.lang-container {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.lang-box {
  flex: 1;
}

.lang-box-title {
  font-size: 15px;
  margin-bottom: 8px;
  color: #606266;
  font-weight: 500;
}

.upload-list {
  margin-top: 10px;
}

.character-count {
  text-align: right;
  font-size: 13px;
  color: #909399;
  margin-top: 5px;
}

.character-count.warning {
  color: #e6a23c;
}

.character-count.error {
  color: #f56c6c;
}

@media (max-width: 900px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .lang-container {
    flex-direction: column;
    gap: 15px;
  }
}
</style>