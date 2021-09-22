import { constantRoutes } from '@/router'
// 导入要映射的组件
import map from '@/router/map'
// 导入后端根据角色请求动态路由方法
import { getPermissionRouter } from '../../api/user'

const view_modules = import.meta.glob('../../views/**/*.vue')
const layout = import.meta.glob('../../layout/index.vue')
const modules = Object.assign(view_modules, layout)

//读取缓存中的语言
const language = localStorage.lang || 'zh'

/**
 * 递归映射数组
 * @param {未映射路由数组} asyncRouterMap
 */
function routerMapComponet(asyncRouterMap) {
  if (typeof asyncRouterMap === 'undefined') {
    return
  }
  asyncRouterMap.forEach((value, index) => {
    if (typeof value.component === 'string') {
      if (typeof map[value.component] === 'undefined') {
        asyncRouterMap.splice(index, 1)
      }
      for (let key in modules) {
        let url = '../..' + map[value.component]
        if (url == key) {
          value.component = modules[key]
        }
      }

      if (value.meta) {
        value.meta.title = value.meta[language + '_title']
      }

      routerMapComponet(value.children)
    }
  })
  return asyncRouterMap
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let asyncRouterMap
      asyncRouterMap = []
      getPermissionRouter({ roles: roles }).then(res => {
        asyncRouterMap = res.data.concat({
          path: '/:pathMatch(.*)',
          component: () => import('/src/views/404.vue'),
          hidden: true
        }) // look https://next.router.vuejs.org/zh/guide/essentials/dynamic-matching.html#%E6%8D%95%E8%8E%B7%E6%89%80%E6%9C%89%E8%B7%AF%E7%94%B1%E6%88%96-404-not-found-%E8%B7%AF%E7%94%B1
        // 组建映射
        const asyncRouterMapRes = routerMapComponet(asyncRouterMap)
        commit('SET_ROUTES', asyncRouterMapRes)
        resolve(asyncRouterMapRes)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
