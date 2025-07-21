import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import pool from '../config/db.js';
import jwt from 'jsonwebtoken';
import  JWT_SECRET  from '../config/config.js';
const router = Router();


// 1. 直接通过 import.meta.url 计算上传目录路径（不使用 __dirname）
const currentFileUrl = new URL(import.meta.url); //当前文件完整的地址
const currentDirPath = path.dirname(fileURLToPath(currentFileUrl)); // 当前文件所在目录routes的地址
const uploadDir = path.join(currentDirPath, '../public/plants'); // 拼接上传目录路径
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
// 文件过滤
// 定义一个文件过滤器函数
// 定义文件过滤函数
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('仅支持JPG/PNG格式'), false);
  }
};
// upload是multer中间件 用来管理请求发送过来的文件 不处理非文件的部分！
const upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB限制
});
// 认证中间件！
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
};
// 植物上传路由  bodyParser.urlencoded({ extended: true }),
router.post('/updatePlants', authenticate,  upload.array('plants', 10), async (req, res) => {
    try {
      const { sid,  desch, desen, name ,ename } = req.body;
      const userId = req.user.id; // 从JWT token解析
      console.log('req:',req);
      console.log('req.files:',req.files);

      // 处理每张图片
      const plantUrls = req.files.map(file => 
        `http://localhost:3000/plants/${file.filename}`
      );

      // 批量插入数据库
      const insertPromises = plantUrls.map(url => 
        pool.query(
          `INSERT INTO plants 
          (id, sid, desch, desen, plantUrl,name,ename) 
          VALUES (?, ?, ?, ?, ?,?,?)`,
          [userId, sid, desch, desen, url,name,ename]
        )
      );
      await Promise.all(insertPromises);
      res.status(200).json({
        code:200,
        success: true,
        count: plantUrls.length,
        urls: plantUrls
      });
    } catch (error) {
      console.error('上传错误:', error);
      res.status(500).json({ 
        success: false,
        message: '服务器处理失败'
      });
    }
  }
);
export default router;