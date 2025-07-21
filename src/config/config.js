// config.js
// 立即执行动态导入并配置 dotenv
import('dotenv/config');
// 导出 JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';
export default JWT_SECRET;