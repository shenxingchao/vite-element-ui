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
import 'tinymce/plugins/link' //链接
import 'tinymce/plugins/code' //源代码
import 'tinymce/plugins/preview' //预览
import 'tinymce/plugins/fullscreen' //全屏
import 'tinymce/plugins/help' //帮助

//扩展插件(多图上传)
import axupimgsInit from './plugins/axupimgs'
axupimgsInit() //初始化多图上传插件

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
        'link lists image code table wordcount media preview fullscreen help axupimgs axupimgs',
    },
    //工具栏
    toolbar: {
      type: [String, Array],
      default:
        'bold italic underline strikethrough | fontsizeselect | formatselect | forecolor backcolor | image axupimgs fullscreen preview | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent blockquote | undo redo | link unlink code lists table  media | removeformat ',
    },
  },
  emits: [
    'change', //内容改变事件
  ],
  setup(props, { emit }) {
    //当前组件实例
    const { proxy } = getCurrentInstance()

    //数据对象
    let data = reactive({
      content: '', //编辑器绑定内容
    })

    //初始化设置
    const init = {
      language: 'zh_CN', //汉化
      language_url: `${props.baseUrl}tinymce/langs/zh_CN.js`,
      skin_url: `${props.baseUrl}tinymce/skins/ui/oxide`,
      content_css: `${props.baseUrl}tinymce/skins/content/default/content.css`,
      height: 400, //高度
      convert_urls: false,
      plugins: props.plugins, //插件
      toolbar: props.toolbar, //工具栏
      fontsize_formats:
        '12px 14px 16px 18px 20px 22px 24px 28px 32px 36px 48px 56px 72px', //字体大小
      font_formats:
        '微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;',
      statusbar: false, // 底部的状态栏
      menubar: 'file edit insert view format table tools help', // （1级菜单）最上方的菜单
      branding: false, //隐藏版权
      paste_data_images: false, //图片可粘贴 没效果 这个功能有待研究
      urlconverter_callback: (url, node, onSave, name) => {
        if (node === 'img' && url.startsWith('blob:')) {
          tinymce.activeEditor && tinymce.activeEditor.uploadImages()
        }
        // Return new URL
        return url
      }, // 解决粘贴图片后，不自动上传，而是使用base64编码。
      images_upload_handler: (blobInfo, success, failure) => {
        let fd = new FormData()
        let file = blobInfo.blob()
        fd.append('file', file, file.name)
        fileUpload(fd)
          .then((res) => {
            data.imgUrl = res.data.imgUrl
            proxy.$message({
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