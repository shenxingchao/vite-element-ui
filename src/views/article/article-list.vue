<template>
  <div>
    123
  </div>
</template>
<script>
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  components: {},
  setup() {
    const router = useRouter()

    return { router }
  },
})
</script>