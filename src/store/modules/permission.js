import { asyncRoutes, constantRoutes } from '@/router'
import { getRouter } from '@/api/user'
import Layout from '@/layout'
/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * 后台查询的菜单数据拼装成路由格式的数据
 * @param routes
 */
export function generaMenu(routes, data) {
//  routes = []
  data.forEach(item => {
    // alert(JSON.stringify(item))
    const menu = {
      path: item.name,
      // component: item.name === '#' ? Layout : () => import(`@/pages${item.name}`),
      // alwaysShow: true,
      children: [],
      name: item.name,
      meta: { title: item.title, icon: item.icon, roles: ['admin'] }
    }
    if (item.children) {
      generaMenu(menu.children, item.children)
    }
    routes.push(menu)
  })
  console.log('routes',routes)
}

/** 
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
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
      const loadMenuData = []
      //const asyncRoutes = []

      getRouter().then(res => {
        let data = res
        if (res.code === 0) {
          data = res.data.menu
          Object.assign(loadMenuData, data)
          generaMenu(asyncRoutes, loadMenuData)

          let accessedRoutes

          if (roles.includes('res2211')) {
            accessedRoutes = asyncRoutes || []
          } else {
            accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
          } 
          commit('SET_ROUTES', accessedRoutes)
          resolve(accessedRoutes)
          console.log('res2211', res)
        }
      })

      //  accessedRoutes = res.data.menu
    })
  }
}

/*
const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
} */

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
