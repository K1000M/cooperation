import router from './router' // 引入路由实例
import store from './store' // 引入Vuex状态管理实例
import { Message } from 'element-ui' // 引入Element UI的消息提示组件
import NProgress from 'nprogress' // 引入NProgress进度条插件
import 'nprogress/nprogress.css' // 引入NProgress进度条样式
import { getToken } from '@/utils/auth' // 引入从cookie中获取token的函数
import getPageTitle from '@/utils/get-page-title' // 引入获取页面标题的函数
import Layout from '@/layout' // 引入布局组件

// 配置NProgress，不显示旋转的进度图标
NProgress.configure({ showSpinner: false })

// 定义无需重定向的白名单路径
const whiteList = ['/login', '/register', '/change_Password']

// 路由全局前置守卫，在路由跳转之前执行
router.beforeEach(async (to, from, next) => {
  // 开始进度条
  NProgress.start()

  // 设置页面标题
  document.title = getPageTitle(to.meta.title)

  // 判断用户是否已经登录
  const hasToken = getToken()

  if (hasToken) {
    // 如果用户已登录且访问登录页，则重定向到主页
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      // 检查用户信息是否已经获取
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        // 如果已获取用户信息，则直接放行
        next()
      } else {
        try {
          // 如果未获取用户信息，则尝试获取用户信息
          await store.dispatch('user/getInfo')

          // 过滤和转换路由
          let myRoutes = myFilterAsyncRoutes(store.getters.menuList)
          // 添加404页面路由
          myRoutes.push({
            path: '*',
            redirect: '/404',
            hidden: true
          })
          // 动态添加路由
          router.addRoutes(myRoutes)
          // 将路由存至全局变量
          global.myRoutes = myRoutes
          // 防止刷新后页面空白，使用replace: true替换当前历史记录
          next({ ...to, replace: true })
        } catch (error) {
          // 如果获取用户信息失败，则重置token并跳转至登录页
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    // 如果没有token
    if (whiteList.indexOf(to.path) !== -1) {
      // 如果访问的路径在白名单中，则直接放行
      next()
    } else {
      // 如果不在白名单中，则重定向到登录页
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

// 路由全局后置钩子，在路由跳转之后执行
router.afterEach(() => {
  // 完成进度条
  NProgress.done()
})

// 过滤和转换异步路由的函数
function myFilterAsyncRoutes(menuList) {
  // 对菜单列表进行过滤和转换
  menuList.filter(menu => {
    if (menu.component === 'Layout') {
      // 如果组件是布局组件，则直接使用Layout组件
      menu.component = Layout
    } else {
      // 否则，动态加载对应的vue组件
      menu.component = require(`@/views/${menu.component}.vue`).default
    }
    // 递归处理子菜单
    if (menu.children && menu.children.length) {
      menu.children = myFilterAsyncRoutes(menu.children)
    }
    return true
  })
  return menuList // 返回处理后的菜单列表
}
