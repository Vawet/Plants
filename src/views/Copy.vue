<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ArrowLeft } from '@element-plus/icons-vue';
import {useAllDataStore} from '@/stores/index.js'
const store = useAllDataStore(); // 引入全局数据

const router = useRouter();
const route = useRoute();

// 获取路由参数中的科系ID
const familyId = ref(route.params.sid);

// 模拟数据 - 根据ID获取科系详情
const familyDetail = ref({
  id: familyId.value,
  chineseName: '菊科',
  englishName: 'Asteraceae',
  chineseDescription: '菊科是双子叶植物纲菊亚纲的第一大科，约有1100属，25000-30000种，广泛分布于全球各地。菊科植物多为草本，有些种类为灌木或乔木。菊科植物的花具有头状花序，花序由许多小花密集排列在花托上形成，花序外围常有总苞片包围。菊科植物具有重要的经济价值，包括观赏植物（如菊花、向日葵）、药用植物（如艾草、茵陈蒿）和食用植物（如莴苣、洋蓟）等。',
  englishDescription: 'The Asteraceae, also known as the aster, daisy, or sunflower family, is one of the largest families of flowering plants, with over 32,000 accepted species across approximately 1,900 genera. Members of this family are characterized by composite flowers made up of many small florets arranged in a dense head (capitulum) surrounded by involucral bracts. Asteraceae species are distributed worldwide and include many economically important plants used as ornamentals (e.g., chrysanthemums, marigolds), food crops (e.g., lettuce, artichoke), and medicinal herbs (e.g., echinacea, milk thistle).',
  images: [
    { id: 1, url: '../assets/上海植物园照片/DSC04394.JPG', alt: '菊花1' },
    { id: 2, url: '../assets/上海植物园照片/DSC04394.JPG', alt: '菊花2' },
    { id: 3, url: '../assets/上海植物园照片/DSC04394.JPG', alt: '菊花3' },
    { id: 4, url: '../assets/上海植物园照片/DSC04394.JPG', alt: '菊花4' },
    { id: 5, url: '../assets/上海植物园照片/DSC04394.JPG', alt: '菊花5' }
  ]
});

// 返回主页
const goBack = () => {
  router.go(-1);
};

// 轮播图悬停控制
const isHovering = ref(false);
</script>

<template>
  <div class="detail-container">
    <!-- 顶部导航栏 -->
    <div class="nav-bar">
      <el-button :icon="ArrowLeft" circle @click="goBack" />
      <div class="title-container">
        <h1>{{ familyDetail.chineseName }}</h1>
        <h2>{{ familyDetail.englishName }}</h2>
      </div>
    </div>

    <!-- 图片展示区 -->
    <div class="image-section">
      <el-carousel 
        :autoplay="!isHovering" 
        height="320px" 
        indicator-position="outside"
        type="card"
        trigger="click"
        @mouseenter="isHovering = true"
        @mouseleave="isHovering = false">
        <el-carousel-item v-for="image in familyDetail.images" :key="image.id">
          <div class="carousel-image">
            <!-- <img :src="image.url" :alt="image.alt" /> -->
             <img src="../assets/上海植物园照片/DSC04394.JPG" :alt="image.alt" />
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
    
    <!-- 文字介绍区 -->
    <div class="description-section">
      <div class="chinese-description">
        <h3>中文介绍</h3>
        <p>{{ familyDetail.chineseDescription }}</p>
      </div>
      <div class="english-description">
        <h3>English Description</h3>
        <p>{{ familyDetail.englishDescription }}</p>
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
.image-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.carousel-image {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.carousel-image img {
  height: 70%;
  width: auto;
  object-fit: cover;
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.carousel-image img:hover {
  transform: scale(1.05);
}
.carousel-caption {
  height:20%;
  padding: 0.8rem 1rem;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.9);
  margin-top: 0;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
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