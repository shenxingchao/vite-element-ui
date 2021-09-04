<script>
import { defineComponent, reactive, toRefs } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'

export default defineComponent({
  components: {},
  setup() {
    const $store = useStore()

    //定义router
    const $router = useRouter()
    const $route = useRoute()

    //数据对象
    let data = reactive({})

    return {
      ...toRefs(data),
    }
  },
})
</script>