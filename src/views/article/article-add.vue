<template>
  <div class="app-container">
    <el-card shadow="hover">
      <el-row type="flex" justify="left">
        <el-col :xs="24" :md="16">
          <el-form ref="ruleFormRef" :rules="rules" :model="ruleForm" label-position="right" label-width="150px">
            <el-form-item :label="$t('field.title')" prop="title">
              <el-input v-model="ruleForm.title" :placeholder="$t('field.title')" />
            </el-form-item>
            <el-form-item :label="$t('field.image')" prop="image">
              <upload @handleUploadSuccess="handleUploadSuccess($event)" @handleDeleteFile="ruleForm.image = ''">
              </upload>
            </el-form-item>
            <el-form-item :label="$t('field.image_list')" prop="image_list">
              <upload multiple @handleUploadMultipleSuccess="handleUploadMultipleSuccess($event)"
                      @handleClickDeleteMultiple="ruleForm.image_list = $event">
              </upload>
            </el-form-item>
            <el-form-item :label="$t('field.author')" prop="author">
              <el-input v-model="ruleForm.author" :placeholder="$t('field.author')" />
            </el-form-item>
            <el-form-item :label="$t('field.detail')" prop="detail">
              <editor :value="ruleForm.detail" @change="handleChangeEditor($event)">
              </editor>
            </el-form-item>
            <el-form-item :label="$t('field.recommend')" prop="recommend">
              <el-switch v-model="ruleForm.recommend" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <el-form-item :label="$t('field.top')" prop="top">
              <el-switch v-model="ruleForm.top" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <el-form-item :label="$t('field.status')" prop="">
              <el-switch v-model="ruleForm.status" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm()">{{$t('opt.confirm')}}</el-button>
              <el-button @click="resetForm()">{{$t('opt.reset')}}</el-button>
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
            message: proxy.$t('tips.input') + proxy.$t('field.title'),
            trigger: 'blur',
          },
        ],
        image: [
          {
            required: true,
            message: proxy.$t('tips.upload') + proxy.$t('field.image'),
          },
        ],
        image_list: [
          {
            required: true,
            message: proxy.$t('tips.upload') + proxy.$t('field.image_list'),
          },
        ],
        author: [
          {
            required: true,
            message: proxy.$t('tips.input') + proxy.$t('field.author'),
            trigger: 'blur',
          },
        ],
        detail: [
          {
            required: true,
            message: proxy.$t('tips.input') + proxy.$t('field.detail'),
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
                message: proxy.$t('tips.add_success'),
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