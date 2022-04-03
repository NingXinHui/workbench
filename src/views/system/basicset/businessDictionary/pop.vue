<template>
  <div class="popBox">
    <el-dialog
        title="字典配置"
        :visible="show"
        @close="close"
        destroy-on-close
        :close-on-click-modal="false"
    >
      <div class="content">
        <div class="pop-header-box">
          <div>
            <span>类型编号</span>
            <span>{{ editAddData.dictTypeNo }}</span>
          </div>
          <div>
            <span>类型名称</span>
            <span>{{ editAddData.dictTypeName }}</span>
          </div>
        </div>
        <div class="pop-table-box">
          <div class="pop-table-btn">
            <el-button plain size="mini" @click="addDetails">新增</el-button>
            <!-- <el-button plain size="mini" class="delButton" @click="deleteDetails">删除</el-button> -->
          </div>
          <div class="zTable">
            <main-table
                class="pop-table-content"
                ref="mainTable"
                :isMain="true"
                :tableColumn="tableColumn"
                :tableData="tableData"
                :loading="loading"
                @selePage="handleItemSelect"
                :isSelection="true"
                :tableheight="400"
            />
          </div>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit" :disabled="loading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {queryDictConfig, addDictConfig,} from '@/api/basicConfig/commonality/dict'
import {deepCopy, getMathIndex,} from "@/lib/common";
import MainTable from "@/components/CommonTable";

export default {
  components: {
    MainTable,
  },
  name: '',
  data() {
    return {
      //当前编辑条件
      queryForm: {},
      show: true,
      loading: false,
      tableColumn: [
        {
          label: '编号',
          prop: 'dictValue',
          isEdit: true,
          config: {
            key: 'dictValue',
            type: 'input',
            subtype: 'text',
          },
        },
        {
          label: '名称',
          prop: 'dictLabel',
          isEdit: true,
          config: {
            key: 'dictLabel',
            type: 'input',
            subtype: 'text',
          },
        },
        {
          label: '排序号',
          prop: 'orderNumber',
          isEdit: true,
          config: {
            key: 'orderNumber',
            type: 'number',
            min: 1,
            max: 999999999,
            precision: 0,
          },
        },
        {
          label: '是否可用',
          prop: 'usable',
          align: 'center',
          isEdit: true,
          config: {
            key: 'usable',
            type: 'checkbox',
          },
        },
      ],
      tableData: [],
      multipleSelection: [],
      deletedIdList: [],
    }
  },
  computed: {},
  props: {
    editAddData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    config: {
      type: Object,
      default: () => {
        return {
          show: false,
        }
      }
    },
  },
  created() {
    this.initData()
  },
  methods: {
    /**
     * @desc 添加新列
     */
    addDetails() {
      let obj = {
        dictLabel: '',
        dictValue: '',
        orderNumber: 1,
        usable: true,
        isIndex: getMathIndex(this.tableData, 'isIndex'),
      }

      this.clearSelct()
      this.tableData.push(obj)
    },
    /**
     * @desc 删除数据
     */
    deleteDetails() {
      let array = this.tableData

      this.multipleSelection.forEach(item => {
        // if(item.id) {
        //     this.deletedIdList.push(item.id)
        // }

        let index = array.findIndex(value => {
          if (item.id) {
            // return item.id == value.id
            if (item.id == value.id) {
              value.usable = false
            }
          } else {
            return item.isIndex == value.isIndex
          }
        })

        if (index != -1) {
          array.splice(index, 1)
        }
      })
      this.tableData = array
      this.clearSelct()
    },
    /**
     * @desc 查询配置里面所有指定类的明细
     */
    queryDictConfig() {
      this.loading = true
      let params = {
        id: this.editAddData.id,
      }

      queryDictConfig(params).then(res => {
        this.loading = false
        this.tableData = res.data
      })
          .catch(error => {
            console.group(error)
            this.loading = false
            this.tableData = []
          })
    },
    /**
     * @desc 新增编辑删除
     */
    addDictConfig() {
      let array = deepCopy(this.tableData)

      array.forEach(item => {
        delete item.isIndex
      })
      let params = {
        dictTypeId: this.editAddData.id,
        deletedIdList: this.deletedIdList,
        list: array,
      }
      this.loading = true
      addDictConfig(params).then(res => {
        this.loading = false
        this.$message.success('配置成功')
        this.close()
      })
          .catch(error => {
            console.group(error)
            this.loading = false
          })

    },
    /**
     * @desc 初始化数据
     */
    initData() {
      this.queryDictConfig()
    },
    /**
     * @desc 获取选中的数据
     */
    handleItemSelect(val) {
      this.multipleSelection = val
    },
    /**
     * @desc 关闭弹窗
     */
    close() {
      this.$emit('close', false)
    },
    /**
     * @desc 点击保存
     */
    submit() {
      if (this.tableData.length > 0) {
        let index = this.tableData.findIndex(item => {
          return item.dictLabel === '' || item.dictValue === '' || item.orderNumber === '' || typeof item.orderNumber === 'undefined'
        })

        if (index == -1) {
          this.addDictConfig()
        } else {
          this.$message.error('有未编辑完的数据')
        }
      } else {
        this.$message.error('请添加数据')
      }
    },
    /**
     * @desc 清空选中数据
     */
    clearSelct() {
      if (this.$refs.mainTable) {
        this.$refs.mainTable.resetSelect();
      }
    },
  },
  mounted() {
  },
}
</script>
<style lang="scss" scoped>
.popBox {
  .pop-header-box {
    display: flex;
    height: 35px;
    line-height: 35px;

    & > div {
      font-size: 12px;
      color: #999999;
      width: 50%;

      span:last-child {
        margin-left: 10px;
        color: #374256;
      }
    }
  }

  .pop-table-btn {
    background-color: #f8f8f9;
    padding: 8px;
    border: 1px solid #dfe6ec;
    border-bottom: 0;

    .el-button {
      width: auto !important;
    }
  }
}
</style>
