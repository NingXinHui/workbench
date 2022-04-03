<!--
@time:2021/12/1
@author:chenqian
-->
<template>
    <div id="zPage">
      <!-- 按钮 -->
      <div class="z-header">
        <div class="z-header-button">
          <el-button @click="operationFun('submit')">派车</el-button>
        </div>
      </div>
      <div class="z-content">
        <el-card>
          <!-- 搜索条件 -->
          <header-search :searchArr="searchArr" @sureSearch="searchMethod" :isPrint='true' printtype='order_no' :selectRow='selectRow'>
            <slot>
             <span style="color:red;font-weight:bold;">少高级查询yesOrNo~~</span>

              <!-- <el-button @click="operationFun('print')">打印</el-button> -->
              <!-- <el-button @click="operationFun('print')" style="margin-top: -2px;">打印</el-button>
              <el-button @click="operationFun('export')" style="margin-top: -2px;">导出</el-button> -->
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
      <Approval  v-if="approvalVisible" :ids="ids" :approvalVisible.sync="approvalVisible" :approvalText="approvalText" :titletype="titletype"></Approval>
      <Push :pushVisible.sync="pushVisible" :pushlText="pushlText" ></Push>
    </div>
</template>

<script>
import HeaderSearch from '@/components/CommonHeadSearch/ZSearch'
import commonTable from '@/components/CommonTable'

import { getDataList, deleteData, withdrawData, submitData, } from '@/api/marketOrder';
import {noticeList,deleteNotice,submitNotice,revokeNotice} from "@/api/purchase/notice"
import { deepCopy,} from "@/lib/common"
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
  data() {
    return {
      ids:"",
      approvalVisible: false,
      pushVisible: false,
      approvalText: "审核",
      pushlText: "选择下推方向",
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
          width:150,
          label: '到货通知单号',
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
          prop: 'arrivalDate',
          label: '预计到货时间',
        },
        {
          prop: 'supplierCode',
          label: '供应商编号',
        },
        {
          prop: 'buyerName',
          label: '采购员',
        },
        {
          prop: 'departmentName',
          label: '采购组',
        },
        {
          prop: 'warehouseName',
          label: '到货仓库',
        },
        {
          prop: 'freight',
          label: '运费金额',
        },
        {
          prop: 'receiveTypeName',
          label: '收货方式',
        },
        {
          prop: 'billStatusName',
          label: '单据状态',
        },
        {
          prop: 'businessStatusName',
          label: '业务状态',
        },{
          prop: '',
          label: '附件',
        },{
          prop: 'remark',
          label: '备注',
        },
        {
          prop: 'createUserName',
          label: '创建人',
        },
        {
          prop: 'createTime',
          label: '创建时间',
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
          selectOption: []
        },
        {
          label: '运输工单号',
          value: 'transportationNumber',
          type: 1,
          maxLength: 40,
        },
        {
          label: '业务状态',
          value: 'businessStatus',
          optionLabel: 'label',
          optionValue: 'value',
          type: 2,
          selectOption: []
        },
         {
          label: '派单类型',
          value: 'dispatchOrderType',
          optionLabel: 'label',
          optionValue: 'value',
          type: 2,
          selectOption: []
        },
         {
          label: '客商名称',
          value: 'transportationNumber',
          type: 1,
          maxLength: 40,
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
        current: this.pageParams.pageNum,
        size: this.pageParams.pageSize,
        billNo: this.queryForm.billNo,
        usable:true,
      }
      if(Array.isArray(this.queryForm.createDate)) {
        let time = this.queryForm.createDate

        params.startTime = time[0]
        params.endTime = time[1]
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
      noticeList(params).then(res => {
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
          value: '12345',
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
          value: '02',
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
    //审核反审核操作
    audit(type, code , val) {

      if(!this.checkOperation('examine', this.multipleSelection, code || 'billStatus', val)) {
          return
        }
        this.ids = this.multipleSelection.map(item => { return item.id}).toString()
        if(type == 'examine' ||type == 'cancelAudit'
       || type=='cancelFinish' || type =='finish' || type == 'cancelClose' || type == 'close') {
          this.approvalText = type == 'examine' ? '审核' : type == 'cancelAudit' ? "反审核" : "提示";
          this.titletype = type == 'examine' ? '审核原因' :type == 'cancelAudit' ? "审核原因" :
          type == 'finish' ? "请填写完成原因" : type == 'cancelFinish' ? "请填写取消完成原因" :
          type == 'cancelClose' ? "请填写取消关闭原因" :"请填写关闭原因";
          this.approvalVisible = true;
        } else {
          this.pushlText = type == 'Push' ? '选择下推方向': "联查";
          this.pushVisible = true;
        }
    },
    cancelClose() {
      if(!this.multipleSelection.length) {
        this.$message.error("请选择操作项");
        return
      }
      let flag = this.multipleSelection.every(item => {
        return item.businessStatus != 2 && item.businessStatus != 3
      })
      if(flag) {
        this.ids = this.multipleSelection.map(item => { return item.id}).toString()
        this.approvalText = '提示';
        this.titletype = "请填写关闭原因";
        this.approvalVisible = true;
      } else {
        this.$message.error("当前操作项不能操作")
      }
    },
    /**
     * @desc 删除选中数据
     */
    delData() {
      this.loading = true

     let ids = this.multipleSelection.map(item => {
       return item.id
     })

      deleteNotice({
        ids:ids.toString()
      }).then(res => {
        if(res.code == 0) {
          this.loading = false
        this.$message.success('删除成功!')
        if (this.tableData.length === this.multipleSelection.length && this.pageParams.pageNum !== 1) {
          this.pageParams.pageNum--
        }
        this.getDataList()
        } else {
          this.$message.error(res.msg);
        }
      })
      .catch((error) => {
        this.loading = false
      })
    },
    /**
     * @desc 提交选中数据
     */
    submitData() {
     this.loading = true
      let ids = this.multipleSelection.map(item => {
       return item.id
     })

      submitNotice({
        ids:ids.toString()
      }).then(res => {
        if(res.code == 0) {
          this.loading = false
          this.$message.success('操作成功!')
         this.getDataList()
        } else {
          this.$message.error(res.msg);
        }
      })
      .catch((error) => {
        console.group(error)
        this.loading = false
      })
    },
    /**
     * @desc 撤回选中数据
     */
    withdrawData() {
      this.loading = true
      let ids = this.multipleSelection.map(item => {
       return item.id
     })
      revokeNotice({
        ids:ids.toString()
      }).then(res => {
        if(res.code == 0) {
          this.loading = false
        this.$message.success('操作成功!')
        this.getDataList()
        } else {
          this.$message.error(res.msg);
        }
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
