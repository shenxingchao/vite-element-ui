<template>
  <div class="app-container">
    <el-card shadow="hover">
      <custom-table id="article-list" :data="List" :table-head="tableHead" :params="params" :show-selection="true"
                    :opt-width="180" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"
                    @handleSelectionChange="handleSelectionChange" @handleRowDblClick="handleRowDblClick"
                    @handleEdit="handleEdit" @handleDelete="handleDelete">
        <template v-slot:searchBar>
          <el-form ref="searchForm" :inline="true" :model="params" class="demo-form-inline" size="mini" @submit.prevent>
            <el-form-item prop="keyword">
              <el-input v-model="params.keyword" placeholder="搜索关键词" @keyup.enter="onSubmit()" />
            </el-form-item>
            <el-form-item prop="recommend">
              <el-select v-model="params.recommend" placeholder="推荐" clearable>
                <el-option label="是" :value="true"> </el-option>
                <el-option label="否" :value="false"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="top">
              <el-select v-model="params.top" placeholder="置顶" clearable>
                <el-option label="是" :value="true"> </el-option>
                <el-option label="否" :value="false"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="status">
              <el-select v-model="params.status" placeholder="状态" clearable>
                <el-option label="显示" :value="true"> </el-option>
                <el-option label="隐藏" :value="false">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">
                <el-icon style="vertical-align: middle;margin-right:4px;">
                  <search />
                </el-icon>
                <span style="vertical-align: middle;"> 查询 </span>
              </el-button>
              <el-button @click="onReset();onSubmit()">
                <el-icon style="vertical-align: middle;margin-right:4px;">
                  <refresh-left />
                </el-icon>
                <span style="vertical-align: middle;"> 重置 </span>
              </el-button>
              <el-button type="primary" size="mini" @click="$router.push('/article/article-add')">
                <el-icon style="vertical-align: middle;margin-right:4px;">
                  <plus />
                </el-icon>
                <span style="vertical-align: middle;"> 添加 </span>
              </el-button>
              <el-button type="danger" size="mini" @click="handleDeleteRows">
                <el-icon style="vertical-align: middle;margin-right:4px;">
                  <delete />
                </el-icon>
                <span style="vertical-align: middle;"> 删除 </span>
              </el-button>
              <el-button type="warning" @click="dialogVisible = true">
                <el-icon style="vertical-align: middle;margin-right:4px;">
                  <rank />
                </el-icon>
                <span style="vertical-align: middle;"> 这是一个可移动弹窗 </span>
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
      <el-dialog title="弹窗" v-model="dialogVisible">
        <span>这是一个可移动弹窗</span>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="dialogVisible = false">确定</el-button>
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
      tableHead: [
        {
          label: '编号',
          prop: 'id',
          width: 60,
        },
        {
          label: '标题',
          prop: 'title',
          width: 300,
        },
        {
          label: '图片',
          prop: 'image',
          render: (row) => {
            return '<img  src="' + row.image + '" class="table-img"/>'
          },
        },
        {
          label: '作者',
          prop: 'author',
        },
        {
          label: '推荐',
          prop: 'recommend',
          component: (row) => {
            return row.recommend
              ? { is: 'custom-tag', type: 'success', title: '是' }
              : { is: 'custom-tag', type: 'danger', title: '否' }
          },
        },
        {
          label: '置顶',
          prop: 'top',
          component: (row) => {
            return row.top
              ? { is: 'custom-tag', type: 'success', title: '是' }
              : { is: 'custom-tag', type: 'danger', title: '否' }
          },
        },
        {
          label: '状态',
          prop: 'status',
          component: (row) => {
            return row.status
              ? { is: 'custom-tag', type: 'success', title: '启用' }
              : { is: 'custom-tag', type: 'danger', title: '禁用' }
          },
        },
        {
          label: '添加时间',
          prop: 'addtime',
          width: 140,
        },
        {
          label: '修改时间',
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
            message: '删除成功',
            type: 'success',
          })
        })
        .catch(() => {})
    }

    const handleDownload = (index, row) => {
      proxy.$message({
        message: '当前下载行的id是' + row.id,
        type: 'success',
      })
    }

    const handleDeleteRows = () => {
      if (data.selectionIdList.length == 0) {
        proxy.$message({
          message: '请选择要删除的数据',
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
            message: '删除成功',
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