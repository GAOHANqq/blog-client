import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { IINK_TYPE, LOGIN_TYPE } from '@/utils/enum'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home',
  },

  {
    path: '/main',
    name: 'main',
    component: ()=>import('@/views/main.vue'),
    meta: {
      title: '主页'
    }
  },
  {
    path: '/home',
    name: 'home',
    component: ()=>import('@/views/frontend/home.vue'),
    meta: {
      title: '首页'
    }
  },
  {
    path: '/list',
    name: 'list',
    component: ()=>import('@/views/frontend/list.vue'),
    props: (route) => Object.assign(route.params, route.query),
    meta: {
      title: '文章列表'
    }
  },
  {
    path: '/example',
    name: 'example',
    component: ()=>import('@/views/frontend/example.vue'),
    props: (route) => Object.assign(route.params, route.query),
    meta: {
      title: '案例中心'
    }
  },
  {
    path: '/userarticle',
    name: 'user-article',
    component: ()=>import('@/views/frontend/userarticle.vue'),
    props: (route) => Object.assign(route.params, route.query),
    meta: {
      title: '用户文章'
    }
  },
  {
    path: '/chat',
    name: 'chat',
    component: ()=>import('@/views/chat.vue'),
    meta: {
      title: '聊天室'
    }
  },
  {
    path: '/message',
    name: 'message',
    component: ()=>import('@/views/frontend/message.vue'),
    meta: {
      title: '留言板'
    }
  },
  {
    path: '/aboutme',
    name: 'aboutme',
    component: ()=>import('@/views/frontend/aboutme.vue'),
    meta: {
      title: '关于我'
    }
  },
  {
    path: '/detail',
    name: 'detail',
    component: ()=>import('@/views/frontend/detail.vue'),
    props: (route) => Object.assign(route.params, route.query),
    meta: {
      title: '文章详情'
    }
  },
  {
    path: '/login',
    name: 'login',
    component: ()=>import('@/views/frontend/login.vue'),
    meta: {
      title: '登录'
    },
    props: {
      type: LOGIN_TYPE.LOGIN
    }
  },
  {
    path: '/register',
    name: 'register',
    component: ()=>import('@/views/frontend/login.vue'),
    meta: {
      title: '注册'
    },
    props: {
      type: LOGIN_TYPE.REGISTER
    }
  },
  {
    path: '/password',
    name: 'password',
    component: ()=>import('@/views/backend/password.vue'),
    meta: {
      title: '修改密码'
    }
  },
  {
    path: '/admin',
    name: 'admin',
    component: ()=>import('@/views/backend/admin.vue'),
    redirect: '/admin/category',
    meta: {
      requireAuth: true
    },
    children: [
      {
        path: 'category',
        name: 'category',
        component: ()=>import('@/views/backend/category.vue'),
        meta: {
          title: '分类管理'
        }
      },
      {
        path: 'tag',
        name: 'tag',
        component: ()=>import('@/views/backend/tag.vue'),
        meta: {
          title: '标签管理'
        }
      },
      {
        path: 'article',
        name: 'article',
        component: ()=>import('@/views/backend/article.vue'),
        meta: {
          title: '文章管理'
        }
      },
      {
        path: 'link',
        name: 'link',
        component: ()=>import('@/views/backend/link.vue'),
        props: (route) => Object.assign(route.params, route.query,{type:IINK_TYPE.FRIND}),
        meta: {
          title: '友链管理'
        }
      },
      {
        path: 'example',
        name: 'admin-example',
        component: ()=>import('@/views/backend/link.vue'),
        props: (route) => Object.assign(route.params, route.query,{type:IINK_TYPE.EXAMPLE}),
        meta: {
          title: '案例管理'
        }
      },
      {
        path: 'profile',
        name: 'profile',
        component: ()=>import('@/views/backend/profile.vue'),
        meta: {
          title: '个人设置'
        }
      },
      {
        path: 'edit',
        name: 'edit',
        component: ()=>import('@/views/backend/edit.vue'),
        props: (route) => Object.assign(route.params, route.query),
      },
    ]
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404.vue'),
    props: (route) => Object.assign({}, route.params, route.query)
  },
  {
    path: '/sso',
    name: 'sso',
    component: ()=>import('@/views/frontend/login.vue'),
    meta: {
      title: 'sso'
    },
    props: {
      type: LOGIN_TYPE.SSO
    }
  },
  {
    path: '/:pathMatch(.*)',
    redirect: '/404',
  }
]
const router = createRouter({
  routes,
  history: createWebHistory(`${import.meta.env.BASE_URL}`)
})
export default router
