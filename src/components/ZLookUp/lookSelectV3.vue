<template>
  <div id="look-up-box">
    <el-dialog
        :title="config.title"
        :visible="show"
        @close="close"
        destroy-on-close
        width="750px"
        :close-on-click-modal="false"
    >
      <div class="content">
        <div class="form" style="display: flex;width: 100%">
          <form-list v-model="queryForm" :formConfig="formConfig" ref="form" class="width700"></form-list>
          <div style="width: 135px;float: right">
            <el-button type="primary" @click="searchData">查询</el-button>
            <el-button type="primary" @click="resetParams">重置</el-button>
          </div>
        </div>
        <div style="display: flex;align-items: center;justify-content: space-between">
          <div class="pop-table-label">待选订单</div>
          <el-button type="primary" :disabled="!multipleSelection.length>0" size="mini" @click="add">添加</el-button>
        </div>


        <div class="pop-table-box">
          <main-table
              class="pop-table-content"
              ref="mainTable"
              is-select-more
              :loading="loading"
              :isSelection="true"
              :isMain="true"
              :tableColumn="tableColumn"
              :tableData="tableData"
              :table-height="200"
              @selePage="rowClick"
          />
          <el-divider></el-divider>

          <div style="display: flex;align-items: center;justify-content: space-between">
            <div class="pop-table-label">{{ topLable }}</div>
            <el-button type="danger" :disabled="!multipleAddSelection.length>0" @click="del">移除</el-button>
          </div>
          <main-table
              class="pop-table-content"
              ref="addMainTable"
              :isMain="true"
              is-select-more
              is-selection
              :tableColumn="addTableColumn"
              :tableData="addTableData"
              :table-height="200"
              @selePage="rowAddClick"
          />
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit">确 认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import formList from '@/components/Form/formList.vue'
import MainTable from "@/components/CommonTable";
import {getMathIndex, checkExistData, deepCopy,} from "@/lib/common";

export default {
  components: {
    formList,
    MainTable,
  },
  name: 'LooKSelect',
  data() {
    return {
      //当前编辑条件
      queryForm: {},
      show: false,
      tableData: [],
      addTableData: [],
      multipleSelection: [],
      multipleAddSelection: [],
      loading: false,
      // oldData:[]
    }
  },
  computed: {
    formConfig() {
      return {
        inline: true,
        size: 'mini',
        formItemList: this.formItemList,
      }
    },
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          show: false,
          title: '',
        }
      }
    },
    extQtyType: {
      type: Boolean,
      default: false,
    },
    outQtyType: {
      type: Boolean,
      default: false,
    },
    QtyType: {
      type: Boolean,
      default: false,
    },
    formItemList: {
      type: Array,
      default: () => {
        return []
      }
    },
    tableColumn: {
      type: Array,
      default: () => {
        return []
      },
    },
    //已加入的
    addTableColumn: {
      type: Array,
      default: () => {
        return []
      },
    },
    //接口查询方法
    method: {
      type: Function,
    },
    params: {
      type: Object,
      default: () => {
        return {}
      }
    },
    typeWords: {
      type: String,
      default: ''
    },
    topLable: {
      type: String,
      default: '已选订单'
    },
  },
  created() {
    this.resetParams()
  },
  methods: {
    add() {
      //去除已添加的数据
      let arr = this.multipleSelection.filter(item => {
        return this.addTableData.every(v => v.id !== item.id)
      })
      this.addTableData = [...this.addTableData, ...arr]
      //删除上面表格添加进去的数据
      this.tableData = this.tableData.filter(v => {
        return this.addTableData.every(e => e.id !== v.id);
      });
      this.$refs.mainTable.$refs.multipleTable.clearSelection()
    },
    del() {
      //清除下面选中的数据
      this.addTableData = this.addTableData.filter(v => {
        return this.multipleAddSelection.every(e => e.id !== v.id);
      });
      //将清楚的数据重新添回上面表格中,剔除上面表格已存在的数据
      let arr = this.multipleAddSelection.filter(item => {
        return this.tableData.every(v => v.id !== item.id)
      })
      this.tableData = [...arr, ...this.tableData]
      this.$refs.addMainTable.$refs.multipleTable.clearSelection()
    },
    /**
     * @desc 重置参数
     */
    resetParams() {
      let obj = {}

      this.formItemList.forEach(item => {
        if (item.type == 'number') {
          obj[item.key] = undefined
        } else {
          obj[item.key] = ''
        }
      })

      this.queryForm = obj
      this.searchData()
    },
    //单击事件
    rowClick(val, type) {
      this.multipleSelection = val
    },
    //已添加点击事件
    rowAddClick(val) {
      this.multipleAddSelection = val
    },
    /**
     * @desc 查询数据
     */
    searchData() {
      let params = {
            ...this.queryForm,
            ...this.params,
          },
          array = []

      this.loading = true
      this.method(params).then((res) => {
        this.loading = false
        if (res.data.records !== undefined) {
          array = res.data.records;
        } else {
          array = res.data;
        }
        if (this.addTableData) {
          array = array.filter(item => {
            return this.addTableData.every(v => v.id !== item.id)
          })
        }
        this.tableData = array
        this.$emit('afterTableData', this.tableData)
      })
          .catch(() => {
            this.loading = false
            this.tableData = array
          })
    },
    /**
     * @desc 关闭弹窗
     */
    close() {
      this.$emit('close', false)
    },

    setData() {
      this.tableData.map(item => {
        item.qty = 0
      })
    },

    /**
     * @desc 点击保存
     */
    submit() {
      if (this.addTableData.length <= 0) {
        this.$message.error('请选择操作项')
        return
      }
      this.close()
      this.$emit('submit', this.addTableData)
    },
  },
  mounted() {
    this.show = true

  },
}
</script>
<style lang="less" scoped>
.pop-table-label {
  height: 30px;
  line-height: 30px;
  font-size: 12px;
}

/deep/ .el-form-item__label {
  width: 80px;
  text-align: right;
}

/deep/ .el-button + .el-button {
  margin-left: 4px;
}

.width700 {
  width: 700px;
}
</style>
