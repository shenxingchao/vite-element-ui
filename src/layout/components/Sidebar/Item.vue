<template>
  <i v-if="icon.includes('el-icon')" :class="icon + 'sub-el-icon'" />
  <svg-icon v-else :icon-class="icon" />
  <!-- bug -->
  <slot name='title'><span>{title}</span></slot>
  <!-- bug -->
</template>
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
  },
  components: {},

  setup() {
    return {}
  },
})
</script>
<style scoped>
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
</style>

