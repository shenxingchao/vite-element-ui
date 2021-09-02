<template>
  <div>
    <svg-icon :icon-class="isFullscreen?'exit-fullscreen':'fullscreen'" @click="click" />
  </div>
</template>

<script>
import {
  defineComponent,
  getCurrentInstance,
  reactive,
  toRefs,
  onMounted,
  onBeforeUnmount,
} from 'vue'
import screenfull from 'screenfull'

export default defineComponent({
  components: {},
  setup() {
    //当前组件实例
    const internalInstance = getCurrentInstance()

    //访问 globalProperties
    const global = internalInstance?.appContext.config.globalProperties

    //数据对象
    let data = reactive({
      isFullscreen: false,
    })

    const click = () => {
      if (!screenfull.isEnabled) {
        //fix bug enable attribute name error
        global.$message({
          message: 'you browser can not work',
          type: 'warning',
        })
        return false
      }
      screenfull.toggle()
    }

    const change = () => {
      data.isFullscreen = screenfull.isFullscreen
    }

    const init = () => {
      if (screenfull.enabled) {
        screenfull.on('change', change)
      }
    }
    const destroy = () => {
      if (screenfull.enabled) {
        screenfull.off('change', change)
      }
    }

    onMounted(() => {
      init()
    })

    onBeforeUnmount(() => {
      destroy()
    })

    return {
      ...toRefs(data),
      click,
    }
  },
})
</script>

<style scoped>
.screenfull-svg {
  display: inline-block;
  cursor: pointer;
  fill: #5a5e66;
  width: 20px;
  height: 20px;
  vertical-align: 10px;
}
</style>
//已完成