<template>
  <!-- 模板部分 -->
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <!-- 使用Element UI的面包屑导航组件，设置类名和分隔符 -->
    <transition-group name="breadcrumb">
      <!-- 使用Vue的<transition-group>元素为面包屑导航项添加过渡效果（追踪每个节点的身份，从而重用和重新排序现有元素。） -->
      <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
        <!-- 使用Vue的v-for指令遍历levelList数组，并为每个项创建一个面包屑导航项 -->
        <span v-if="item.redirect==='noRedirect'||index==levelList.length-1" class="no-redirect">{{ item.meta.title }}</span>
        <!-- 如果item.redirect是'noRedirect'或者当前项是数组的最后一个，则显示面包屑导航项的标题 -->
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
        <!-- 如果上述条件不满足，则显示一个链接，点击链接会调用handleLink方法 -->
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import pathToRegexp from 'path-to-regexp'

export default {
  data() {
    return {
      levelList: null
    }
  },
  watch: {
    $route() {
      // 监听路由变化，当路由变化时，调用getBreadcrumb方法
      this.getBreadcrumb()
    }
  },
  created() {
    this.getBreadcrumb()
  },
  methods: {
    getBreadcrumb() {
      // 获取当前路由的匹配项，并过滤掉没有meta.title的路由
      let matched = this.$route.matched.filter(item => item.meta && item.meta.title)
      const first = matched[0]

      if (!this.isDashboard(first)) {
        matched = [{ path: '/dashboard', meta: { title: '首页' }}].concat(matched)
      }

      this.levelList = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false)
    },
    isDashboard(route) {
      const name = route && route.name
      if (!name) {
        return false
      }
      return name.trim().toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase()
    },
    pathCompile(path) {
      // 使用path-to-regexp库将路径编译成正则表达式
      var toPath = pathToRegexp.compile(path)
      return toPath(params)
    },
    handleLink(item) {
      const { redirect, path } = item
      if (redirect) {
        // 如果item.redirect存在，则使用Vue Router的push方法重定向到redirect路径
        this.$router.push(redirect)
        return
      }
      // 否则，使用Vue Router的push方法重定向到pathCompile方法编译后的路径
      this.$router.push(this.pathCompile(path))
    }
  }
}
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
