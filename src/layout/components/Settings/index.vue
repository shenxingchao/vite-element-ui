<template>
  <div class="drawer-container">
    <div>
      <h3 class="drawer-title">{{$t('info.page_setting')}}</h3>
      <div class="drawer-item">
        <span>{{$t('opt.open_tags')}}</span>
        <el-switch v-model="tagsView" class="drawer-switch" />
      </div>
      <div class="drawer-item">
        <span>{{$t('opt.sidebar_logo')}}</span>
        <el-switch v-model="sidebarLogo" class="drawer-switch" />
      </div>
      <div class="drawer-item">
        <span>{{$t('info.current_version')}}：{{app_version}}</span>
      </div>
      <div class="drawer-item">
        <span>©github.com/shenxingchao</span>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  components: {},
  setup() {
    const $store = useStore()

    //数据对象
    let data = reactive({
      app_version: import.meta.env.VITE_APP_VERSION,
    })

    const set = reactive({
      tagsView: computed({
        get() {
          return $store.getters.tagsView
        },
        set(val) {
          $store.dispatch('settings/changeSetting', {
            key: 'tagsView',
            value: val,
          })
        },
      }),
      sidebarLogo: computed({
        get() {
          return $store.getters.sidebarLogo
        },
        set(val) {
          $store.dispatch('settings/changeSetting', {
            key: 'sidebarLogo',
            value: val,
          })
        },
      }),
    })

    return {
      ...toRefs(data),
      ...toRefs(set),
    }
  },
})
</script>

<style lang="scss" scoped>
.drawer-container {
  padding: 24px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;

  .drawer-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    line-height: 22px;
  }

  .drawer-item {
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    padding: 12px 0;
  }

  .drawer-switch {
    float: right;
  }
}
</style>