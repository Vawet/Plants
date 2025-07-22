import express, { json } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import editRoutes from './routes/edit.js';
import plantsRoutes from './routes/plants.js';
import seriesRoutes from './routes/series.js';
// import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
const filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(filename);
const app=express();
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
const allowOrigins = ['http://localhost:8080','http://localhost:8081'];
app.use(cors({
    origin: (origin, callback) => {
        // !origin 表示允许Postman等工具的跨域请求
        if (!origin || allowOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS!!!'));
        }
    },
    credentials: true,
    // 明确允许的请求头
    allowedHeaders: ['Content-Type', 'Authorization'],
    // 允许的HTTP方法
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  }));
app.options('*', cors());
// 在所有路由前添加
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', allowOrigins[0], allowOrigins[1]);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});
// 解析请求体的中间件，要放在路由挂载之前
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// 上面管理登录和注册
app.use('/api/auth',authRoutes);
//下面管理用户后台操作
app.use('/api/edit',editRoutes);
app.use('/api/plants',plantsRoutes);
// 前后台合并端口
app.use('/api/series',seriesRoutes);
app.use('/avatars',express.static(path.join(__dirname, 'public/avatars')));
app.use('/plants',express.static(path.join(__dirname, 'public/plants')));
// console.log('实际路径:',path.join(__dirname, 'public/avatars'));
const PORT=process.env.PORT ||3000;
app.listen(PORT,()=>{
    console.log(`服务器运行在端口${PORT}`);
})