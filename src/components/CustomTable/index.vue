<template>
  <div>
    <div v-if="showFilter||showSearch" class="check-cloumn-container">
      <slot v-if="showSearch" name="searchBar"></slot>
      <el-dropdown v-if="showFilter" class="filter">
        <el-button type="primary">
          <span style="vertical-align: middle;"> 筛选 </span>
          <el-icon style="vertical-align: middle;">
            <arrow-down />
          </el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <div class="clear-btn-box">
              <el-button type="primary" @click="handleClickClearCache">
                <el-icon style="vertical-align: middle;">
                  <refresh />
                </el-icon>
                <span style="vertical-align: middle;"> 清除缓存 </span>
              </el-button>
            </div>
            <el-checkbox v-model="checkAll" class="check-column-item" :indeterminate="isIndeterminate"
                         @change="handleCheckAllChange">全选
            </el-checkbox>
            <el-checkbox-group v-model="checkedColumn" @change="handleCheckedColumnChange">
              <div v-for="(item,index) in tableHead" :key="index">
                <el-checkbox class="check-column-item" :label="item.label">{{item.label}}</el-checkbox>
              </div>
            </el-checkbox-group>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <el-table :id="id" :key="key" ref="multipleTable" :data="data" :row-key="hanldeRowKey" border fit default-expand-all
              tooltip-effect="dark" style="width: 100%" @header-dragend="handleHeaderDrag" @row-click="handleRowClick"
              @select="handleSelect" @select-all="handleSelectAll" @selection-change="handleSelectionChange"
              @row-dblclick="handleRowDblClick">
      <!-- 多选框checkbox -->
      <el-table-column v-if="showSelection" type="selection" width="55">
      </el-table-column>
      <el-table-column v-for="(item,index) in tableHeadOptions" :key="index" :width="item.width ? item.width : ''"
                       :align="item.align||'center'" :label="item.label" :prop="item.prop"
                       :sortable="item.sortable ? 'custom' : false" show-overflow-tooltip>
        <template v-slot="scope">
          <!-- 单元格渲染html代码 -->
          <template v-if="item.render"><span v-html="item.render(scope.row)"></span></template>
          <!-- 渲染动态组件,这里只用到了tag组件,其他组件自行实现 -->
          <template v-else-if="item.component">
            <component :is="item.component(scope.row).is" :type="item.component(scope.row).type"
                       :title="item.component(scope.row).title"></component>
          </template>
          <!-- 渲染普通文字 -->
          <template v-else>{{scope.row[item.prop]}}</template>
        </template>
      </el-table-column>
      <!-- 操作列 -->
      <el-table-column v-if="showOpt" align="center" label="操作" :min-width="optWidth">
        <template v-slot="scope">
          <el-button type="primary" @click.stop="handleEdit(scope.$index, scope.row)">
            <el-icon>
              <edit />
            </el-icon>
          </el-button>
          <el-button type="danger" @click.stop="handleDelete(scope.$index, scope.row)">
            <el-icon>
              <delete />
            </el-icon>
          </el-button>
          <slot :scope="scope" name="opt">
          </slot>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="showPage" class="block">
      <el-pagination :current-page="params.page" :total="params.total" :page-sizes="params.pageSizes"
                     :page-size="params.pageSize" background layout="total, sizes, prev, pager, next, jumper"
                     @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
import {
  defineComponent,
  onBeforeMount,
  reactive,
  ref,
  toRefs,
  watch,
} from 'vue'
import CustomTag from '@/components/CustomTag/index.vue'
import Sortable from 'sortablejs' //拖拽插件

