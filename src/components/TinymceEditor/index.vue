<template>
  <div>
    <editor v-model="content" :init="init"></editor>
  </div>
</template>
<script>
import {
  defineComponent,
  getCurrentInstance,
  onMounted,
  reactive,
  toRefs,
  watch,
} from 'vue'
import { fileUpload } from '@/api/upload'

import tinymce from 'tinymce/tinymce'
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/themes/silver/index'
import 'tinymce/themes/silver/theme'
import 'tinymce/icons/default'

import 'tinymce/plugins/image' // 插入上传图片插件
import 'tinymce/plugins/media' // 插入视频插件
import 'tinymce/plugins/table' // 插入表格插件
import 'tinymce/plugins/lists' // 列表插件
import 'tinymce/plugins/wordcount' // 字数统计插件
import 'tinymce/plugins/link'
import 'tinymce/plugins/code'
import 'tinymce/plugins/preview'
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/help'

export default defineComponent({
  name: 'TinymceEditor',
  components: {
    Editor,
  },
  props: {
    //编辑器的内容
    value: {
      type: String,
      default: '123',
    },
    //图片上传地址
    url: {
      type: String,
      default: '',
    },
    //图片上传头
    header: {
      type: Object,
      default: null,
    },
    // 基本路径，默认为空根目录，如果你的项目发布后的地址为目录形式，
    baseUrl: {
      type: String,
      default: import.meta.env.VITE_BASE_URL, //环境变量配置文件.env里面去找吧
    },
    //插件
    plugins: {
      type: [String, Array],
      default:
        'link lists image code table wordcount media preview fullscreen help',
    },
    //工具栏
    toolbar: {
      type: [String, Array],
      default:
        'bold italic underline strikethrough | fontsizeselect | formatselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent blockquote | undo redo | link unlink code lists table image media | removeformat | fullscreen preview',
    },
  },
  emits: [
    'change', //内容改变事件
  ],
  setup(props, { emit }) {
    //当前组件实例
    const internalInstance = getCurrentInstance()

    //访问 globalProperties
    const global = internalInstance?.appContext.config.globalProperties

    //数据对象
    let data = reactive({
      content: '', //编辑器绑定内容
    })

    //初始化设置
    const init = {
      language: 'zh_CN', //汉化
      language_url: `${props.baseUrl}/tinymce/langs/zh_CN.js`,
      skin_url: `${props.baseUrl}/tinymce/skins/ui/oxide`,
      content_css: `${props.baseUrl}/tinymce/skins/content/default/content.css`,
      height: 300, //高度
      convert_urls: false,
      plugins: props.plugins, //插件
      toolbar: props.toolbar, //工具栏
      statusbar: false, // 底部的状态栏
      menubar: 'file edit insert view format table tools help', // （1级菜单）最上方的菜单
      branding: false, //隐藏版权
      paste_data_images: false, //这个功能有待研究
      urlconverter_callback: (url, node, onSave, name) => {
        if (node === 'img' && url.startsWith('blob:')) {
          tinymce.activeEditor && tinymce.activeEditor.uploadImages()
        }
        // Return new URL
        return url
      }, // 解决粘贴图片后，不自动上传，而是使用base64编码。
      images_upload_handler: (blobInfo, success, failure) => {
        // const img = 'data:image/jpeg;base64,' + blobInfo.base64() //base64上传自己修改
        let fd = new FormData()
        fd.append('file', blobInfo.blob(), blobInfo.filename())
        fileUpload(fd)
          .then((res) => {
            data.imgUrl = res.data.imgUrl
            global.$message({
              message: '上传成功',
              type: 'success',
              onClose: function () {},
            })
            success(data.imgUrl)
          })
          .catch((err) => {
            failure(err)
          })
      },
    }

    onMounted(() => {
      tinymce.init({})
    })

    watch(
      () => props.value,
      (value) => {
        data.content = value
      },
      { immediate: true }
    )

    watch(
      () => data.content,
      (value) => {
        emit('change', value)
      }
    )

    return {
      ...toRefs(data),
      init,
    }
  },
})
</script>