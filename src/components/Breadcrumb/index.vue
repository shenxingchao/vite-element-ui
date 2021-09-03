<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
        <span v-if="item.redirect==='noRedirect'||index==levelList.length-1"
              class="no-redirect">{{ item.meta.title }}</span>
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import { defineComponent, reactive, toRefs, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import pathToRegexp from 'path-to-regexp'

export default defineComponent({
  components: {},
  setup() {
    //定义router
    const $router = useRouter()
    const $route = useRoute()

    //数据对象
    let data = reactive({
      levelList: null,
    })

    watch($route, () => {
      getBreadcrumb()
    })

    const getBreadcrumb = () => {
      // only show routes with meta.title
      let matched = $route.matched.filter(
        (item) => item.meta && item.meta.title
      )
      const first = matched[0]

      if (!isDashboard(first)) {
        matched = [
          {
            path: '/dashboard',
            meta: { title: '控制台' },
          },
        ].concat(matched)
      }

      data.levelList = matched.filter(
        (item) => item.meta && item.meta.title && item.meta.breadcrumb !== false
      )
    }

    const isDashboard = (route) => {
      const name = route && route.name
      if (!name) {
        return false
      }
      return name.trim().toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase()
    }

    const pathCompile = (path) => {
      // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
      const { params } = $route
      var toPath = pathToRegexp.compile(path)
      return toPath(params)
    }

    const handleLink = (item) => {
      const { redirect, path } = item
      if (redirect) {
        $router.push(redirect)
        return
      }
      $router.push(this.pathCompile(path))
    }

    //相当于在created里执行 https://vue3js.cn/docs/zh/api/composition-api.html#%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E9%92%A9%E5%AD%90
    getBreadcrumb()

    return { ...toRefs(data), pathCompile, handleLink }
  },
})
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
//已完成