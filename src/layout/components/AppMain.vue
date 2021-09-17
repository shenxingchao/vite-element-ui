<template>
  <section class="app-main">
    <router-view v-slot="{ Component }">
      <transition appear name="fade-slide" mode="out-in">
        <keep-alive :include="cachedViews">
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>
  </section>
</template>

<script>
import { computed, defineComponent, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'AppMain',
  components: {},
  setup() {
    const $store = useStore()

    const set = reactive({
      cachedViews: computed(() => {
        return $store.getters.cachedViews
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