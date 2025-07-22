<script setup>
import { ref,computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ArrowLeft } from '@element-plus/icons-vue';
import {useAllDataStore} from '@/stores/index.js'
const store = useAllDataStore(); // 引入全局数据

const router = useRouter();
const route = useRoute();

// 获取路由参数中的科系ID
const familyId = computed(() => route.params.sid)

// 根据ID获取科系详情
const familyDetail = computed(() => {
  if (!store.plantsGroup || !familyId.value) {
    return null;
  }
  return store.plantsGroup.find(family => family.sid === familyId.value)
})
console.log(familyDetail)
// 返回主页
const goBack = () => {
  router.go(-1);
};

// 轮播图悬停控制
const isHovering = ref(false);

const currentIndex=ref(0);
const currentPlant = computed(() => {
  if (!familyDetail.value?.plants || familyDetail.value.plants.length === 0) {
    return null;
  }
  return familyDetail.value.plants[currentIndex.value]
})
// 轮播切换事件处理
const handleCarouselChange = (index) => {
  currentIndex.value = index
  console.log('当前植物:', currentPlant.value)
}
// 初始化
onMounted(() => {
  if (familyDetail.value?.plants && familyDetail.value.plants.length > 0) {
    currentIndex.value = 0
  }
})
</script>

<template>
  <div class="plant-detail-container">
    <!-- 顶部导航栏 -->
    <div class="nav-bar">
      <el-button :icon="ArrowLeft" circle @click="goBack" />
      <div class="title-container">
        <h1>{{ familyDetail.sname }}</h1>
      </div>
    </div>
    <div class="container">
      <section class="carousel-section">
      <el-carousel 
      indicator-position="outside" 
      height="500px" 
      class="botany-carousel" 
      type="card"
      @change="handleCarouselChange"
      ref="carouselRef"
    >
        <el-carousel-item v-for="(item, index) in familyDetail.plants" :key="index">
          <div class="carousel-image">
            <img :src=item.plantUrl :alt="`植物图片 ${index + 1}`" />
          </div>
          <div class="carousel-caption">
            <h3>{{ item.name }}</h3>
            <p>{{ item.ename }}</p>
          </div>
        </el-carousel-item>
      </el-carousel>
    </section>
    
     <!-- 当前植物的文字介绍区 -->
    <div class="description-section" v-if="currentPlant">
      <div class="plant-info">
        <h2>{{ currentPlant.name }}</h2>
        <h3>{{ currentPlant.ename }}</h3>
      </div>
      
      <div class="descriptions">
        <div class="chinese-description">
          <h3>中文介绍</h3>
          <p>{{ currentPlant.desch || '暂无中文介绍' }}</p>
        </div>
        <div class="english-description">
          <h3>English Description</h3>
          <p>{{ currentPlant.desen || 'No English description available' }}</p>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<style scoped>
.detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  background-color: #f8faf7;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

/* 顶部导航栏样式 - 粘性定位 */
.nav-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
  
  position: sticky;
  top: 0;
  z-index: 10;
}

.title-container {
  text-align: left;
}

.title-container h1 {
  font-size: 1.8rem;
  margin: 0;
  color: #2c3e50;
}

.title-container h2 {
  font-size: 1.2rem;
  margin: 0.2rem 0 0;
  color: #7f8c8d;
}

/* 图片展示区样式 */
.carousel-section {
  padding: 2rem 0;
  position: relative;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.botany-carousel::before,
.botany-carousel::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100px;
  z-index: 2;
  pointer-events: none;
}

.botany-carousel::before {
  left: 0;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.8) 0%, transparent 100%);
}

.botany-carousel::after {
  right: 0;
  background: linear-gradient(270deg, rgba(255, 255, 255, 0.8) 0%, transparent 100%);
}

.carousel-image {
  height: 350px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  padding-top: 20px;
}

.carousel-image img {
  height: 100%;
  width: auto;
  object-fit: cover;
  border-radius: 20px;
}

.carousel-caption {
  padding: 0.8rem 1rem;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.9);
  margin-top: 0;
}

.botany-carousel {
  height: 480px !important;
}

:deep(.el-carousel__indicators) {
  margin-top: 10px;
}



/* 文字介绍区样式 */
.description-section {
  padding: 1.5rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.chinese-description, .english-description {
  margin-bottom: 2rem;
}

.chinese-description h3, .english-description h3 {
  color: #4CAF50;
  border-bottom: 1px solid #eaeaea;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}

.chinese-description p, .english-description p {
  line-height: 1.8;
  color: #666;
}
</style>