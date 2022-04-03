<!--
@time:2021/12/1
@author:chenqian
-->
<template>
  <div id="zPage">
    <!-- 按钮 -->
    <div class="z-header">
      <div class="z-header-button">
        <el-button @click="openEdit('add')">新增</el-button>
        <el-button @click="openEdit('edit')">编辑</el-button>
        <el-button class="delButton"
                   @click="operationFun('delete')">删除</el-button>
        <el-button @click="operationFun('submit')">提交</el-button>
        <el-button @click="operationFun('withdraw')">撤回</el-button>
        <el-button @click="audit('examine', '12')">审核</el-button>
        <el-button @click="audit('cancelAudit', '123')">反审核</el-button>
        <el-button @click="audit('Push', '123')">下推</el-button>
        <el-button @click="audit('Joint', '123')">联查</el-button>
      </div>
    </div>
    <div class="z-content">
      <el-card>
        <!-- 搜索条件 -->
        <header-search :searchArr="searchArr"
                       @sureSearch="searchMethod"
                       :isPrint='true'
                       printtype='order_no'
                       :selectRow='selectRow'>
          <slot>
            <!-- <el-button @click="operationFun('print')">打印</el-button> -->
            <el-button @click="operationFun('print')"
                       style="margin-top: -2px;">打印</el-button>
            <el-button @click="operationFun('export')"
                       style="margin-top: -2px;">导出</el-button>
          </slot>
        </header-search>
        <div class="z-content-table">
          <!-- table -->
          <common-table is-height
                        ref="mainTable"
                        :isMain="true"
                        :tableColumn="tableColumn"
                        :tableData="tableData"
                        :isSelection="true"
                        :isSelectMore="false"
                        :loading="loading"
                        :pageParams="pageParams"
                        @selePage="handleItemSelect"
                        @pageChange="pageSizeChange" />
        </div>
      </el-card>
    </div>
    <Approval :approvalVisible.sync="approvalVisible"
              :approvalText="approvalText"
              :titletype="titletype"></Approval>
    <Push :pushVisible.sync="pushVisible"
          :pushlText="pushlText"></Push>
  </div>
</template>

<script>
import HeaderSearch from '@/components/CommonHeadSearch/ZSearch'
import commonTable from '@/components/CommonTable'

import { getDataList, deleteData, withdrawData, submitData, } from '@/api/marketOrder'



import { searchwareListApi, deleteWareApi, submitWareApi, backSubmitWareApi, searchStockTypeApi } from "@/api/wareManagementApi/wareManagemen";
import { downloadsome } from "@/utils/auth"
import { deepCopy, } from "@/lib/common"
import orderMixins from "@/lib/orderMixins"
import Approval from "./approval"
import Push from "./Push"

