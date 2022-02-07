import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// A modern alternative to CSS resets
import 'normalize.css/normalize.css'
//引入element plus
import ElementPlus from 'element-plus'
// import 'element-plus/dist/index.css' 如果要用这个 那么去掉/src/styles/index.scss里的element scss引用
import zhCn from 'element-plus/es/locale/lang/zh-cn'
// index scss
import './styles/index.scss'
//引入svg
import SvgPlugin from '@/components/SvgIcon'
// permission control
import '@/permission'
//引入mock.js 模拟数据 开启这里 使用moke/index.js文件拦截
import './mock'
//引入全局变量
import provide from '@/plugins/provide'
//引入全局组件：elIcon
import componentInstall from '@/plugins/componentInstall'

//App对象
const app = createApp(App)
//使用状态
app.use(store)
//使用路由
app.use(router)
//使用element plus
app.use(ElementPlus, {
  locale: zhCn
})
//使用svg
app.use(SvgPlugin, {
  imports: []
})
//使用全局变量
app.use(provide)
//使用全局组件
app.use(componentInstall)
//挂载
app.mount('#app')
