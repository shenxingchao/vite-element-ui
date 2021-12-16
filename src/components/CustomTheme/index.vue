<template>
  <el-color-picker v-model="color" @change="handleChangeTheme()" popper-class="custom-theme" />
</template>
<script>
import { defineComponent, getCurrentInstance, reactive, ref, toRefs } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { mix } from '@/utils/tools'

export default defineComponent({
  name: 'CustomTheme',
  components: {},
  setup() {
    //当前组件实例
    const { proxy } = getCurrentInstance()
    //定义状态
    const $store = useStore()

    //定义router
    const $router = useRouter()
    const $route = useRoute()

    // 变量前缀
    const pre = '--el-color-primary'
    // 白色混合色
    const mixWhite = '#ffffff'
    // 黑色混合色
    const mixBlack = '#000000'

    //数据对象
    let data = reactive({
      color: localStorage.getItem('primaryColor') || '#2d8cf0',
    })

    /**
     * @description: 更改主题
     * @param {String} color 颜色
     */
    const handleChangeTheme = (color = data.color) => {
      const node = document.documentElement
      // 主色调
      node.style.setProperty(pre, color)
      localStorage.setItem('primaryColor', color)
      // 这里是覆盖原有颜色的核心代码
      for (let i = 1; i < 10; i += 1) {
        node.style.setProperty(
          `${pre}-light-${i}`,
          mix(color, mixWhite, i * 0.1)
        )
      }
      node.style.setProperty(
        '--el-color-primary-dark',
        mix(color, mixBlack, 0.1)
      )
      // 本地缓存style，样式持久化，你也可以存在后端
      localStorage.setItem('style', node.style.cssText)
    }

    return {
      ...toRefs(data),
      handleChangeTheme,
    }
  },
})
</script>
<style lang="scss">
.custom-theme {
  z-index: 9999999 !important;
}
</style>