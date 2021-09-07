import SvgIcon from './SvgIcon.vue'

const componentPlugin = {
  install: function (app, options) {
    //注册svg组件
    app.component(SvgIcon.name, SvgIcon)
  }
}
export default componentPlugin
