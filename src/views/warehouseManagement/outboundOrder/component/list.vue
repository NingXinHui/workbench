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
        <el-button @click="openEdit('sure')">收货确认</el-button>
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
    <Sure :visible.sync="visible"
          :details="details"></Sure>
  </div>
</template>

<script>
import HeaderSearch from '@/components/CommonHeadSearch/ZSearch'
import commonTable from '@/components/CommonTable'
import Sure from "./sure";
import { getDataList, deleteData, withdrawData, submitData, } from '@/api/marketOrder'

import { deepCopy, } from "@/lib/common"
import orderMixins from "@/lib/orderMixins"
import Approval from "./approval"
import Push from "./Push"


import { trueOutWareManagerApi, searchOutwareListApi, deleteOutWareApi, submitOutWareApi, backSubmitOutWareApi, searchStockTypeApi } from "@/api/wareManagementApi/outWareManagemen";
import { downloadsome } from "@/utils/auth"

export default {
  name: "",
  components: {
    HeaderSearch,
    commonTable,
    Approval,
    Push,
    Sure
  },

  mixins: [orderMixins],
  data () {
    return {
      details: '', //选择某行的数据
      approvalVisible: false,
      pushVisible: false,
      visible: false,
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
          label: '出库单编号',
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
          prop: 'districtName',
          label: '仓库地区',
        },
        {
          prop: 'outTypeName',
          label: '出库类型',
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
          prop: 'billStatusName',
          label: '单据状态',
        },
        {
          prop: 'outTime',
          label: '出库时间',
        },
        {
          prop: 'companyName',
          label: '公司主体',
        },
        {
          prop: 'checkItemName',
          label: '客商名称',
        },
        {
          prop: 'checkItemUserName',
          label: '单位名称',
        }, {
          prop: 'receiveMan',
          label: '收货人',
        }, {
          prop: 'receiveTelephone',
          label: '收货人联系方式',
        }, {
          prop: 'addrDistrict',
          label: '地址区域',
        }, {
          prop: 'addrDetail',
          label: '详细地址',
        }, {
          prop: 'bookKeeperName',
          label: '记账人',
        }, {
          prop: 'shipPersonName',
          label: '装运人员',
        }, {
          prop: 'unloadWages',
          label: '装车工资',
        }, {
          prop: 'businessDate',
          label: '业务日期',
        }, {
          prop: 'remark',
          label: '备注',
        },
        {
          prop: 'receiveStatusName',
          label: '签收状态',
        },
        {
          prop: 'transportUnit',
          label: '运输单位',
        },
        {
          prop: 'transportFeeType',
          label: '运输类型',
        },
        {
          prop: 'transportFee',
          label: '运费',
        },
        {
          prop: 'receiveDate',
          label: '实际签收日期',
        },
        {
          prop: 'receiveRemark',
          label: '签收备注',
        },
        {
          prop: 'createUserName',
          label: '创建人',
        },
        {
          prop: 'createTime',
          label: '创建时间'
        }
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
        {
          label: '出库单号',
          value: 'billNo',
          type: 1,
          maxLength: 40,
        }, {
          label: '出库类型',
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
        }, {
          label: '单据状态',
          value: 'billStatusName',
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
          label: '客商名称',
          value: 'checkItemName',
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
          label: '创建时间',
          value: 'createTime',
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
        '/st/out-store-order/export', params, '出库管理模块清单.xls'
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
        billNo: this.queryForm.billNo, // 目前只写一个,后面条件需要再次增加改动
      },
        objParams = {
          // checkItemName: 'customerName',
        }

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
      debugger
      return params
    },
    /**
     * @desc 获取数据列表
     */
    getDataList () {
      this.loading = true
      let params = this.initParams()

      this.clearSelct()
      searchOutwareListApi(params).then(res => {
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

      deleteOutWareApi(params).then(res => {
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

      submitOutWareApi(params).then(res => {
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

      backSubmitOutWareApi(params).then(res => {
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
        }
        this.$emit('submit', data)
      }

      if (type === 'sure') {
        if (!this.checkOperation(type, this.multipleSelection, 'billStatus', '12345')) {
          return
        } else {
          this.details = deepCopy(this.multipleSelection[0])
          this.visible = true
          debugger
        }
      }

    },
  },
  mounted () {
  },
}
</script>

<style scoped>
</style>
