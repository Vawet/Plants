// src/config/db.js
import { createPool } from 'mysql2/promise';
// 数据库用的是我自己的数据库 这有问题吗？
const pool = createPool({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'account',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;