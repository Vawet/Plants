// src/services/editService.js
import axios from 'axios';
import { ElMessage } from 'element-plus';
const API_URL = 'http://106.54.254.209:3000/api/edit';
import {useAllDataStore} from '@/stores/index'
const store=useAllDataStore();
export const handleAvatarChange=async (file)=> {
    try {
        // 创建 FormData 对象，用于上传文件
        const formData = new FormData();
        formData.append('file', file.raw); 
        // 调用后端接口上传头像，这里的接口地址根据实际后端定义填写
        const res = await axios.post(`${API_URL}/updateAvatar`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data', 
                'Authorization':`Bearer ${localStorage.getItem('token')}`,
            },
            withCredentials: true
        });
        if (res.data.code === 200) { // 假设后端返回 code 为 200 表示成功
            ElMessage.success('头像修改成功');
            // 更新 store 中的头像地址
            store.updateImg(res.data.data.avatar);
        }
    } catch (error) {
        // console.error('上传头像出错!：', error);
        ElMessage.error('网络异常，头像修改失败!');
    }
}

export const handlePersonUpload=async (form)=>{
    try{
        // const formData = new FormData();
        // formData.append('nickname', form.author);
        // formData.append('bioch', form.authorBio);
        // formData.append('bioen', form.authorBioEn);
        const requestData = {
            nickname: form.author,
            bioch: form.authorBio,
            bioen: form.authorBioEn
        };
        const response=await axios.post(`${API_URL}/updatePerson`, requestData, {
            headers: {
                // 'Content-Type': 'multipart/form-data', 
                // 'Content-Type': 'application/x-www-form-urlencoded', 
                'Content-Type': 'application/json', // 必须明确指定JSON格式
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            // body:new URLSearchParams(formData).toString(),
            withCredentials: true
        });
        if(response.data.code===200){
            ElMessage.success('个人信息修改成功');
        }else{
            ElMessage.error('个人信息修改失败');
        }
    }catch(error){
        console.error('上传个人信息出错!：', error);
        ElMessage.error('网络异常，个人信息修改失败!');
    }
}