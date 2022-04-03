<template>
  <div id="zPage" class="market-order-edit">
    <div class="z-header">
      <div v-if="isEdit" class="z-header-button">
        <el-button plain @click="selectOrder" v-if="operateType=='add'">选单</el-button>
        <el-button plain @click="saveData" :disabled="loading">保存</el-button>
        <el-button plain @click="cancel">取消</el-button>
         <el-button v-if="operateType!='add'"  @click="() => uploadFile()">附件</el-button>
      </div>
      <div v-else class="z-header-button">
        <el-button plain @click="updateStatus" v-if="queryForm.billStatus == 0">编辑</el-button>
        <el-button plain @click="cancel">返回</el-button>
        <el-button plain @click="submit"  v-if="queryForm.billStatus == 0">提交</el-button>
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
                <el-tab-pane label="财务信息" name="third">
                  <form-list
                    v-model="queryForm"
                    :formConfig="formConfigType(3)"
                    class="form form-order-box"
                  ></form-list>
                  <Period
                    ref="Period"
                    :selectRow="queryForm.periodDateList"
                    :disabled="!isEdit"
                    v-if="queryForm.settlementMethod == '2'"
                  />
                </el-tab-pane>
                <el-tab-pane
                  label="条款信息"
                  name="fourth"
                  style="height:200px"
                >
                  <div class="z-details-btn">
                    <el-button
                      size="mini"
                      :disabled="!isEdit"
                      plain
                      @click="dialogTableVisible = true"
                      >添加条款</el-button
                    >
                  </div>
                  <quill-editor
                    :disabled="!isEdit"
                    style="width:100%;height:100px;"
                    v-model="queryForm.termsContent"
                    ref="myQuillEditor"
                    :options="editorOption"
                    maxlength="1000"
                  >
                  </quill-editor>
                  <div class="popBox add">
                    <el-dialog
                      title="添加条款"
                      v-if="dialogTableVisible"
                      @close="dialogTableVisible = false"
                      :visible.sync="dialogTableVisible"
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
                        <el-button @click="close">取消</el-button>
                        <el-button type="primary" @click="addTerms"
                          >确认</el-button
                        >
                      </div>
                    </el-dialog>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="其他信息" name="six">
                  <form-list
                    v-model="queryForm"
                    :formConfig="formConfigType(6)"
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
                @changeDoubleClick="(a, b) => changeDoubleClick(a, b)"
                :propTableHeight="100"
                :isMain="true"
              ></common-table>
            </div>
          </div>
        </div>
      </el-card>
    </div>
    <AuditRecord :auditVisible.sync="auditVisible"></AuditRecord>
    <SelectOrderTable
      v-if="orderVisible"
      @selectTable="selectTable"
      :orderVisible.sync="orderVisible"
    ></SelectOrderTable>
    <look-up
      ref="lookup"
      v-if="visible"
      :title="look.title"
      :isSelectMore="false"
      :visible.sync="visible"
      @setCheckItem="setCheckItem"
      :method="look.method"
      :table-column="look.tableColumn"
      :search-arr="look.searchArr"
      :params="look.params"
    ></look-up>
    <div v-if="openmodal">
        <open-modal :billId="queryForm.id" billType="SALE_ORDER" @closeModal="(value)=>{this.openmodal=false}" />
      </div>
  </div>
</template>

