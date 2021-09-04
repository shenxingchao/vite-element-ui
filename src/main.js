import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// A modern alternative to CSS resets
import 'normalize.css/normalize.css'
//引入element plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
// index scss
import './styles/index.scss'
//引入svg
import SvgPlugin from '@/components/SvgIcon'
// permission control
import '@/permission'
//引入mock.js 模拟数据 开启这里 使用moke/index.js文件拦截
import './mock'
//引入dialog组件可拖拽指令 使用方法 标签上加上v-el-drag-dialog即可
import elDragDialog from '@/directive/el-drag-dialog'

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
app.use(elDragDialog)
//挂载
app.mount('#app')
