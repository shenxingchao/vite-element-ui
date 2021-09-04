<script>
import { defineComponent, h } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export default defineComponent({
  components: {},
  setup() {
    //定义router
    const $router = useRouter()
    const $route = useRoute()

    const { params, query } = $route
    const { path } = params

    $router.replace({ path: '/' + path, query })

    return () => {
      return h('div')
    }
  },
})
</script>