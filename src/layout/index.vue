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
      <!-- <right-panel v-if="showSettings">
        <settings />
      </right-panel> -->
    </div>
  </div>
</template>
<script>
import { computed, defineComponent, reactive, toRefs } from 'vue'
import RightPanel from '@/components/RightPanel/index.vue'
import { Sidebar, Navbar, TagsView, AppMain, Settings } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapState, useStore } from 'vuex'

export default defineComponent({
  name: 'Layout',
  components: {
    Sidebar,
    Navbar,
    TagsView,
    AppMain,
  },
  // mixins: [ResizeMixin],
  setup() {
    const $store = useStore()

    const set = reactive({
      sidebar: computed(() => {
        return $store.getters.sidebar
      }),
      device: computed(() => {
        return $store.getters.device
      }),
      showSettings: computed(() => {
        return $store.state.settings.showSettings
      }),
      needTagsView: computed(() => {
        return $store.state.settings.tagsView
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

    const handleClickOutside = () => {
      $store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }

    return { ...toRefs(set), handleClickOutside }
  },
})
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';
@import '@/styles/variables.scss';

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
