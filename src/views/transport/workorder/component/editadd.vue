<!--
@time:2022/1/10
@author:shaoliting 
-->
<template>
  <div id="zPage" class="market-order-edit">
    <div class="z-header">
      <div v-if="isEdit" class="z-header-button">
        <el-button plain @click="saveData" :disabled="loading">保存</el-button>
        <el-button plain @click="cancel">取消</el-button>
      </div>
      <div v-else class="z-header-button">
        <el-button plain @click="updateStatus">编辑</el-button>
        <el-button plain @click="cancel">返回</el-button>
        <el-button plain @click="submit">提交</el-button>
        <el-button plain @click="auditVisible = true">审核记录</el-button>
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
                    class="form form-order-box formOne"
                  ></form-list>
                </el-tab-pane>
                <el-tab-pane label="费用信息" name="second">
                  <form-list
                    v-model="queryForm"
                    :formConfig="formConfigType(2)"
                    class="form form-order-box"
                  ></form-list>
                  <!-- 需要改 -->
                  <div>
                         <div v-if="isEdit" class="z-details-btn">
              <!-- <el-button size="mini" plain @click="copyDetails">复制</el-button> -->
                <el-button size="mini" plain @click="copyDetails">新增</el-button>
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
                  :tableColumn="tablecolumnMoneyList"
                  :tableData="tableData"
                  @selePage="handleSelectionChange"
                  :tableheight="150"
                  :isMain="true"
                ></common-table>
              </div>
                  </div>
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
              运输明细
            </span>
          </div>
          <div
          style="padding-left:24px"
            :class="[
              'z-details-content-box',
              detailsShow ? '' : 'details-height-none'
            ]"
          >
            <div v-if="isEdit" class="z-details-btn">
              <!-- <el-button size="mini" plain @click="copyDetails">复制</el-button> -->
               <el-button size="mini" plain @click="copyDetails">新增</el-button>
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

        <div class="z-details-content">
          <div class="z-details-icon">
            <span @click="isCancel('feedbackShow', !feedbackShow)">
              <i
                :class="
                  feedbackShow ? 'el-icon-caret-bottom' : 'el-icon-caret-right'
                "
              ></i>
              评价反馈
            </span>
          </div>
          <div
          style="padding-left:24px"
            :class="[
              'z-details-content-box',
              feedbackShow ? '' : 'details-height-none'
            ]"
          >
            <form-list
                  v-model="queryForm"
                  :formConfig="formConfigType(4)"
                  class="form form-order-box"
                >
                </form-list>
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
        <look-up ref="lookup"
      :visible.sync="lookVisible" :isSelectMore="true" @setCheckItem="setCheckItem" :method="look.method" :table-column="look.tableColumn" :search-arr="look.searchArr" :params="look.params" ></look-up>  
  </div>
</template>