export default defineComponent({
  name: 'CustomTable',
  components: {
    CustomTag,
    Sortable,
  },
  props: {
    //表格id
    id: {
      type: String,
      default: '',
    },
    //显示多选框
    showSelection: {
      type: Boolean,
      default: true,
    },
    //多选框是否为单选
    isRadio: {
      type: Boolean,
      default: false,
    },
    //表头数据
    tableHead: {
      type: Array,
      default: () => {
        return []
      },
    },
    //表格数据
    data: {
      type: Array,
      default: () => {
        return []
      },
    },
    //显示分页
    showPage: {
      type: Boolean,
      default: true,
    },
    //分页参数
    params: {
      type: Object,
      default: null,
    },
    //显示筛选
    showFilter: {
      type: Boolean,
      default: true,
    },
    //显示搜索
    showSearch: {
      type: Boolean,
      default: true,
    },
    //显示操作
    showOpt: {
      type: Boolean,
      default: true,
    },
    //操作列最小宽度
    optWidth: {
      type: Number,
      default: 120,
    },
  },
  //组件发出的事件需要定义
  emits: [
    'handleSizeChange',
    'handleCurrentChange',
    'handleSelectionChange',
    'handleRowDblClick',
    'handleEdit',
    'handleDelete',
    'handleRowRrop',
  ],
  setup(props, { emit }) {
    //数据对象
    let data = reactive({
      key: 0, //table的key
      tableHeadOptions: {}, //实际显示的tableHead
      selectionId: null, //当前选中id临时变量
      checkAll: true, //全选
      checkedColumn: [], //字段筛选列表
      isIndeterminate: false, //全选按钮 样式  - 或者是 √
    })

    //ref
    const multipleTable = ref(null)

    onBeforeMount(() => {
      initHead()
      //必须在初始化之后
      watch(
        () => data.checkedColumn,
        (value) => {
          data.tableHeadOptions = props.tableHead.filter((i) => {
            return value.indexOf(i.label) >= 0
          })
          // // console.log(props.tableHead)
          data.key += 1 //fix 抖动 bug
          setTimeout(() => {
            rowDrop() //每次重绘表格在执行拖动
          }, 100)
        },
        { immediate: true }
      )
    })

    //初始化表头
    const initHead = (isClearCache = false) => {
      //获取浏览器缓存的列宽
      if (localStorage.getItem(props.id) == null) {
        localStorage.setItem(props.id, JSON.stringify(props.tableHead))
      } else {
        let temptableHead = JSON.parse(localStorage.getItem(props.id))

        temptableHead.forEach((element) => {
          let x = props.tableHead.find((obj) => obj.label == element.label)
          x.width = element.width
        })
      }
      //是否是清除缓存
      if (!isClearCache) {
        //放入筛选列
        props.tableHead.forEach((element) => {
          data.checkedColumn.push(element.label)
        })
      } else {
        data.key += 1
      }
    }

    //行key
    const hanldeRowKey = (row) => {
      return row.id
    }

    //分页
    const handleSizeChange = (val) => {
      emit('handleSizeChange', val)
    }

    //分页
    const handleCurrentChange = (val) => {
      emit('handleCurrentChange', val)
    }

    //单击一行 选中
    const handleRowClick = (row) => {
      if (props.isRadio) {
        //单选
        multipleTable.value.clearSelection()
        if (row) {
          //如果选中了行
          if (row.id == data.selectionId) {
            //如果选中的还是上一行
            data.selectionId = ''
            emit('handleSelectionChange', null)
            multipleTable.value.toggleRowSelection(row, false)
          } else {
            //如果是其他行
            data.selectionId = row.id
            emit('handleSelectionChange', row.id)
            multipleTable.value.toggleRowSelection(row, true)
          }
        } else {
          //如果没有选中
          data.selectionId = ''
          emit('handleSelectionChange', null)
          multipleTable.value.toggleRowSelection(row, true)
        }
      } else {
        //多选
        multipleTable.value.toggleRowSelection(row)
      }
    }

    //选择
    const handleSelect = (selection, row) => {
      if (props.isRadio) {
        // 清除所有选中
        multipleTable.value.clearSelection()
        if (selection.length === 0) {
          emit('handleSelectionChange', null)
          return
        }
        // 将当前点击项选中
        multipleTable.value.toggleRowSelection(row, true)
        if (row) {
          emit('handleSelectionChange', row.id)
        }
      }
    }

    //全选
    const handleSelectAll = (selection, row) => {
      if (props.isRadio) {
        multipleTable.value.clearSelection()
        console.log('null')
      }
    }

    //选中行状态改变
    const handleSelectionChange = (rows) => {
      if (!props.isRadio) {
        //多选
        let selectionIdList = []
        rows.forEach((element) => {
          selectionIdList.push(element.id)
        })
        emit('handleSelectionChange', selectionIdList)
      }
    }

    //双击打开编辑
    const handleRowDblClick = (val) => {
      let id = val.id
      emit('handleRowDblClick', id)
    }

    //编辑操作
    const handleEdit = (index, row) => {
      emit('handleEdit', index, row)
    }

    //删除操作
    const handleDelete = (index, row) => {
      emit('handleDelete', index, row)
    }

    //拖动表头 改变宽度 保存到localstorage
    const handleHeaderDrag = (newWidth, oldWidth, column, event) => {
      setTimeout(() => {
        let table_key = props.id
        let applyTableColWidths = []
        let applyTable = document.getElementById(table_key)
        let applyTableColgroup = applyTable.getElementsByTagName('colgroup')[0]
        let applyTableCol = applyTableColgroup.getElementsByTagName('col')
        //这里循环变量i是head字段在表头th中的顺序 需要去掉选择框 和 操作列 这2列是固定的
        for (
          let i = props.showSelection ? 1 : 0, j = 0;
          i <
          (props.showOpt ? applyTableCol.length - 2 : applyTableCol.length - 1);
          i++, j++
        ) {
          applyTableColWidths.push({
            label: data.tableHeadOptions[j].label,
            width: applyTableCol[i].width,
          })
        }
        let oldTableHead = JSON.parse(localStorage.getItem(props.id))

        //循环 并更新 指定字段宽度
        oldTableHead.forEach((element) => {
          let x = applyTableColWidths.find((obj) => obj.label == element.label)
          if (x) {
            element.width = x.width
          }
        })

        //更新tableHead 数据
        oldTableHead.forEach((element) => {
          let x = props.tableHead.find((obj) => obj.label == obj.label)
          if (x) {
            x.width = element.width
          }
        })

        //保存到localstorage
        localStorage.setItem(table_key, JSON.stringify(oldTableHead))
      }, 100)
    }

    //行拖动交换 触发函数参数为交换记录行的id值
    const rowDrop = () => {
      const tbody = document.querySelector('.el-table__body-wrapper tbody')

      Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = props.data.splice(oldIndex, 1)[0]
          props.data.splice(newIndex, 0, currRow)
          emit('handleRowRrop', props.data) //当前页新的排序数据
        },
      })
    }

    //全选
    const handleCheckAllChange = (val) => {
      data.checkedColumn = []

      if (val) {
        props.tableHead.forEach((element) => {
          data.checkedColumn.push(element.label)
        })
      }

      data.isIndeterminate = false
    }

    //切换筛选
    const handleCheckedColumnChange = (value) => {
      let checkedCount = value.length
      data.checkAll = checkedCount === props.tableHead.length
      data.isIndeterminate =
        checkedCount > 0 && checkedCount < props.tableHead.length
    }

    //清除缓存
    const handleClickClearCache = () => {
      localStorage.removeItem(props.id)
      initHead(true)
    }

    return {
      ...toRefs(data),
      multipleTable,
      hanldeRowKey,
      handleSizeChange,
      handleCurrentChange,
      handleRowClick,
      handleSelect,
      handleSelectAll,
      handleSelectionChange,
      handleRowDblClick,
      handleEdit,
      handleDelete,
      handleHeaderDrag,
      rowDrop,
      handleCheckAllChange,
      handleCheckedColumnChange,
      handleClickClearCache,
    }
  },
})
</script>

<style lang="scss">
.check-cloumn-container {
  .filter {
    height: 29px;
    width: 73px;
  }
}
</style>
<style lang="scss" scoped>
.check-cloumn-container {
  display: flex;
  justify-content: space-between;
  align-items: top;
  margin-bottom: 18px;
}
.check-column-item {
  padding: 6px 8px;
  height: auto;
}

.el-dropdown-menu {
  .clear-btn-box {
    padding: 0 10px 6px 10px;
  }
}
</style>