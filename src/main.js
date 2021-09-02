import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// A modern alternative to CSS resets
import 'normalize.css/normalize.css'
//引入element plus
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
// global css
import './styles/index.scss'
//引入svg
import SvgPlugin from '@/components/SvgIcon'

//引入mock.js 模拟数据 开启这里 使用moke/index.js文件拦截
import './mock'

//App对象
const app = createApp(App)
//使用状态
app.use(store)
//使用路由
app.use(router)
//使用element plus
app.use(ElementPlus)
//使用svg
app.use(SvgPlugin, {
  imports: []
})
//挂载
app.mount('#app')
