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
          <el-button class="delButton" @click="operationFun('delete')">删除</el-button>
          <el-button @click="operationFun('submit')">提交</el-button>
          <el-button @click="operationFun('withdraw')">撤回</el-button>
          <el-button @click="audit('examine', '12')">审核</el-button>
          <el-button @click="audit('cancelAudit', '123')">反审核</el-button>
          <el-button @click="audit('finish', '123')">完成</el-button>
          <el-button @click="audit('cancelFinish', '123')">取消完成</el-button>
           <el-button @click="edit('handle', '23')">处理</el-button>
          <el-button @click="edit('evaluate', '23')">评价</el-button>
          <el-button @click="audit('close', '123')">关闭</el-button>
          <el-button @click="audit('cancelClose', '123')">取消关闭</el-button>
        </div>
      </div>
      <div class="z-content">
        <el-card>
          <!-- 搜索条件 -->
          <header-search :searchArr="searchArr" @sureSearch="searchMethod" :isPrint='true' printtype='order_no' :selectRow='selectRow'>
            <slot>
              <!-- <el-button @click="operationFun('print')">打印</el-button> -->
              <el-button @click="operationFun('print')" style="margin-top: -2px;">打印</el-button>
              <el-button @click="operationFun('export')" style="margin-top: -2px;">导出</el-button>
            </slot>
          </header-search>
          <div class="z-content-table">
            <!-- table -->
            <common-table
              is-height
              ref="mainTable"
              :isMain="true"
              :tableColumn="tableColumn"
              :tableData="tableData"
              :isSelection="true"
              :isSelectMore="false"
              :loading="loading"
              :pageParams="pageParams"
              @selePage="handleItemSelect"
              @pageChange="pageSizeChange"
            />
          </div>
        </el-card>
      </div>
      <Approval :approvalVisible.sync="approvalVisible" :approvalText="approvalText" :titletype="titletype"></Approval>
    </div>
</template>

<script>
import HeaderSearch from '@/components/CommonHeadSearch/ZSearch'
import commonTable from '@/components/CommonTable'

