import axios from 'axios';
// import { ElMessage } from 'element-plus';
const API_URL = 'http://localhost:3000/api/auth';
import {useAllDataStore} from '@/stores/index'
const store=useAllDataStore();
import { generateMenuByRole } from '../models/Menu';
export const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};
// 登录 测试的接口是http://localhost:3000/api/auth/login
// 导出一个名为login的异步函数，接收一个参数credentials
export const login = async (credentials) => {
  // 使用axios发送post请求，请求地址为API_URL/login，请求参数为credentials
  const response = await axios.post(`${API_URL}/login`, credentials);
  // 打印返回的数据中的userinfo.role
  console.log(response.data);
  // 现在需要根据角色来生成不同用户的菜单！
  // 将返回的数据中的token存储到localStorage中
  localStorage.setItem('token', response.data.token);
  // 使用store的action方法更新菜单
  store.updateMenuList(generateMenuByRole(response.data.userinfo.role));
  // 将返回的数据中的token存储到store的state中
  store.state.token=response.data.token;
  store.state.avatar=response.data.userinfo.avatar;
  // 返回返回的数据
  return response.data;
};
// 获取用户信息
export const getCurrentUser = () => {
  const token = localStorage.getItem('token');
  return token ? JSON.parse(atob(token.split('.')[1])) : null;
};

