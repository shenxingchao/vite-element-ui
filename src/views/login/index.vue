<template>
  <div class="login-container">
    <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on"
             label-position="left">
      <div class="title-container">
        <h3 class="title">Administrator Login</h3>
      </div>
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input ref="username" v-model="loginForm.username" :placeholder="$t('field.username')" name="username"
                  type="text" tabindex="1" auto-complete="on" />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input :key="passwordType" ref="passwordRef" v-model="loginForm.password" :type="passwordType"
                  :placeholder="$t('field.password')" name="password" tabindex="2" auto-complete="on"
                  @keyup.enter="handleLogin" />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      <div class="lang-change">
        <el-radio v-model="lang" label="zh" @click="changeLang('zh')">中文</el-radio>
        <el-radio v-model="lang" label="en" @click="changeLang('en')">English
        </el-radio>
      </div>
      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.prevent="handleLogin">
        {{$t('opt.login')}}</el-button>
    </el-form>
  </div>
</template>
<script>
import {
  defineComponent,
  getCurrentInstance,
  reactive,
  toRefs,
  ref,
  nextTick,
  watch,
} from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'

export default defineComponent({
  components: {},
  setup() {
    //当前组件实例
    const { proxy } = getCurrentInstance()

    //store
    const $store = useStore()

    //router
    const $router = useRouter()
    const $route = useRoute()

    //数据对象
    let data = reactive({
      app_name: import.meta.env.VITE_APP_NAME,
      loginForm: {
        username: '',
        password: '',
      },
      loginRules: {
        username: [
          {
            required: true,
            trigger: 'blur',
            message: proxy.$t('tips.input') + proxy.$t('field.username'),
          },
        ],
        password: [
          {
            required: true,
            trigger: 'blur',
            message: proxy.$t('tips.input') + proxy.$t('field.password'),
          },
        ],
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      lang: localStorage.lang || 'zh',
    })

    //refs dom对象
    const passwordRef = ref(null)
    const loginFormRef = ref(null)

    watch(
      $route,
      (route) => {
        data.redirect = route.query && route.query.redirect
      },
      {
        immediate: true,
      }
    )

    //方法
    //显示密码
    const showPwd = () => {
      if (data.passwordType === 'password') {
        data.passwordType = ''
      } else {
        data.passwordType = 'password'
      }
      nextTick(() => {
        passwordRef.value.focus()
      })
    }

    //点击登录
    const handleLogin = () => {
      loginFormRef.value.validate((valid) => {
        if (valid) {
          data.loading = true
          $store
            .dispatch('user/login', data.loginForm)
            .then(() => {
              $router.push({ path: data.redirect || '/' })
              data.loading = false
            })
            .catch(() => {
              data.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }

    const changeLang = (lang) => {
      localStorage.setItem('lang', lang)
      //目前先这样刷新，路由里的标题不会随之改变
      $router.go(0)
    }

    return {
      ...toRefs(data),
      passwordRef,
      loginFormRef,
      showPwd,
      handleLogin,
      changeLang,
    }
  },
})
</script>
<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: $theme;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    width: 85%;
    input {
      color: $h1c !important;
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $light_gray inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>
<style lang="scss" scoped>
$bg: $deep-theme;
$dark_gray: #889aa4;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: #5685b5;
  // background: url('../../assets/login/login-background.png') 100% 100% no-repeat;
  overflow: hidden;
  position: relative;
  z-index: 1;
  &::after {
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    z-index: 1;
  }
  .login-form {
    z-index: 2;
    position: relative;
    width: 440px;
    max-width: 100%;
    padding: 30px 35px 0;
    margin: 20vh auto 0;
    overflow: hidden;
    background: #ffffff;
    border-radius: 20px;
  }
  .el-form-item {
    background: #ffffff;
    border: 1px solid #cccccc;
    .el-form-item__content {
      height: 40px;
    }
  }

  .svg-container {
    padding: 0 8px;
    color: $dark_gray;
    width: 30px;
    display: inline-block;
    .svg-icon {
      color: $theme;
    }
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $h2c;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 0;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>