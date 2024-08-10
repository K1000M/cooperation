<template>
  <div class="login-container">
    <!-- 表单容器，定义了登录表单的样式和属性 -->
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <!-- 标题容器，显示欢迎标题 -->
      <div class="title-container">
        <h3 class="title">欢迎使用数字化健康监测管理平台</h3>
      </div>

      <!-- 用户名输入项 -->
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <!-- 用户名输入框 -->
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="用户名"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <!-- 密码输入项 -->
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <!-- 密码输入框，支持显示和隐藏密码 -->
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <!-- 显示/隐藏密码的图标 -->
        <span class="show-pwd" @click="showPwd">
          <svg-icon
            :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
          />
        </span>
      </el-form-item>

      <!-- 登录按钮 -->
      <el-button
        :loading="loading"
        type="primary"
        style="width: 100%; margin-bottom: 30px"
        @click.native.prevent="handleLogin"
        >登 陆</el-button
      >
      <div>
        <!-- 注册按钮 -->
        <el-button
          type="primary"
          style="width: 100%; margin-bottom: 30px; margin-left: 0px"
          @click.native.prevent="handleRegister"
          >注 册</el-button
        >
      </div>
    </el-form>
  </div>
</template>

<script>
import { validUsername } from "@/utils/validate"; // 导入用户名验证函数

export default {
  name: "Login",
  data() {
    // 定义验证用户名函数
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error("请输入正确的用户名")); // 不合法则返回错误信息
      } else {
        callback(); // 合法则返回验证成功
      }
    };

    // 定义验证密码函数
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("输入的密码不能少于6位")); // 密码小于6位则返回错误信息
      } else {
        callback(); // 合法则返回验证成功
      }
    };

    return {
      loginForm: {
        username: "", // 用户名
        password: "", // 密码
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername },
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword },
        ],
      },
      loading: false, // 登录按钮加载状态
      passwordType: "password", // 密码输入框类型
      redirect: undefined, // 重定向路径
    };
  },

  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect; // 监听路由变化，更新重定向路径
      },
      immediate: true,
    },
  },

  methods: {
    // 显示或隐藏密码
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = ""; // 显示密码
      } else {
        this.passwordType = "password"; // 隐藏密码
      }
      this.$nextTick(() => {
        this.$refs.password.focus(); // 聚焦密码输入框
      });
    },

    // 登录处理函数
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true; // 显示加载状态
          this.$store
            .dispatch("user/login", this.loginForm)
            .then(() => {
              // 登录成功，跳转到重定向路径或首页
              this.$router.push({ path: this.redirect || "/" });
              this.loading = false; // 隐藏加载状态
            })
            .catch(() => {
              this.loading = false; // 隐藏加载状态
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    // 注册处理函数
    handleRegister() {
      this.$router.push({ path: "/register" }); // 跳转到注册页面
    },
  },
};
</script>

<style lang="scss">
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100vh;
  width: 100%;
  background-color: $bg;
  display: flex;// 设置容器为弹性布局
  justify-content: center;//设置容器内子元素水平居中
  align-items: center;
  background-image: url("https://www.2008php.com/2020_Website_appreciate/2020-05-16/20200516222649kCEL5.jpg");
  background-size: cover;//完全覆盖容器

  .login-form {
    position: relative; // 设置登录表单的相对定位
    width: 520px; // 设置登录表单的宽度
    max-width: 100%; // 设置登录表单的最大宽度为100%，即容器宽度
    padding: 80px 35px 0; // 设置登录表单的上方和下方内边距为80px，左侧和右侧内边距为35px
    margin: 0 auto; // 设置登录表单的水平居中
    overflow: hidden; // 设置登录表单的内容溢出隐藏
    background-color: #fff; // 设置登录表单的背景颜色为白色
    border-radius: 10px; // 设置登录表单的圆角为10px
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.3); // 设置登录表单的阴影效果
  }

  .tips {//提示信息
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;// 设置图标容器内边距
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;// 设置图标容器为内联块级元素
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $dark_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);// 设置显示密码按钮的垂直位置为视口高度的一半
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .el-form-item {
    margin-bottom: 20px;
  }

  .el-input {
    width: 100%;
    border: none;
    border-radius: 5px;
    background-color: #f7f7f7;

    input {
      padding: 15px;
      color: $dark_gray;

      &::placeholder {
        color: #ccc;
      }
    }
  }

  .el-button {
    height: 50px;
    border-radius: 25px;
    font-size: 16px;
    background-color: $dark_gray;
    border: none;

    &:hover,
    &:focus {
      background-color: darken($dark_gray, 10%);
    }
  }
}
</style>
