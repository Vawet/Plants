import axios from 'axios';
const API_URL = 'http://localhost:3000/api/series';
import {useAllDataStore} from '@/stores/index.js'
import { ElMessage } from 'element-plus';

export const handleSearch=async (nickname) => {
    const store=useAllDataStore();
    try{
        const res = await axios.post(`${API_URL}/getUserWithPlants`,{nickname});
        // console.log(res.data);
        // console.log(res.data.data.plantGroups);
        // console.log(res.data.data.user);
        store.updatePerson(res.data.data.user);
        store.updatePlantsGroup(res.data.data.plantGroups);
        // console.log(store.plantsGroup)
    }catch(error){
        // 处理不同类型的错误
        if (error.response) {
      // 服务器响应了错误状态码
            const status = error.response.status
            const data = error.response.data
            if (status === 404) {
                ElMessage.error('该用户不存在！')
            } else if (data?.code === 404) {
                ElMessage.error('该用户不存在！')
            } else {
                ElMessage.error(data?.message || '服务器错误')
            }
        } else if (error.request) {
      // 网络错误
      ElMessage.error('网络连接失败，请检查网络')
    } else {
      // 其他错误
      ElMessage.error('请求失败，请稍后重试')
    }
}
}
