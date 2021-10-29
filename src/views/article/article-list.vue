<template>
  <div class="app-container">
    <el-card shadow="hover">
      <custom-table :id="tableId" :data="List" :table-head="tableHead" :params="params" :show-selection="true"
                    :opt-width="180" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"
                    @handleSelectionChange="handleSelectionChange" @handleRowDblClick="handleRowDblClick"
                    @handleEdit="handleEdit" @handleDelete="handleDelete">
        <template v-slot:searchBar>
          <el-form ref="searchForm" :inline="true" :model="params" class="demo-form-inline" size="mini">
            <el-form-item prop="keyword">
              <el-input v-model="params.keyword" :placeholder="$t('field.keyword')" />
            </el-form-item>
            <el-form-item prop="recommend">
              <el-select v-model="params.recommend" :placeholder="$t('field.recommend')" clearable>
                <el-option :label="$t('field.yes')" :value="true"> </el-option>
                <el-option :label="$t('field.no')" :value="false"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="top">
              <el-select v-model="params.top" :placeholder="$t('field.top')" clearable>
                <el-option :label="$t('field.yes')" :value="true"> </el-option>
                <el-option :label="$t('field.no')" :value="false"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="status">
              <el-select v-model="params.status" :placeholder="$t('field.status')" clearable>
                <el-option :label="$t('field.show')" :value="true"> </el-option>
                <el-option :label="$t('field.hide')" :value="false">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">
                <el-icon style="vertical-align: middle;margin-right:4px;">
                  <search />
                </el-icon>
                <span style="vertical-align: middle;"> {{$t('opt.search')}} </span>
              </el-button>
              <el-button @click="onReset();onSubmit()">
                <el-icon style="vertical-align: middle;margin-right:4px;">
                  <refresh-left />
                </el-icon>
                <span style="vertical-align: middle;"> {{$t('opt.reset')}} </span>
              </el-button>
              <el-button type="primary" size="mini" @click="$router.push('/article/article-add')">
                <el-icon style="vertical-align: middle;margin-right:4px;">
                  <plus />
                </el-icon>
                <span style="vertical-align: middle;"> {{$t('opt.add')}} </span>
              </el-button>
              <el-button type="danger" size="mini" @click="handleDeleteRows">
                <el-icon style="vertical-align: middle;margin-right:4px;">
                  <delete />
                </el-icon>
                <span style="vertical-align: middle;"> {{$t('opt.delete')}} </span>
              </el-button>
              <el-button type="warning" @click="dialogVisible = true">
                <el-icon style="vertical-align: middle;margin-right:4px;">
                  <rank />
                </el-icon>
                <span style="vertical-align: middle;"> {{$t('opt.dialog')}} </span>
              </el-button>
            </el-form-item>
          </el-form>
        </template>
        <template v-slot:opt="slotProps">
          <el-button size="mini" type="warning"
                     @click.stop="handleDownload(slotProps.scope.$index, slotProps.scope.row)">
            <el-icon>
              <download />
            </el-icon>
          </el-button>
        </template>
      </custom-table>
    </el-card>
    <div v-el-drag-dialog>
      <el-dialog :title="$t('opt.dialog')" v-model="dialogVisible">
        <span>{{$t('info.move_dialog')}}</span>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">{{$t('opt.cancel')}}</el-button>
            <el-button type="primary" @click="dialogVisible = false">{{$t('opt.confirm')}}</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {
  defineComponent,
  getCurrentInstance,
  onMounted,
  reactive,
  ref,
  toRefs,
} from 'vue'
import { useRouter } from 'vue-router'
import CustomTable from '@/components/CustomTable/index.vue'
import { articleLst, articleDelete } from '@/api/article'

