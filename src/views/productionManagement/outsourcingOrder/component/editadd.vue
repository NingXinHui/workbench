<template>
  <div id="zPage" class="market-order-edit">
    <div class="z-header">
      <div v-if="isEdit" class="z-header-button">
        <el-button plain @click="selectOrder" v-show="!currentData.id"
          >选单</el-button
        >
        <el-button plain @click="saveData" :disabled="loading">保存</el-button>
        <el-button plain @click="cancel">取消</el-button>
        <el-button v-if="operateType != 'add'" @click="() => uploadFile()"
          >附件</el-button
        >
      </div>
      <div v-else class="z-header-button">
        <el-button plain @click="updateStatus" :disabled="!isCanEdit"
          >编辑</el-button
        >
        <el-button plain @click="cancel">返回</el-button>
        <el-button plain @click="SetOrRetrun('set')">生产投料</el-button>
        <el-button plain @click="SetOrRetrun('return')">生产退料</el-button>
        <el-button plain @click="updateStatus">提交</el-button>
        <el-button plain @click="auditVisible = true">审核记录</el-button>
        <el-button v-if="operateType != 'add'" @click="() => uploadFile()"
          >附件</el-button
        >
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
                <el-tab-pane label="财务信息" name="four">
                  <form-list
                    v-model="queryForm"
                    :formConfig="formConfigType(4)"
                    class="form form-order-box"
                  ></form-list>
                  <Period
                    ref="Period"
                    :selectRow="queryForm.accountPeriodDateList"
                    :disabled="!isEdit"
                    v-if="queryForm.settlementType == '2'"
                  />
                </el-tab-pane>

                <el-tab-pane label="质量要求" name="second">
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
              产品信息
            </span>
          </div>
          <div
            :class="[
              'z-details-content-box',
              detailsShow ? '' : 'details-height-none'
            ]"
          >
            <div v-if="isEdit" class="z-details-btn">
              <!-- <el-button size="mini" plain @click="addDetails">新增</el-button>
              <el-button size="mini" plain @click="copyDetails">复制</el-button>
              <el-button
                size="mini"
                plain
                class="delButton"
                @click="deleteDetails"
                >删除</el-button
              > -->
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
        <div class="z-details-content">
          <div class="z-details-icon">
            <span @click="isCancel('materialShow', !materialShow)">
              <i
                :class="
                  materialShow ? 'el-icon-caret-bottom' : 'el-icon-caret-right'
                "
              ></i>
              投料信息
            </span>
          </div>
          <div
            :class="[
              'z-details-content-box',
              materialShow ? '' : 'details-height-none'
            ]"
          >
            <div v-if="isEdit" class="z-details-btn">
              <!--   <el-button size="mini" plain @click="addBot">新增</el-button>
              <el-button size="mini" plain @click="copyBot">复制</el-button>
              <el-button size="mini" plain class="delButton" @click="delBot"
                >删除</el-button
              > -->
              <el-button size="mini" plain @click="copyBot">可用库存</el-button>
            </div>
            <div class="z-content-table">
              <common-table
                :class="{ zTable: isEdit }"
                ref="mainTable"
                :isSelectMore="true"
                :isSelection="true"
                :tableColumn="botTableColumn"
                :tableData="botTableData"
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
    <OperationTable
      v-if="operationVisible"
      :operationVisible.sync="operationVisible"
      :operationTitle="operationTitle"
    ></OperationTable>
    <SelectOrderTable
      v-if="orderVisible"
      :orderVisible.sync="orderVisible"
      @selectTable="selectTable"
    ></SelectOrderTable>
    <look-up
      ref="lookup"
      v-if="visible"
      :visible.sync="visible"
      @setCheckItem="setCheckItem"
      :method="look.method"
      :table-column="look.tableColumn"
      :search-arr="look.searchArr"
      :params="look.params"
    ></look-up>
    <div v-if="openmodal">
      <open-modal
        :billId="queryForm.id"
        billType="OUTSOURCE_ORDER"
        @closeModal="
          value => {
            this.openmodal = false;
          }
        "
      />
    </div>
    <!-- <div>
            <look-up :title="look.title" :visible.sync="popConfig.show" :isClearAll="true" @setCheckItem="popSubmit" :params="look.params"  :method="look.methods" :table-column="look.tableColumn" :search-arr="look.searchArr" ></look-up>
        </div> -->
  </div>