export default {
  name: "",
  components: {
    HeaderSearch,
    commonTable,
    Approval,
    Push
  },
  mixins: [orderMixins],
  data () {
    return {
      approvalVisible: false,
      pushVisible: false,
      approvalText: "审核",
      pushlText: "选择下推方向",
      titletype: "",
      selectRow: {},
      queryForm: {},
      tableColumn: [
        {
          type: 'index',
          label: '序号',
        },
        {
          prop: 'billNo',
          label: '入库单编号',
          render: (h, scope) => {
            return h(
              "a",
              {
                style: "color:blue",
                on: { click: () => this.openEdit('details', scope.row) },
              },
              scope.row.billNo
            );
          },
        },
        {
          prop: 'orderNo',
          width: 120,
          label: '关联销售订单号',
        },
        {
          prop: 'sourceNo',
          label: '来源单号',
        },
        {
          prop: 'sourceType',
          label: '源单类型',
        },
        {
          prop: 'inTypeName',
          label: '入库类型',
        },
        {
          prop: 'districtName',
          label: '仓库地区',
        },

        {
          prop: 'billStatusName',
          label: '单据状态',
        },
        {
          prop: 'inTime',
          label: '入库时间',
        },
        {
          prop: 'companyId',
          label: '公司主体',
        },
        {
          prop: 'bookKeeperName',
          label: '记账人',
        },
        {
          prop: 'shipPersonName',
          label: '装运人员',
        },
        {
          prop: 'unloadWages',
          label: '卸车工资',
        },
        {
          prop: 'businessDate',
          label: '业务日期',
        },
        //  {
        //   prop: 'ownerName',
        //   label: '货主',
        // }, {
        //   prop: 'inventoryNature',
        //   label: '库存性质',
        // }, {
        //   prop: 'billStatusName',
        //   label: '附件',
        // }, {
        //   prop: 'remark',
        //   label: '备注',
        // },
        // {
        //   prop: 'createUserName',
        //   label: '创建人',
        // },
        // {
        //   prop: 'billStatusName',
        //   label: '创建时间',
        // }
      ],
      tableData: [],
      loading: false,
      pageParams: {
        pageNum: 1,
        pageSize: 30,
        total: 0
      },
      multipleSelection: [],
    }
  },
  computed: {
    searchArr () {
      return [
        // {
        //   label: '查询方案',
        //   value: 'billStatus',
        //   optionLabel: 'label',
        //   optionValue: 'value',
        //   type: 2,
        //   selectOption: [{
        //     label: '草稿',
        //     value: 0
        //   }, {
        //     label: '审核中',
        //     value: 1
        //   }, {
        //     label: '已审核',
        //     value: 2
        //   }]
        // },
        {
          label: '入库单号',
          value: 'billNo',
          type: 1,
          maxLength: 40,
        }, {
          label: '入库类型',
          value: 'inType',
          optionLabel: 'label',
          optionValue: 'value',
          type: 2,
          selectOption: [{
            label: '0',
            value: 0
          }, {
            label: '1',
            value: 1
          }, {
            label: '2',
            value: 2
          }]
        }, {
          label: '单据状态',
          value: 'orderNo',
          optionLabel: 'label',
          optionValue: 'value',
          type: 2,
          selectOption: [{
            label: '草稿',
            value: 0
          }, {
            label: '审核中',
            value: 1
          }, {
            label: '已审核',
            value: 2
          }]
        },
        {
          label: '供应商',
          value: 'supplierName',
          type: 1,
          maxLength: 40,
        },
        {
          label: '创建时间',
          value: 'inTime',
          type: 4,
          rangedesc: '至',
          pickerType: 'daterange',
          valueFormat: 'yyyy-MM-dd',
        },
      ]
    }
  },
  created () {
    this.pageChange(1)
  },
  methods: {
    /**
     * @desc 导出
     */
    exportCommonData () {
      // 传查询条件
      let params = { ...this.queryForm }
      downloadsome(
        '/st/in-store/export', params, '入库管理模块清单.xls'
      )
    },
    /**
     * @desc 条件数据获取
     */
    searchMethod (data) {
      this.queryForm = data
      this.pageChange(1)
    },
    /**
     * @desc 初始化数据列表接口参数
     */
    initParams () {
      let params = {
        pageNo: this.pageParams.pageNum,
        pageSize: this.pageParams.pageSize,
        billNo: this.queryForm.billNo, //入库单号
        // inType: this.queryForm.inType.value, //入库类型
        billStatus: this.queryForm.billStatus, // 单据状态
        inStartTime: this.queryForm.billStatus,//	入库-查询开始时间
        inEndTime: this.queryForm.billStatus,//入库-查询结束时间
        supplierName: this.queryForm.supplierName
      }
      // objParams = {

      // }
      // Object.keys(objParams).forEach(item => {
      //   if (typeof this.queryForm[objParams[item]] != 'undefined' && this.queryForm[objParams[item]] != '') {
      //     params[item] = this.queryForm[objParams[item]]
      //   }
      // })

      if (Array.isArray(this.queryForm.createDate)) {
        let time = this.queryForm.createDate

        params.beginDate = time[0] + ' 00:00:00'
        params.endDate = time[1] + ' 23:59:59'
      }

      return params
    },
    /**
     * @desc 获取数据列表
     */
    getDataList () {
      this.loading = true
      let params = this.initParams()

      this.clearSelct()
      searchwareListApi(params).then(res => {
        console.log('我是查询结果', res)
        this.loading = false

        this.tableData = res.data.records
        this.pageParams.total = res.data.total
      })
        .catch(error => {
          console.group(error)
          this.tableData = []
          this.loading = false
          this.pageParams.total = 0
        })
    },
    /**
     * @desc 选择复选
     */
    handleItemSelect (val) {
      this.multipleSelection = val
      this.selectRow = val[0]
    },
    /**
     * @desc 页数发生变化
     */
    pageChange (page) {
      this.pageParams.pageNum = page
      this.getDataList()
    },
    /**
     * @desc 页面页码页面数字改变
     */
    pageSizeChange (data) {
      this.pageParams.pageNum = data.page
      this.pageParams.pageSize = data.limit

      this.getDataList()
    },
    /**
     * @desc 删除选中数据
     */
    operationFun (type) {
      let objText = {
        delete: {
          text: '确认删除选中的数据吗？',
          fun: this.delData,
          check: this.checkOperation,
          key: 'billStatus',
          value: '123345',
        },
        submit: {
          text: '确认提交选中的数据吗？',
          fun: this.submitData,
          check: this.checkOperation,
          key: 'billStatus',
          value: '12345',
        },
        withdraw: {
          text: '确认撤回选中的数据吗？',
          fun: this.withdrawData,
          check: this.checkOperation,
          key: 'billStatus',
          value: '0',
        },
        print: {
          text: '确认打印选中的数据吗？',
          fun: this.printCommonData,
        },
        export: {
          text: '确认导出查询的数据？',
          fun: this.exportCommonData,
        },
        copy: {
          text: '确认复制选中数据到新单据？',
          fun: this.copyOrder,
        },
      }

      if (objText[type].check) {
        if (!objText[type].check(type, this.multipleSelection, objText[type].key, objText[type].value)) {
          return
        }
      }
      this.$confirm(objText[type].text, "", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          objText[type].fun()
        })
        .catch(() => {

        });
    },
    //审核反审核操作
    audit (type, val) {

      if (!this.checkOperation('examine', this.multipleSelection, 'billStatus', val)) {
        return
      }
      if (type == 'examine' || type == 'cancelAudit'
        || type == 'cancelFinish' || type == 'finish' || type == 'cancelClose' || type == 'close') {
        this.approvalText = type == 'examine' ? '审核' : type == 'cancelAudit' ? "反审核" : "提示";
        this.titletype = type == 'examine' ? '审核原因' : type == 'cancelAudit' ? "审核原因" : ''
        this.approvalVisible = true;
      } else {
        this.pushlText = type == 'Push' ? '选择下推方向' : "联查";
        this.pushVisible = true;
      }
    },
    //复制订单
    copyOrder () {

    },
    /**
     * @desc 删除选中数据
     */
    delData () {
      this.loading = true
      let ids = []

      this.multipleSelection.forEach(item => {
        ids += item.id + ','
        // ids.push(item.id)
      })

      if (ids.length > 0) {
        ids = ids.slice(0, -1)
      }
      let params = {
        ids: ids,
      }

      deleteWareApi(params).then(res => {
        this.loading = false
        this.$message.success('删除成功!')

        if (this.tableData.length === this.multipleSelection.length && this.pageParams.pageNum !== 1) {
          this.pageParams.pageNum--
        }

        this.getDataList()
      })
        .catch((error) => {
          console.group(error)
          this.loading = false
        })
    },
    /**
     * @desc 提交选中数据
     */
    submitData () {
      this.loading = true
      let ids = []

      this.multipleSelection.forEach(item => {
        ids += item.id + ','
      })

      if (ids.length > 0) {
        ids = ids.slice(0, -1)
      }
      let params = {
        ids: "1485816949018574850",
      }

      submitWareApi(params).then(res => {
        this.loading = false
        this.$message.success('操作成功!')

        this.getDataList()
      })
        .catch((error) => {
          console.group(error)
          this.loading = false
        })
    },
    /**
     * @desc 提交选中数据
     */
    withdrawData () {
      this.loading = true
      let id = []

      this.multipleSelection.forEach(item => {
        id += item.id + ','
      })

      if (id.length > 0) {
        id = id.slice(0, -1)
      }
      let params = {
        ids: id,
      }

      backSubmitWareApi(params).then(res => {
        this.loading = false
        this.$message.success('操作成功!')

        this.getDataList()
      })
        .catch((error) => {
          console.group(error)
          this.loading = false
        })
    },
    /**
     * @desc 清空选中数据
     */
    clearSelct () {
      if (this.$refs.mainTable) {
        this.$refs.mainTable.resetSelect();
      }
    },
    /**
     * @desc 新增编辑详情
     */
    openEdit (type, params) {
      let data = {
        type,
        data: params || {},
      }

      if (type === 'edit') {
        if (!this.checkOperation(type, this.multipleSelection, 'billStatus', '12345')) {
          return
        } else {

          data.data = deepCopy(this.multipleSelection[0])
          console.log('我是带入的数据u', this.multipleSelection[0])
        }
      }
      this.$emit('submit', data)
    },
  },
  mounted () {
  },
}
</script>

<style scoped>
</style>
