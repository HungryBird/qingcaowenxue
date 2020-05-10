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
    path: '/tuiguang',
    component: () => import('@/pages/novels/tuiguang')
  },
  {
    path: '/',
    component: Layout,
    redirect: '/proxy'
    /* children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
      }
    ] */
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  // {
  //   path: '/notice',
  //   component: Layout,
  //   redirect: '/notice/list',
  //   name: 'notice',
  //   alwaysShow: true,
  //   meta: {
  //     title: '公告管理',
  //     iconType: 'element',
  //     icon: 'message'
  //   },
  //   children: [
  //     {
  //       path: 'list',
  //       component: () => import('@/pages/notice/list'),
  //       name: 'notice-list',
  //       meta: { title: '公告列表' }
  //     }
  //   ]
  // },
  // {
  //   path: '/stat',
  //   component: Layout,
  //   redirect: '/stat/stat',
  //   name: 'stat',
  //   alwaysShow: true,
  //   meta: {
  //     title: '数据统计管理',
  //     icon: 'chart'
  //   },
  //   children: [
  //     {
  //       path: 'stat',
  //       component: () => import('@/pages/stat/stat'),
  //       name: 'stat-stat',
  //       meta: {
  //         title: '数据统计'
  //       }
  //     }
  //   ]
  // },
  {
    path: '/wechat',
    component: Layout,
    redirect: '/wechat/base-config',
    name: 'wechat',
    alwaysShow: true,
    meta: {
      title: '公众号管理',
      icon: 'fa fa-wechat'
    },
    children: [
      /* {
        path: 'base-config',
        component: () => import('@/pages/wechat/baseConfig'),
        name: 'BaseConfig',
        meta: { title: '基本配置' }
      }, */
      {
        path: 'wechat-list',
        component: () => import('@/pages/wechat/wechatList'),
        name: 'wechat-list',
        meta: { title: '公众号列表' }
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
      icon: 'fa fa-user'
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
    path: '/novels',
    component: Layout,
    redirect: '/novels/novels',
    name: 'novels',
    alwaysShow: true,
    meta: {
      title: '小说管理',
      icon: 'fa fa-bars'
    },
    children: [
      {
        path: 'novels',
        component: () => import('@/pages/novels/novels'),
        name: 'novel-management',
        meta: { title: '小说管理' }
      },
      {
        path: 'categories',
        component: () => import('@/pages/novels/categories'),
        name: 'catogories-management',
        meta: { title: '分类管理' }
      },
      {
        path: 'carousel',
        component: () => import('@/pages/novels/carousel'),
        name: 'carousel-management',
        meta: { title: '轮播管理' }
      },
      {
        path: 'filtration',
        component: () => import('@/pages/novels/filtration'),
        name: 'filtration',
        meta: { title: '过滤管理' }
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
      icon: 'fa fa-space-shuttle'
    },
    children: [
      {
        path: 'list',
        component: () => import('@/pages/recommend/list'),
        name: 'recommend-list',
        meta: { title: '推荐位列表' }
      },
      {
        path: 'list-2',
        component: () => import('@/pages/recommend/list-2'),
        name: 'recommend-list-2',
        meta: { title: '榜单' }
      }
    ]
  },
  // {
  //   path: '/financial',
  //   component: Layout,
  //   redirect: '/financial/proxyOrder',
  //   name: 'financial-management',
  //   alwaysShow: true,
  //   meta: {
  //     title: '财务管理',
  //     icon: 'money'
  //   },
  //   children: [
  //     {
  //       path: 'proxyOrder',
  //       component: () => import('@/pages/financial/proxyOrder'),
  //       name: 'proxy-order',
  //       meta: { title: '代理提现单' }
  //     }
  //   ]
  // },
  // {
  //   path: '/promote',
  //   component: Layout,
  //   redirect: '/promote/list',
  //   name: 'promote-management',
  //   alwaysShow: true,
  //   meta: {
  //     title: '推广管理',
  //     icon: 'star'
  //   },
  //   children: [
  //     {
  //       path: 'list',
  //       component: () => import('@/pages/promote/list'),
  //       name: 'promote-list',
  //       meta: { title: '推广列表' }
  //     },
  //     {
  //       path: 'mass',
  //       component: () => import('@/pages/promote/mass'),
  //       name: 'promote-mass',
  //       meta: { title: '群发推广' }
  //     },
  //     {
  //       path: 'activity',
  //       component: () => import('@/pages/promote/activity'),
  //       name: 'promote-mass',
  //       meta: { title: '促销活动' }
  //     },
  //     {
  //       path: 'keywords',
  //       component: () => import('@/pages/promote/keywords'),
  //       name: 'keywords',
  //       meta: { title: '关键字回复' }
  //     }
  //   ]
  // },
  // {
  //   path: '/orders',
  //   component: Layout,
  //   redirect: '/orders/list',
  //   name: 'order-management',
  //   alwaysShow: true,
  //   meta: {
  //     title: '订单管理',
  //     iconType: 'element',
  //     icon: 's-order'
  //   },
  //   children: [
  //     {
  //       path: 'list',
  //       component: () => import('@/pages/orders/list'),
  //       name: 'order-list',
  //       meta: { title: '订单列表' }
  //     }
  //   ]
  // },
  {
    path: '/members',
    component: Layout,
    redirect: '/members/list',
    name: 'members',
    alwaysShow: true,
    meta: {
      title: '会员管理',
      icon: 'fa fa-user'
    },
    children: [
      {
        path: 'list',
        component: () => import('@/pages/members/list'),
        name: 'members-stat',
        meta: {
          title: '会员列表'
        }
      }
    ]
  },
  // {
  //   path: '/lageImages',
  //   component: Layout,
  //   redirect: '/lageImages/list',
  //   name: 'lager-images',
  //   alwaysShow: true,
  //   meta: {
  //     title: '大图管理',
  //     icon: 'picture',
  //     iconType: 'element'
  //   },
  //   children: [
  //     {
  //       path: 'list',
  //       component: () => import('@/pages/lageImages/list'),
  //       name: 'members-stat',
  //       meta: {
  //         title: '大图列表'
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: '/comments',
  //   component: Layout,
  //   redirect: '/comments/list',
  //   name: 'comments',
  //   alwaysShow: true,
  //   meta: {
  //     title: '评论管理',
  //     icon: 'chat-round',
  //     iconType: 'element'
  //   },
  //   children: [
  //     {
  //       path: 'list',
  //       component: () => import('@/pages/comments/list'),
  //       name: 'comments-list',
  //       meta: {
  //         title: '评论列表'
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: '/copywriter',
  //   component: Layout,
  //   redirect: '/copywriter/material',
  //   name: 'comments',
  //   alwaysShow: true,
  //   meta: {
  //     title: '文案管理',
  //     icon: 's-management',
  //     iconType: 'element'
  //   },
  //   children: [
  //     {
  //       path: 'material',
  //       component: () => import('@/pages/copywriter/material'),
  //       name: 'copywriter-material',
  //       meta: {
  //         title: '文案素材'
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: '/authors',
  //   component: Layout,
  //   redirect: '/authors/list',
  //   name: 'authors',
  //   alwaysShow: true,
  //   meta: {
  //     title: '作者管理',
  //     icon: 'fa fa-meh-o'
  //   },
  //   children: [
  //     {
  //       path: 'list',
  //       component: () => import('@/pages/authors/list'),
  //       name: 'authors-list',
  //       meta: {
  //         title: '作者列表'
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: '/system',
  //   component: Layout,
  //   redirect: '/system/user-list',
  //   name: 'system',
  //   alwaysShow: true,
  //   meta: {
  //     title: '系统管理',
  //     icon: 'fa fa-cog'
  //   },
  //   children: [
  //     {
  //       path: 'user-list',
  //       component: () => import('@/pages/system/user-list'),
  //       name: 'user-list',
  //       meta: {
  //         title: '用户管理'
  //       }
  //     },
  //     {
  //       path: 'role-list',
  //       component: () => import('@/pages/system/role-list'),
  //       name: 'role-list',
  //       meta: {
  //         title: '角色管理'
  //       }
  //     },
  //     // {
  //     //   path: 'menu-list',
  //     //   component: () => import('@/pages/system/menu-list'),
  //     //   name: 'menu-list',
  //     //   meta: {
  //     //     title: '菜单管理'
  //     //   }
  //     // },
  //     // {
  //     //   path: 'wechat-conf',
  //     //   component: () => import('@/pages/system/wechat-conf'),
  //     //   name: 'wechat-conf',
  //     //   meta: {
  //     //     title: '微信配置'
  //     //   },
  //     //   hidden:true
  //     // },
  //   ]
  // }
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
