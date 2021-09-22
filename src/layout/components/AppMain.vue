<template>
  <section class="app-main">
    <router-view v-slot="{ Component,route }">
      <transition appear name="fade-slide" mode="out-in">
        <keep-alive :include="keep_alive_list">
          <component :is="Component" :key="route.name" />
        </keep-alive>
      </transition>
    </router-view>
  </section>
</template>

<script>
import { computed, defineComponent, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'AppMain',
  components: {},
  setup() {
    const $store = useStore()

    //定义router
    const $router = useRouter()

    const set = reactive({
      //缓存页面，点叉叉取消缓存，否则他会一直缓存
      keep_alive_list: computed(() => {
        //缓存路由名称白名单
        let white_list = []
        //打开页面中需要缓存的页面
        let cached = []
        //所有路由
        let data = $router.options.routes
        //递归找缓存方法
        let recursive = (white_list, data) => {
          data.forEach((element) => {
            if (element.meta && element.meta.keepAlive) {
              white_list.push(element.name)
            }
            if (element.children && element.children.length > 0) {
              recursive(white_list, element.children)
            }
          })
        }
        //递归找到所有需要缓存的路由名称数组
        recursive(white_list, data)
        //过滤当前打开路由中需要缓存的页面
        white_list.forEach((element) => {
          if ($store.state.tagsView.cachedViews.includes(element)) {
            cached.push(element)
          }
        })

        return cached
      }),
    })

    return {
      ...toRefs(set),
    }
  },
})
</script>


<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  flex: 1;
  width: 100%;
  position: relative;
  overflow: hidden;
}
</style>