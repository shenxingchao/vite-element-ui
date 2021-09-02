import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { svgBuilder } from './src/plugins/svgBuilder'

function resolve(dir) {
  return path.join(__dirname, dir)
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    svgBuilder('./src/assets/svg/') //svg加载插件 https://segmentfault.com/a/1190000039255368?utm_source=tag-newest
  ],
  //解析
  resolve: {
    //别名
    alias: {
      '@': resolve('src')
    }
  },
  //配置全局css https://cn.vitejs.dev/config/#css-preprocessoroptions
  css: {
    preprocessorOptions: {
      scss: {
        //注意这里sass变成了scss
        additionalData: `@import "@/styles/common.scss";`
      }
    }
  }
})
