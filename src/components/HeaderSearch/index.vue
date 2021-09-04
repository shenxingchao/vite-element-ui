<template>
  <div :class="{'show':show}" class="header-search">
    <svg-icon class-name="search-icon" icon-class="search" @click.stop="click" />
    <el-select ref="headerSearchSelect" v-model="search" :remote-method="querySearch" filterable default-first-option
               remote placeholder="搜索" class="header-search-select" @change="change">
      <el-option v-for="item in options" :key="item.item.path" :value="item.item"
                 :label="item.item.title.join(' > ')" />
      <!-- fix bug fuse output  res in item keys see https://fusejs.io/examples.html#search-string-array outout tab -->
    </el-select>
  </div>
</template>

<script>
import {
  computed,
  defineComponent,
  nextTick,
  onMounted,
  reactive,
  ref,
  toRefs,
  watch,
} from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import Fuse from 'fuse.js'
import path from 'path-browserify'

export default defineComponent({
  name: 'HeaderSearch',
  components: {},
  setup() {
    const $store = useStore()

    //定义router
    const $router = useRouter()

    //数据对象
    let data = reactive({
      search: '',
      options: [],
      searchPool: [],
      show: false,
      fuse: undefined,
    })

    const headerSearchSelect = ref(null)

    const set = reactive({
      routes: computed(() => {
        return $store.getters.permission_routes
      }),
    })

    watch(set.routes, () => {
      data.searchPool = generateRoutes(set.routes)
    })

    watch(
      () => data.searchPool,
      (list) => {
        initFuse(list)
      }
    )

    watch(
      () => data.show,
      (value) => {
        if (value) {
          document.body.addEventListener('click', close)
        } else {
          document.body.removeEventListener('click', close)
        }
      }
    )

    onMounted(() => {
      data.searchPool = generateRoutes(set.routes)
    })

    const click = () => {
      data.show = !data.show
      if (data.show) {
        headerSearchSelect.value && headerSearchSelect.value.focus()
      }
    }

    const close = () => {
      headerSearchSelect.value && headerSearchSelect.value.blur()
      data.options = []
      data.show = false
    }

    const change = (val) => {
      $router.push(val.path)
      data.search = ''
      data.options = []
      nextTick(() => {
        data.show = false
      })
    }

    const initFuse = (list) => {
      data.fuse = new Fuse(list, {
        shouldSort: true,
        threshold: 0.4,
        location: 0,
        distance: 100,
        // maxPatternLength: 32,//fuse.js v6.4.1无此属性
        minMatchCharLength: 1,
        keys: [
          {
            name: 'title',
            weight: 0.7, //类似于权重
          },
          {
            name: 'path',
            weight: 0.3,
          },
        ],
      })
    }

    // Filter out the routes that can be displayed in the sidebar
    // And generate the internationalized title
    const generateRoutes = (routes, basePath = '/', prefixTitle = []) => {
      let res = []

      for (const router of routes) {
        // skip hidden router
        if (router.hidden) {
          continue
        }

        const data = {
          path: path.resolve(basePath, router.path),
          title: [...prefixTitle],
        }

        if (router.meta && router.meta.title) {
          data.title = [...data.title, router.meta.title]

          if (router.redirect !== 'noRedirect') {
            // only push the routes with title
            // special case: need to exclude parent router without redirect
            res.push(data)
          }
        }

        // recursive child routes
        if (router.children) {
          const tempRoutes = generateRoutes(
            router.children,
            data.path,
            data.title
          )
          if (tempRoutes.length >= 1) {
            res = [...res, ...tempRoutes]
          }
        }
      }
      return res
    }

    const querySearch = (query) => {
      if (query !== '') {
        data.options = data.fuse.search(query)
      } else {
        data.options = []
      }
    }

    return {
      ...toRefs(data),
      ...toRefs(set),
      headerSearchSelect,
      click,
      change,
      querySearch,
    }
  },
})
</script>

<style lang="scss" scoped>
.header-search {
  font-size: 0 !important;

  .search-icon {
    cursor: pointer;
    font-size: 18px;
    vertical-align: middle;
  }

  .header-search-select {
    font-size: 18px;
    transition: width 0.2s;
    width: 0;
    overflow: hidden;
    background: transparent;
    border-radius: 0;
    display: inline-block;
    vertical-align: middle;

    :deep(.el-input__inner) {
      border-radius: 0;
      border: 0;
      padding-left: 0;
      padding-right: 0;
      box-shadow: none !important;
      border-bottom: 1px solid #d9d9d9 !important;
      vertical-align: middle;
    }
  }

  &.show {
    .header-search-select {
      width: 210px;
      margin-left: 10px;
    }
  }
}
</style>
