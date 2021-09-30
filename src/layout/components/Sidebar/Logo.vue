<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="mode-fade" mode="out-in">
      <!-- 使用过度模式 当前元素先进行过渡，完成之后新元素过渡进入
      look at https://vue3js.cn/docs/zh/guide/transitions-enterleave.html#%E5%A4%9A%E4%B8%AA%E5%85%83%E7%B4%A0%E7%9A%84%E8%BF%87%E6%B8%A1 -->
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo" />
        <h1 v-else class="sidebar-title">{{ title }} </h1>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo" />
        <h1 class="sidebar-title">{{ title }} </h1>
      </router-link>
    </transition>
  </div>
</template>
<script>
import { defineComponent, reactive, toRefs } from 'vue'

export default defineComponent({
  name: 'SidebarLogo',
  components: {},
  props: {
    collapse: {
      type: Boolean,
      required: true,
    },
  },
  setup() {
    //数据对象
    let data = reactive({
      title: import.meta.env.VITE_APP_NAME,
      logo: 'https://v3.cn.vuejs.org/logo.png',
    })

    return {
      ...toRefs(data),
    }
  },
})
</script>

<style lang="scss" scoped>
.mode-fade-enter-active,
.mode-fade-leave-active {
  transition: opacity 0.5s ease;
}

.mode-fade-enter-from,
.mode-fade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #2b2f3a;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 12px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>