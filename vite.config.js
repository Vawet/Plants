import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import path from 'path'

export default defineConfig({
  plugins: [
    vue(),
    // 自动导入 Vue 相关函数和 Composition API
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      // 因为是JS项目，所以不需要生成.d.ts文件
      // dts: 'src/auto-imports.d.ts',
      resolvers: [ElementPlusResolver()],
    }),
    // 自动导入组件
    Components({
      resolvers: [
        ElementPlusResolver({
          importStyle: 'less', 
        }),
      ],
      // dts: 'src/components.d.ts',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    host: '0.0.0.0', // 允许外部访问
    port: 8080, // 自定义端口
    open: true, // 自动打开浏览器
    proxy: {
      // API 代理配置
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ''), // 重写路径
        // secure: false, // 不验证 SSL
        // ws: true, // 支持 WebSocket
      },
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        // 自动导入 Element Plus 变量
        // additionalData: `@import "@/styles/global.less";`,
      },
    },
  },
  build: {
    target: 'esnext', // 构建目标
    chunkSizeWarningLimit: 1000, // 分块大小警告限制（KB）
    rollupOptions: {
      output: {
        // 手动分割代码
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        },
      },
    },
  },
})