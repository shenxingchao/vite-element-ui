import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// css 样式重置
import 'normalize.css/normalize.css'
//引入element plus
import ElementPlus from 'element-plus'
// import 'element-plus/dist/index.css' 如果要用这个 那么去掉/src/styles/index.scss里的element scss引用
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
//引入全局变量
import provide from '@/plugins/provide'
//引入i18n
import { i18n, elementPlusLang } from './lang/i18n'

//App对象
const app = createApp(App)

//使用状态
app.use(store)
//使用路由
app.use(router)
//使用element plus
app.use(ElementPlus, {
  locale: elementPlusLang
})
//使用svg
app.use(SvgPlugin, {
  imports: []
})
//使用拖动指令
app.use(elDragDialog)
//使用全局变量
app.use(provide)
//使用i18n
app.use(i18n)

//挂载
app.mount('#app')