<script>
import formList from "@/components/Form/formList";
import SelectOrderTable from "./selectOrderTable";
import commonTable from "@/components/CommonTable";
import AuditRecord from "./AuditRecord";
import lookUp from "@/components/ZLookUp/lookUpImport"; //lookup统一弹窗
import { addone, copyone, deleteone, tablecol, tablecolMoneyList} from "./show";
import { formone, formtwo, formThree, formFore } from "./form";
import { serachAllType } from "@/api/master/supplierFile";
import {
  addNotice,
  updateNotice,
  searchNotice,
  submitNotice
} from "@/api/purchase/notice";
import looks from "./look";
import { checkFormData } from "@/lib/common";
export default {
  name: "Menuceng",
  components: { formList, commonTable, SelectOrderTable, lookUp, AuditRecord },
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
      lookVisible:false, //基础信息的客户名称look显示控制
      basicShow: true, //是否显示基本信息的模块
      detailsShow: true, //是否显示详情数据的模块
      feedbackShow: true, // 是否显示评价反馈
      isEdit: true, //是否处于编辑状态
      loading: false, //主体是否处于加载状态
      orderVisible: false, //选单的弹窗
      auditVisible: false, //审核弹窗
      activeName: "first",
      queryForm: {}, //所有的表单的数据
      topTableData: [], //融资信息表格
      tableData: [], //下面表格要显示的数据、
      multipleSelection: [], //下main表格选中的数据
      visible: false, //lookup展示条件
      receiveType: [], //收货方式下拉
      look: {
        method: "",
        tableColumn: [],
        searchArr: [],
        params: {}
      }
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
    tablecolumnMoneyList() {
      let isEdit = this.isEdit;
      return tablecolMoneyList(this, isEdit);
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
    formFore() {
      return formFore(this, !this.isEdit);
    }
  },

  methods: {
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
      submitNotice({
        ids: this.queryForm.id
      }).then(res => {
        if (res.code == 0) {
          this.$message.success("操作成功");
          this.loading = false;
          this.$emit("submit");
        }
      });
    },
    init() {
      searchNotice({
        id: this.currentData.id
      }).then(res => {
        if (res.code == 0) {
          this.initFormAndTable(res.data);
          this.tableData = res.data.detailList.map((item, i) => {
            return { ...item, isIndex: i };
          });
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //查询所有的词典下拉
    serachAllType() {
      serachAllType(["receiveType"]).then(res => {
        if (res.code == 0) {
          this.receiveType = res.data.receiveType; //收货方式下拉
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    formConfigType(type) {
      let obj = {
        1: this.formOne,
        2: this.formTwo,
        3: this.formThree,
        4: this.formFore,
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
      if (this.look.type == "supplier") {
        if (Array.isArray(val)) {
          this.queryForm.supplierId = val[0].id;
          this.queryForm.supplierName = val[0].checkItemName;
          this.queryForm.supplierCode = val[0].checkItemNo;
        } else {
          this.queryForm.supplierId = val.id;
          this.queryForm.supplierName = val.checkItemName;
          this.queryForm.supplierCode = val.checkItemNo;
        }
      } else if (this.look.type == "company") {
        if (Array.isArray(val)) {
          this.queryForm.transportId = val[0].id;
          this.queryForm.transportName = val[0].checkItemName;
        } else {
          this.queryForm.transportId = val.id;
          this.queryForm.transportName = val.checkItemName;
        }
      } else if (this.look.type == "companyName") {
        if (Array.isArray(val)) {
          this.queryForm.companyId = this.queryForm.supplierId;
          this.queryForm.contact = val[0].id;
          this.queryForm.companyName = val[0].companyName;
          this.queryForm.contactName = val[0].contactName;
          this.queryForm.contactTel = val[0].contactPhoneNumber;
          this.queryForm.receiveDistrict = val[0].address;
          this.queryForm.receiveAddress = val[0].addressDtl;
        } else {
          this.queryForm.companyId = this.queryForm.supplierId;
          this.queryForm.contact = val.id;
          this.queryForm.companyName = val.companyName;
          this.queryForm.contactName = val.contactName;
          this.queryForm.contactTel = val.contactPhoneNumber;
          this.queryForm.receiveDistrict = val.address;
          this.queryForm.receiveAddress = val.addressDtl;
        }
      }
    },
    //选单
    selectOrder() {
      this.orderVisible = true;
    },
    selectTable(a) {
      if (!this.tableData.length && a.length == 1) {
        this.queryForm.buyerId = a[0].purchaser;
        this.queryForm.buyerName = a[0].purchaserName;
        this.queryForm.departmentId = a[0].purchaseGroup;
        this.queryForm.departmentName = a[0].purchaseGroupName;
        this.queryForm.exchangeRate = a[0].contractExchangeRate;
        this.tableData = a.map(item => {
          return {
            ...item,
            arrivalQty: item.qty,
            unit:"",
          };
        });
        this.tableData = this.tableData.map((i, r) => {
          return { ...i, isIndex: r };
        });
        return;
      }
      let b = a.map(item => {
        return {
          ...item,
          arrivalQty: item.qty,
        };
      });
      if (!this.tableData.length && a.length > 1) {
        let a = b[0];
        let flag = false;
        this.queryForm.buyerId = a.purchaser;
        this.queryForm.buyerName = a.purchaserName;
        this.queryForm.departmentId = a.purchaseGroup;
        this.queryForm.departmentName = a.purchaseGroupName;
        this.queryForm.exchangeRate = a.contractExchangeRate;
        b.forEach(item => {
          if (item.billNo == a.billNo) {
            this.tableData.push(item);
          } else {
            flag = true;
          }
        });
        this.tableData = this.tableData.map((i, r) => {
          return { ...i, isIndex: r };
        });
        if (flag) {
          this.$message.error("选单数据只能选择同一条订单的明细");
        }
        return;
      }
      if (this.tableData.length) {
        let a = this.tableData[0];
        let flag = false;
        b.forEach(item => {
          if (item.billNo == a.billNo) {
            this.tableData.push(item);
          } else {
            flag = true;
          }
        });
        this.tableData = this.tableData.map((i, r) => {
          return { ...i, isIndex: r };
        });
        if (flag) {
          this.$message.error("选单数据只能选择同一条订单的明细");
        }
        return;
      }
    },
    //lookup弹窗
    selectLook(val) {
      if (val == "companyName" && !this.queryForm.supplierName) {
        this.$message.error("请先选择供应商!!!");
        return;
      }
      this.look = looks[val];
      this.look.params =
        val == "companyName"
          ? { checkItemNo: this.queryForm.supplierCode }
          : this.look.params;
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
      let obj = [...this.formOne, ...this.formTwo, ...this.formThree,...this.formFore];
      if (!checkFormData(obj, this.queryForm)) {
        return;
      }
      this.loading = true;
      if (this.operateType == "add") {
        addNotice({
          ...this.queryForm,
          detailList: this.tableData
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
        updateNotice({
          ...this.queryForm,
          detailList: this.tableData
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
        arrivalDate: "",
        billNo: "",
        billStatus: 0,
        businessStatus: 0,
        buyerId: "",
        cancelCloseReason: "",
        cancelCompleteReason: "",
        closeReason: "",
        companyId: "",
        completeReason: "",
        contact: "",
        contactTel: "",
        departmentId: "",
        detailList: [],
        exchangeRate: 0,
        fileId: "",
        fileUrl: "",
        freight: "",
        inspectionFree: true,
        isStock: true,
        receiveAddress: "",
        receiveCity: "",
        receiveDistrict: "",
        receiveProvince: "",
        receiveType: "",
        remark: "",
        supplierCode: "",
        supplierId: "",
        supplierName: "",
        transportId: "",
        usable: true,
        warehouseId: "",
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
    },
  }
};
</script>

<style lang="less" scoped>
.tips {
}
.formOne {
  ::v-deep .el-form-item:nth-child(4) {
  //  width: 265px !important;
    .el-radio__label {
      font-size: 12px !important;
    }
  }
}
.formThree {
  ::v-deep .el-form-item:nth-child(1) {
     width: 265px !important;
    .el-radio__label {
      font-size: 12px !important;
    }
  }
}
.form-upload{
  width: auto!important;
}
</style>
