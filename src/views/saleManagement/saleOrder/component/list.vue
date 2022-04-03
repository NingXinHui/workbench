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
          <el-button @click="copyOrder">复制</el-button>
          <el-button class="delButton" @click="operationFun('delete')">删除</el-button>
          <el-button @click="operationFun('submit')">提交</el-button>
          <el-button @click="operationFun('withdraw')">撤回</el-button>
          <el-button @click="audit('examine', '12')">审核</el-button>
          <el-button @click="audit('cancelAudit', '123')">反审核</el-button>
          <el-button @click="audit('Push','billStatus', '01')">下推</el-button>
          <el-button @click="audit('Joint','', '0')">联查</el-button>
         <el-button @click="audit('finish','businessStatus', '23')">完成</el-button>
          <el-button @click="audit('cancelFinish','businessStatus', '013')">取消完成</el-button>
          <el-button @click="cancelClose('close', 'businessStatus','23')">关闭</el-button>
          <el-button @click="audit('cancelClose','businessStatus','012')">取消关闭</el-button>
           <el-button @click="contact">合同归档</el-button>

            <el-button @click="() => uploadFile()">附件</el-button>
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
            <!-- 显示自定义刘的插件 -->
              <!-- <template #customer>
            <button-customer
                :table-column="tableColumn"
                @changeTableColumn="changeTableColumn"
                :tab-id="tabId"/>
          </template> -->
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
         <div class="popBox add">
                    <el-dialog
                      title="合同归档"
                      v-if="dialogTableVisible"
                      @close="dialogTableVisible = false"
                      :visible.sync="dialogTableVisible"
                    >
                      <div class="content">
                        <div class="form">
                          <el-form>
                            <el-form-item label="合同归档">
                            <el-checkbox v-model="contractArchive"></el-checkbox>
                            </el-form-item>
                          </el-form>
                        </div>
                      </div>
                      <div slot="footer">
                        <el-button @click="dialogTableVisible = false">取消</el-button>
                        <el-button type="primary" @click="saveContact"
                          >确认</el-button
                        >
                      </div>
                    </el-dialog>
                  </div>
      <Approval v-if="approvalVisible" :ids="ids" :approvalVisible.sync="approvalVisible" :approvalText="approvalText" :titletype="titletype"></Approval>
      <Push v-if="pushVisible" :pushVisible.sync="pushVisible" :selection="multipleSelection" :pushlText="pushlText" ></Push>
      <div v-if="openmodal">
        <open-modal :billId="billId" billType="SALE_ORDER" @closeModal="(value)=>{this.openmodal=false}" />
      </div>
    </div>
</template>

