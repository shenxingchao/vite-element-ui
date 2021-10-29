//导入svgicon库
import * as ElIconModules from '@element-plus/icons'

const componentInstall = {
  install: function (app, options) {
    // 统一注册el-icon图标
    for (let iconName in ElIconModules) {
      app.component(iconName, ElIconModules[iconName])
    }
  }
}

export default componentInstall
