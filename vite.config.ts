import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [vue()],
  resolve:{
    alias: {
      "@": '/src/'
    }
  },
  build:{
    commonjsOptions: {
      transformMixedEsModules: true,
    }
  },
  server: {
    host: 'localhost',
    port: 5713,
    https: false,
    proxy: {
      '/video/':{
        target: 'https://pi.yysf.xin:8081/',
        changeOrigin: true,
      },
      '/api': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/config': {
        target: 'http://192.168.123.134:8080',
        changeOrigin: true,
        rewrite: (path) => {
          return path.replace(/^\/config/, '');
        },
      }
    }
  }
})