<script>
import formList from "@/components/Form/formList";
import Period from "./period"; //选择账期的组件
import SelectOrderTable from "./selectOrderTable";
import commonTable from "@/components/CommonTable";
import AuditRecord from "./AuditRecord";
import OpenModal from '@/components/commonUpload';
import lookUp from "@/components/ZLookUp/lookUpImport"; //lookup统一弹窗
import { addone, copyone, deleteone, tablecol, topTablecol } from "./show";
import { serachAllType } from "@/api/master/supplierFile";
import { contractList } from "@/api/sale/base";
import {
  searchSaleType,
  addSaleOrder,
  searchOrderDetail,
  updateSaleOrder,
  submitSaleOrder
} from "@/api/sale/order";
import { getProvinceList } from "@/api/common";
import { checkFormData } from "@/lib/common";
import {
  formone,
  formonePlus,
  formtwo,
  formtwoPlus,
  formThree,
  formsix
} from "./form";
import look from "./look";
export default {
  name: "Menuceng",
  components: {
    formList,
    commonTable,
    Period,
    SelectOrderTable,
    lookUp,
    AuditRecord,
    OpenModal
  },
  props: {
    operateType: {
      type: String,
      default: "edit"
    },
    currentData: {
      type: Object,
      default: () => {
        return {};
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
      auditVisible: false, //审核的弹窗
      activeName: "first",
      queryForm: {}, //所有的表单的数据
      topTableData: [], //融资信息表格
      tableData: [], //下面表格要显示的数据、
      multipleSelection: [], //下main表格选中的数据
      visible: false, //lookup展示条件
      look: {
        method: searchSaleType,
        tableColumn: [],
        searchArr: [],
        params: {}
      },
      paymentType: [], //支付类型下拉
      tradeType: [], //贸易类型下拉
      receiveType: [], //运输方式下拉
      settlementType: [], //结算方式下拉
      unifiedIdentification: [], //统计标识下拉
      SaleTypeList: [], //销售类型下拉
      provinceList: [], //省
      certificateType: [], //证书类型下拉
      selectIndex: 0, //判断选择哪行表格数据

      doubleClickDrawIndex: undefined
    };
  },

  mounted() {
    if (this.operateType == "details") {
      this.isEdit = false;
    }
    if (
      this.operateType == "edit" ||
      this.operateType == "details" ||
      this.operateType == "copy"
    ) {
      this.queryForm.billStatus = '1';
      this.init();
    }
  },

  /**
   * 加载前准备些数据 比如下拉框需要的 还有初始化界面的
   */
  created() {
    this.initFormAndTable();
    this.serachAllType(); //查询字典
    if (this.operateType == "add") {
      this.searchSaleType(); //查询销售类型
    }
    this.getProvinceList(); //获取省
    this.getContractList(); //获取条款
  },

  /**
   * @desc 存储一些数据变化需要页面更新的 比如searchArr  table的
   */
  computed: {
    tableColumn() {
      let isEdit = this.isEdit;
      if (this.queryForm.tradeType == 0) {
        return tablecol(this, isEdit);
      } else {
        return topTablecol(this, isEdit);
      }
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
    // 双击传过来的值
    changeDoubleClick(a) {
      this.doubleClickDrawIndex = a;
    },
    close() {
      this.dialogTableVisible = false;
    },
    //选单
    selectTable(val) {
      this.queryForm.sourceBillNo = val[0].billNo;
      this.queryForm.sourceBillTypeName = val[0].billTypeName;
      this.queryForm.sourceBillType = val[0].billType;
      this.queryForm.checkItemName = val[0].supplierName;
      this.queryForm.checkItemNo = val[0].supplierNo;
    },
    updateStatus() {
      if (this.queryForm.billStatus != 0) {
        this.$message.error("当前状态不能编辑");
        return;
      }
      this.isEdit = !this.isEdit;
    },
    //提交审核
    submit() {
      if (this.queryForm.billStatus != 0) {
        this.$message.error("当前状态不能提交审核");
        return;
      }
      this.loading = true;
      submitSaleOrder({
        ids: this.queryForm.id
      }).then(res => {
        if (res.code == 0) {
          this.$message.success("操作成功");
          this.loading = false;
          this.$emit("submit");
        }
      });
    },
    //查询订单详情
    init() {
      searchOrderDetail({
        id: this.currentData.id
      }).then(res => {
        if (res.code == 0) {
          res.data.billDate = res.data.billDate
            ? res.data.billDate.substring(0, 10)
            : "";
          (res.data.contractValidity = res.data.contractValidity
            ? res.data.contractValidity.substring(0, 10)
            : ""),
            this.initFormAndTable(res.data);
          this.tableData = res.data.orderDetailList.map((item, i) => {
            return { ...item, isIndex: i, salesCertificateType:item.salesCertificateType.split(",")};
          });
          this.searchSaleType();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //获取条款
    getContractList() {
      contractList().then(res => {
        if (res.code == 0) {
          this.options = res.data.records;
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
    //查询销售类型
    searchSaleType() {
      searchSaleType({
        current: 1,
        size: 50,
        tradeMethod: this.queryForm.tradeType == 0 ? 1 : 2
      }).then(res => {
        if (res.code == 0) {
          this.SaleTypeList = res.data.records;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //查询省
    getProvinceList() {
      getProvinceList().then(res => {
        if (res.code == 0) {
          this.provinceList = JSON.parse(res.data);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    formConfigType(type) {
      let obj = {
        1:
          this.queryForm.tradeType == "0"
            ? this.formOne
            : [...this.formOne, ...this.formonePlus],
        2: this.queryForm.tradeType == "0" ? this.formTwo : this.formtwoPlus,
        3: this.formThree,
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
      if (this.look.type == "customer") {
        this.queryForm.receiveCompanyId = "";
        this.queryForm.receiveCompanyName = "";
        this.queryForm.receiver = "";
        this.queryForm.receiverContact = "";
        this.queryForm.receiveDistrict = "";
        this.queryForm.receiveAddress = "";
        if (Array.isArray(val)) {
          this.queryForm.checkItemNo = val[0].checkItemNo;
          this.queryForm.checkItemName = val[0].checkItemName;
          this.queryForm.salesPerson = val[0].userId;
          this.queryForm.salesPersonName = val[0].userName;
          this.queryForm.tradeCountry = val[0].countryName;
        } else {
          this.queryForm.checkItemNo = val.checkItemNo;
          this.queryForm.checkItemName = val.checkItemName;
          this.queryForm.salesPerson = val.userId;
          this.queryForm.salesPersonName = val.userName;
          this.queryForm.tradeCountry = val.countryName;
        }
      } else if (this.look.type == "saleman") {
        if (Array.isArray(val)) {
          this.queryForm.salesPerson = val[0].id;
          this.queryForm.salesPersonName = val[0].fullName;
        } else {
          this.queryForm.salesPerson = val.id;
          this.queryForm.salesPersonName = val.fullName;
        }
      } else if (this.look.type == "saleGroup") {
        if (Array.isArray(val)) {
          this.queryForm.salesGroupId = val[0].departmentId;
          this.queryForm.salesGroupName = val[0].departmentName;
        } else {
          this.queryForm.salesGroupId = val.departmentId;
          this.queryForm.salesGroupName = val.departmentName;
        }
      } else if (this.look.type == "business") {
        if (Array.isArray(val)) {
          this.queryForm.contacts = val[0].id;
          this.queryForm.contactsName = val[0].contactName;
          this.queryForm.contactNumber = val[0].contactPhoneNumber;
        } else {
          this.queryForm.contacts = val.id;
          this.queryForm.contactsName = val.contactName;
          this.queryForm.contactNumber = val.contactPhoneNumber;
        }
      } else if (this.look.type == "company") {
        if (Array.isArray(val)) {
          this.queryForm.receiveCompanyId = val[0].id;
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
      } else if (this.look.type == "materil") {
        if (Array.isArray(val)) {
          this.tableData[this.selectIndex].materialId = val[0].id;
          this.tableData[this.selectIndex].materialNo = val[0].materialNo;
          this.tableData[this.selectIndex].materialName = val[0].materialName;
          this.tableData[this.selectIndex].materialDescription =
            val[0].materialDescription;
          this.tableData[this.selectIndex].unit = val[0].unit;
          this.tableData[this.selectIndex].unitName = val[0].unitName;
          this.tableData[this.selectIndex].taxRate = val[0].taxRate;
          this.tableData[this.selectIndex].salesGuidancePrice = val[0].salesGuidancePrice;
          this.tableData[this.selectIndex].propertyMerge = val[0].propertyMerge;
        } else {
          this.tableData[this.selectIndex].materialId = val.id;
          this.tableData[this.selectIndex].materialNo = val.materialNo;
          this.tableData[this.selectIndex].materialName = val.materialName;
          this.tableData[this.selectIndex].materialDescription =
            val.materialDescription;
          this.tableData[this.selectIndex].unit = val.unit;
          this.tableData[this.selectIndex].unitName = val.unitName;
          this.tableData[this.selectIndex].taxRate = val.taxRate;
          this.tableData[this.selectIndex].salesGuidancePrice =  val.salesGuidancePrice;
          this.tableData[this.selectIndex].propertyMerge = val.propertyMerge;
        }
      } else if (this.look.type == "workOrder") {
        if (Array.isArray(val)) {
          this.queryForm.sampleBillNo = val[0].billNo;
        } else {
          this.queryForm.sampleBillNo = val.billNo;
        }
      }
    },
    //上方勾选
    handleTopSelectionChange(val) {},
    //选单
    selectOrder() {
      this.orderVisible = true;
    },
    //lookup弹窗
    selectLook(val, e) {
      if (val == "saleGroup" && !this.queryForm.salesPerson) {
        this.$message.error("请先选择销售员!!!");
        return;
      }
      if (val == "company" && !this.queryForm.checkItemNo) {
        this.$message.error("请先选择客户!!!");
        return;
      }
      if (val == "materil") {
        this.selectIndex = e.target.getAttribute("index");
        if (!isNaN(this.doubleClickDrawIndex)) {
          this.selectIndex = this.doubleClickDrawIndex;
        }
      }
      this.look = look.lookall(this, val);
      this.look.params =
        val == "company"
          ? { checkItemNo: this.queryForm.checkItemNo }
          : val == "saleGroup"
          ? { userId: this.queryForm.salesPerson }
          : val=="business" ? { checkItemNo: this.queryForm.checkItemNo } : this.look.params;
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
      let type = this.operateType === "details" ? "edit" : this.operateType;

      if (this.tableData.length < 1) {
        this.$message.error("明细信息未添加");
        return;
      }
      let obj = [];
      if (this.queryForm.tradeType == 0) {
        obj = [
          ...this.formOne,
          ...this.formTwo,
          ...this.formThree,
          ...this.formsix
        ];
      } else {
        obj = [
          ...this.formOne,
          ...this.formonePlus,
          ...this.formtwoPlus,
          ...this.formThree,
          ...this.formsix
        ];
      }
      if (!checkFormData(obj, this.queryForm)) {
        return;
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
      if (this.queryForm.settlementMethod == "2") {
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
              console.log(item[i])
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
      // let formDate = new FormData();
      // formDate.append('file', this.queryForm.upLoadList.length ? this.queryForm.upLoadList[0].file : {});
      this.loading = true;
      if (this.operateType == "add" || this.operateType == "copy") {
        //  let detail = JSON.stringify({
        //   ...this.queryForm,
        //   orderDetailList: this.tableData,
        //   periodDateList:
        //     this.queryForm.settlementMethod == "2"
        //       ? this.$refs.Period.obj.periodDateList
        //       : [],
        //       id: null,
        // });
        // formDate.append('orderAddDTO',new Blob([detail],{type: "application/json"}))
        addSaleOrder({
          ...this.queryForm,
          orderDetailList: this.tableData.map(o => {
            return {...o, salesCertificateType: o.salesCertificateType.toString()}
          }),
          periodDateList:
            this.queryForm.settlementMethod == "2"
              ? arr
              : [],
          id: null
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
        updateSaleOrder({
          ...this.queryForm,
          orderDetailList: this.tableData.map(o => {
            return {...o, salesCertificateType: o.salesCertificateType.toString()}
          }),
          periodDateList:
            this.queryForm.settlementMethod == "2"
              ? arr
              : []
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
        amoebaRule: "",
        batchShipment: 0,
        billDate: this.$moment(new Date()).format("yyyy-MM-DD"),
        billStatus: 0,
        businessStatus: "",
        cancelCloseReason: "",
        cancelCompleteReason: "",
        checkItemNo: "",
        checkItemName: "",
        closeReason: "",
        companyId: JSON.parse(localStorage.companyIdNow).companyId,
        companyName: JSON.parse(localStorage.companyIdNow).companyName,
        completeReason: "",
        contactNumber: "",
        contacts: "",
        contactsName: "",
        contractValidity: "",
        currency: "1",
        customerServiceRemark: "",
        destinationPort: "",
        exchangeRate: 0,
        frontMoneyAmount: 0,
        insure: false,
        invoiceStatus: "",
        orderDetailList: [],
        paymentMethod: "",
        paymentStatus: "",
        periodDateList: [],
        pi: "",
        pledgeInterestRate: 0,
        pledgeRate: 0,
        receiveAddress: "",
        receiveCity: "",
        receiveCompany: "",
        receiveCompanyName: "",
        receiveDistrict: "",
        receiveProvince: "",
        receiver: "",
        receiverContact: "",
        remark: "",
        salesGroupId: "",
        salesGroupName: "",
        salesPerson: JSON.parse(localStorage.userInfoNow).userId,
        salesPersonName: JSON.parse(localStorage.userInfoNow).fullName,
        salesType: "SpotSales",
        sampleBillNo: "",
        settled: true,
        settlementMethod: "",
        shipType: "",
        shipmentLatestDate: "",
        shipmentPort: "",
        shipmentStatus: "",
        singleBargaining: 0,
        singleBargainingRemark: "",
        sourceBillNo: "",
        sourceBillType: "",
        statisticsFlag: "2",
        termsContent: "",
        totalAmount: 0,
        tradeCountry: "",
        tradeMethod: "",
        tradeType: "0",
        usable: true,
        upLoadList: [],
        ...data
      };
    },
    //添加条款
    addTerms() {
      if (!this.value) {
        this.$message.error("请选择条款");
        return;
      }
      this.queryForm.termsContent = this.value;
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
      addone(this);
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
</style>
