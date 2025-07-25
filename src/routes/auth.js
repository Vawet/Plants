// src/routes/auth.js
import { Router } from 'express';
const router = Router();
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import  JWT_SECRET  from '../config/config.js';
// 注册 
router.post('/register', async (req, res) => {
  try {
    const { username, password,role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.createUser(username, hashedPassword,role); 
    res.status(201).json({ message: '注册成功' });
  } catch (error) {
    res.status(500).json({ error:error });
  }
});

// 登录  生成JWT令牌 Token
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body; 
    // 1.在数据库中查找是否存在这个账号
    const user = await User.findByUsername(username); 
    // 2.控制台展示错误信息
    if (!user) {
      // 明确告知前端用户不存在
      return res.status(401).json({ error: '用户不存在' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // 明确告知前端密码错误
      return res.status(401).json({ error: '密码错误' });
    }
    // 3.生成JWT Token中包含用户的id和用户的角色字段
    const token = jwt.sign({ id: user.id,role:user.role }, JWT_SECRET, { expiresIn: '7d' });
    // 4.返回Token给前端
    res.json({ token,userinfo:{id:user.id,username:user.username,role:user.role,avatar:user.avatarUrl} });
  } catch (error) {
    res.status(500).json({ error: '登录失败' });
  }
});

export default router;