<template>
  <div class="zPage">
    <div class="z-header">
      <div v-if="isEdit" class="z-header-button">
        <el-button @click="save" >保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
      <div v-else class="z-header-button">
        <el-button @click="edit" >编辑</el-button>
        <el-button @click="submitOpen">提交</el-button>
        <el-button @click="auditOpen">审核</el-button>
        <el-button @click="auditCancel">反审核</el-button>
        <el-button @click="">打印</el-button>
        <el-button @click="cancel">返回</el-button>
      </div>
    </div>
    <!--  表单编辑区-->
    <div class="z-content" style="background: #eaeef3">
      <el-card shadow="never">
        <div>
          <div style="font-size: 18px;color: #0066FF">
             <span @click="()=>{this.isOpenBasic=!this.isOpenBasic}">
              <el-icon :class=" isOpenBasic? 'el-icon-caret-bottom':'el-icon-caret-right' "/>
              <span> 基本信息</span>
             </span>
          </div>
          <div  style="overflow:hidden;margin-top: 8px" :style=" !isOpenBasic ? {height:'0px'}:'' ">
            <div v-if="!isEdit">
              <div class="detail">
                <el-descriptions class="margin-top" :column="5" label-class-name="my-label" :colon="false">
                  <el-descriptions-item :key="index" v-for="(item,index) in detailColumn" :label="item.label" >
                    <div v-if="item.type===2||item.type===6">
                      {{
                        item.optionList &&
                        item.optionList.find(
                            (show) => show[item.optionValue] === targetForm[item.field]
                        )
                            ? item.optionList.find(
                                (show) => show[item.optionValue] === targetForm[item.field]
                            )[item.optionLabel]
                            : "--"
                      }}
                    </div>
                    <div v-else>{{ targetForm[item.field] }}</div>
                  </el-descriptions-item>
                </el-descriptions>
              </div>
            </div>
            <div v-else style="display: flex;flex-wrap: wrap;justify-content: space-between;">
              <z-form  ref="sendForm" class="editForm" :config="formConfig" :form-column="detailColumn" :model="targetForm">
              </z-form>
            </div>
          </div>

        </div>

        <!--  明细查看区-->
        <div class="setBorder"></div>
        <div style="margin-top: 8px">
          <div style="font-size: 18px;color: #0066FF;margin-bottom: 8px">
             <span @click="()=>{this.isOpenDetail=!this.isOpenDetail}">
              <el-icon :class=" isOpenDetail? 'el-icon-caret-bottom':'el-icon-caret-right' "/>
              <span> 明细列表</span>
             </span>
          </div>

          <!--    操作区-->
          <div style="overflow:hidden" :style=" !isOpenDetail ? {height:'0px'}:'' " >
            <div v-if="isEdit" class="" style="margin-bottom: 4px">
              <el-button plain @click="add">新增</el-button>
              <el-button plain @click="copy">复制</el-button>
              <el-button plain @click="del" class="delButton">删除</el-button>
            </div>
            <!--      表格区域-->
            <div :class="{'zTable':isEdit,'z-content-table':1}">
              <common-table
                  tableheight="400"
                  :is-edit="isEdit"
                  ref="itemTable"
                  :isMain="true"
                  :tableColumn="tableColumn"
                  :tableData="targetForm.dtlList"
                  :isSelection="isEdit"
                  @selePage="handleItemSelect"
                  :set-height="520"
              />
            </div>
          </div>
          <div>
            <item @setCheckItem="setCheckItemId" :visible.sync="visible"></item>
          </div>
<!--          lookup区域-->
              <div>
                <look-up
                    :params="look_up_customer_config.params"
                    title="查询信息"
                    :config="look_up_customer_config"
                    :visible.sync="look_up_customer_config.visible"
                    :method="look_up_customer_config.method"
                    :table-column="look_up_customer_config.tableColumn"
                    :search-arr="look_up_customer_config.searchArr"
                    @setCheckItem="(e)=>set_look_up(e,1)"
                >
                </look-up>
                <look-up
                    :config="look_up_sale_config"
                    :visible.sync="look_up_sale_config.visible"
                    :method="look_up_sale_config.method"
                    :table-column="look_up_sale_config.tableColumn"
                    :search-arr="look_up_sale_config.searchArr"
                    @setCheckItem="(e)=>set_look_up(e,2)"
                >
                </look-up>
                <look-up
                    :config="look_up_material_no_config"
                    :visible.sync="look_up_material_no_config.visible"
                    :method="look_up_material_no_config.method"
                    :table-column="look_up_material_no_config.tableColumn"
                    :search-arr="look_up_material_no_config.searchArr"
                    @setCheckItem="(e)=>set_look_up(e,3)"
                >
                </look-up>
              </div>
        </div>
      </el-card>
    </div>


