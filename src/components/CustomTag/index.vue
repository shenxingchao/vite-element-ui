<template>
  <el-tag :type="type">{{title}}</el-tag>
</template>
<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'CustomTag',
  components: {},
  props: {
    type: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
  },
  setup() {
    return {}
  },
})
</script>