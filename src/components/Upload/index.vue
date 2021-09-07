<template>
  <div class="upload-file-commpent">
    <template v-if="!multiple">
      <div v-if="imgUrl" class="uplaod-file-preview" @mouseenter="isShowOpt = true" @mouseleave="isShowOpt = false">
        <img :src="imgUrl" alt="上传成功图片" />
        <div v-show="isShowOpt" class="opt">
          <i class="el-icon-delete delete-btn" @click="handleClickDelete()"></i>
        </div>
      </div>
      <div v-if="!imgUrl" class="upload-file-btn" @click="$refs.file.click()">
        <i class="el-icon-plus"></i>
        <input ref="file" type="file" class="upload-file-input" :accept="fileType"
               @change="handleUploadFile($event.target.files[0])" />
      </div>
    </template>
    <template v-if="multiple">
      <div v-for="(item,index) in imgList" :key="index" class="uplaod-file-preview" @mouseenter="item.isShowMask = true"
           @mouseleave="item.isShowMask = false">
        <img :src="item.url" alt="上传成功图片" />
        <div v-show="item.isShowMask" class="opt">
          <i class="el-icon-delete delete-btn" @click="handleClickDeleteMultiple(index)"></i>
        </div>
      </div>
      <div v-if="imgList.length < limit" class="upload-file-btn" @click="$refs.files.click()">
        <i class="el-icon-plus"></i>
        <input ref="files" type="file" class="upload-file-input" :accept="fileType" :multiple="multiple"
               @change="handleUploadFiles($event.target.files)" />
      </div>
    </template>
  </div>
</template>
<script>
import {
  defineComponent,
  getCurrentInstance,
  reactive,
  toRefs,
  watch,
} from 'vue'
import { fileUpload } from '@/api/upload'

export default defineComponent({
  name: 'Upload',
  components: {},
  props: {
    file: {
      type: String,
      default: '',
    },
    fileType: {
      type: String,
      default: 'image/*',
    },
    multiple: {
      type: Boolean,
      defalut: false,
    },
    limit: {
      type: Number,
      default: 3,
    },
    files: {
      type: Array,
      default: function () {
        return []
      },
    },
  },
  emits: [
    'handleUploadSuccess',
    'handleDeleteFile',
    'handleClickDeleteMultiple',
    'handleUploadMultipleSuccess',
  ],
  setup(props, { emit }) {
    //当前组件实例
    const { proxy } = getCurrentInstance()

    //数据对象
    let data = reactive({
      imgUrl: '',
      imgList: [],
      isShowOpt: false,
    })

    watch(
      () => props.file,
      (value) => {
        data.imgUrl = value
      }
    )

    watch(
      () => props.files,
      (value) => {
        data.imgList = []
        value.forEach((url) => {
          data.imgList.push({
            url: url,
            isShowMask: false,
          })
        })
      }
    )

    /**
     * 文件上传
     */
    const handleUploadFile = (file) => {
      let fd = new FormData()
      fd.append('file', file)
      fileUpload(fd)
        .then((res) => {
          data.imgUrl = res.data.imgUrl
          proxy.$message({
            message: '上传成功',
            type: 'success',
            onClose: function () {},
          })
          //子组件通知父组件上传成功
          emit('handleUploadSuccess', data.imgUrl)
        })
        .catch(() => {})
    }

    /**
     * 文件删除
     */
    const handleClickDelete = () => {
      data.imgUrl = ''
      emit('handleDeleteFile')
    }

    /**
     * 多文件删除
     */
    const handleClickDeleteMultiple = (index) => {
      data.imgList.splice(index, 1)
      let urlList = [...data.imgList].map((item) => item.url)
      emit('handleClickDeleteMultiple', urlList)
    }

    /**
     * 多文件上传
     */
    const handleUploadFiles = (files) => {
      if (files.length + data.imgList.length > props.limit) {
        proxy.$message({
          type: 'error',
          message: '最多可上传' + props.limit + '张',
        })
        return false
      }
      new Promise((resolve) => {
        //fix files.forEach is not func
        Array.from(files).forEach(async (file, index) => {
          let fd = new FormData()
          fd.append('file', file)
          await fileUpload(fd)
            .then((res) => {
              data.imgList.push({
                url: res.data.imgUrl,
                isShowMask: false,
              })
              if (index == files.length - 1) {
                resolve()
              }
            })
            .catch(() => {})
        })
      }).then(() => {
        proxy.$message({
          type: 'success',
          message: '图片列表上传成功',
        })
        let urlList = [...data.imgList].map((item) => item.url) //JSON.parse(JSON.stringify(data.imgList))
        //子组件通知父组件上传成功
        emit('handleUploadMultipleSuccess', urlList)
      })
    }

    return {
      ...toRefs(data),
      handleUploadFile,
      handleClickDelete,
      handleClickDeleteMultiple,
      handleUploadFiles,
    }
  },
})
</script>

<style lang="scss" scoped>
.upload-file-commpent {
  display: flex;
  flex-wrap: wrap;
  .uplaod-file-preview {
    width: 100px;
    height: 100px;
    margin-right: 10px;
    margin-bottom: 10px;
    position: relative;
    img {
      width: 100%;
      height: 100%;
      display: block;
    }
    .opt {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba($color: #000000, $alpha: 0.3);
      .delete-btn {
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: #ffffff;
        position: absolute;
        top: 0;
        right: 0;
      }
    }
  }
  .upload-file-btn {
    width: 100px;
    height: 100px;
    border: 1px dashed #cccccc;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    &:hover {
      border-color: #409eff;
    }
    .el-icon-plus {
      font-size: 26px;
      color: #777777;
    }
    .upload-file-input {
      display: none;
    }
  }
}
</style>
/** 
@图片上传组件
引入
import Upload from '@/components/Upload/index.vue'

使用
<upload :file="ruleForm.avatar" @handleUploadSuccess="handleUploadSuccess($event)"
        @handleDeleteFile="ruleForm.avatar = ''">
</upload>

//上传成功事件
handleUploadSuccess: function(imgUrl) {
    data.ruleForm.avatar = imgUrl
    //取消头像验证
    ruleFormRef.value.clearValidate('avatar')
}

多图上传
<upload :files="ruleForm.image_list" multiple
        @handleUploadMultipleSuccess="handleUploadMultipleSuccess($event)"
        @handleClickDeleteMultiple="ruleForm.image_list = $event">
</upload>
      
//多图上传成功事件
handleUploadMultipleSuccess: function(imgUrlList) {
  data.ruleForm.image_list = imgUrlList
  ruleFormRef.clearValidate('image_list')
}
*/