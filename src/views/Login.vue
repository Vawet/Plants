<script setup>
import { reactive,watch} from 'vue'
import { useAllDataStore } from '../stores/index.js'
import { useRouter, useRoute } from 'vue-router'
import { login,register } from '../services/authService.js'
const loginForm = reactive({
    username: "",
    password: "",
})
const store = useAllDataStore()
const router = useRouter()

const handleLogin = async () => {
    try{
        await login({"username":loginForm.username,"password":loginForm.password})
        store.addMenu(router);
        // console.log("菜单也渲染好了！登录成功！");
        router.push('/home')
    }catch(error){
        console.log("登录失败！",error);
        ElMessage.error("登录失败，请检查账户和密码");
    }
}
const ToRegister = () => {
    router.push('/register')
}


</script>


<template>
    <div class="body-login">
        <el-form class="login-container">
            <h1>欢迎登录</h1>
            <el-form-item>
                <el-input type="input" placeholder="请输入账号" v-model="loginForm.username"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input type="password" placeholder="请输入密码" v-model="loginForm.password">
                </el-input>
            </el-form-item>
            <el-form-item class="button">
                <el-button class="gradient-btn login-btn" @click="handleLogin">登录</el-button>
                <el-button class="gradient-btn register-btn" @click="ToRegister">注册</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>


<style scoped lang="less">
.body-login {
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

.login-container {
    width: 350px;
    background-color: rgba(255, 255, 255, 0.8); /* 增加背景透明度，与背景融合 */
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 15px;
    padding: 35px 35px 15px 35px;
    box-shadow: 0 0 25px rgba(0, 0, 0, 0.1);
    margin: 250px auto;
    h1 {
        text-align: center;
        margin-bottom: 20px;
        color: #333;
    }
    .button {
        text-align: center;
        display: flex;
        // align-items: center;
        gap: 100px;
        justify-content: space-between;
        
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
        
        .login-btn {
            background: linear-gradient(135deg, #4CAF50 0%, #388E3C 100%); /* 绿色系渐变 */
        }
        
        .register-btn {
            background: linear-gradient(135deg, #8BC34A 0%, #7CB342 100%); /* 浅绿色系渐变 */
        }
    }
}
</style>