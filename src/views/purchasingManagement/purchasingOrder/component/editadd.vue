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
                <el-tab-pane label="业务信息" name="second">
                  <form-list
                    v-model="queryForm"
                    :formConfig="formConfigType(2)"
                    class="form form-order-box"
                  ></form-list>
                </el-tab-pane>
                <el-tab-pane label="财务信息" name="third">
                  <form-list
                    v-model="queryForm"
                    :formConfig="formConfigType(3)"
                    class="form form-order-box formThree"
                  ></form-list>
                  <Period
                    ref="Period"
                    :selectRow="queryForm.accountPeriodDateList"
                    :disabled="!isEdit"
                    v-if="queryForm.settlementType == '2'"
                  />
                </el-tab-pane>
                <el-tab-pane
                  label="条款信息"
                  name="fourth"
                  style="height:200px"
                >
                  <div class="z-details-btn">
                    <el-button :disabled="!isEdit"
                      size="mini"
                      plain
                      @click="dialogTableVisible = true"
                      >添加条款</el-button
                    >
                  </div>
                  <quill-editor
                    style="width:100%;height:100px;"
                    v-model="queryForm.clauseName"
                    :disabled="!isEdit"
                    ref="myQuillEditor"
                    :options="editorOption"
                    maxlength="1000"
                  >
                  </quill-editor>
                  <div class="popBox add">
                    <el-dialog
                      title="添加条款"
                      v-if="dialogTableVisible"
                      :visible.sync="dialogTableVisible"
                      @close="dialogTableVisible = false"
                    >
                      <div class="content">
                        <div class="form">
                          <el-form>
                            <el-form-item label="条款名称">
                              <el-select v-model="value" placeholder="请选择">
                                <el-option
                                  v-for="item in options"
                                  :key="item.termsName"
                                  :label="item.termsName"
                                  :value="item.termsContent"
                                >
                                </el-option>
                              </el-select>
                            </el-form-item>
                          </el-form>
                        </div>
                      </div>
                      <div slot="footer">
                        <el-button @click="dialogTableVisible = false"
                          >取消</el-button
                        >
                        <el-button type="primary" @click="addTerms"
                          >确认</el-button
                        >
                      </div>
                    </el-dialog>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="融资信息" name="five">
                  <form-list
                    v-model="queryForm"
                    :formConfig="formConfigType(5)"
                    class="form form-order-box"
                  ></form-list>
                  <div class="z-details-btn" v-if="isEdit">
                    <el-button size="mini" plain @click="addTop"
                      >新增</el-button
                    >
                    <el-button size="mini" plain @click="delTop"
                      >删除</el-button
                    >
                  </div>

                </el-tab-pane>
                <el-tab-pane label="其他信息" name="six">
                  <form-list
                    v-model="queryForm"
                    :formConfig="formConfigType(6)"
                    class="form form-order-box"
                  ></form-list>
                </el-tab-pane>
                  <div class="z-content-table" v-if="activeName=='five'">
                    <common-table
                      :class="{ zTable: isEdit }"
                      ref="mainTopTable"
                      :isSelectMore="true"
                      :isSelection="true"
                      :tableColumn="topTableColumn"
                      :tableData="queryForm.financeList"
                      @selePage="handleTopSelectionChange"
                      :tableheight="150"
                      :isMain="true"
                    ></common-table>
                  </div>
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
              <el-button size="mini" plain @click="addDetails">新增</el-button>
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
    <SelectOrderTable v-if="orderVisible" @selectTable="selectTable" :orderVisible.sync="orderVisible"></SelectOrderTable>
    <look-up
      ref="lookup" v-if="visible"
      :isSelectMore="false"
      :visible.sync="visible"
      @setCheckItem="setCheckItem"
      :method="look.method"
      :table-column="look.tableColumn"
      :search-arr="look.searchArr"
      :params="look.params"
    ></look-up>
    <!-- <div>
            <look-up :title="look.title" :visible.sync="popConfig.show" :isClearAll="true" @setCheckItem="popSubmit" :params="look.params"  :method="look.methods" :table-column="look.tableColumn" :search-arr="look.searchArr" ></look-up>
        </div> -->
         <div v-if="openmodal">
        <open-modal :billId="queryForm.id" billType="PURCHASE_ORDER" @closeModal="(value)=>{this.openmodal=false}" />
      </div>
  </div>