<!--    弹窗审核-->


    <div class="popBox">
      <el-dialog title="审核" @close="()=>{reason=''}" :close-on-click-modal="false" :visible.sync="auditDialog">
        <div class="content">
          <div style="font-size: 12px;"><span style="color: #ED5751">*</span><span>审核原因</span></div>
          <div style="margin-top: 4px">
            <el-input
                :rows="10"
                type="textarea"
                placeholder="请输入"
                v-model="reason"
                maxlength="50"
                show-word-limit
            >
            </el-input>
          </div>
        </div>
        <div slot="footer" style="margin-top: 8px">
          <el-button @click="auditDialog=false">取消</el-button>
          <el-button type="primary" @click="audit" >确认</el-button>
        </div>
      </el-dialog>
    </div>

  </div>
</template>
<script>
import lookUp from '@/components/ZLookUp/lookUp'
import ZForm from '@/components/ZForm/ZForm'
import OrderButton from './compents/button'
import commonTable from '@/components/CommonTable/commonTable'

import {addArr, commonRequest, copyArr, deepCopy} from "@/lib/common";
import _vm,{detailColumn} from "./modules/checkIn";
import LookUpMixin from "@/lib/lookUp";
import {buttonLoading} from "@/lib/buttonLoading";
import Mixin from "@/lib/vuex-mixin";
import {dict, select_currency, select_order_type} from "@/api/order/dict";
import {order_detail, generatorByPageRoute, order_edit, order_add, order_audit, order_audit_cancel} from "@/api/order";
const {mapGetters, mapActions} = new Mixin('order').getHelper()
import {look_up_sale_config,look_up_customer_config,look_up_material_no_config} from "./modules/lookup";
// import {getCustomerType} from "@/api/merchants/archives";
import {getInfo} from "@/api/login";
import {order_submit} from "@/api/order";
export default {
  name: "Edit",
  props: {},
  mixins: [LookUpMixin, buttonLoading],
  components: {
    commonTable, ZForm,OrderButton,lookUp
  },

  data() {
    return {
      selectCurrency:[],
      tableIndex:0,
      look_up_sale_config,
      look_up_customer_config,
      look_up_material_no_config,
      isOpenBasic:true,
      isOpenDetail:true,
      flag: true,
      reason:'',
      auditDialog:false,
      formConfig: {
        size: 'mini',
        inline: true
      },
      //控制是否显示编辑表单
      //要发送的表单
      targetForm: {
        dtlList:[],
        deleteDetailIdList:[]
      },
      //明细数据
      tableData: [],
      //明细表格表头配置项
      tableColumn: [
        {
          prop: 'rowNo',
          label: '序号',
          width:80,
          disabled:true
        },
        {
          prop: 'materialNo',
          label: '物料编号',
          width:110,
          openLook:true,
          focus:(e)=>{
            this.tableIndex=e.$index
            this.openLookUp(3)
          },
          editConfig: {
            type: 1,
          }
        },
        {
          type:'lookUp',
          prop: 'materialName',
          label: '物料名称',
          width:110,
          disabled: true
        },
        {
          prop: 'colorName',
          label: '颜色',
          width:110,
          editConfig: {
            type: 1,
          }
        },{
          prop: 'specification',
          label: '规格',
          width:110,
        },{
          //确定是字典
          prop: 'colorLamp',
          label: '对色光源',
          width:110,
          editConfig: {
            type: 2,
          }
        },{
          prop: 'pattenNo',
          label: '花型号',
          width:110,
        },{
          prop: 'width',
          label: '幅宽',
          width:110,
        },{
          prop: 'pieceCount',
          label: '匹数',
          width:110,
        },{
          prop: 'pieceLength',
          label: '匹长',
          width:110,
        },{
          prop: 'customerMaterialName',
          label: '客户品名',
          width:110,
        },{
          prop: 'productionQty',
          label: '生产数量(米)',
          width:110,
        },{
          prop: 'qty',
          label: '数量',
          width:110,
        },{
          prop: 'unitNo',
          label: '单位',
          width:110,
        },{
          prop: 'price',
          label: '单价',
          width:110,
        },{
          prop: 'amount',
          label: '金额',
          width:110,
          disabled: true,
          editConfig: {
            type:1
          }
        },{
          prop: 'deliveryDate',
          label: '交货日期',
          width:110,
          editConfig: {
            type: 3
          }
        },{
          prop: 'remark',
          label: '备注',
          width:110,
        }

      ],
      //选中的明细表格选中项
      selectRow: [],
      detailColumn,
      sendForm:{}
    }
  },
  computed: {
    ...mapGetters(['isEdit','editData','isAdd']),
    currentId() {
      return this.editData.id
    },

  },
  mounted() {
     _vm.setVue(this)
    this.select_order_type()
    this.select_currency()
    this.select_pay()
    this.select_customer()
    this.select_color_source()
    // this.targetForm=this.editData
    if (!this.isAdd){
      this.order_detail()
    }
    if (this.isAdd) {
      getInfo().then(res=>{
        this.targetForm.createUser=res.data.tenantName

      })
      // generatorByPageRoute().then(res => {
      //   this.$set(this.targetForm, 'moneyNo', res.data.billNo)
      // })
    }

    // if (this.isCopy) {
    //   delete this.targetForm.id
    // }
    //
    // this.targetForm.moneySort = '实收'
    // this.detailColumn[8].optionList = this.selectMoneyType
    // this.detailColumn[11].optionList = this.selectCurrency
    // this.detailColumn[13].optionList = this.selectCheckItemName
    // this.detailColumn[17].optionList = this.selectCheckItemName
  },

  methods: {
    //对色光源下拉框
    select_color_source(){
      dict('color_source').then(res=>{
        this.tableColumn[5].editConfig.optionList=res.data
        this.tableColumn[5].editConfig.optionLabel='dictLabel'
        this.tableColumn[5].editConfig.optionValue='dictValue'
      })
    },
    //审核按钮
    auditOpen(){
      this.auditDialog=true
    },
    //审核操作
    audit(){
      if (this.reason==''){
        this.$message.error('审核原因为必填')
        return
      }
      order_audit({id:this.currentId}).then(res=>{
        if (res.success){
          this.$message.success('审核成功')
          this.auditDialog=false
        }
      })
    },
    //反审核
    auditCancel(){
      this.$confirm('确认取消审核中的数据吗？', '', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        order_audit_cancel({id:this.currentId}).then(res=>{
          if (res.success){
            this.$message.success('反审核成功')
          }
        })
      }).catch(() => {
      });

    },
    ...mapActions(['setShowType']),

    edit(){
      this.setShowType(['edit',true])
    },
    cancel(){
      this.setShowType(['list',false])
    },
    save(){
      this.getParams()
      let data=deepCopy(this.sendForm)
      data.dtlList.map(item=>{
        if (item.isEdit && item.index) {
          delete item.id
        }
        delete item.isEdit
        delete item.index
      })
      if (this.isAdd){
        order_add(data).then(res=>{
          if (res.success){
            this.$message.success('新增成功')
            this.setShowType(['list',false])

          }
        })
      }else {
        order_edit(data).then(res=>{
          if (res.success){
            this.$message.success('编辑成功')
            this.setShowType(['list',false])
          }
        })
      }

    },
    set_look_up(e,t){
       //辅助传值ID
       // this.$refs.sendForm.formParams[this.look_up_customer_config.field]=e[this.look_up_customer_config.value]
      //赋值显示字段
      if (t===1){
        // this.$set(this.targetForm,'customerName',e.checkName)
        this.targetForm.customerId=e.id
        this.targetForm.customerName=e.checkName
        // this.$refs.sendForm.formParams[this.look_up_customer_config.formField]=e[this.look_up_customer_config.showField]
      }
      if (t===2){
        this.targetForm.salesName=e.salesName
        this.targetForm.salesId=e.id
        // this.$refs.sendForm.formParams[this.look_up_sale_config.formField]=e[this.look_up_sale_config.showField]
      }
      if (t===3){
        this.targetForm.dtlList[this.tableIndex].materialId=e.id
        this.targetForm.dtlList[this.tableIndex].materialName=e.materialName
        this.targetForm.dtlList[this.tableIndex].materialNo=e.materialNo
        this.targetForm.dtlList[this.tableIndex].specification=e.specification
        // this.targetForm.dtlList[this.tableIndex].width=e.width
        this.targetForm.dtlList[this.tableIndex].unitNo=e.unitNo
        this.targetForm.dtlList[this.tableIndex].colorLamp=e.colorLamp
      }
      this.$refs.sendForm.$forceUpdate()
    },
    //提交按钮
    submitOpen() {

      this.$confirm('确定提交选中的数据吗？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        order_submit({id: this.editData.id}).then(res => {
          if (res.success) {
            this.$message({
              type: 'success',
              message: '提交成功!'
            });
            this.order_detail()
          }
        })
      })
    },

    openLookUp(e){
      if (e===1){
        this.look_up_customer_config.visible=true
      }
      if (e===2){
        this.look_up_sale_config.visible=true
      }
      if (e===3){
        this.look_up_material_no_config.visible=true
      }

    },
    //获取表单数据
    getParams(){
      this.sendForm=this.$refs.sendForm.formParams
      this.sendForm.dtlList=this.targetForm.dtlList
      this.sendForm.deleteDetailIdList=this.targetForm.deleteDetailIdList&&this.targetForm.deleteDetailIdList.length?this.targetForm.deleteDetailIdList:[]
    },

    //获取详情
    order_detail(){
      order_detail({id:this.editData.id}).then(res=>{
       this.tableData=res.data.dtlList
       this.targetForm=deepCopy(res.data)
      })
    },
    //销售订单类型下拉框
    select_order_type(){
      select_order_type().then(res=>{
        this.detailColumn[1].optionList=res.data
        this.detailColumn[1].optionLabel='orderTypeName'
        this.detailColumn[1].optionValue='id'
      })
    },
    //币种下拉框
    select_currency(){
      select_currency().then(res=>{
        this.detailColumn[5].optionList=res.data
        this.detailColumn[5].optionLabel='currencyName'
        this.detailColumn[5].optionValue='currencyNo'
        this.selectCurrency=res.data
      })
    },
    //结算方式下卡框
    select_pay(){
      dict('order_settlement_method').then(res=>{
        this.detailColumn[8].optionList=res.data
        this.detailColumn[8].optionLabel='dictLabel'
        this.detailColumn[8].optionValue='dictValue'
      })
    },
    //客户分类
    // select_customer(){
    //   //获取客户分类
    //   getCustomerType({
    //     checkItemTypeCode: 'customer',
    //     usable: true
    //   }).then(res => {
    //     if (res.success) {
    //       this.look_up_customer_config.searchArr[1].optionList=res.data
    //       this.look_up_customer_config.searchArr[1].optionLabel='dtlTypeName'
    //       this.look_up_customer_config.searchArr[1].optionValue='dtlTypeCode'
    //     }
    //   })
    // },

    /********************表头操作区*****************************/
    //上一页
    // prev() {
    //   let currentIndex = this.pageData.findIndex(item => item.id === this.targetForm.id)
    //   if (this.pageData[currentIndex - 1]) {
    //     this.targetForm = this.pageData[currentIndex - 1]
    //   } else {
    //     if (this.currentPage === 1) {
    //       this.$message.warning('没有上一页了');
    //     } else {
    //       this.pageParams.pageNo = this.currentPage - 1
    //       receivableMoneyList(this.pageParams).then(res => {
    //         this.targetForm = res.data.records[res.data.records.length - 1]
    //         this.setCurrentPage(Number(res.data.current))
    //         this.setTotalPage(Number(res.data.pages))
    //         this.setPageParams(this.pageParams)
    //         this.setPage(res.data.records)
    //       })
    //     }
    //   }
    //   this.$forceUpdate()
    // },
    //下一页
    // next() {
    //   let currentIndex = this.pageData.findIndex(item => item.id === this.targetForm.id)
    //   if (this.pageData[currentIndex + 1]) {
    //     this.targetForm = this.pageData[currentIndex + 1]
    //   } else {
    //     if (this.currentPage === this.totalPage) {
    //       this.$message.warning('没有下一页了');
    //     } else {
    //       this.pageParams.pageNo = this.currentPage + 1
    //       receivableMoneyList(this.pageParams).then(res => {
    //         this.targetForm = res.data.records[0]
    //         this.setCurrentPage(Number(res.data.current))
    //         this.setTotalPage(Number(res.data.pages))
    //         this.setPageParams(this.pageParams)
    //         this.setPage(res.data.records)
    //       })
    //     }
    //   }
    //   this.$forceUpdate()
    // },
    // //赋值当前项
    // copyMain() {
    //   this.setEdit(true)
    //   this.setCopy(true)
    // },
    // changeEdit() {
    //   if (this.targetForm['billStatus'] == 2) {
    //     this.$alert('已审核的数据不能被编辑', '', {type: 'warning'})
    //     return
    //   }
    //   this.setEdit(true)
    // },
    // back() {
    //   this.setShow('main')
    // },
    //核算项目下拉框 选择时赋值项目ID
    // changeItem(e) {
    //   let obj = this.selectCheckItemName.find(item => {
    //     return item.id == e
    //   })
    //   this.targetForm.checkItemName = obj.checkName
    // },
    /********************明细表单操作区*****************************/
    // 新增明细
    add() {
      let arr = addArr(this.targetForm.dtlList)
      this.targetForm.dtlList.push(arr)
      this.$forceUpdate()
    },
    // 复制明细项
    copy() {
      if (this.selectRow.length < 1) {
        this.$message.warning('当前未选中需要操作数据，请选中后点击操作！')
        return false

      } else if (this.selectRow.length > 1) {
        this.$message.warning('选择错误，数据不允许批量操作')
        return false
      }
      let arr = deepCopy(this.selectRow[0])
      let copy = copyArr(this.targetForm.dtlList, arr)
      this.targetForm.dtlList.push(copy)
    },
    // 删除明细
    del() {
      if (this.selectRow.length < 1) {
        this.$message.warning('当前未选中需要操作数据，请选中后点击操作！')
        return false
      }
      //代表的是新增项
      this.selectRow.map(item => {
        //代表的是新增项(存在自定义添加的索引以及编辑字段)
        if (item.isEdit && item.index) {
          this.targetForm.dtlList.splice(this.targetForm.dtlList.findIndex(item2 => {
            return item2.index === item.index
          }), 1);
        } else {
          if (!this.targetForm.hasOwnProperty('deleteDetailIdList')) {
            this.targetForm.deleteDetailIdList = []
            this.targetForm.deleteDetailIdList.push(item.id)
          } else {
            this.targetForm.deleteDetailIdList.push(item.id)
          }
          let index = this.targetForm.dtlList.findIndex(item2 => {
            return item2.id === item.id
          })
          this.targetForm.dtlList.splice(index, 1);
        }
        //执行取消选中
        this.$refs.itemTable.$refs.multipleTable.toggleRowSelection(item, false);
      })
    },


    handleItemSelect(e) {
      this.selectRow = e
    },
    //取消操作
    // cancel() {
    //   this.setShow('main')
    // },
    //获取明细详情
    // getDetail() {
    //   receivableMoneyQueryById({id: this.targetForm.id}).then(res => {
    //     this.tableData = res.data.receivableMoneyDtlList
    //     if (this.isEdit) {
    //       this.tableData.map(item => {
    //         item.isEdit = true
    //       })
    //     }
    //   })
    // },

    //  根据币种获取汇率

    getRate(e) {
      this.targetForm.exchangeRate = this.selectCurrency.find(item => item.currencyNo === e)['exchangeRate']
    },
    // changeFlag() {
    //   this.tableData.map(item => {
    //     let base = 1
    //     this.targetForm.flag && (base = -1)
    //     console.log(base, item.amount)
    //     item.amount = Number(base * Math.abs(item.amount))
    //     item.amountNat = Number(base * Math.abs(item.amountNat))
    //     item.discountAmountNat = Number(base * Math.abs(item.discountAmountNat))
    //     item.discountAmount = Number(base * Math.abs(item.discountAmount))
    //   })
    // },
    //根据明细计算本币金额
    getAmountTotal() {

      let total = 0
      this.targetForm.dtlList.map(item => {
        if (Number(item.qty)&&Number(item.price)) {
          item.amount=Number(item.qty)*Number(item.price)
        } else {
          item.amount = 0
        }
        // if (item.discountAmount) {
        //   disTotal += Number(item.discountAmount)
        //   item.discountAmountNat = Number(item.discountAmount * (this.targetForm.exchangeRate ?? 0)).toFixed(2)
        // } else {
        //   item.discountAmountNat = 0
        // }
      })
      // this.$set(this.targetForm, 'amount', total.toFixed(2))
      // this.$set(this.targetForm, 'amountNat', (total * (this.targetForm.exchangeRate ?? 0)).toFixed(2))
      // this.$set(this.targetForm, 'discountAmountNat', (disTotal * (this.targetForm.exchangeRate ?? 0)).toFixed(2))
      // this.$set(this.targetForm, 'discountAmount', disTotal.toFixed(2))

      this.$forceUpdate()
    },
    // handleClose() {
    //   this.targetForm.checkItemId = ''
    //   this.targetForm.checkItemName = ''
    // },
    // setCheckItemId(e) {
    //   this.$set(this.targetForm, 'checkItemId', e.id)
    //   this.$set(this.targetForm, 'checkItemName', e.checkName)
    // }

  },


  //取得存储在vuex中的数据,并进行赋值
  created() {
  },
  watch: {
    isEdit: {
      handler(val) {
        if (val) {
          this.targetForm.dtlList.map(item => {
            item.isEdit = true
          })
        }
      },
      immediate: true
    },
    //监听币种变化
    'targetForm.currency'(val) {
      if (val) {
        this.getRate(val)
      } else {
        this.targetForm.exchangeRate = ''
      }
    },
    //监听红蓝字变化
    // 'targetForm.flag'(val) {
    //   this.changeFlag()
    // },

    //监听明细变化
    ['targetForm.dtlList']: {
      handler() {
        if (this.flag) {
          this.getAmountTotal()
        }
      },
      deep: true
    },
    // currentId() {
    //   this.getDetail()
    // }

  },
  destroyed() {

  }
}
</script>

