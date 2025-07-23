<template>
    <div class="body-register">
        <el-form class="register-container" @submit.prevent="handleRegister">
            <h1>用户注册</h1>
            <el-form-item>
                <el-input type="input" placeholder="请输入账号" v-model="registerForm.username" required></el-input>
            </el-form-item>
            <el-form-item>
                <el-input type="password" placeholder="请输入密码" v-model="registerForm.password" @input="checkPassword" required></el-input>
                
                <!-- 密码强度提示 -->
                <div class="password-strength" v-if="registerForm.password">
                  <span class="strength-label">密码强度：</span>
                  <span class="strength-level" :class="strengthClass">
                    {{ strengthText }}
                  </span>
                  <div class="strength-progress">
                    <div 
                      class="strength-bar" 
                      :style="{ width: strengthScore + '%' }"
                      :class="strengthClass"
                    ></div>
                  </div>
                </div>
                
                <!-- 密码要求提示 -->
                <div class="password-tips">
                  <span class="tip-item" :class="{ 'valid': hasLength }">
                    ✓ 长度8-25位
                  </span>
                  <span class="tip-item" :class="{ 'valid': hasNumber }">
                    ✓ 包含数字
                  </span>
                  <span class="tip-item" :class="{ 'valid': hasLetter }">
                    ✓ 包含字母
                  </span>
                  <span class="tip-item" :class="{ 'valid': hasSpecial }">
                    ✓ 包含特殊字符
                  </span>
                </div>
            </el-form-item>
            <el-form-item class="button">
                <el-button class="gradient-btn register-btn" @click="handleRegister(0)">注册</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { ref, reactive } from 'vue'
import {register } from '../services/authService.js'
import { useAllDataStore } from '../stores/index.js'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const store = useAllDataStore()
const registerForm = reactive({
  username: '',
  password: '',
})

const strengthScore = ref(0)
const strengthText = ref('')
const strengthClass = ref('')

// 密码验证状态
const hasLength = ref(false)
const hasNumber = ref(false)
const hasLetter = ref(false)
const hasSpecial = ref(false)

let debounceTimer = null
const checkPassword=()=>{
    if(debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        checkPasswordStrength();
},300);
}
function checkPasswordStrength() {
  const password = registerForm.password
  // 重置状态
  hasLength.value = password.length >= 8 && password.length <= 25
  hasNumber.value = /\d/.test(password)
  hasLetter.value = /[A-Za-z]/.test(password)
  hasSpecial.value = /[@$!%*?&.]/.test(password)
  // 计算强度
  let score = 0
  if (hasLength.value) score += 25
  if (hasNumber.value) score += 25
  if (hasLetter.value) score += 25
  if (hasSpecial.value) score += 25
  strengthScore.value = score
  // 设置等级
  if (score >= 75) {
    strengthText.value = '强'
    strengthClass.value = 'strong'
  } else if (score >= 50) {
    strengthText.value = '中'
    strengthClass.value = 'medium'
  } else if (score >= 25) {
    strengthText.value = '弱'
    strengthClass.value = 'weak'
  } else {
    strengthText.value = '极弱'
    strengthClass.value = 'very-weak'
  }
}

const handleRegister = async (role) => {
  if (strengthScore.value < 50) {
    ElMessage.error('密码强度太弱，请使用更强的密码');
    return;
  }
  try{
        await register({"username":registerForm.username,"password":registerForm.password,"role":role});
        ElMessage.success("注册成功！");
        store.addMenu(router);
        router.push('/home')
    }catch(error){
        console.log(error)
        ElMessage.error("注册失败！");
    }
}
</script>

<style scoped lang="less">
/* 注册页面样式 */
.body-register {
    width: 100%;
    height: 100vh;
    margin: 0;
    padding: 0;
    background-image: url("../assets/images/background.png");
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    background-attachment: fixed;
    overflow: hidden;
}

.register-container {
    width: 400px;
    background-color: rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 15px;
    padding: 35px 35px 15px 35px;
    box-shadow: 0 0 25px rgba(0, 0, 0, 0.1);
    margin: 200px auto;
    h1 {
        text-align: center;
        margin-bottom: 20px;
        color: #333;
    }
    .button {
        text-align: center;
        display: flex;
        flex-direction:row;
        flex-wrap:wrap;
        justify-content: center;
        
        .gradient-btn {
            position: relative;
            width: 150px;
            height: 45px;
            border: none;
            border-radius: 25px;
            color: white;
            font-weight: 600;
            overflow: hidden;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            
            &:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
            }
            
            &::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(
                    120deg,
                    transparent,
                    rgba(255, 255, 255, 0.4),
                    transparent
                );
                transition: all 0.6s ease;
            }
            
            &:hover::before {
                left: 100%;
            }
        }
        
        .register-btn {
            background: linear-gradient(135deg, #8BC34A 0%, #7CB342 100%); /* 浅绿色系渐变 */
            margin:0 auto;
        }
    }
}

/* 密码强度样式 */
.password-strength {
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.strength-label {
  font-size: 12px;
  color: #666;
}

.strength-level {
  font-size: 12px;
  font-weight: bold;
}

.strength-level.very-weak { color: #f56c6c; }
.strength-level.weak { color: #e6a23c; }
.strength-level.medium { color: #409eff; }
.strength-level.strong { color: #67c23a; }

.strength-progress {
  flex: 1;
  height: 4px;
  background: #eee;
  border-radius: 2px;
  overflow: hidden;
}

.strength-bar {
  height: 100%;
  transition: all 0.3s;
  border-radius: 2px;
}

.strength-bar.very-weak { background: #f56c6c; }
.strength-bar.weak { background: #e6a23c; }
.strength-bar.medium { background: #409eff; }
.strength-bar.strong { background: #67c23a; }

.password-tips {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.tip-item {
  font-size: 12px;
  color: #999;
  transition: color 0.3s;
}

.tip-item.valid {
  color: #67c23a;
}
</style>    