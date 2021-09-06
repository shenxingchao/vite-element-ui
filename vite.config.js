import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { loadEnv } from 'vite'
import { svgBuilder } from './src/plugins/svgBuilder'

function resolve(dir) {
  return path.join(__dirname, dir)
}

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const root = process.cwd()
  const env = loadEnv(mode, root) // https://www.jianshu.com/p/4973bd983e96

  return {
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
      postcss: {
        plugins: [
          require('autoprefixer'), //css自动前缀
          require('postcss-import') //支持@import写法
        ]
      },
      preprocessorOptions: {
        scss: {
          //注意这里sass变成了scss
          additionalData: `@import "@/styles/variables.scss";`
        }
      }
    },
    //共享配置
    base: env.VITE_BASE_URL, //开发环境或者生产环境的根路径，后面改掉
    build: {
      minify: true, //打包文件是否压缩  打包出来的css文件 @charset "UTF-8"; 重复添加  原因'node_modules/element-plus/dist/index.css' 里添加了@charset "UTF-8"; 强迫症可以去掉在打包
      target: 'es2015',
      sourcemap: false, //构建后是否生成 source map 文件
      brotliSize: false, // 启用/禁用 brotli 压缩大小报告。压缩大型输出文件可能会很慢，因此禁用该功能可能会提高大型项目的构建性能。
      chunkSizeWarningLimit: 2000 // chunk 大小警告的限制（以 kbs 为单位）。
    }
  }
})
