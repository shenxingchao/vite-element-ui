<template>
  <div style="padding: 0 15px;" @click="toggleClick">
    <svg-icon :class="{'is-active':isActive}" class="hamburger" icon-class="collapse" />
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Hamburger',
  components: {},
  props: {
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  //组件发出的事件需要定义
  emits: ['toggleClick'],
  setup(props, { emit }) {
    const toggleClick = () => {
      emit('toggleClick')
    }
    return {
      toggleClick,
    }
  },
})
</script>

<style lang="scss" scoped>
.hamburger {
  display: inline-block;
  vertical-align: middle;
  color: $h1c;
  transition: all 0.3s linear;
}

.hamburger.is-active {
  transform: rotate(90deg);
}
</style>