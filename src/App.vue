<template>
  <router-view />
</template>
<script>
import { defineComponent, onMounted } from 'vue'
export default defineComponent({
  components: {},
  setup() {
    onMounted(() => {
      //读取缓存中的主题颜色
      const style = localStorage.getItem('style')
      document.documentElement.style.cssText = style && style
    })
    return {}
  },
})
</script>
