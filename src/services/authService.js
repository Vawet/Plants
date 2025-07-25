import axios from 'axios';
// import { ElMessage } from 'element-plus';
const API_URL = 'http://106.54.254.209:3000/api/auth';
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
  console.log(response.data);
  localStorage.setItem('token', response.data.token);
  // store.updateMenuList(generateMenuByRole(response.data.userinfo.role));
  store.state.token=response.data.token;
  store.state.avatar=response.data.userinfo.avatar;
  return response.data;
};
// 获取用户信息
export const getCurrentUser = () => {
  const token = localStorage.getItem('token');
  return token ? JSON.parse(atob(token.split('.')[1])) : null;
};

