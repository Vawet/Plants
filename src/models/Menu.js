export function generateMenuByRole(role) {
  // 基础菜单配置（所有角色都有）
  const baseMenu = [
    {
      path: '/home',
      name: 'home',
      label: '首页',
      icon: 'house',
      url: 'Home'
    },
   {
          path: '/page2',
          name: 'page2',
          label: '个人信息编辑',
          icon: 'setting',
          url: 'Page2'
        },
  ];

  // 管理员和员工额外的菜单
  const adminMenu = [
    {
      path: '/user',
      name: 'user',
      label: '用户管理',
      icon: 'user',
      url: 'User'
    },
    {
      path: '/staff',
      name: 'staff',
      label: '员工管理',
      icon: 'user',
      url: 'Staff'  
    },
    {
      path: '/other',
      label: '其他',
      icon: 'location',
      children: [
        {
          path: '/page1',
          name: 'page1',
          label: '统计分析',
          icon: 'setting',
          url: 'Page1'
        },
        {
          path: '/page2',
          name: 'page2',
          label: '页面2',
          icon: 'setting',
          url: 'Page2'
        }
      ]
    }
  ];

  // 根据角色返回不同的菜单
  if (role === 0) {
    return baseMenu;
  } else if (role === 1 || role === 2) {
    return [...baseMenu, ...adminMenu];
  }
}