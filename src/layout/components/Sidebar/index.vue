<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu :default-active="activeMenu" :collapse="isCollapse" :background-color="variables.menuBg"
               :text-color="variables.menuText" :unique-opened="false" :active-text-color="variables.menuActiveText"
               :collapse-transition="false" mode="vertical">
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>
<script>
import { defineComponent, computed, reactive, toRefs } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'

import Logo from './Logo.vue'
import SidebarItem from './SidebarItem.vue'
import variables from '@/styles/variables.scss'

export default defineComponent({
  components: { Logo, SidebarItem },
  setup() {
    const $store = useStore()

    //定义router
    const $router = useRouter()
    const $route = useRoute()

    const set = reactive({
      routes: computed(() => {
        // console.log(router.options.routes)
        return $router.options.routes
      }),
      activeMenu: computed(() => {
        const _route = $route
        const { meta, path } = _route
        // if set path, the sidebar will highlight the path you set
        if (meta.activeMenu) {
          return meta.activeMenu
        }
        return path
      }),
      showLogo: computed(() => {
        return $store.state.settings.sidebarLogo
      }),
      variables: computed(() => {
        return variables
      }),
      isCollapse: computed(() => {
        return !$store.getters.sidebar.opened
      }),
    })

    return {
      ...toRefs(set),
    }
  },
})
</script>
//已完成