import { getDataList, deleteData, withdrawData, submitData, } from '@/api/marketOrder'
import { deepCopy,} from "@/lib/common"
import orderMixins from "@/lib/orderMixins"
import Approval from "./approval"
export default {
  name: "",
  components: {
    HeaderSearch,
    commonTable,
    Approval,
  },
  mixins: [orderMixins],
  data() {
    return {
      approvalVisible: false,
      approvalText: "审核",
      titletype: "",
      selectRow:{},
      queryForm: {},
      tableColumn: [
        {
          type: 'index',
          label: '序号',
        },
        {
          prop: 'billNo',
          label: '售后工单号',
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
          prop: 'billDate',
          label: '单据状态',
        },
        {
          prop: 'billDate',
          label: '业务状态',
        },
        {
          prop: 'checkItemName',
          label: '来源单号',
        },
        {
          prop: 'checkItemContactName',
          label: '源单类型',
        },
        {
          prop: 'salesName',
          label: '客诉时间',
        },
        {
          prop: 'salesGroupName',
          label: '客户名称',
        },
        {
          prop: 'updateUserName',
          label: '业务员',
        },
        {
          prop: 'updateUserName',
          label: '问题描述',
        },
        {
          prop: 'updateUserName',
          label: '期望结果',
        }
      ],
      tableData:[],
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
    searchArr() {
      return [
        {
          label: '查询方案',
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
          label: '开票申请单号',
          value: 'customerName',
          type: 1,
          maxLength: 40,
        },
        {
          label: '创建日期',
          value: 'createDate',
          type: 4,
          rangedesc: '至',
          pickerType: 'daterange',
          valueFormat: 'yyyy-MM-dd',
        },
      ]
    }
  },
  created() {
    this.pageChange(1)
  },
  methods: {
    /**
     * @desc 条件数据获取
     */
    searchMethod(data) {
      this.queryForm = data
      this.pageChange(1)
    },
    /**
     * @desc 初始化数据列表接口参数
     */
    initParams() {
      let params = {
        pageNo: this.pageParams.pageNum,
        pageSize: this.pageParams.pageSize,
      },
      objParams = {
        billNo: 'orderNo',
        checkItemName: 'customerName',
      }

      Object.keys(objParams).forEach(item => {
        if(typeof this.queryForm[objParams[item]] != 'undefined' && this.queryForm[objParams[item]] != '') {
          params[item] = this.queryForm[objParams[item]]
        }
      })

      if(Array.isArray(this.queryForm.createDate)) {
        let time = this.queryForm.createDate

        params.beginDate = time[0] + ' 00:00:00'
        params.endDate = time[1] + ' 23:59:59'
      }

      return params
    },
    /**
     * @desc 获取数据列表
     */
    getDataList() {
      this.loading = true
      let params = this.initParams()

      this.clearSelct()
      getDataList(params).then(res => {
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
    handleItemSelect(val) {
      this.multipleSelection = val
      this.selectRow = val[0]
    },
    /**
     * @desc 页数发生变化
     */
    pageChange(page) {
      this.pageParams.pageNum = page
      this.getDataList()
    },
    /**
     * @desc 页面页码页面数字改变
     */
    pageSizeChange(data) {
      this.pageParams.pageNum = data.page
      this.pageParams.pageSize = data.limit

      this.getDataList()
    },
    /**
     * @desc 删除选中数据
     */
    operationFun(type) {
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

      if(objText[type].check) {
        if(!objText[type].check(type, this.multipleSelection, objText[type].key,objText[type].value)) {
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
    //处理和评价
    edit(type,val) {
       if(!this.checkOperation('examine', this.multipleSelection, 'billStatus', val)) {
          return
        }
      let data = {
        type,
        data: deepCopy(this.multipleSelection[0]),
      }
      this.$emit('submit', data)
    },
    //审核反审核操作
    audit(type, val) {

      if(!this.checkOperation('examine', this.multipleSelection, 'billStatus', val)) {
          return
        }
        if(type == 'examine' ||type == 'cancelAudit'
       || type=='cancelFinish' || type =='finish' || type == 'cancelClose' || type == 'close') {
          this.approvalText = type == 'examine' ? '审核' : type == 'cancelAudit' ? "反审核" : "提示";
          this.titletype = type == 'examine' ? '审核原因' :type == 'cancelAudit' ? "审核原因" :
          type == 'finish' ? "请填写完成原因" : type == 'cancelFinish' ? "请填写取消完成原因" :
          type == 'cancelClose' ? "请填写取消关闭原因" :"请填写关闭原因";
          this.approvalVisible = true;
        }
    },
    //复制订单
    copyOrder() {

    },
    /**
     * @desc 删除选中数据
     */
    delData() {
      this.loading = true
      let ids = []

      this.multipleSelection.forEach(item => {
        ids += item.id + ','
        // ids.push(item.id)
      })

      if(ids.length > 0) {
        ids = ids.slice(0,-1)
      }
      let params = {
        ids: ids,
      }

      deleteData(params).then(res => {
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
    submitData() {
      this.loading = true
      let id = []

      this.multipleSelection.forEach(item => {
        id += item.id + ','
      })

      if(id.length > 0) {
        id = id.slice(0,-1)
      }
      let params = {
        id: id,
      }

      submitData(params).then(res => {
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
    withdrawData() {
      this.loading = true
      let id = []

      this.multipleSelection.forEach(item => {
        id += item.id + ','
      })

      if(id.length > 0) {
        id = id.slice(0,-1)
      }
      let params = {
        id: id,
      }

      withdrawData(params).then(res => {
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
    clearSelct() {
      if (this.$refs.mainTable) {
        this.$refs.mainTable.resetSelect();
      }
    },
    /**
     * @desc 新增编辑详情
     */
    openEdit(type, params) {
      let data = {
        type,
        data: params || {},
      }

      if(type === 'edit') {
        if(!this.checkOperation(type, this.multipleSelection, 'billStatus', '12345')) {
          return
        } else {
          data.data = deepCopy(this.multipleSelection[0])
        }
      }
      this.$emit('submit', data)
    },
  },
  mounted() {
  },
}
</script>

<style scoped>

</style>