<style scoped lang="less">
.zTable{
}
/deep/ .detail{

  .el-descriptions__body{
    .el-descriptions__table{
      >tbody:nth-child(3){
        font-size: 12px;
        >tr{
          >td:nth-child(5){
            flex-basis: 100%;
          }
        }

      }
    }

  }

  font-size: 12px;
  @media ( max-width : 1440px)  {
    width: 1280px;
  }
  width: 1280px;
  .my-label {
    width: 100px !important;
    text-align: right;
    padding-right: 8px;
    line-height: 28px;
    color: #999999;
    font-size: 12px;
  }
  .el-descriptions-item__content{
    font-size: 12px;
    color: #374256;
  }
}


/deep/ .el-descriptions-row {
  display: flex;
  flex-wrap: wrap;
  .el-descriptions-item{
    flex-basis: 20%;
  }
}

/deep/ .el-descriptions-item__container {
  margin: unset !important;
  height: 28px;
  line-height: 28px;
}

/deep/ .el-descriptions-item {
  padding-bottom: unset !important;
  margin-bottom: 6px;

}
.remark {
  display: flex;

}

/deep/ .el-descriptions-item__label:not(.is-bordered-label) {
  margin: unset !important;
}


/deep/ .editForm {
  .form {

    .el-form-item{
      label{
        font-weight: 400;
        color: #374256;
        font-size: 12px;
      }
    }
  }
  .form{
    @media ( max-width : 1440px)  {
      width: 1280px;
      .el-form-item {
        &+.form-textarea{
          flex-basis: 1100px !important;
        }
      }
    }
    display: flex;
    width: 1440px;
    flex-wrap: wrap;
    .el-form-item {
      display: flex;
      flex-basis: 270px;
      margin-bottom: 8px;
      margin-right: 8px;
      width: 180px;
      //&:last-child {
      //  flex-basis: 100%;
      //}
      .el-form-item__label{
        padding: 0 4px 0 0 ;
      }
      &+.form-textarea{
        flex-basis: 1380px;
      }
    }

    .el-form-item__content {
      flex: 1 1 0%
    }

    .el-form-item__label {
      width: 100px;
    }

    .el-input, .el-date-editor, .el-select {
      width: 180px;
    }
    .el-date-editor{
      margin-right: 0!important;
    }
  }

}



/deep/ .editTable{
  :not(.el-date-editor){
    .el-input__inner {
      padding: 0 1px;
      height: 26px;
      line-height: 26px;
      font-size: 12px;
    }
  }
  .el-input__icon {
    font-size: 12px;
    line-height: 26px;
  }
}
.setBorder {
  height: 1px;
  background: #ececec;
  width: calc(100vw - 8px);
  margin-left: -20px;
  margin-bottom: 8px;
}
/deep/ .el-descriptions--mini{
  font-size: 14px!important;
}



</style>
