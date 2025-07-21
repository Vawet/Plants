import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import pool from '../config/db.js';
import jwt from 'jsonwebtoken';
import  JWT_SECRET  from '../config/config.js';
import bodyParser from 'body-parser';
const router = Router();

// 1. 直接通过 import.meta.url 计算上传目录路径（不使用 __dirname）
const currentFileUrl = new URL(import.meta.url); //当前文件完整的地址
const currentDirPath = path.dirname(fileURLToPath(currentFileUrl)); // 当前文件所在目录routes的地址
const uploadDir = path.join(currentDirPath, '../public/avatars'); // 拼接上传目录路径
// console.log('uploadDir:',uploadDir);
// 初始化上传目录
try {
  await fs.access(uploadDir);
} catch {
  await fs.mkdir(uploadDir, { recursive: true });
}

// 2. 配置 multer 存储规则
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9_.-]/g, '');
    const uniqueName = `${Date.now()}-${safeName}`;
    cb(null, uniqueName);
    //生成唯一文件名
  }
});

// 3. 创建 multer 实例
const upload = multer({
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('只允许上传图片文件！'), false);
    }
  },
  storage: storage
});

// 4.添加认证中间件  
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  console.log(req.headers);
  if (!token) {
    return res.status(401).json({ 
      code: 401, 
      message: '未提供Token认证信息!' 
    });
  }

  try {
    // 获取发送请求方的token信息，验证发送人   同时在post请求中顺利的修改请求人的数据库字段
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    console.log('req.user:',req.user);
    next();
  } catch (error) {
    res.status(401).json({ 
      code: 401, 
      message: '这是无效或者过期的Token!' 
    });
}
}
// 5. 处理头像上传请求
router.post('/updateAvatar',authenticate, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        code: 400, 
        message: '文件为空，请选择要上传的头像！' 
      });
    }
    console.log('req.file.filename:',req.file.filename);
    // 生成图片访问 URL
    const avatarUrl = `http://localhost:3000/avatars/${req.file.filename}`;

    // 验证登录态
    if (!req.user?.id) {
      return res.status(401).json({ 
        code: 401, 
        message: '未登录，无法修改头像' 
      });
    }
    const userId = req.user.id;

    // 更新数据库
    const [results] = await pool.query(
      'UPDATE users SET avatarUrl = ? WHERE id = ?',
      [avatarUrl, userId]
    );

    if (results.affectedRows === 0) {
      return res.status(404).json({ 
        code: 404, 
        message: '用户不存在，更新失败' 
      });
    }

    res.status(200).json({
      code: 200,
      message: '头像修改成功',
      data: { avatar: avatarUrl }
    });

  } catch (error) {
    console.error('头像上传失败：', error);
    res.status(500).json({ 
      code: 500, 
      message: '服务器错误，上传失败' 
    });
  }
});

router.post('/updatePerson',authenticate,bodyParser.urlencoded({ extended: true }),async (req, res) => {
  try {
    const {nickname,bioch,bioen}=req.body;
    const userId = req.user.id;
    console.log('个人信息接口req.body的内容:',req.body);
    console.log('个人信息接口req.headers的内容:',req.headers);
     // 参数校验
    if (![nickname, bioch, bioen].every(Boolean)) {
      return res.status(400).json({ 
        code: 400,
        message: '昵称和简介不能为空' 
      });
    }
    // 更新数据库
    const [results] = await pool.query(
      'UPDATE users SET nickname = ?, bioch = ?, bioen = ? WHERE id = ?',
      [nickname,bioch,bioen, userId]  
    );
    if (results.affectedRows === 0) {
      return res.status(404).json({ 
        code: 404, 
        message: '用户不存在，更新失败' 
      });
    }
    res.status(200).json({
      code: 200,
      message: '个人信息修改成功',
    });
  } catch (error) {
    console.error('个人信息上传失败：', error);
    res.status(500).json({ 
      code: 500, 
      message: '服务器错误，上传失败' 
    });
  }
});

export default router;