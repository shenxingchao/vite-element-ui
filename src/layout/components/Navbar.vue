<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <breadcrumb class="breadcrumb-container" />
    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <search id="header-search" class="right-menu-item" />
        <screenfull id="screenfull" class="right-menu-item hover-effect" />
      </template>
      <el-dropdown class="avatar-container" trigger="hover" @command="handleCommand">
        <div class="avatar-wrapper">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar" />
          <el-icon>
            <caret-bottom />
          </el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu class="user-dropdown">
            <router-link to="/">
              <el-dropdown-item>{{$t('info.home')}}</el-dropdown-item>
            </router-link>
            <a target="_blank" href="https://github.com/shenxingchao/vite-element-ui">
              <el-dropdown-item>Github</el-dropdown-item>
            </a>
            <el-dropdown-item divided command="logout">
              <span style="display:block;">{{$t('opt.log_out')}}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { mapGetters, useStore } from 'vuex'
import Hamburger from '@/components/Hamburger/index.vue'
import Breadcrumb from '@/components/Breadcrumb/index.vue'
import Screenfull from '@/components/Screenfull/index.vue'
import Search from '@/components/HeaderSearch/index.vue'
import { useRouter, useRoute } from 'vue-router'

export default defineComponent({
  components: {
    Hamburger,
    Breadcrumb,
    Screenfull,
    Search,
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar', 'device']),
  },
  setup() {
    const $store = useStore()

    //定义router
    const $router = useRouter()
    const route = useRoute()

    const toggleSideBar = () => {
      $store.dispatch('app/toggleSideBar')
    }

    const logout = async () => {
      await $store.dispatch('user/logout')
      $router.push(`/login?redirect=${route.fullPath}`)
    }

    const handleCommand = (command) => {
      if (command == 'logout') {
        logout()
      }
    }

    return {
      toggleSideBar,
      handleCommand,
    }
  },
})
</script>
<style lang="scss">
.navbar {
  .avatar-container {
    margin-right: 30px;
  }
}
</style>
<style lang="scss" scoped>
.navbar {
  z-index: 1;
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 52px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.05);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 14px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>