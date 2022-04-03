<template>
  <div id="zPage" class="market-order-edit">
    <div class="z-header">
      <div v-if="isEdit" class="z-header-button">
        <el-button plain @click="selectOrder" v-if="operateType=='add'">选单</el-button>
        <el-button plain @click="saveData" :disabled="loading">保存</el-button>
        <el-button plain @click="cancel">取消</el-button>
         <el-button v-if="operateType!='add'" @click="() => uploadFile()">附件</el-button>
      </div>
      <div v-else class="z-header-button">
        <el-button plain @click="updateStatus" v-if="queryForm.billStatus == 0"
          >编辑</el-button
        >
        <el-button plain @click="cancel">返回</el-button>
        <el-button plain @click="submit" v-if="queryForm.billStatus == 0">提交</el-button>
        <el-button plain @click="auditVisible = true">审核记录</el-button>
         <el-button v-if="operateType!='add'" @click="() => uploadFile()">附件</el-button>
      </div>
    </div>
    <div class="z-content" v-loading="loading">
      <el-card class="z-details-box">
        <div class="z-details-content">
          <div class="z-details-icon">
            <span @click="isCancel('basicShow', !basicShow)">
              <i
                :class="
                  basicShow ? 'el-icon-caret-bottom' : 'el-icon-caret-right'
                "
              ></i>
              基本信息
            </span>
          </div>
          <div
            :class="[
              'z-details-content-box',
              basicShow ? '' : 'details-height-none'
            ]"
          >
            <div style="padding-left:24px">
              <el-tabs v-model="activeName">
                <el-tab-pane label="基础信息" name="first">
                  <form-list
                    v-model="queryForm"
                    :formConfig="formConfigType(1)"
                    class="form form-order-box"
                  ></form-list>
                </el-tab-pane>
                <el-tab-pane label="发货信息" name="second">
                  <form-list
                    v-model="queryForm"
                    :formConfig="formConfigType(2)"
                    class="form form-order-box"
                  ></form-list>
                </el-tab-pane>
                <el-tab-pane label="其他信息" name="third">
                  <form-list
                    v-model="queryForm"
                    :formConfig="formConfigType(3)"
                    class="form form-order-box"
                  ></form-list>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </div>
        <div class="z-details-content">
          <div class="z-details-icon">
            <span @click="isCancel('detailsShow', !detailsShow)">
              <i
                :class="
                  detailsShow ? 'el-icon-caret-bottom' : 'el-icon-caret-right'
                "
              ></i>
              明细信息
            </span>
          </div>
          <div
            :class="[
              'z-details-content-box',
              detailsShow ? '' : 'details-height-none'
            ]"
          >
            <div v-if="isEdit" class="z-details-btn">
              <el-button size="mini" plain @click="addDetails" v-if="operateType!='add'">新增</el-button>
              <el-button size="mini" plain @click="copyDetails">复制</el-button>
              <el-button
                size="mini"
                plain
                class="delButton"
                @click="deleteDetails"
                >删除</el-button
              >
            </div>
            <div class="z-content-table">
              <common-table
                :class="{ zTable: isEdit }"
                ref="mainTable"
                :isSelectMore="true"
                :isSelection="true"
                :tableColumn="tableColumn"
                :tableData="tableData"
                @selePage="handleSelectionChange"
                :tableheight="250"
                :isMain="true"
              ></common-table>
            </div>
          </div>
        </div>
      </el-card>
    </div>
    <AuditRecord :auditVisible.sync="auditVisible"></AuditRecord>
    <SelectOrderTable @selectTable="selectTable" v-if="orderVisible" :orderVisible.sync="orderVisible"></SelectOrderTable>
    <look-up
      ref="lookup" v-if="visible"
      :visible.sync="visible"
      @setCheckItem="setCheckItem"
      :method="look.method"
      :isSelectMore="isSelectMore"
      :table-column="look.tableColumn"
      :search-arr="look.searchArr"
      :params="look.params"
    ></look-up>
    <!-- <div>
            <look-up :title="look.title" :visible.sync="popConfig.show" :isClearAll="true" @setCheckItem="popSubmit" :params="look.params"  :method="look.methods" :table-column="look.tableColumn" :search-arr="look.searchArr" ></look-up>
        </div> -->
        <div v-if="openmodal">
        <open-modal :billId="queryForm.id" billType="DELIVERY_NOTICE" @closeModal="(value)=>{this.openmodal=false}" />
      </div>
  </div>