</template>

<script>
import {
  getDetailList,
  getOrderDetailList,
  dictList,
  addDataList,
  updateDataList,
  deleteData
} from "@/api/marketOrder/outsourcing.js";
import OpenModal from "@/components/commonUpload";

import { checkFormData } from "@/lib/common";

import formList from "@/components/Form/formList";
import SelectOrderTable from "./selectOrderTable";
import commonTable from "@/components/CommonTable";
import OperationTable from "./operationTable";
import AuditRecord from "./AuditRecord";
import lookUp from "@/components/ZLookUp/lookUpImport"; //lookup统一弹窗
import { addone, copyone, deleteone, tablecol, botTablecol } from "./show";
import { formone, formtwo, formThree, formFour } from "./form";
import looks from "./look";
import { getDepartmentList } from "@/api/marketOrder";
import Period from "./period"; //选择账期的组件

export default {
  name: "Menuceng",
  components: {
    formList,
    commonTable,
    SelectOrderTable,
    lookUp,
    AuditRecord,
    OperationTable,
    Period,
    OpenModal
  },
  props: {
    operateType: {
      type: String,
      default: "edit"
    },
    currentData: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      basicShow: true, //是否显示基本信息的模块
      detailsShow: true, //是否显示详情数据的模块
      materialShow: true, //是否显示投料信息的模块
      isEdit: true, //是否处于编辑状态
      loading: false, //主体是否处于加载状态
      orderVisible: false, //选单的弹窗
      auditVisible: false, //审核弹窗
      activeName: "first",
      queryForm: {}, //所有的表单的数据
      botTableData: [], //投料信息表格
      tableData: [], //下面表格要显示的数据、
      multipleSelection: [], //下main表格选中的数据
      visible: false, //lookup展示条件
      operationVisible: false, //展示投料或者退料
      operationTitle: "",
      look: {
        method: getDepartmentList,
        tableColumn: [],
        searchArr: [],
        params: {}
      },
      processTypeList: [], //加工类型下拉
      settleTypeList: [], //结算方式的下拉
      paymentTypeList: [], //支付方式的下拉
      unitIdentyList: [] //统计标识下拉
    };
  },

  mounted() {
    if (this.operateType == "details") {
      this.isEdit = false;
    }

    if (this.operateType == "edit" || this.operateType == "details") {
      let id = this.currentData.id;
      getDetailList(id)
        .then(res => {
          this.initFormAndTable(res.data);

          this.botTableData = res.data.feedList;
          this.tableData = res.data.productList;
        })
        .catch(err => {});
    }
    // 加工类型的下拉
    dictList("outsourcingOrderType").then(res => {
      if (res.success) {
        this.processTypeList = res.data;
      }
    });
    // 结算方式
    dictList("settlementType").then(res => {
      if (res.success) {
        this.settleTypeList = res.data;
      }
    });
    // 支付方式的下拉
    dictList("paymentTypes").then(res => {
      if (res.success) {
        this.paymentTypeList = res.data;
      }
    });
    // 统计标识unitIdenty
    dictList("unifiedIdentification").then(res => {
      if (res.success) {
        this.unitIdentyList = res.data;
      }
    });
  },

  /**
   * 加载前准备些数据 比如下拉框需要的 还有初始化界面的
   */
  created() {
    this.initFormAndTable();
  },

  /**
   * @desc 存储一些数据变化需要页面更新的 比如searchArr  table的
   */
  computed: {
    tableColumn() {
      let isEdit = this.isEdit;
      return tablecol(this, isEdit);
    },
    botTableColumn() {
      let isEdit = this.isEdit;
      return botTablecol(this, isEdit);
    },
    formOne() {
      return formone(this, !this.isEdit);
    },
    formTwo() {
      return formtwo(this, !this.isEdit);
    },
    formThree() {
      return formThree(this, !this.isEdit);
    },
    formFour() {
      return formFour(this, !this.isEdit);
    }
  },

  methods: {
    uploadFile() {
      if (!this.queryForm.id) return;
      this.openmodal = true;
    },
    formConfigType(type) {
      let obj = {
        1: this.formOne,
        2: this.formTwo,
        3: this.formThree,
        4: this.formFour
      };

      return {
        inline: true,
        size: "mini",
        labelWidth: "auto",
        formItemList: obj[type]
      };
    },
    //退料或者投料弹窗
    SetOrRetrun(val) {
      this.operationTitle = val == "return" ? "生产退料" : "生产投料";
      this.operationVisible = true;
    },
    //lookup
    setCheckItem(val) {
      if (!val) {
        return;
      }
      if (this.look.type == "checkItemName") {
        if (Array.isArray(val)) {
          this.queryForm.checkItemId = val[0].id;
          this.queryForm.checkItemName = val[0].checkItemName;
        } else {
          this.queryForm.checkItemId = val.id;
          this.queryForm.checkItemName = val.checkItemName;
        }
      } else if (this.look.type == "checkUserName") {
        if (Array.isArray(val)) {
          this.queryForm.checkItemUserId = val[0].id;
          this.queryForm.checkItemUserName = val[0].contactName;
        } else {
          this.queryForm.checkItemUserId = val.id;
          this.queryForm.checkItemUserName = val.contactName;
        }
      }
    },
    //上方勾选
    handleTopSelectionChange(val) {},
    //选单
    selectOrder() {
      this.orderVisible = true;
    },
    // 选单数据
    selectTable(a) {
      if (a.length == 1) {
        getOrderDetailList(a[0].id).then(res => {
          if (res.success) {
            console.log(res.data.sourceBillNo);
            this.queryForm.sourceNo = res.data.sourceBillNo || "1212121"; //来源单号
            this.queryForm.sourceType = res.data.sourceBillType || "1212121"; //源单类型
            this.queryForm.salesman = res.data.productionManName || "1212121";

            this.queryForm.department = res.data.productionDepartmentName;
            this.queryForm.companyName = res.data.companyName || "1212121";

            this.queryForm.deliveryDate = res.data.deliveryDate || "1212121";

            this.queryForm.businessStatus =
              res.data.businessStatusName || "1212121";

            this.queryForm.checkBillName =
              res.data.documentaryFlowName || "1212121";
            this.queryForm.checkBillId = res.data.documentaryFlow || "1212121";

            this.queryForm.gramWeight = res.data.gramWeight;
            this.queryForm.widthCloth = res.data.width;
            this.queryForm.forceful = res.data.strength;
            this.queryForm.frosting = res.data.brushed;
            this.queryForm.color = res.data.color;
            this.queryForm.printType = res.data.dyeingType;
            this.queryForm.purpose = res.data.purpose;

            this.queryForm.qualityCheckBillId =
              res.data.qualityCheckBillId || "1";
            this.queryForm.qualityCheckBillType =
              res.data.qualityCheckBillType || "1";
            // 以下数据写死是因为prd没带
            this.queryForm.orderAmount = 121; //订单金额
            // this.queryForm.applicantName = 12122; //申请人
            this.queryForm.applicant = 1212121;

            this.queryForm.telephone = 139922222222; //联系电话
            this.queryForm.orderNo = 1212121; //关联销售订单号
            // this.queryForm.billNo = "qwe11111111"; //委外加工单号

            this.tableData = res.data.productionTaskDetailVOList;
            this.botTableData = res.data.productionTaskInputVOList.map(item => {
              return {
                ...item,
                lossRate: item.lossRate,
                processCost: item.processCost,
                produceTaskId: item.produceTaskId,
                materialId: item.materialId
              };
            });
          }
        });

        // this.idList.push(a[0].materialId);
      }
    },
    //投料信息新增
    addBot() {
      let obj = {};
      this.botTableData.push(obj);
    },
    copyBot() {},
    delBot() {},
    //lookup弹窗
    selectLook(val) {
      if (val == "checkUserName" && !this.queryForm.checkItemName) {
        this.$message.error("请先选择加工商名称!!!");
        return;
      }
      if (val == "checkItemName") {
        this.look = looks[val];

        this.look.params = {
          userId: this.queryForm.productionManId
        };
      } else if (val == "checkUserName") {
        this.look = looks[val];

        this.look.params = {
          userId: this.queryForm.productionManId
        };
      }
      this.look = looks[val];
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
      let obj = [...this.formOne, ...this.formTwo, ...formThree, ...formFour];

      if (!checkFormData(obj, this.queryForm)) {
        return;
      }
      console.log(this.tableData);

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
      this.tableData = this.tableData.map(item => {
        return {
          follower: item.follower || "121",
          keepSample: item.keepSample || true,
          lossRate: item.lossRate || "121",
          materialDescribe: item.materialDescribe || "121",
          materialId: item.materialId || "121",
          materialName: item.materialName || "121",
          materialNo: item.materialNo || "121",
          processCost: item.processCost || "121",
          processRequire: item.processRequire || "121",
          produceTaskId: item.produceTaskId || "121",
          qty: item.qty || "121",
          unit: item.unit || "121"
        };
      });
      this.botTableData = this.botTableData.map(item => {
        return {
          materialNo: item.materialNo || "121",
          materialName: item.materialName || "11",
          materialDescribe: item.materialDescribe || "11",
          purchaser: item.purchaser || "11",
          purchaseCompany: item.purchaseCompany || "11",
          lossRate: item.lossRate,
          processCost: item.processCost,
          produceTaskId: item.produceTaskId,
          materialId: item.materialId
        };
      });
      let params = {
        id: this.currentData.id || null,
        ...this.queryForm,
        paymentType: 2, //支付方式
        productList: this.tableData,
        productListJson: JSON.stringify(this.tableData),
        feedList: this.botTableData,
        feedListJson: JSON.stringify(this.botTableData),
        accountPeriodDateList:
          this.queryForm.settlementType == "2"
            ? this.$refs.Period.obj.periodDateList
            : [],
        id: null
      };

      console.log(params);

      if (this.operateType === "add" || this.operateType == "copy") {
        addDataList(params)
          .then(res => {
            console.log(res);
            this.$message.success("操作成功");
            this.loading = false;
            this.$emit("submit");
          })
          .catch(() => {
            this.loading = false;
          });
      } else {
        updateDataList({
          ...this.queryForm,
          productList: this.tableData,
          feedList: this.botTableData,
          accountPeriodDateList:
            this.queryForm.settlementType == "2"
              ? this.$refs.Period.obj.periodDateList
              : []
        })
          .then(res => {
            // console.log(res);
            this.$message.success("操作成功");
            this.loading = false;
            this.$emit("submit");
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
        typeName: "",
        upLoadList: [
          { value: "上传文件1.doc" },
          { value: "物料文档10.excel" },
          { value: "人员名单.ppt" }
        ],
        accountPeriodDateList: [], //账期
        amoebaRule: "",
        applicant: "",
        applicantName: "",
        approvalReason: "",
        approvalTime: "",
        billNo: "",
        billStatus: "",
        businessStatus: "",
        businessType: "1", //生产业务
        cancelCloseReason: "",
        cancelCompleteReason: "",
        checkBillId: "",
        checkBillName: "",
        checkItemId: "",
        checkItemName: "",
        checkItemUserId: "",
        checkItemUserName: "",
        closeReason: "",
        color: "",
        companyName: "",
        completeReason: "",
        contractArchiving: true,
        createTime: "",
        createUser: "",
        createUserFullName: "",
        currency: "",
        deApprovalReason: "",
        deliveryDate: "",
        department: "",
        departmentName: "",
        depositAmount: "",
        feedList: [],
        feedStatus: "",
        forceful: "",
        frosting: "",
        gramWeight: "",
        id: "",
        invoiceStatus: "",
        orderAmount: "",
        orderNo: "",
        paymentStatus: "",
        paymentType: "",
        printType: "",
        processType: "",
        productList: [],
        purpose: "",
        qualityCheckBillId: "",
        qualityCheckBillType: "",
        receiveStatus: "",
        remark: "",
        repair: true,
        salesman: "",
        settlementType: "",
        ...data
      };
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
</style>
