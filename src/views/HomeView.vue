<script setup>
import { ref,onMounted } from "vue";
import { useRouter } from 'vue-router'; // 引入路由
import {handleSearch} from "@/services/seriesService.js"; // 引入搜索功能函数
import {useAllDataStore} from '@/stores/index.js'
import { watch } from "less";
const store = useAllDataStore(); // 引入全局数据
const router = useRouter(); // 获取路由实例
const searchQuery = ref(''); // 搜索框输入内容
const isFocused = ref(false); // 搜索框是否聚焦
const familyDetail = ref(null); // 点击植物科系卡片时，显示该植物科系的详细信息
const isLoading = ref(true); // 添加加载状态
//当鼠标悬浮在页面元素.family-gird时，.family-info的bottom值设置为-20px，移除恢复70px
const hideInfo = (e) => {
  e.currentTarget.querySelector('.family-info').style.bottom = '-20px';
}
const showInfo = (e) => {
  e.currentTarget.querySelector('.family-info').style.bottom = '70px';
}

const handleCategoryClick = (value) => {
  // router.push(`/plantfamily/${value}`);
  router.push({ name: 'PlantFamilyDetail', params: { sid: value } })
}

const Active=ref('1'); // 控制显示哪个植物科系

onMounted(async () => {
  await handleSearch('admin');
  isLoading.value = false; // 加载完成后，将加载状态设为 false
})

const CarouselImage = computed(() => {
  if (isLoading.value || !store.plantsGroup.length) return [];
  return store.plantsGroup
    .filter(family => family.plants?.length > 0) // 确保有植物数据
    .map(family => family.plants[0])
    .filter(plant => plant?.plantUrl); // 确保植物有图片地址
})
</script>

