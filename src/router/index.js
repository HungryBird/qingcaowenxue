import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/tuiguangImg',
    component: () => import('@/pages/novelManagement/tuiguangImg')
  },
  {
    path: '/tuiguangText',
    component: () => import('@/pages/novelManagement/tuiguangText')
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [

  {
    path: '/wechat',
    component: Layout,
    redirect: '/wechat/base-config',
    name: 'wechat',
    alwaysShow: true,
    meta: {
      title: '微信管理',
      icon: 'wechat'
    },
    children: [
      {
        path: 'base-config',
        component: () => import('@/pages/wechat/index'),
        name: 'BaseConfig',
        meta: { title: '基本配置' }
      }
    ]
  },
  {
    path: '/proxy',
    component: Layout,
    redirect: '/proxy/list',
    name: 'proxy',
    alwaysShow: true,
    meta: {
      title: '代理管理',
      icon: 'peoples'
    },
    children: [
      {
        path: 'list',
        component: () => import('@/pages/proxy/list'),
        name: 'proxy-list',
        meta: { title: '代理列表' }
      }
    ]
  },
  {
    path: '/novelManagement',
    component: Layout,
    redirect: '/novelManagement/novelManagement',
    name: 'novelManagement',
    alwaysShow: true,
    meta: {
      title: '小说管理',
      icon: 'list'
    },
    children: [
      {
        path: 'novelManagement',
        component: () => import('@/pages/novelManagement/novelManagement'),
        name: 'novel-management',
        meta: { title: '小说管理' }
      },
      {
        path: 'categoriesManagement',
        component: () => import('@/pages/novelManagement/categoriesManagement'),
        name: 'catogories-management',
        meta: { title: '分类管理' }
      }
    ]
  },
  {
    path: '/recommed',
    component: Layout,
    redirect: '/recommend/list',
    name: 'recommend',
    alwaysShow: true,
    meta: {
      title: '推荐位管理',
      icon: 'guide'
    },
    children: [
      {
        path: 'list',
        component: () => import('@/pages/recommend/list'),
        name: 'recommend-list',
        meta: { title: '推荐位列表' }
      }
    ]
  },
  {
    path: '/financialManagement',
    component: Layout,
    redirect: '/financialManagement/proxyOrder',
    name: 'financial-management',
    alwaysShow: true,
    meta: {
      title: '财务管理',
      icon: 'money'
    },
    children: [
      {
        path: 'list',
        component: () => import('@/pages/financialManagement/proxyOrder'),
        name: 'proxy-order',
        meta: { title: '代理提现单' }
      }
    ]
  },
  {
    path: '/promoteManagement',
    component: Layout,
    redirect: '/promoteManagement/list',
    name: 'promote-management',
    alwaysShow: true,
    meta: {
      title: '推广管理',
      icon: 'star'
    },
    children: [
      {
        path: 'list',
        component: () => import('@/pages/promoteManagement/list'),
        name: 'promote-list',
        meta: { title: '推广列表' }
      },
      {
        path: 'mass',
        component: () => import('@/pages/promoteManagement/mass'),
        name: 'promote-mass',
        meta: { title: '群发推广' }
      },
      {
        path: 'activity',
        component: () => import('@/pages/promoteManagement/activity'),
        name: 'promote-mass',
        meta: { title: '促销活动' }
      },
      {
        path: 'keywords',
        component: () => import('@/pages/promoteManagement/keywords'),
        name: 'keywords',
        meta: { title: '关键字回复' }
      }
    ]
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
