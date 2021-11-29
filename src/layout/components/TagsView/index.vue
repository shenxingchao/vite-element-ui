<template>
  <div id="tags-view-container" class="tags-view-container">
    <el-scrollbar ref="scrollContainer" class="scroll-container" wrap-class="tags-view-wrapper" @scroll="handleScroll"
                  @wheel.prevent="handleScrollBar">
      <router-link v-for="tag in visitedViews" :ref="setTagRef" :key="tag.path" :class="isActive(tag)?'active':''"
                   :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }" tag="span" class="tags-view-item"
                   @click.middle="!isAffix(tag)?closeSelectedTag(tag):''" @contextmenu.prevent="openMenu(tag,$event)">
        <span style="vertical-align: middle;"> {{ tag.title }} </span>
        <el-icon v-if="!isAffix(tag)" class="icon" @click.prevent.stop="closeSelectedTag(tag)"
                 style="margin-left:4px;vertical-align: middle;">
          <close />
        </el-icon>
      </router-link>
    </el-scrollbar>
    <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
      <li @click="refreshSelectedTag(selectedTag)">刷新</li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">关闭当前</li>
      <li @click="closeOthersTags">关闭其他</li>
      <li @click="closeAllTags(selectedTag)">关闭所有</li>
    </ul>
  </div>
</template>

<script>
import {
  defineComponent,
  getCurrentInstance,
  reactive,
  toRefs,
  ref,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
  nextTick,
} from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import path from 'path-browserify'

