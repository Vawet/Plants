<script setup>
import { reactive} from 'vue'
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
        console.log("菜单也渲染好了！登录成功！");
        // router.push('/home')
        router.push('home')
    }catch(error){
        console.log("登录失败！",error);
        alert("登录失败，请检查账户和密码！");
    }
}
const handleRegister = async (role) => {
    try{
        await register({"username":loginForm.username,"password":loginForm.password,"role":role});
        alert("注册成功！");
    }catch{
        alert("注册失败！");
    }
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
                <el-button type="primary" @click="handleLogin">登录</el-button>
                <!-- 因为这个是超级管理员注册的管理员的账户 -->
                <el-button type="primary" @click="handleRegister(0)">注册</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<style scoped lang="less">
.body-login {
    width: 100%;
    height: 100vh; /* 使用视口高度确保全屏 */
    margin: 0; /* 移除默认边距 */
    padding: 0; /* 移除默认内边距 */
    background-image: url("../assets/images/background.png");
    background-size: cover; /* 关键属性：覆盖整个容器 */
    background-position: center center; /* 居中显示 */
    background-repeat: no-repeat; /* 禁止重复 */
    background-attachment: fixed; /* 可选：固定背景 */
    overflow: hidden;
}

.login-container {
    width: 350px;
    background-color: #fff;
    border: 1px solid #eaeaea;
    border-radius: 15px;
    padding: 35px 35px 15px 35px;
    box-shadow: 0 0 25px #cacaca;
    margin: 250px auto;
    h1 {
        text-align: center;
        margin-bottom: 20px;
        color: #505450;
    }
    .button {
        text-align: center;
        /* 父容器文本居中 */
        .el-button {
            width: 200px;
            /* 固定宽度 + 自动外边距 */
            margin: 0 auto;
        }
    }
}
</style>
