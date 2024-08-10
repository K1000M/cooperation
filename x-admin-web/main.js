import Vue from 'vue' // 引入Vue.js

import 'normalize.css/normalize.css' // 引入normalize.css，用于样式重置

import ElementUI from 'element-ui' // 引入Element UI组件库
import 'element-ui/lib/theme-chalk/index.css' // 引入Element UI的主题样式
import locale from 'element-ui/lib/locale/lang/zh-CN' // 引入中文语言包

import '@/styles/index.scss' // 引入全局CSS样式

import App from './App' // 引入根组件
import store from './store' // 引入Vuex状态管理实例
import router from './router' // 引入路由实例

// 引入自定义图标
import '@/icons'

// 引入权限控制
import '@/permission'

/**
 * 如果不需要使用mock服务器，
 * 可以使用MockJs来模拟API请求
 * 可以在生产环境中使用MockJs，
 * 上线前请确保移除！
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// 设置Element UI的语言为中文
Vue.use(ElementUI, { locale })
// 如果需要使用英文版element-ui，可以去掉这行代码

Vue.config.productionTip = false // 设置为false以阻止Vue在启动时生成生产提示

new Vue({
  el: '#app', // 选择器，用于挂载根实例
  router, // 路由实例
  store, // Vuex状态管理实例
  render: h => h(App) // 渲染根组件
}).$mount('#app') // 挂载根组件到指定的元素上