export default defineComponent({
  name: 'ArticleList',
  components: {
    CustomTable,
  },
  setup() {
    //当前组件实例
    const { proxy } = getCurrentInstance()
    //定义router
    const $router = useRouter()
    //数据对象
    let data = reactive({
      List: [],
      selectionIdList: [],
      tableId: proxy.$i18n.locale + '-article-list',
      tableHead: [
        {
          label: proxy.$t('field.id'),
          prop: 'id',
          width: 60,
        },
        {
          label: proxy.$t('field.title'),
          prop: 'title',
          width: 300,
        },
        {
          label: proxy.$t('field.image'),
          prop: 'image',
          render: (row) => {
            return '<img  src="' + row.image + '" class="table-img"/>'
          },
        },
        {
          label: proxy.$t('field.author'),
          prop: 'author',
        },
        {
          label: proxy.$t('field.recommend'),
          prop: 'recommend',
          component: (row) => {
            return row.recommend
              ? { is: 'custom-tag', type: 'success', title: '是' }
              : { is: 'custom-tag', type: 'danger', title: '否' }
          },
        },
        {
          label: proxy.$t('field.top'),
          prop: 'top',
          component: (row) => {
            return row.top
              ? { is: 'custom-tag', type: 'success', title: '是' }
              : { is: 'custom-tag', type: 'danger', title: '否' }
          },
        },
        {
          label: proxy.$t('field.status'),
          prop: 'status',
          component: (row) => {
            return row.status
              ? { is: 'custom-tag', type: 'success', title: '启用' }
              : { is: 'custom-tag', type: 'danger', title: '禁用' }
          },
        },
        {
          label: proxy.$t('field.addtime'),
          prop: 'addtime',
          width: 140,
        },
        {
          label: proxy.$t('field.updatetime'),
          prop: 'updatetime',
          width: 140,
        },
      ],
      params: {
        page: 1,
        total: 0,
        pageSize: 10,
        pageSizes: [10, 20, 30, 50],
        keyword: '',
        recommend: '',
        top: '',
        status: '',
      },
      dialogVisible: false, //可移动弹窗
    })

    //ref
    const searchForm = ref(null)

    onMounted(async () => {
      await getArticleLst()
    })

    const getArticleLst = () => {
      return articleLst(data.params)
        .then((res) => {
          data.List = res.data.data
          data.params.total = res.data.total
        })
        .catch(() => {})
    }

    const handleSizeChange = (val) => {
      data.params.pageSize = val
      getArticleLst()
    }

    const handleCurrentChange = (val) => {
      data.params.page = val
      getArticleLst()
    }

    const handleSelectionChange = (val) => {
      data.selectionIdList = val
    }

    const handleRowDblClick = (val) => {
      $router.push({
        path: '/article/article-edit',
        query: {
          id: val,
        },
      })
    }

    const handleEdit = (index, row) => {
      handleRowDblClick(row.id)
    }

    const handleDelete = (index, row) => {
      articleDelete({ ids: [row.id] })
        .then((res) => {
          data.List.splice(index, 1)
          proxy.$message({
            message: proxy.$t('tips.delete_success'),
            type: 'success',
          })
        })
        .catch(() => {})
    }

    const handleDownload = (index, row) => {
      proxy.$message({
        message: proxy.$t('tips.download_info') + row.id,
        type: 'success',
      })
    }

    const handleDeleteRows = () => {
      if (data.selectionIdList.length == 0) {
        proxy.$message({
          message: proxy.$t('tips.select_delete'),
          type: 'error',
        })
        return false
      }
      articleDelete({ ids: data.selectionIdList })
        .then((res) => {
          //这里删除还可以使用逆向循环删除，删除以后还可以重新获取数据
          data.List = data.List.filter(
            (item) => data.selectionIdList.indexOf(item.id) == -1
          )
          proxy.$message({
            message: proxy.$t('tips.delete_success'),
            type: 'success',
            onClose: function () {
              getArticleLst()
            },
          })
        })
        .catch(() => {})
    }

    const onReset = () => {
      searchForm.value.resetFields()
    }

    const onSubmit = () => {
      data.params.page = 1
      data.params.pageSize = 10
      getArticleLst()
    }

    return {
      ...toRefs(data),
      searchForm,
      handleSizeChange,
      handleCurrentChange,
      handleSelectionChange,
      handleRowDblClick,
      handleEdit,
      handleDelete,
      handleDownload,
      handleDeleteRows,
      onReset,
      onSubmit,
    }
  },
})
</script>