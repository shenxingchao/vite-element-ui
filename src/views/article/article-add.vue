<template>
  <div class="app-container">
    <el-card shadow="hover">
      <el-row type="flex" justify="start">
        <el-col :xs="24" :md="16">
          <el-form ref="ruleFormRef" :rules="rules" :model="ruleForm" label-position="right" label-width="150px">
            <el-form-item label="标题" prop="title">
              <el-input v-model="ruleForm.title" placeholder="标题" />
            </el-form-item>
            <el-form-item label="图片" prop="image">
              <upload @handleUploadSuccess="handleUploadSuccess($event)" @handleDeleteFile="ruleForm.image = ''">
              </upload>
            </el-form-item>
            <el-form-item label="图片列表" prop="image_list">
              <upload multiple @handleUploadMultipleSuccess="handleUploadMultipleSuccess($event)"
                      @handleClickDeleteMultiple="ruleForm.image_list = $event">
              </upload>
            </el-form-item>
            <el-form-item label="作者" prop="author">
              <el-input v-model="ruleForm.author" placeholder="作者" />
            </el-form-item>
            <el-form-item label="详情" prop="detail">
              <editor :value="ruleForm.detail" @change="handleChangeEditor($event)">
              </editor>
            </el-form-item>
            <el-form-item label="推荐" prop="recommend">
              <el-switch v-model="ruleForm.recommend" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <el-form-item label="置顶" prop="top">
              <el-switch v-model="ruleForm.top" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <el-form-item label="状态" prop="">
              <el-switch v-model="ruleForm.status" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm()">确定</el-button>
              <el-button @click="resetForm()">重置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
import { defineComponent, getCurrentInstance, reactive, ref, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { articleAdd } from '@/api/article'
import Upload from '@/components/Upload/index.vue'
import Editor from '@/components/TinymceEditor/index.vue'

export default defineComponent({
  name: 'ArticleAdd',
  components: {
    Upload,
    Editor,
  },
  setup() {
    //当前组件实例
    const { proxy } = getCurrentInstance()

    //定义router
    const $router = useRouter()

    //数据对象
    let data = reactive({
      ruleForm: {
        title: '',
        image: '',
        image_list: [],
        author: '',
        type: '',
        detail: '',
        recommend: true,
        top: true,
        status: true,
      },
      rules: {
        title: [
          {
            required: true,
            message: '请输入标题',
            trigger: 'blur',
          },
        ],
        image: [
          {
            required: true,
            message: '请上传图片',
          },
        ],
        image_list: [
          {
            required: true,
            message: '请上传图片列表',
          },
        ],
        author: [
          {
            required: true,
            message: '请输入作者',
            trigger: 'blur',
          },
        ],
        detail: [
          {
            required: true,
            message: '请输入详情',
          },
        ],
      },
    })

    const ruleFormRef = ref(null)

    const submitForm = () => {
      ruleFormRef.value.validate((valid) => {
        if (valid) {
          articleAdd(data.ruleForm)
            .then((res) => {
              proxy.$message({
                message: '添加成功',
                type: 'success',
                onClose: function () {
                  $router.push('/article/article-list')
                },
              })
            })
            .catch(() => {})
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }

    const resetForm = () => {
      ruleFormRef.value.resetFields()
    }

    const handleUploadSuccess = (imgUrl) => {
      data.ruleForm.image = imgUrl
      ruleFormRef.value.clearValidate('image')
    }

    const handleUploadMultipleSuccess = (imgUrlList) => {
      data.ruleForm.image_list = imgUrlList
      ruleFormRef.value.clearValidate('image_list')
    }

    const handleChangeEditor = (content) => {
      data.ruleForm.detail = content
    }

    return {
      ...toRefs(data),
      ruleFormRef,
      submitForm,
      resetForm,
      handleUploadSuccess,
      handleUploadMultipleSuccess,
      handleChangeEditor,
    }
  },
})
</script>