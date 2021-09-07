//全局变量插件 这里循环创建 参考https://blog.csdn.net/qq_41636947/article/details/117907448
//ps 用注入器每次都得在setup内定义，不然在非组件函数里直接调用会报错，所以不采用
//示例 $log 可删除
//用法 const { proxy } = getCurrentInstance() proxy/$log

const createProvide = values => {
  return {
    install: function (app, options) {
      for (let key in values) {
        let value = values[key]
        app.config.globalProperties[key] = value
      }
    }
  }
}

export default createProvide({
  $log: content => {
    console.log(content)
  }
})
