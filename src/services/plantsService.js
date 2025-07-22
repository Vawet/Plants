import axios from 'axios';
// import { ElMessage } from 'element-plus';
const API_URL = 'http://localhost:3000/api/plants';
export const handlePlantUpload = async (form) => {
  try {
    // 创建一个FormData对象,然后把form表单数据添加到要上传的formData中
    const formData = new FormData();
    console.log(form.images)
    form.images.forEach(item => {
      if (['image/jpeg',  'image/jpg','image/png'].includes(item.rawFile.type) ) {
        formData.append('plants',item.rawFile); // 字段名与后端一致
      }else{
        ElMessage.error('图片格式不符合要求！');
        return;
      }
    });
    // 添加其他表单数据
    formData.append('sid', form.category); // 植物系列ID (1-10)
    formData.append('desch', form.descriptionCn);
    formData.append('desen', form.descriptionEn);
    formData.append('name', form.name);
    formData.append('ename', form.ename);
    // 发送请求
    const response = await axios.post( `${API_URL}/updatePlants`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      
      withCredentials: true
    });
    if(response.data.code === 200){
      ElMessage.success(`成功上传${response.data.count}张植物图片`);
    }
  } catch (error) {
    ElMessage.error(`上传失败: ${error.response?.data?.message || error.message}`);
  }
};