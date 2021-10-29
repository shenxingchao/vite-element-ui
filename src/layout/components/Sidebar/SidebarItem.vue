<template>
  <div v-if="!item.hidden">
    <template v-if="hasOneShowingChild(item.children,item) 
      && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow">
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{'submenu-title-noDropdown':!isNest}">
          <i v-if="onlyOneChild.meta.icon.includes('el-icon')"
             :class="onlyOneChild.meta.icon||(item.meta&&item.meta.icon) + 'sub-el-icon'" />
          <svg-icon v-else :icon-class="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)" />
          <template #title>
            <span>{{onlyOneChild.meta.title}}</span>
          </template>
        </el-menu-item>
      </app-link>
    </template>
    <el-sub-menu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
      <template v-if="item.meta" #title>
        <i v-if="item.meta.icon.includes('el-icon')" :class="item.meta && item.meta.icon + 'sub-el-icon'" />
        <svg-icon v-else :icon-class="item.meta && item.meta.icon" />
        <span>{{item.meta.title}}</span>
      </template>
      <sidebar-item v-for="child in item.children" :key="child.path" :is-nest="true" :item="child"
                    :base-path="resolvePath(child.path)" class="nest-menu" />
    </el-sub-menu>
  </div>
</template>
<script>
import { defineComponent, reactive, toRefs } from 'vue'
import path from 'path-browserify'
import { isExternal } from '@/utils/validate'
import AppLink from './Link.vue'

export default defineComponent({
  name: 'SidebarItem',
  components: {
    AppLink,
  },
  props: {
    // route object
    item: {
      type: Object,
      required: true,
    },
    isNest: {
      type: Boolean,
      default: false,
    },
    basePath: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    //数据对象
    let data = reactive({
      onlyOneChild: {},
    })

    const hasOneShowingChild = (children = [], parent) => {
      const showingChildren = children.filter((item) => {
        if (item.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          data.onlyOneChild = item
          return true
        }
      })

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        data.onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    }

    const resolvePath = (routePath) => {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(props.basePath)) {
        return props.basePath
      }
      return path.resolve(props.basePath, routePath)
    }

    return {
      ...toRefs(data),
      hasOneShowingChild,
      resolvePath,
    }
  },
})
</script>