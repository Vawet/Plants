// src/models/User.js
import pool from '../config/db.js';
class User {
  // 创建用户（只需要用户名和密码）
  static async createUser(username, password,role) {
    try{
      console.log('数据库连接状态检查...');
      const [rows] = await pool.execute(
        'INSERT INTO users (username, password,role) VALUES (?, ?, ?)',
        [username, password,role]
      );
      return rows.insertId;
    }catch(error){
      console.error('数据库操作失败:', error);
    }
  }

  // 通过用户名查找用户
  static async findByUsername(username) {
    const [rows] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
    return rows[0];
  }
}

export default User;