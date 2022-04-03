<template>
  <div id="look-up-box">
    <el-dialog
        title="查询信息"
        :visible="show"
        @close="close"
        destroy-on-close
        width="650px"
        :close-on-click-modal="false"
    >
      <div class="content">
        <div class="form">
          <form-list v-model="queryForm" :formConfig="formConfig" ref="form">
            <el-form-item class="look-up-btn">
              <el-button type="primary" @click="searchData">查询</el-button>
              <el-button type="primary" @click="resetParams">重置</el-button>
            </el-form-item>
          </form-list>
        </div>
        <div class="pop-table-box">
          <main-table
              class="pop-table-content"
              ref="mainTable"
              :loading="loading"
              is-selection
              :isMain="true"
              :tableColumn="tableColumn"
              :tableData="tableData"
              :isSelection="true"
             :table-height="400"
              @selePage="handleItemSelect"
              @rowClick="rowClick"
              @rowDbClick="rowDbClick"
          />
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <div class="dialog-footer-input">
          <span>显示</span>
          <el-input class="dialog-footer-input-box" v-model="total" @change="resetData"></el-input>
          <span> 条 </span>
        </div>
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {getWarouseList, getWarouseTypeList,} from '@/api/basicConfig/workshop/index'

import formList from '@/components/Form/formList.vue'
import MainTable from "@/components/CommonTable/commonTable";

export default {
  components: {
    formList,
    MainTable,
  },
  name: '',
  data() {
    return {
      //当前编辑条件
      queryForm: {
        storeNo: '',
        storeName: '',
        storeGroupId: '',
      },
      show: false,
      total: 20,
      tableColumn: [
        {
          label: '序号',
          prop: 'index',
          type: 'index',
        },
        {
          label: '仓库编号',
          prop: 'StoreNo',
        },
        {
          label: '仓库名称',
          prop: 'storeName',
        },
        {
          label: '仓库分组',
          prop: 'storeGroupName',
        }
      ],
      tableData: [],
      storeGroupOptions: [],
      tableSourceData: [],
      multipleSelection: [],
      loading: false,
    }
  },
  computed: {
    formConfig() {
      let formItemList = [
        {
          label: '仓库编号',
          type: 'input',
          subtype: 'text',
          key: 'storeNo',
        },
        {
          label: '仓库名称',
          type: 'input',
          subtype: 'text',
          key: 'storeName',
        },
        {
          label: '仓库分组',
          type: 'select',
          options: this.storeGroupOptions,
          key: 'storeGroupId',
        },
      ]

      return {
        inline: true,
        size: 'mini',
        formItemList,
      }
    },
  },
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
     * @desc 获取仓库分组数据
     */
    getWarouseTypeList() {
      let array = []

      getWarouseTypeList().then(res => {
        res.data.forEach(item => {
          item.label = item.storeGroupName
          item.value = item.id
        })

        array = res.data

        this.storeGroupOptions = array
      })
          .catch(error => {
            console.group(error)
            this.storeGroupOptions = array
          })
    },
    /**
     * @desc 重新截取数据
     */
    resetData(val) {
      let bool = false

      if (isNaN(val)) {
        val = 20
        bool = true
      }

      if (val < 20) {
        val = 20
        bool = true
      }

      if (val > 50) {
        val = 50
        bool = true
      }

      if (bool) {
        // this.$message.error('请输入合法数据')
      }
      this.total = val

      this.searchData()
    },
    /**
     * @desc 获取数据列表
     */
    getWarouseList(type) {
      this.loading = true
      let params = {
            usable: true,
            pageNo: 1,
            pageSize: this.total,
          },
          objParams = {
            storeNo: 'storeNo',
            storeName: 'storeName',
            storeGroupId: 'storeGroupId',
          },
          array = []

      Object.keys(objParams).forEach(item => {
        if (typeof this.queryForm[objParams[item]] != 'undefined' && this.queryForm[objParams[item]] != '') {
          params[item] = this.queryForm[objParams[item]]
        }
      })

      this.clearSelct()
      getWarouseList(params).then(res => {
        this.loading = false
        array = res.data.records
        // this.tableSourceData = res.data
        this.tableData = array
      })
          .catch(error => {
            console.group(error)
            this.loading = false
            this.tableData = array
          })
    },
    /**
     * @desc 重置参数
     */
    resetParams() {
      this.queryForm = {
        storeNo: '',
        storeName: '',
        storeGroupId: '',
      }
      this.searchData()
    },
    /**
     * @desc 获取选中的数据
     */
    handleItemSelect(val) {
      this.multipleSelection = val
    },
    //单击事件
    rowClick(val) {
      this.$refs.mainTable.$refs.multipleTable.toggleRowSelection(val, true)
    },
    //双击事件
    rowDbClick() {
      this.submit()
    },
    /**
     * @desc 查询数据
     */
    searchData() {
      this.getWarouseList('search')
    },
    /**
     * @desc 初始化数据
     */
    initData() {
      this.getWarouseList('init')
      this.getWarouseTypeList()
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
      if (!this.checkCount()) {
        return
      }
      let selectRow = this.multipleSelection[0]

      this.$emit('submit', {storeName: selectRow.storeName, storeId: selectRow.id})
    },
    /**
     * @desc 清空选中数据
     */
    clearSelct() {
      if (this.$refs.mainTable) {
        this.$refs.mainTable.resetSelect();
      }
    },
    /**
     * @desc 选择条数校验
     */
    checkCount() {
      let bool = true,
          count = this.multipleSelection.length

      if (count != 1) {
        let title = '此操作只允许操作一条数据'

        if (count < 1) {
          title = '请选择操作项'
        }

        this.$message({
          message: title,
          type: "error",
          showClose: true
        })
        bool = false
      }

      return bool
    },
  },
  mounted() {
    this.show = true
  },
}
</script>
