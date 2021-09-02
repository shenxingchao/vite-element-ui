import SvgIcon from './SvgIcon.vue'

const componentPlugin = {
  install: function (vue, options) {
    //注册svg组件
    vue.component(SvgIcon.name, SvgIcon)
  }
}
export default componentPlugin