</template>

<script>
import formList from "@/components/Form/formList";
import Period from "./period"; //选择账期的组件
import SelectOrderTable from "./selectOrderTable";
import commonTable from "@/components/CommonTable";
import OpenModal from '@/components/commonUpload';
import lookUp from "@/components/ZLookUp/lookUpImport"; //lookup统一弹窗
import { addone, copyone, deleteone, tablecol, topTablecol } from "./show";
import { serachAllType } from "@/api/master/supplierFile";
import { selectPurchaseType,addPurchaseOrder,updatePurchaseOrder,searchOrderDetail,submitPurchaseOrder} from "@/api/purchase/order";
import { contractList } from "@/api/purchase/base";
import { checkFormData } from "@/lib/common";
import {
  formone,
  formonePlus,
  formtwo,
  formtwoPlus,
  formThree,
  formfive,
  formsix
} from "./form";
import looks from "./look";
export default {
  name: "Menuceng",
  components: { formList, commonTable, Period, SelectOrderTable, lookUp,OpenModal },
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
      dialogTableVisible: false,
      value: "",
      options: [],
      editorOption: {
        theme: "snow",
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"], //加粗 斜体下划线删除线["blockquote"，"code-block"]，1/ 引用代码块
            [{ header: 1 }, { header: 2 }], // 1、2级标题
            [{ list: "ordered" }, { list: "bullet" }], //有序、无序列表
            [{ script: "sub" }, { script: "super" }], //上标/下标
            [{ indent: "-1" }, { indent: "+1" }], //缩进
            [{ direction: "rtl" }],
            //文本方向
            [{ size: ["small", false, "large", "huge"] }], //字体大小
            [{ header: [1, 2, 3, 4, 5, 6, false] }], //标题
            [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色[{ font:[]}]，1/字体种类
            [{ align: [] }], // 对齐方式
            ["clean"], // 清除文本格式
            ["link", "image", "video"] //链接、图片、视频
          ]
        }
      },
      content: "",
      basicShow: true, //是否显示基本信息的模块
      detailsShow: true, //是否显示详情数据的模块
      isEdit: true, //是否处于编辑状态
      loading: false, //主体是否处于加载状态
      orderVisible: false, //选单的弹窗
      activeName: "first",
      queryForm: {}, //所有的表单的数据
      topTableData: [], //融资信息表格
      tableData: [], //下面表格要显示的数据、
      multipleSelection: [], //下main表格选中的数据
      visible: false, //lookup展示条件
      look: {
        method: serachAllType,
        tableColumn: [],
        searchArr: [],
        params: {}
      },
      tradeType: [], //贸易类型下拉
      receiveType: [], //运输方式下拉
      settlementType: [], //结算方式下拉
      unifiedIdentification: [], //统计标识
      paymentType: [], //支付方式下拉
      certificateType: [], //证书类型下拉
      PurchaseType: [], //采购类型下拉
      selectTopList:[], //上方勾选数据
      selectTableIndex:0,
    };
  },

  mounted() {
    if (this.operateType == "details") {
      this.isEdit = false;
    }
    if (this.operateType == "edit" || this.operateType == "details" || this.operateType == "copy") {
      this.init();
    }
  },

  /**
   * 加载前准备些数据 比如下拉框需要的 还有初始化界面的
   */
  created() {
    this.initFormAndTable();
    this.serachAllType(); //词典
    if(this.operateType == 'add') {
      this.selectPurchaseType(); //采购类型
    }
    this.getContractList(); //获取条款
  },

  /**
   * @desc 存储一些数据变化需要页面更新的 比如searchArr  table的
   */
  computed: {
    tableColumn() {
      let isEdit = this.isEdit;
      let column = tablecol(this, isEdit);
      let arr = [];
      column.forEach(item => {
        if (item.isShow) {
          arr.push(item);
        }
      });
      return arr;
    },
    formOne() {
      return formone(this, !this.isEdit);
    },
    formonePlus() {
      return formonePlus(this, !this.isEdit);
    },
    formTwo() {
      return formtwo(this, !this.isEdit);
    },
    formtwoPlus() {
      return formtwoPlus(this, !this.isEdit);
    },
    formThree() {
      return formThree(this, !this.isEdit);
    },
    formfive() {
      return formfive(this, !this.isEdit);
    },
    topTableColumn() {
      return topTablecol(this, this.isEdit);
    },
    formsix() {
      return formsix(this, !this.isEdit);
    }
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
      submitPurchaseOrder({
        ids: this.queryForm.id
      }).then(res => {
        if(res.code == 0 ){
          this.$message.success("操作成功");
              this.loading = false;
              this.$emit("submit");
        }
      })
    },
    init() {
      searchOrderDetail({
        id: this.currentData.id
      }).then(res => {
        if (res.code == 0) {
          if(res.data.financeList&&res.data.financeList.length) {
            res.data.financeList = res.data.financeList.map((i,o) => {
            return {...i,isIndex:o}
          })
           res.data.financingUnit = res.data.financeList[0].financingUnit;
           res.data.financingUnitName = res.data.financeList[0].financingUnitName;
           res.data.interestRate = res.data.financeList[0].interestRate;
          }
          res.data.tradeMethod = String(res.data.tradeMethod);
          res.data.tradeType = String(res.data.tradeType) == 0 ? "" : String(res.data.tradeType);
          res.data.deliveryType = String(res.data.deliveryType);
          res.data.settlementType = String(res.data.settlementType);
          res.data.statisticalIdentification = String(res.data.statisticalIdentification);
          res.data.paymentType = String(res.data.paymentType);
          res.data.settlementType = String(res.data.settlementType);
          res.data.purchaseDate = res.data.purchaseDate ? res.data.purchaseDate.substring(0,10) : "";
          res.data.contractValidity = res.data.contractValidity ? res.data.contractValidity.substring(0,10) : "",
          this.initFormAndTable(res.data);
          this.tableData = res.data.detailList.map((item,i) => {
            return {...item, isIndex:i,certType:item.certType ? item.certType.split(",") : [],
            certTypeName:item.certTypeNameList ? item.certTypeNameList.toString() : ""}
          });
          this.selectPurchaseType();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //获取条款
    getContractList() {
      contractList({
        usable:"1"
      }).then(res => {
        if (res.code == 0) {
          this.options = res.data.records;
        }
      });
    },
    //采购类型下拉
    selectPurchaseType() {
      selectPurchaseType({
        current: 1,
        size: 50,
        tradeMethod:this.queryForm.tradeMethod
      }).then(res => {
        if (res.code == 0) {
          this.PurchaseType = res.data.records;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //查询所有的词典下拉
    serachAllType() {
      serachAllType([
        "paymentType",
        "tradeType",
        "receiveType",
        "settlementType",
        "unifiedIdentification",
        "certificateType"
      ]).then(res => {
        if (res.code == 0) {
          this.paymentType = res.data.paymentType; //支付类型下拉
          this.tradeType = res.data.tradeType; //贸易类型下拉
          this.receiveType = res.data.receiveType; //运输方式下拉
          this.settlementType = res.data.settlementType; //结算方式下拉
          this.unifiedIdentification = res.data.unifiedIdentification; //统计标识下拉
          this.certificateType = res.data.certificateType; //证书类型
        } else {
          this.$message.error(res.msg);
        }
      });
    },
      //选单数据
    selectTable(a) {
      if(!this.tableData.length&&a.length == 1) {
         this.queryForm.sourceBillNo = a[0].billNo;
         this.queryForm.sourceBillType = a[0].saleTypeNo;
         this.queryForm.sourceBillTypeName = a[0].saleTypeName;
         this.tableData = a.map(item => {return {...item,
        salesQty:item.qty,shipmentQty:1,remainingOptionalQty:item.remainingOptionalQty,storeId:"1",
        applicant:"",applicantName:"",overflowRate:0,shortageRate:0,unit:item.unitName
        }
        })
        this.tableData = this.tableData.map((i,r) => {
          return {...i, isIndex:r}
        })
        return
      }
      let b = a.map(item => {return {...item,
        salesQty:item.qty,shipmentQty:1,remainingOptionalQty:item.remainingOptionalQty,storeId:"1",
        applicant:"",applicantName:"",overflowRate:0,shortageRate:0,unit:item.unitName
        }
        })
      if(!this.tableData.length&&a.length > 1) {
        let c = b[0]
        let flag = false;
        this.queryForm.sourceBillNo = c.billNo;
         this.queryForm.sourceBillType = c.saleTypeNo;
         this.queryForm.sourceBillTypeName = c.saleTypeName;
        b.forEach(item => {
          if(item.billNo == c.billNo) {
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
         let flag = false;
        b.forEach(item => {
          if(item.billNo == this.queryForm.sourceBillNo) {
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
        1:
          this.queryForm.tradeMethod == "1"
            ? this.formOne
            : [...this.formOne, ...this.formonePlus],
        2:
          this.queryForm.tradeMethod == "1"
            ? this.formTwo
            : [...this.formTwo, ...this.formtwoPlus],
        3: this.formThree,
        5: this.formfive,
        6: this.formsix
      };

      return {
        inline: true,
        size: "mini",
        labelWidth: "auto",
        formItemList: obj[type]
      };
    },
    //lookup
    setCheckItem(val) {
      if (!val) {
        return;
      }
      if (this.look.type == "supplier") {
        if (Array.isArray(val)) {
          this.queryForm.supplierId = val[0].id;
          this.queryForm.supplierName = val[0].checkItemName;
          this.queryForm.tradeCountry = val[0].countryName;
          this.queryForm.purchaser = val[0].userId;
          this.queryForm.purchaserName = val[0].userName;
            this.queryForm.purchaseGroup = val[0].departmentId;
          this.queryForm.purchaseGroupName = val[0].departmentName;
        } else {
          this.queryForm.supplierId = val.id;
          this.queryForm.supplierName = val.checkItemName;
          this.queryForm.tradeCountry = val.countryName;
          this.queryForm.purchaser = val.userId;
          this.queryForm.purchaserName = val.userName;
           this.queryForm.purchaseGroup = val.departmentId;
          this.queryForm.purchaseGroupName = val.departmentName;
        }
      } else if (this.look.type == "purchase") {
        if (Array.isArray(val)) {
          this.queryForm.purchaser = val[0].userId;
          this.queryForm.purchaserName = val[0].userName;
        } else {
          this.queryForm.purchaser = val.userId;
          this.queryForm.purchaserName = val.userName;
        }
      } else if (this.look.type == "purchaseGroup") {
        if (Array.isArray(val)) {
          this.queryForm.purchaseGroup = val[0].departmentId;
          this.queryForm.purchaseGroupName = val[0].departmentName;
        } else {
          this.queryForm.purchaseGroup = val.departmentId;
          this.queryForm.purchaseGroupName = val.departmentName;
        }
      } else if (this.look.type == "salesMan") {
        if (Array.isArray(val)) {
          this.queryForm.supplierContacts = val[0].id;
          this.queryForm.supplierContactsName = val[0].contactName;
          this.queryForm.supplierPhone = val[0].contactPhoneNumber;
        } else {
          this.queryForm.supplierContacts = val.id;
          this.queryForm.supplierContactsName = val.contactName;
          this.queryForm.supplierPhone = val.contactPhoneNumber;
        }
      } else if (this.look.type == "company") {
        if (Array.isArray(val)) {
          this.queryForm.financingUnit = val[0].id;
          this.queryForm.financingUnitName = val[0].checkItemName;
        } else {
          this.queryForm.financingUnit = val.id;
          this.queryForm.financingUnitName = val.checkItemName;
        }
      }  else if (this.look.type == "person") {
        if (Array.isArray(val)) {
          this.$set(this.tableData[this.selectTableIndex], 'applicant',val[0].id)
           this.$set(this.tableData[this.selectTableIndex], 'applicantName',val[0].fullName)
        } else {
           this.$set(this.tableData[this.selectTableIndex], 'applicant',val.id)
           this.$set(this.tableData[this.selectTableIndex], 'applicantName',val.fullName)
        }
      } else if (this.look.type == "materil") {
        if (Array.isArray(val)) {
        let arr = val.map(item => {
          return {...item, materialId:item.id,overflowRate:0,shortageRate:0,unit:item.unitName}
        })
        this.tableData[this.selectTableIndex] = {...this.tableData[this.selectTableIndex],...arr[0]}
        this.tableData = this.tableData.map((x,r) => {
          return {...x, isIndex:r}
        });
        } else {
          let arr = [val].map(item => {
          return {...item, materialId:item.id,overflowRate:0,shortageRate:0,unit:item.unitName}
        })
         this.tableData[this.selectTableIndex] = {...this.tableData[this.selectTableIndex],...arr[0]}
         this.tableData = this.tableData.map((x,r) => {
          return {...x, isIndex:r}
        });
        }
      }
    },
    //上方勾选
    handleTopSelectionChange(val) {
      this.selectTopList = val;
    },
    //选单
    selectOrder() {
      if(!this.queryForm.sourceBillNo&&this.tableData.length) {
      this.$confirm("选单后，已选的物料会被清空，是否确认？", "",{
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
      .then(() => {
        this.tableData = [];
        this.orderVisible = true;
      })
      .catch(() => {
      })
      } else {
        this.orderVisible = true;
      }

    },
    //融资信息添加
    addTop() {
      let obj = {
        factPayAmount: "",
        financingPayAmount: "",
        financingPayDate: "",
        financingUnit: "",
        financingUnitName: "",
        interest: "",
        interestDays: "",
        interestRate: "",
        interestSettlementDate: "",
        isIndex: this.queryForm.financeList.length
      };
      this.queryForm.financeList.push(obj);
    },
    delTop() {
      if(!this.selectTopList.length) {
        this.$message.error("请勾选数据");
      }
       this.selectTopList.forEach((item) => {
          let index =  this.queryForm.financeList.findIndex((value) => {
            return item.isIndex == value.isIndex;
          });

          if (index != -1) {
             this.queryForm.financeList.splice(index, 1);
          }
        });
         this.queryForm.financeList = this.queryForm.financeList.map((item,i) => {
           return {...item, isIndex:i}
         })
         this.$ref.mainTopTable.$refs.multipleTable.clearSelection();
    },
    //lookup弹窗
    selectLook(val) {
      if (val == "purchase" && !this.queryForm.supplierName) {
        this.$message.error("请先选择供应商!!!");
        return;
      }
      if (val == "purchaseGroup" && !this.queryForm.purchaserName) {
        this.$message.error("请先选择采购员!!!");
        return;
      }
      // if (val == "materil") {
      //   this.selectIndex = e.target.getAttribute("index");
      // }
      this.look = looks[val];
      this.look.params =
        val == "purchase"
          ? { checkItemId: this.queryForm.supplierId }
          : val == "purchaseGroup"
          ? { userId: this.queryForm.purchaser }
          :  val == "materil" ? {
            checkItemId: this.queryForm.supplierId
          } : this.look.params;
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
       let obj = [];
      if (this.queryForm.tradeMethod == 1) {
        obj = [
          ...this.formOne,
          ...this.formTwo,
          ...this.formThree,
          ...this.formfive,
          ...this.formsix
        ];
      } else {
        obj = [
          ...this.formOne,
          ...this.formonePlus,
          ...this.formTwo,
          ...this.formtwoPlus,
           ...this.formfive,
          ...this.formThree,
          ...this.formsix
        ];
      }
      if (!checkFormData(obj, this.queryForm)) {
        return;
      }
      if(!this.tableData.length) {
        this.$message.error("请添加明细");
        return
      }
      let bool = true,
        title = "";

      this.tableColumn.forEach(item => {
        if (item.config && item.config.custormRules) {
          this.tableData.forEach((value, key) => {
            value.orderNumber = key + 1;
            if (
              !value[item.config.key] &&
              value[item.config.key] !== 0 &&
              bool
            ) {
              bool = false;
              title =
                "第" + (key + 1) + "行" + item.config.custormRules.message;
            }
          });
        }
      });

      if (!bool) {
        this.$message.error(title);
        return;
      }
       let flag = false;
      let arr = [];
      if (this.queryForm.settlementType == "2") {
        this.$refs.Period.obj.periodDateList.forEach(item => {
          if(item.type == this.$refs.Period.obj.saleAccountPeriodRule) {
            arr.push(item);
          }
        })
        arr.forEach(item => {
          for (let i in item) {
            if (!item[i] && !Array.isArray(item[i])) {
              flag = true;
            }
            if (Array.isArray(item[i]) && item[i].length) {
              item[i].forEach(s => {
                for (let x in s) {
                  if (!s[x]) {
                    flag = true;
                  }
                }
              });
            }
          }
        });
      }
      if(flag) {
        this.$message.error("账期规则不能为空");
        return
      }
        this.loading = true;
      this.queryForm.financeList = this.queryForm.financeList.map(item => {
        return {...item,financingUnit:this.queryForm.financingUnit,
        financingUnitName:this.queryForm.financingUnitName,
        interestRate:this.queryForm.interestRate,
        }
      })
      if (this.operateType == "add" || this.operateType == "copy") {
        addPurchaseOrder({
          ...this.queryForm,
          detailList: this.tableData.map(item => {
            return {...item, certType:item.certType.toString()}
          }),
          accountPeriodDateList:
            this.queryForm.settlementType == "2"
              ? arr
              : [],
              id: null,
        })
          .then(res => {
            if (res.code == 0) {
              this.$message.success("操作成功");
              this.loading = false;
              this.$emit("submit");
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch(() => {
            this.loading = false;
          });
      } else {
        updatePurchaseOrder({
          ...this.queryForm,
          detailList: this.tableData.map(item => {
            return {...item, certType:item.certType.toString()}
          }),
          accountPeriodDateList:
            this.queryForm.settlementType == "2"
              ? arr
              : [],
        })
          .then(res => {
            if (res.code == 0) {
              this.$message.success("操作成功");
              this.loading = false;
              this.$emit("submit");
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch(() => {
            this.loading = false;
          });
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
          type: "warning"
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
    initFormAndTable(data = {}) {
      this.queryForm = {
        purchaseTypeCode:"",
        tradeTypeName: "",
        deliveryTypeName: "",
        settlementTypeName: "",
        statisticalIdentificationName: "",
        paymentTypeName: "",
        accountPeriodDateList: [],
        amoebaRule: 0,
        billNo: "",
        billStatus: 0,
        businessEntity: JSON.parse(localStorage.companyIdNow).companyId,
        businessEntityName:JSON.parse(localStorage.companyIdNow).companyName,
        businessStatus: "",
        cancelCloseReason: "",
        cancelCompleteReason: "",
        clauseName: "",
        closeReason: "",
        completeReason: "",
        contractArchiving: true,
        contractExchangeRate: 0,
        contractTerms: "",
        contractValidity: "",
        currency: "1",
        deliverStatus: 0,
        deliveryType: "",
        depositAmount: "",
        destinationPort: "",
        detailList: [],
        financeList: [],
        invoiceStatus: "",
        latestShipmentDate: "",
        loadingPort: "",
        orderAmount: "",
        paymentStatus: 0,
        paymentType: "",
        pi: "",
        purchaseDate: this.$moment(new Date()).format("yyyy-MM-DD"),
        purchaseGroup: "",
        purchaseTypeId: "",
        purchaser: JSON.parse(localStorage.userInfoNow).userId,
        purchaserName: JSON.parse(localStorage.userInfoNow).fullName,
        receiveStatus: "",
        remark: "",
        settlementType: "",
        sourceBillNo: "",
        sourceBillType: "",
        statisticalIdentification: "1111",
        supplierContacts: "",
        supplierId: "",
        supplierPhone: "",
        tradeCountry: "",
        tradeMethod: "1",
        tradeType: "",
        usable: true,
        ...data
      };
    },
    //添加条款
    addTerms() {
      if (!this.value) {
        this.$message.error("请选择条款");
        return;
      }
      this.queryForm.clauseName = this.value;
      this.dialogTableVisible = false;
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
      if(this.queryForm.sourceBillNo) {
        this.$message.error("选单以后不能新增");
        return
      }
      if(!this.queryForm.supplierId) {
        this.$message.error("请先选择供应商");
        return
      }
      addone(this)
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
    }
  }
};
</script>

<style lang="less" scoped>
.tips {
}
.add /deep/ .el-dialog {
  min-height: 110px !important;
  width: 350px !important;
  min-width: 350px !important;
  .el-dialog__body {
    min-height: 70px !important;
  }
}
 /deep/ .formThree {
  .el-form-item:nth-child(8) {
   .el-form-item__content {
    width: 180px !important;
   }
  }
 }
</style>
