import { Router } from 'express';
import pool from '../config/db.js';
const router = Router();
/**原先 
 * 通过 nickname 获取用户及关联的植物数据
 * 请求方式：POST
 * 请求体：{ nickname: 'xxx' }
 * 返回：{ user: {...}, plants: [...] }
 */

/**现在！
 * 通过 nickname 获取用户及关联的植物数据（按科系分组）
 * 请求方式：POST
 * 请求体：{ nickname: 'xxx' }
 * 返回：{ user: {...}, plantGroups: [{ sid,sname, plants: [...] }] }
 */
router.post('/getUserWithPlants', async (req, res) => {
  try {
    const { nickname } = req.body;

    // 1. 校验参数  
    if (!nickname) {
      return res.status(400).json({ code: 400, msg: '缺少 nickname 参数' });
    }

    // 2. 查询 users 表，获取用户信息
    const userSql = 'SELECT id, nickname, bioch, bioen, avatarUrl FROM users WHERE nickname = ?';
    const [userResult] = await pool.query(userSql, [nickname]);
    if (userResult.length === 0) {
      return res.status(404).json({ code: 404, msg: '未找到该用户' });
    }
    const user = userResult[0];

    // 3. 通过用户 id 查询 plants 表，并按 sid 分组
    const plantsSql = `
      SELECT sid, plantid, name,ename, plantUrl, desen, desch 
      FROM plants 
      WHERE id = ?  
      ORDER BY sid ASC, plantid ASC  
    `;
    const [plants] = await pool.query(plantsSql, [user.id]);

    // 4. 将植物按科系ID分组
    const plantGroups = {};
    plants.forEach(plant => {
      if (!plantGroups[plant.sid]) {
        plantGroups[plant.sid] = [];
      }
      plantGroups[plant.sid].push(plant);
    });

    // 5. 转换为数组格式并添加科系名称
    const plantCategories = [
      { value: '1', label: '1: 草本植物' },
      { value: '2', label: '2: 木本植物' },
      { value: '3', label: '3: 多肉植物' },
      { value: '4', label: '4: 水生植物' },
      { value: '5', label: '5: 藤本植物' },
      { value: '6', label: '6: 食虫植物' },
      { value: '7', label: '7: 蕨类植物' },
      { value: '8', label: '8: 兰科植物' },
      { value: '9', label: '9: 苔藓植物' },
      { value: '10', label: '10: 珍稀植物' }
    ];
    
    const groupedResult = Object.entries(plantGroups).map(([sid, plants]) => {
      const category = plantCategories.find(cat => cat.value === sid) || { label: `未知科系 ${sid}` };
      return {
        sid,
        sname: category.label,
        plants: plants.map(plant => ({
          plantid: plant.plantid,
          name: plant.name,
          ename: plant.ename,
          plantUrl: plant.plantUrl,
          desen: plant.desen,
          desch: plant.desch
        }))
      };
    });

    // 6. 返回结果（用户信息 + 按科系分组的植物列表）
    res.json({
      code: 200,
      msg: '查询成功',
      data: {
        user: {
          id: user.id,
          nickname: user.nickname,
          bioch: user.bioch,
          bioen: user.bioen,
          avatarUrl: user.avatarUrl
        },
        plantGroups: groupedResult // 按科系分组的植物数据
      }
    });
  } catch (error) {
    console.error('接口错误：', error);
    res.status(500).json({ code: 500, msg: '服务器内部错误' });
  }
});

export default router;