<template>
  <div class="home-container">
    <!-- 新增搜索框区域 -->
    <section class="search-section">
      <div class="search-container">
        <div class="search-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </svg>
        </div>
        <input 
          type="text" 
          v-model="searchQuery" 
          class="search-input"
          placeholder="搜索用户昵称..."
          @focus="isFocused = true"
          @blur="isFocused = false"
          @keyup.enter="handleSearch(searchQuery)"
        >
        <button class="search-button" @click="handleSearch(searchQuery)">
          搜索
        </button>
      </div>
    </section>
    <!-- 第一部分：个人介绍区域 -->
    <section class="profile-section">
      <div class="profile-header">
        <img :src="store.avatar" alt="学生头像" class="avatar" />
        <div class="name-container">
          <h1 class="chinese-name">{{ store.nickname }}</h1>
          <!-- <h2 class="english-name">英文名字</h2> -->

        </div>
      </div>

      <div class="bio-container">
        <p class="chinese-bio">{{ store.bioch }}</p>
        <p class="english-bio">{{ store.bioen }}</p>
      </div>

      <div class="specialty-link">
        <a href="https://www.youtube.com/watch?v=example" target="_blank" class="specialty-button">
          查看我的特长视频 / Watch My Specialty Video
        </a>
      </div>

      <div class="welcome-banner">
        <h2>欢迎来到植物学世界</h2>
        <h3>Welcome to the World of Botany</h3>
      </div>
    </section>

    <!-- 第二部分：轮播图区域 -->
    <section class="carousel-section">
      <el-carousel indicator-position="outside" height="500px" class="botany-carousel" type="card">
        <el-carousel-item v-for="(item, index) in CarouselImage" :key="index">
          <div class="carousel-image">
            <img :src="item.plantUrl" :alt="`植物图片 ${index + 1}`" />
          </div>
          <div class="carousel-caption">
            <h3>{{ item.name }}</h3>
            <h3>{{ item.ename }}</h3>
          </div>
        </el-carousel-item>
      </el-carousel>
    </section>

    <!-- 第三部分：植物科系展示 -->
    <section class="botany-section">
        <div class="nav-wrapper">
          <div class="quick-nav">
            <div 
              v-for="(family, index) in store.plantsGroup" 
              :key="family.sid"
              class="nav-item" 
              @mouseenter="Active=family.sid"
              @click="handleCategoryClick(family.sid)"
              >
              <span>{{ family.sname }}</span><br>
              <span style="font-size: .7rem; color: gray;">ENG.{{ family.sid }}</span>
            </div>
        </div>
        </div>
        <div class="content-wrapper">
          <div 
            v-for="(family, index) in store.plantsGroup"
            :key="family.sid"
            class="family-container"
            :style="{display:Active===family.sid ? 'block' : 'none'}"
          >
            <div class="family-grid">
              <div 
                v-for="(plant, index) in family.plants" 
                :key="plant.plantid" 
                class="family-card" 
                @mouseenter="hideInfo"
                @mouseleave="showInfo"
                @click="showFamilyDetail(family)"
              >
                <div class="image-container">
                  <img :src="plant.plantUrl" :alt="`植物科系 ${plant.sid}`" />
                </div>
                <div class="family-info" style="background-color: white;">
                  <h4>{{ plant.name }}</h4>
                  <p>{{ plant.ename }}</p>
                  <div class="family-description">
                    <p class="chinese-desc">{{ plant.desch }}</p>
                    <p class="english-desc">{{ plant.descen }}</p>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-container {
  max-width: 1300px;
  margin: 0 auto;
  padding: 1rem;
  background-color: #f8faf7;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}
/* 新增搜索框样式 */
.search-section {
  padding: 1.5rem 0;
  background-color: white;
  border-radius: 8px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.search-container {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
}

.search-input {
  width: 100%;
  padding: 12px 20px 12px 45px;
  border: 2px solid #e0e7e0;
  border-radius: 50px;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;
  background-color: #f9fcf9;
  color: #2c3e50;
}

.search-input:focus {
  border-color: #4CAF50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
  background-color: white;
  width: 105%;
}

.search-icon {
  position: absolute;
  left: 15px;
  color: #7f8c8d;
  transition: all 0.3s ease;
}

.search-container:focus-within .search-icon {
  color: #4CAF50;
}

.search-button {
  position: absolute;
  right: 5px;
  padding: 8px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateX(10px);
  pointer-events: none;
}

.search-container:focus-within .search-button {
  opacity: 1;
  transform: translateX(0);
  pointer-events: auto;
}

.search-button:hover {
  background-color: #388E3C;
}

.search-input::placeholder {
  color: #b0b8b0;
  transition: all 0.3s ease;
}

.search-input:focus::placeholder {
  color: #d0d8d0;
}

/* 第一部分：个人介绍区域样式 */
.profile-section {
  text-align: center;
  padding: 2rem 0;
  border-bottom: 1px solid #eaeaea;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.profile-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #4CAF50;
}

.name-container {
  text-align: left;
}

.chinese-name {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.english-name {
  font-size: 1.5rem;
  color: #7f8c8d;
}

.bio-container {
  max-width: 800px;
  margin: 0 auto 1.5rem;
  line-height: 1.6;
}

.chinese-bio,
.english-bio {
  margin-bottom: 1rem;
}

.specialty-link {
  margin: 1.5rem 0;
}

.specialty-button {
  display: inline-block;
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border-radius: 4px;
  text-decoration: none;
  transition: all 0.3s ease;
}

.specialty-button:hover {
  background-color: #388E3C;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.welcome-banner {
  background-color: #f9f9f9;
  padding: 1.5rem;
  border-radius: 8px;
  margin-top: 1.5rem;
}

.welcome-banner h2,
.welcome-banner h3 {
  margin: 0.5rem 0;
}

/* 第二部分：轮播图区域样式 */
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

/* 第三部分：植物科系展示样式 */
.botany-section {
  display: flex;
  gap: 2rem;
  padding: 2rem 0;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  flex-direction: row;
  align-items: flex-start;
  overflow: visible;
  position: relative;
}

.nav-wrapper .quick-nav {
  width: 180px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0.5rem;

  position: sticky;
  top: 0;
  z-index: 10;
  background-color: white;
 
  border-radius: 6px;
  max-height: calc(100vh - 20px);
  overflow-y: auto;
}

.nav-item {
  padding: .7rem;
  background-color: #f5f7fa;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  /* transform-origin: left center; */
}

.nav-item:hover {
  background-color: #e1f5fe;
  transform: scale(1.05);
  /* z-index: 2; */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.family-container{
  /* 容器居中 */
  justify-content: center; /* 网格水平居中 */
  align-content: center;   /* 网格垂直居中 */
   /* 每个网格项的内容居中 */
  justify-items: center;   /* 项目内容水平居中 */
  align-items: center;     /* 项目内容垂直居中 */
}
.content-wrapper .family-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(2, minmax(300px, 1fr));
  gap: 1rem;
  position: relative;
}

.family-card {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  height: 350px;
  width:470px;
}

.family-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.image-container {
  height: 250px;
  overflow: hidden;
  width: 100%;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.family-card:hover .image-container img {
  transform: scale(1.05);
}

.family-info {
  padding: 0.8rem;
  text-align: center;
  height: calc(100% - 150px);
  display: flex;
  flex-direction: column;
  transition: .5s;
  position: relative;
  bottom: 70px;
}

.family-info h4 {
  margin: 0.2rem 0;
  color: #2c3e50;
  font-size: 1.1rem;
}

.family-info p {
  margin: 0 0 0.5rem 0;
  color: #7f8c8d;
  font-size: 0.85rem;
}

.family-description {
  margin-top: 0rem;
  padding-top: 0rem;
  border-top: 1px dashed #e0e0e0;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.chinese-desc,
.english-desc {
  font-size: 0.8rem;
  color: #666;
  margin: 0rem 0;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