<script>
import HeaderSearch from '@/components/CommonHeadSearch/ZSearch'
import commonTable from '@/components/CommonTable'
import { searchOrderList,deleteSaleOrder,submitSaleOrder,revocationSaleOrder,archiveSaleOrder} from '@/api/sale/order'
import { deepCopy,} from "@/lib/common"
import orderMixins from "@/lib/orderMixins"
import Approval from "./approval"
import Push from "./Push"
import buttonCustomer from "@/components/buttonCustomer"
import OpenModal from '@/components/commonUpload'
export default {
  name: "",
  components: {
    HeaderSearch,
    commonTable,
    Approval,
    buttonCustomer,
    OpenModal,
    Push
  },
  mixins: [orderMixins],
  data() {
    return {
      billId:"",
      openmodal:false,
      approvalVisible: false,
      dialogTableVisible: false,
      contractArchive:true,
      pushVisible: false,
      approvalText: "审核",
      pushlText: "选择下推方向",
      titletype: "",
      selectRow:{},
      queryForm: {},
      tabId:123,
      tableColumn: [
        {
          type: 'index',
          label: '序号',
        },
        {
          prop: 'billNo',
          label: '销售订单号',
          width:"130",
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
          prop: 'tradeType',
          label: '贸易类型',
          render:(h,scope) => {
            return h(
              'span',
              {},
              scope.row.tradeType == '0' ? '国内' : "国外"
            )
          }
        },
        {
          prop: 'salesTypeName',
          label: '销售类型',
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
          prop: 'shipTypeName',
          label: '发货方式',
        },
        {
          prop: 'settlementMethodName',
          label: '结算方式',
        },
        {
          prop: 'checkItemName',
          label: '销售客户',
        },
        {
          prop: 'contactsName',
          label: '客户联系人',
        },
        {
          prop: 'receiver',
          label: '收货人',
        },
        {
          prop: 'receiverContact',
          label: '联系方式',
        },
        {
          prop: 'receivingAddress',
          label: '收货地址',
        },{
          prop: 'receiveAddress',
          label: '收货详细地址',
        },{
          prop: 'salesPersonName',
          label: '业务员',
        },
        {
          prop: 'paymentStatusName',
          label: '支付状态',
        },
        {
          prop: 'invoiceStatusName',
          label: '开票状态',
        },
        {
          prop: 'shipmentStatusName',
          label: '发货状态',
        },
        {
          prop: 'businessStatusName',
          label: '业务状态',
        },
        {
          prop: 'billStatusName',
          label: '单据状态',
        },
        {
          prop: 'currency',
          label: '币种',
        },
        {
          prop: 'exchangeRate',
          label: '汇率',
        },
        {
          prop: 'totalAmount',
          label: '订单总金额',
        },
        {
          prop: 'companyName',
          label: '公司主体',
        },
        {
          prop: 'tradeTypeName',
          label: '贸易类型',
        },
        {
          prop: 'amoebaRule',
          label: '阿米巴规则',
        },
         {
          prop: 'statisticsFlag',
          label: '统计标识',
        },
         {
          prop: '',
          label: '附件',
        },
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
          width: "160"
        },
      ],
      ids:"",
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
        // {
        //   label: '查询方案',
        //   value: 'orderNo',
        //   optionLabel: 'label',
        //   optionValue: 'value',
        //   type: 2,
        //   selectOption: []
        // },
         {
          label: '销售订单号',
          value: 'billNo',
          type: 1,
          maxLength: 40,
        },
        {
          label: '客户名称',
          value: 'checkItemName',
          type: 1,
          maxLength: 40,
        },
        {
          label: '业务员',
          value: 'contacts',
          type: 1,
          maxLength: 40,
        },
        {
          label: '品种',
          value: 'materialName',
          type: 1,
          maxLength: 40,
        },
        {
          label: '创建时间',
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
    //打开合同归档弹窗
    contact() {
      if(!this.multipleSelection.length) {
        this.$message.error("请选择操作项");
        return
      }
      this.dialogTableVisible = true
    },
    //保存合同归档
    saveContact() {
      let ids = this.multipleSelection.map(item => {return item.id}).toString();
      archiveSaleOrder({
        ids: ids,
        contractArchive:this.contractArchive ? 1 :0
      }).then(res => {
        if(res.code == 0) {
          this.$message.success("操作成功");
          this.dialogTableVisible = false;
          this.getDataList();
        } else {
          this.$message.error(res.msg);
        }
      })
    },
     changeTableColumn(e) {
      this.tableColumn = e
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
        checkItemName: this.queryForm.checkItemName,
        contacts: this.queryForm.contacts,
        salesGroupName: this.queryForm.salesGroupName,
        materialName: this.queryForm.materialName,
        billNo: this.queryForm.billNo
      };

      if(Array.isArray(this.queryForm.createDate)) {
        let time = this.queryForm.createDate

        params.createStartTime = time[0]
        params.createEndTime = time[1]
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
      searchOrderList(params).then(res => {
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
          if(this.multipleSelection.length != 1) {
            this.$message.error("请选择一条操作项");
            return
          }
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
    //复制订单
    copyOrder() {
      if(this.multipleSelection.length&&this.multipleSelection.length==1) {
          this.$confirm("确认复制选中数据到新单据？", "", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
      .then(() => {
        this.$emit('submit', {
          type:"copy",
          data:this.multipleSelection[0]
        })
      })
      .catch(() => {
      });
      } else {
        this.$message.error("请勾选一条操作项")
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

      deleteSaleOrder({
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

      submitSaleOrder({
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
      revocationSaleOrder({
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

<style scoped lang="less">
.add /deep/ .el-dialog {
  min-height: 110px !important;
  width: 350px !important;
  min-width: 350px !important;
  .el-dialog__body {
    min-height: 70px !important;
  }
}
</style>
