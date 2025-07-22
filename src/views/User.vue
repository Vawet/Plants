<template>
  <div class="user-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>用户管理</span>
        </div>
      </template>
      <el-table v-loading="loading" :data="userList" style="width: 100%">
        <el-table-column prop="username" label="用户名" width="180" />
        <el-table-column prop="password" label="密码" width="180" >
          <template #default="scope">
            <span>******</span> <!-- 密码加密显示 -->
          </template>
        </el-table-column>
        <el-table-column prop="lastLoginTime" label="最近登录时间" width="200" />
        <el-table-column prop="loginLocation" label="登录地点" width="200" />
        <el-table-column prop="role" label="身份" width="120" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="scope">
            <el-button size="small" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
// import { ElMessage } from 'element-plus';
// 假设我们有一个用户服务
// import { getUserList } from '@/services/userService';

// 模拟数据
const userList = ref([
  { id: 1, username: 'admin', password: '123456', lastLoginTime: '2023-11-11 10:30:00', loginLocation: '北京', role: '管理员' },
  { id: 2, username: 'user1', password: '123456', lastLoginTime: '2023-11-10 15:45:00', loginLocation: '上海', role: '普通用户' },
  { id: 3, username: 'user2', password: '123456', lastLoginTime: '2023-11-09 09:12:00', loginLocation: '广州', role: '普通用户' },
]);

const loading = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(3);

// 生命周期钩子
onMounted(() => {
  // 加载用户列表
  // loadUserList();
});

// 加载用户列表
// const loadUserList = async () => {
//   loading.value = true;
//   try {
//     const response = await getUserList({
//       page: currentPage.value,
//       pageSize: pageSize.value
//     });
//     userList.value = response.data.items;
//     total.value = response.data.total;
//   } catch (error) {
//     ElMessage.error('获取用户列表失败');
//     console.error('Failed to load user list:', error);
//   } finally {
//     loading.value = false;
//   }
// };

// 处理页码变化
const handleCurrentChange = (val) => {
  currentPage.value = val;
  // loadUserList();
};

// 处理每页条数变化
const handleSizeChange = (val) => {
  pageSize.value = val;
  currentPage.value = 1;
  // loadUserList();
};

// 处理编辑
const handleEdit = (row) => {
  ElMessage({
    message: `编辑用户: ${row.username}`,
    type: 'info'
  });
  // 这里可以打开编辑对话框
};

// 处理删除
const handleDelete = (row) => {
  ElMessage({
    message: `删除用户: ${row.username}`,
    type: 'warning'
  });
  // 这里可以打开确认删除对话框
};
</script>

<style scoped>
.user-management {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>