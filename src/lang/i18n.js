/* 语言统一在这里初始化 */
//引入vue-i18n组件
import { createI18n } from 'vue-i18n/index'
//引入自定义语言包
import messages from './index'

//引入element plus语言包
import enLocale from 'element-plus/es/locale/lang/en'
import zhLocale from 'element-plus/es/locale/lang/zh-cn'

//定义所用语言对应的element plus语言
let map_list = [{ en: enLocale }, { zh: zhLocale }]

//读取缓存中的语言
const language = localStorage.lang || 'zh'

//初始化i18n实例
const i18n = createI18n({
  fallbackLocale: 'ch',
  globalInjection: true,
  legacy: false, // you must specify 'legacy: false' option
  locale: language,
  messages,
  fallbackWarn: false,
  missingWarn: false
})

//找到element plus语言包
let elementPlusLang = map_list.find(item => {
  if (Object.keys(item).indexOf(language) !== -1) {
    return item
  }
})[language]

export { i18n, elementPlusLang }
