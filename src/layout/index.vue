<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" />
    <div :class="{hasTagsView:needTagsView}" class="main-container">
      <div :class="{'fixed-header':fixedHeader}">
        <navbar />
        <tags-view v-if="needTagsView" />
      </div>
      <app-main />
      <right-panel v-if="showSettings">
        <settings />
      </right-panel>
    </div>
  </div>
</template>
<script>
import {
  computed,
  defineComponent,
  reactive,
  toRefs,
  watch,
  onMounted,
  onBeforeMount,
  onBeforeUnmount,
} from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import RightPanel from '@/components/RightPanel/index.vue'
import { Sidebar, Navbar, TagsView, AppMain, Settings } from './components'

export default defineComponent({
  name: 'Layout',
  components: {
    Sidebar,
    Navbar,
    TagsView,
    AppMain,
    RightPanel,
    Settings,
  },
  setup() {
    const $store = useStore()

    //定义router
    const $route = useRoute()

    const { body } = document
    const WIDTH = 992 // refer to Bootstrap's responsive design

    const set = reactive({
      sidebar: computed(() => {
        return $store.getters.sidebar
      }),
      device: computed(() => {
        return $store.getters.device
      }),
      showSettings: computed(() => {
        return $store.getters.showSettings
      }),
      needTagsView: computed(() => {
        return $store.getters.tagsView
      }),
      fixedHeader: computed(() => {
        return $store.getters.fixedHeader
      }),
      classObj: computed(() => {
        return {
          hideSidebar: !set.sidebar.opened,
          openSidebar: set.sidebar.opened,
          withoutAnimation: set.sidebar.withoutAnimation,
          mobile: set.device === 'mobile',
        }
      }),
    })

    watch($route, () => {
      if (set.device === 'mobile' && set.sidebar.opened) {
        $store.dispatch('app/closeSideBar', { withoutAnimation: false })
      }
    })

    onMounted(() => {
      const isMobile = _isMobile()
      if (isMobile) {
        $store.dispatch('app/toggleDevice', 'mobile')
        $store.dispatch('app/closeSideBar', { withoutAnimation: true })
      }
    })

    onBeforeMount(() => {
      window.addEventListener('resize', _resizeHandler)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', _resizeHandler)
    })

    const handleClickOutside = () => {
      $store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }

    const _isMobile = () => {
      const rect = body.getBoundingClientRect()
      return rect.width - 1 < WIDTH
    }

    const _resizeHandler = () => {
      if (!document.hidden) {
        const isMobile = _isMobile()
        $store.dispatch('app/toggleDevice', isMobile ? 'mobile' : 'desktop')

        if (isMobile) {
          $store.dispatch('app/closeSideBar', { withoutAnimation: true })
        }
      }
    }

    return { ...toRefs(set), handleClickOutside }
  },
})
</script>

<style lang="scss" scoped>
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
</style>
