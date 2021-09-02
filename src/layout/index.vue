<template>
  3333
  <router-view />
</template>
<script>
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'Layout',
  components: {},
  setup() {
    const router = useRouter()

    return { router }
  },
})
</script>
