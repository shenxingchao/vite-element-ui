<template>
  <el-config-provider :locale="locale">
    <router-view />
  </el-config-provider>
</template>
<script>
import { defineComponent } from 'vue'
//多语言
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'

export default defineComponent({
  components: {
    [ElConfigProvider.name]: ElConfigProvider, //多语言组件
  },
  setup() {
    //设置多语言
    const locale = zhCn

    return { locale }
  },
})
</script>
