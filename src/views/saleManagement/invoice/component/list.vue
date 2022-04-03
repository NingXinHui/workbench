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
          <!-- <el-button @click="audit('Push', '123')">下推</el-button> -->
          <el-button @click="audit('Joint', '123')">联查</el-button>
           <el-button @click="audit('finish','businessStatus', '23')">完成</el-button>
          <el-button @click="audit('cancelFinish','businessStatus', '013')">取消完成</el-button>
          <el-button @click="cancelClose('close', 'businessStatus','23')">关闭</el-button>
          <el-button @click="audit('cancelClose','businessStatus','012')">取消关闭</el-button>
          <el-button @click="() => uploadFile()">附件</el-button>
        </div>
      </div>
      <div class="z-content">
        <el-card>
          <!-- 搜索条件 -->
          <header-search :searchArr="searchArr" @sureSearch="searchMethod" :isPrint='true' printtype='order_no' :selectRow='selectRow'>
            <slot>
             <!-- <el-button @click="openModalControl" style="margin-top: -2px;">1</el-button>
              <el-button @click="operationFun('print')">打印</el-button> -->
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
              :isSelectMore="true"
              :loading="loading"
              :pageParams="pageParams"
              @selePage="handleItemSelect"
              @pageChange="pageSizeChange"
            />
          </div>
        </el-card>
      </div>
      <Approval :ids="ids" v-if="approvalVisible" :approvalVisible.sync="approvalVisible" :approvalText="approvalText" :titletype="titletype"></Approval>
      <Push :pushVisible.sync="pushVisible" :pushlText="pushlText" ></Push>
       <table-head-control
        v-if="openControlModal"
        :tabledowncolumn="tabledowncolumn"
        :showColumnTable="showColumnTable"
        @closeParent="closeParent"
    />
     <div v-if="openmodal">
        <open-modal :billId="billId" billType="DELIVERY_NOTICE" @closeModal="(value)=>{this.openmodal=false}" />
      </div>
    </div>
</template>

<script>
import HeaderSearch from '@/components/CommonHeadSearch/ZSearch'
import commonTable from '@/components/CommonTable'

import { getDataList, deleteData, withdrawData, submitData, } from '@/api/marketOrder'
import { deepCopy,} from "@/lib/common"
import orderMixins from "@/lib/orderMixins"
import Approval from "./approval"
import Push from "./Push"
import TableHeadControl from "@/components/tableHeadControl";
import { invoiceList,deleteInvoice,submitInvoice,revocationInvoice} from "@/api/sale/invoice";
import OpenModal from '@/components/commonUpload'
export default {
  name: "",
  components: {
    HeaderSearch,
    commonTable,
    Approval,
    Push,
    TableHeadControl,
    OpenModal
  },
  mixins: [orderMixins],
  data() {
    return {
      openmodal:false,
      billId:"",
      approvalVisible: false,
      pushVisible: false,
      openControlModal:false,
      tabledowncolumn:[],
      showColumnTable:[],
      ids:"",
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
          label: '发货通知单号',
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
          prop: 'sourceBillNo',
          label: '来源单号',
        },
        {
          prop: 'sourceBillType',
          label: '源单类型',
        },
        {
          prop: 'receiver',
          label: '收货人',
        },
        {
          prop: 'receiverContact',
          label: '收货人联系方式',
        },
        {
          prop: 'receiveDistrict',
          label: '地址区域',
        },
        {
          prop: 'receiveAddress',
          label: '详细地址',
        },
        {
          prop: 'planDate',
          label: '要求发货日期',
        },
        {
          prop: 'businessStatusName',
          label: '业务状态',
        },
        {
          prop: 'billStatusName',
          label: '单据状态',
        },
        // {
        //   prop: '1',
        //   label: '附件',
        // },
        {
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
          label: '通知单号',
          value: 'billNo',
          type: 1,
          maxLength: 40,
        },
        {
          label: '发货日期',
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
     //上传附件
    uploadFile() {
      if(this.multipleSelection.length != 1) {
        this.$message.error("请选择一条操作项");
        return
      }
      this.billId = this.multipleSelection[0].id;
      this.openmodal=true
    },
     //  打开控制表格头部的弹框
    openModalControl() {
      // 要传给子组件的数据 并且打开弹框
      let tabledowncolumn = this.tableColumn.filter((item) => {
        if (
            !this.showColumnTable.find((itemxx) => item.label == itemxx.label)
        ) {
          return item;
        }
      });
      console.log(tabledowncolumn);
      this.tabledowncolumn = tabledowncolumn.length > 0 ? tabledowncolumn : [];
      this.openControlModal = true;
    },
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
        billNo:this.queryForm.billNo
      };
      // objParams = {
      //   billNo: 'orderNo',
      //   checkItemName: 'customerName',
      // }

      // Object.keys(objParams).forEach(item => {
      //   if(typeof this.queryForm[objParams[item]] != 'undefined' && this.queryForm[objParams[item]] != '') {
      //     params[item] = this.queryForm[objParams[item]]
      //   }
      // })

      if(Array.isArray(this.queryForm.createDate)) {
        let time = this.queryForm.createDate

        params.createStartTime = time[0] + " 00:00:00"
        params.createEndTime = time[1] + " 23:59:59"
      }
      console.log(params)
      return params
    },
    /**
     * @desc 获取数据列表
     */
    getDataList() {
      this.loading = true
      let params = this.initParams()

      this.clearSelct()
      invoiceList(params).then(res => {
        this.loading = false

        this.tableData = res.data.records
        this.pageParams.total = res.data.total
      })
      .catch(error => {
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
          check: this.checkOperation,
          key: 'billStatus',
          value: '3',
        },
        export: {
          text: '确认导出查询的数据？',
          fun: this.exportCommonData,
          check: this.checkOperation,
          key: 'billStatus',
          value: '3',
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
    audit(type,code, val) {

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

      deleteInvoice({
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

      submitInvoice({
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
        this.loading = false
      })
    },
    /**
     * @desc 撤回
     */
    withdrawData() {
      this.loading = true
      let ids = this.multipleSelection.map(item => {
       return item.id
     })
      revocationInvoice({
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
        if(this.multipleSelection.length != 1) {
          this.$message.error("请选择一条操作项");
          return
        }
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