export default defineComponent({
  components: {},
  setup() {
    //当前组件实例
    const { proxy } = getCurrentInstance()

    //store
    const $store = useStore()

    //定义router
    const $router = useRouter()
    const $route = useRoute()

    //数据对象
    let data = reactive({
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {},
      affixTags: [],
    })

    //refs dom对象
    let tagRefList = []

    const setTagRef = (el) => {
      tagRefList.push(el)
    }

    const tagAndTagSpacing = 4 // tagAndTagSpacing

    const scrollContainer = ref(null)

    const set = reactive({
      visitedViews: computed(() => {
        return $store.getters.visitedViews
      }),
      routes: computed(() => {
        return $store.getters.permission_routes
      }),
    })

    const scrollWrapper = computed(() => {
      return scrollContainer.value.$refs.wrap$
    })

    watch($route, () => {
      addTags()
      moveToCurrentTag()
    })

    watch(
      () => data.visible,
      (value) => {
        if (value) {
          document.body.addEventListener('click', closeMenu)
        } else {
          document.body.removeEventListener('click', closeMenu)
        }
      }
    )

    onMounted(() => {
      initTags()
      addTags()
      scrollWrapper.value.addEventListener('scroll', handleScroll, true)
    })

    onBeforeUnmount(() => {
      scrollWrapper.value.removeEventListener('scroll', handleScroll)
    })

    const isActive = (route) => {
      return route.path === $route.path
    }

    const isAffix = (tag) => {
      return tag.meta && tag.meta.affix
    }

    const filterAffixTags = (routes, basePath = '/') => {
      let tags = []
      routes.forEach((route) => {
        if (route.meta && route.meta.affix) {
          const tagPath = path.resolve(basePath, route.path)
          tags.push({
            fullPath: tagPath,
            path: tagPath,
            name: route.name,
            meta: { ...route.meta },
          })
        }
        if (route.children) {
          const tempTags = filterAffixTags(route.children, route.path)
          if (tempTags.length >= 1) {
            tags = [...tags, ...tempTags]
          }
        }
      })
      return tags
    }

    const initTags = () => {
      const affixTags = (data.affixTags = filterAffixTags(set.routes))
      for (const tag of affixTags) {
        // Must have tag name
        if (tag.name) {
          $store.dispatch('tagsView/addVisitedView', tag)
        }
      }
    }

    const addTags = () => {
      const { name } = $route
      if (name) {
        $store.dispatch('tagsView/addView', $route)
      }
      return false
    }

    const moveToCurrentTag = () => {
      const tags = tagRefList
      nextTick(() => {
        for (const tag of tags) {
          if (tag && tag.to.path === $route.path) {
            //fix tag is null
            moveToTarget(tag)
            // when query is different then update
            if (tag.to.fullPath !== $route.fullPath) {
              $store.dispatch('tagsView/updateVisitedView', $route)
            }
            break
          }
        }
      })
    }

    const refreshSelectedTag = (view) => {
      $store.dispatch('tagsView/delCachedView', view).then(() => {
        const { fullPath } = view
        nextTick(() => {
          $router.replace({
            path: '/redirect' + fullPath,
          })
        })
      })
    }

    const closeSelectedTag = (view) => {
      $store.dispatch('tagsView/delView', view).then(({ visitedViews }) => {
        if (isActive(view)) {
          toLastView(visitedViews, view)
        }
      })
    }

    const closeOthersTags = () => {
      $router.push(data.selectedTag)
      $store.dispatch('tagsView/delOthersViews', data.selectedTag).then(() => {
        moveToCurrentTag()
      })
    }

    const closeAllTags = (view) => {
      $store.dispatch('tagsView/delAllViews').then(({ visitedViews }) => {
        if (data.affixTags.some((tag) => tag.fullPath === $route.path)) {
          return
        }
        toLastView(visitedViews, view)
      })
    }

    const toLastView = (visitedViews, view) => {
      const latestView = visitedViews.slice(-1)[0]
      if (latestView) {
        $router.push(latestView.fullPath)
      } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (view.name === 'Dashboard') {
          // to reload home page
          $router.replace({ path: '/redirect' + view.fullPath })
        } else {
          $router.push('/')
        }
      }
    }

    const openMenu = (tag, e) => {
      const menuMinWidth = 105

      const offsetLeft = proxy.$el.getBoundingClientRect().left // container margin left
      const offsetWidth = proxy.$el.offsetWidth // container width
      const maxLeft = offsetWidth - menuMinWidth // left boundary
      const left = e.clientX - offsetLeft + 15 // 15: margin right

      if (left > maxLeft) {
        data.left = maxLeft
      } else {
        data.left = left
      }

      data.top = 39
      data.visible = true
      data.selectedTag = tag
    }

    const closeMenu = () => {
      data.visible = false
    }

    const handleScroll = () => {
      closeMenu()
    }

    const handleScrollBar = (e) => {
      const eventDelta = e.wheelDelta || -e.deltaY * 40
      const $scrollWrapper = scrollWrapper.value
      $scrollWrapper.scrollLeft = $scrollWrapper.scrollLeft + eventDelta / 4
    }

    const moveToTarget = (currentTag) => {
      const $container = scrollContainer.value.$el
      const $containerWidth = $container.offsetWidth
      const $scrollWrapper = scrollWrapper.value
      const tagList = tagRefList

      let firstTag = null
      let lastTag = null

      // find first tag and last tag
      if (tagList.length > 0) {
        firstTag = tagList[0]
        lastTag = tagList[tagList.length - 1]
      }

      if (firstTag === currentTag) {
        $scrollWrapper.scrollLeft = 0
      } else if (lastTag === currentTag) {
        $scrollWrapper.scrollLeft = $scrollWrapper.scrollWidth - $containerWidth
      } else {
        // find preTag and nextTag
        const currentIndex = tagList.findIndex((item) => item === currentTag)
        const prevTag = tagList[currentIndex - 1]
        const nextTag = tagList[currentIndex + 1]

        // the tag's offsetLeft after of nextTag
        const afterNextTagOffsetLeft =
          nextTag.$el.offsetLeft + nextTag.$el.offsetWidth + tagAndTagSpacing

        // the tag's offsetLeft before of prevTag
        const beforePrevTagOffsetLeft =
          prevTag.$el.offsetLeft - tagAndTagSpacing

        if (
          afterNextTagOffsetLeft >
          $scrollWrapper.scrollLeft + $containerWidth
        ) {
          $scrollWrapper.scrollLeft = afterNextTagOffsetLeft - $containerWidth
        } else if (beforePrevTagOffsetLeft < $scrollWrapper.scrollLeft) {
          $scrollWrapper.scrollLeft = beforePrevTagOffsetLeft
        }
      }
    }

    return {
      ...toRefs(data),
      setTagRef,
      ...toRefs(set),
      scrollContainer,
      isActive,
      isAffix,
      refreshSelectedTag,
      closeSelectedTag,
      closeOthersTags,
      closeAllTags,
      openMenu,
      handleScroll,
      handleScrollBar,
    }
  },
})
</script>


<style lang="scss" scoped>
:deep(.scroll-container) {
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  width: 100%;
  .el-scrollbar__bar {
    bottom: 0px;
  }
  .el-scrollbar__wrap {
    height: 56px;
  }
}
.tags-view-container {
  z-index: 2;
  height: 42px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
  position: relative;
  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 34px;
      line-height: 34px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 5px;
      border-radius: 4px;
      &:first-of-type {
        margin-left: 15px;
      }
      &:last-of-type {
        margin-right: 15px;
      }
      &.active {
        background-color: $theme;
        color: #fff;
        border-color: $theme;
        &::before {
          content: '';
          background: #fff;
          display: inline-block;
          vertical-align: middle;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>

<style lang="scss">
//reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    .icon {
      width: 16px;
      height: 16px;
      line-height: 21px;
      border-radius: 50%;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transform-origin: 100% 50%;
      font-size: 12px;
      &:hover {
        background-color: $h3c;
        color: #fff;
      }
    }
  }
}
</style>