</template>

<script>
import formList from "@/components/Form/formList";
import SelectOrderTable from "./selectOrderTable"
import commonTable from "@/components/CommonTable";
import AuditRecord from "./AuditRecord"
import lookUp from '@/components/ZLookUp/lookUpImport'; //lookup统一弹窗
import { addone, copyone, deleteone, tablecol } from "./show";
import { formone,formonePlus,formtwo,formThree } from "./form";
import looks from "./look";
import { serachAllType } from "@/api/master/supplierFile";
import {addInvoice,invoiceDeatail,updateInvoice,submitInvoice} from "@/api/sale/invoice"
import { checkFormData } from "@/lib/common";
import OpenModal from '@/components/commonUpload'
export default {
  name: "Menuceng",
  components: { formList, commonTable,SelectOrderTable,lookUp,AuditRecord,OpenModal},
  props: {
    operateType: {
      type: String,
      default: "edit",
    },
    currentData: {
      type:Object,
      default:() => {
        return {}
      }
    }
  },
  data() {
    return {
      openmodal:false,
      isSelectMore:false,
      basicShow: true, //是否显示基本信息的模块
      detailsShow: true, //是否显示详情数据的模块
      isEdit: true, //是否处于编辑状态
      loading: false, //主体是否处于加载状态
      orderVisible: false, //选单的弹窗
      auditVisible: false, //审核弹窗
      activeName:'first',
      queryForm: {}, //所有的表单的数据
      topTableData: [], //融资信息表格
      tableData: [], //下面表格要显示的数据、
      multipleSelection: [], //下main表格选中的数据
      visible: false, //lookup展示条件
      deliveryType:[], //发货方式下拉
      look: {
        method: serachAllType,
        tableColumn: [],
        searchArr: [],
        params: {},
      },
    };
  },

  mounted() {
   if (this.operateType == "details") {
      this.isEdit = false;
    }
    if (this.operateType == "edit" || this.operateType == "details") {
      this.init();
    }
  },

  /**
   * 加载前准备些数据 比如下拉框需要的 还有初始化界面的
   */
  created() {
    this.initFormAndTable();
    this.serachAllType(); //词典
  },

  /**
   * @desc 存储一些数据变化需要页面更新的 比如searchArr  table的
   */
  computed: {
    tableColumn() {
      let isEdit = this.isEdit;
      return tablecol(this, isEdit);
    },
    formOne() {
      return formone(this, !this.isEdit);
    },
    formonePlus() {
      return formonePlus(this, !this.isEdit)
    },
    formTwo() {
      return formtwo(this, !this.isEdit);
    },

    formThree() {
      return formThree(this, !this.isEdit)
    },
  },

  methods: {
    //查看文件
    uploadFile() {
      if(!this.queryForm.id) return;
      this.openmodal=true;
    },
    updateStatus() {
      if(this.queryForm.billStatus != 0){
        this.$message.error("当前状态不能编辑");
        return
      }
      this.isEdit = !this.isEdit;
    },
    //提交审核
    submit() {
      if(this.queryForm.billStatus != 0){
        this.$message.error("当前状态不能提交审核");
        return
      }
      this.loading = true;
      submitInvoice({
        ids: this.queryForm.id
      }).then(res => {
        if(res.code == 0 ){
          this.$message.success("操作成功");
              this.loading = false;
              this.$emit("submit");
        }
      }).catch(() => {
         this.loading = false;
      })
    },
     //查询详情
    init() {
      invoiceDeatail({
        id: this.currentData.id
      }).then(res => {
        if (res.code == 0) {
          res.data.planDate = res.data.planDate ? res.data.planDate.substring(0,10) : "";
          this.initFormAndTable(res.data);
          this.tableData = res.data.shipmentDetailList.map((item,i) => {
            return {...item, isIndex:i}
          });
        } else {
          this.$message.error(res.msg);
        }
      });
    },
      //查询所有的词典下拉
    serachAllType() {
      serachAllType([
        "deliveryType",
      ]).then(res => {
        if (res.code == 0) {
          this.deliveryType = res.data.deliveryType; //发货方式下拉
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //选单数据
    selectTable(a) {
      if(!this.tableData.length&&a.length == 1) {
         this.queryForm.sourceBillNo = a[0].billNo;
         this.queryForm.sourceBillType = a[0].saleTypeName;
         this.queryForm.sourceBillTypeName = a[0].saleTypeName;
         this.queryForm.checkItemName = a[0].checkItemName;
         this.tableData = a.map(item => {return {...item,
        salesQty:item.qty,shipmentQty:1,remainingOptionalQty:item.remainingOptionalQty,storeId:"1",unit:item.unitName
        }
        })
        this.tableData = this.tableData.map((i,r) => {
          return {...i, isIndex:r}
        })
        return
      }
      let b = a.map(item => {return {...item,
        salesQty:item.qty,shipmentQty:1,remainingOptionalQty:item.remainingOptionalQty,storeId:"1",unit:item.unitName
        }
        })
      if(!this.tableData.length&&a.length > 1) {
        let a = b[0]
        let flag = false;
        this.queryForm.sourceBillNo = a.billNo;
       this.queryForm.sourceBillType = a.saleTypeName;
         this.queryForm.sourceBillTypeName = a.saleTypeName;
         this.queryForm.checkItemName = a.checkItemName;
        b.forEach(item => {
          if(item.billNo == a.billNo) {
            this.tableData.push(item);
          } else {
            flag = true
          }
        })
         this.tableData = this.tableData.map((i,r) => {
          return {...i, isIndex:r}
        })
        if(flag) {
          this.$message.error("选单数据只能选择同一条订单的明细");
        }
        return
      }
       if(this.tableData.length) {
         let a = this.tableData[0]
         let flag = false;
        b.forEach(item => {
          if(item.billNo == a.billNo) {
            this.tableData.push(item);
          } else {
            flag = true
          }
        })
         this.tableData = this.tableData.map((i,r) => {
          return {...i, isIndex:r}
        })
         if(flag) {
          this.$message.error("选单数据只能选择同一条订单的明细");
        }
        return
       }
    },

    formConfigType(type) {
      let obj = {
        1: this.queryForm.shipmentMethod != '1' ?this.formOne : [...this.formOne,...this.formonePlus],
        2: this.formTwo,
        3: this.formThree,
      };

      return {
        inline: true,
        size: "mini",
        labelWidth: "auto",
        formItemList: obj[type],
      };
    },
    //lookup
    setCheckItem(val) {
       if (this.look.type == "companyName") {
        if (Array.isArray(val)) {
          this.queryForm.receiveCompany = val[0].id;
          this.queryForm.receiveCompanyName = val[0].companyName;
          this.queryForm.receiver = val[0].contactName;
          this.queryForm.receiverContact = val[0].contactPhoneNumber;
          this.queryForm.receiveDistrict = val[0].address;
          this.queryForm.receiveAddress = val[0].addressDtl;
        } else {
          this.queryForm.receiveCompanyId = val.id;
          this.queryForm.receiveCompanyName = val.companyName;
          this.queryForm.receiver = val.contactName;
          this.queryForm.receiverContact = val.contactPhoneNumber;
          this.queryForm.receiveDistrict = val.address;
          this.queryForm.receiveAddress = val.addressDtl;
        }
      } else if(this.look.type == "materil") {
        if (Array.isArray(val)) {
        let arr =  val.map(item => {return {...item,
        salesQty:item.qty,shipmentQty:1,remainOptionalQty:item.remainingOptionalQty,storeId:"1"
        }
        })
        this.tableData = [...this.tableData,...arr];
        } else {
        let arr =  [val].map(item => {return {...item,
        salesQty:item.qty,shipmentQty:1,remainOptionalQty:item.remainingOptionalQty,storeId:"1"
        }
        })
         this.tableData = [...this.tableData,...arr];
        }
      }
    },
    //上方勾选
    handleTopSelectionChange(val) {

    },
    //选单
    selectOrder() {
      this.orderVisible = true;
    },
    //lookup弹窗
    selectLook(val) {
      this.isSelectMore = val == 'materil' ? true :false;
      this.look = looks[val];
      this.look.params = val == 'materil'? {
        billNo: this.queryForm.sourceBillNo
      } :  this.look.params
      this.visible = true;
    },
    /**
     * @desc 鼠标聚焦 执行的事件  按照个人需求
     */
    selectMaterial(e) {
      let index = Number(e.target.getAttribute("index"));

      if (isNaN(index)) {
        index = 0;
      }
    },

    /**
     * @desc 点击添加或编辑
     */
    saveData() {
        if (!this.tableData.length) {
          this.$message.error("明细信息未添加");
          return;
        }
        let obj  = [
          ...this.formOne,
          ...this.formTwo,
          ...this.formThree
        ]
        if (!checkFormData(obj, this.queryForm)) {
          return;
        }

        // let bool = true,
        //   title = "";

        // this.tableColumn.forEach((item) => {
        //   if (item.config && item.config.custormRules) {
        //     this.tableData.forEach((value, key) => {
        //       value.orderNumber = key + 1;
        //       if (!value[item.config.key] && value[item.config.key] !== 0) {
        //         bool = false;
        //         title =
        //           "第" + (key + 1) + "行" + item.config.custormRules.message;
        //       } else if (item.config.key === "deliveryDate") {
        //         if (
        //           new Date(value[item.config.key]).getTime() <
        //           new Date(this.queryForm.billDate).getTime()
        //         ) {
        //           bool = false;
        //           title = "第" + (key + 1) + "行销售交期不能小于订单日期";
        //         }
        //       }
        //     });
        //   }
        // });

        // if (!bool) {
        //   this.$message.error(title);
        //   return;
        // }
        if(this.operateType == 'add') {
          this.loading = true;
          addInvoice({
            ...this.queryForm,
            shipmentDetailList:this.tableData,
          }).then(res => {
            if(res.code == 0) {
              this.$message.success("新增成功");
               this.loading = false;
               this.$emit("submit");
            }
          }).catch(() => {
            this.loading = false;
          })
        } else {
          updateInvoice({
            ...this.queryForm,
            shipmentDetailList:this.tableData,
          }).then(res => {
            if(res.code == 0) {
              this.$message.success("修改成功");
               this.loading = false;
               this.$emit("submit");
            }
          }).catch(() => {
            this.loading = false;
          })
        }
    },
    /**
     * @desc 回退到列表的页面
     */
    cancel() {
      if (this.isEdit) {
        this.$confirm("内容还未保存，确认返回吗？", "", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.$emit("submit");
          })
          .catch(() => {});
      } else {
        this.$emit("submit");
      }
    },

    /**
     * @desc 初始化界面的初始值
     */
    initFormAndTable(data={}) {
      this.queryForm = {
  "billStatus": 0,
  "businessStatus": "",
  "cancelCloseReason": "",
  "cancelCompleteReason": "",
  "closeReason": "",
  "completeReason": "",
  "checkItemName":"",
  "driverContract": "",
  "driverIds": "",
  "driverName": "",
  "forwarderCompanyId": "",
  "licensePlate": "",
  "planDate": this.$moment(new Date()).format("yyyy-MM-DD"),
  "receiveAddress": "",
  "receiveCompany": "",
  "receiveDistrict": "",
  "receiveProvince": "",
  "receiver": "",
  "receiverContact": "",
  "remark": "",
  "shipmentDetailList": [],
  "shipmentMethod": "",
  "sourceBillNo": "",
  "sourceBillType": "",
  "storeArea": "",
  "usable": true,
  ...data
      }
    },

    /**
     * @desc 点击icon展示 关闭 下面的数据
     */
    isCancel(key, bool) {
      this[key] = bool;
    },

    /**
     * @desc 勾选复选框
     */
    handleSelectionChange(data) {
      this.multipleSelection = data;
    },

    /**
     * @desc 新增的
     */
    addDetails() {
      this.selectLook("materil")
    },
    /**
     * @desc 复制明细
     */
    copyDetails() {
      copyone(this);
    },
    /**
     * @desc 删除明细
     */
    deleteDetails() {
      deleteone(this);
    },
  },
};
</script>

<style lang="less" scoped>
.tips {
}
</style>
