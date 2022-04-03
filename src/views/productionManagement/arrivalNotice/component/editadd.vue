<template>
  <div id="zPage" class="market-order-edit">
    <div class="z-header">
      <div v-if="isEdit" class="z-header-button">
        <el-button plain @click="selectOrder">选单</el-button>
        <el-button plain @click="saveData" :disabled="loading">保存</el-button>
        <el-button plain @click="cancel">取消</el-button>
      </div>
      <div v-else class="z-header-button">
        <el-button plain @click="updateStatus" :disabled="!isCanEdit"
          >编辑</el-button
        >
        <el-button plain @click="cancel">返回</el-button>
        <el-button plain @click="updateStatus">提交</el-button>
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
                    class="form form-order-box formThree"
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
              到货明细
            </span>
          </div>
          <div
            :class="[
              'z-details-content-box',
              detailsShow ? '' : 'details-height-none'
            ]"
          >
            <div v-if="isEdit" class="z-details-btn">
              <!-- <el-button size="mini" plain @click="addDetails">新增</el-button> -->
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
        <div class="z-details-content">
          <div class="z-details-icon">
            <span @click="isCancel('detailsShow', !detailsShow)">
              <i
                :class="
                  detailsShow ? 'el-icon-caret-bottom' : 'el-icon-caret-right'
                "
              ></i>
              原料使用量
            </span>
          </div>
          <div
            :class="[
              'z-details-content-box',
              detailsShow ? '' : 'details-height-none'
            ]"
          >
            <div v-if="isEdit" class="z-details-btn">
              <el-button size="mini" plain @click="addBot">新增</el-button>
              <!-- <el-button size="mini" plain @click="copyBot">复制</el-button> -->
              <el-button size="mini" plain class="delButton" @click="delBot"
                >删除</el-button
              >
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
    <SelectOrderTable
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
    <!-- <div>
            <look-up :title="look.title" :visible.sync="popConfig.show" :isClearAll="true" @setCheckItem="popSubmit" :params="look.params"  :method="look.methods" :table-column="look.tableColumn" :search-arr="look.searchArr" ></look-up>
        </div> -->
  </div>
</template>

<script>
import { checkFormData } from "@/lib/common";
import {
  getDetailList,
  addDataList,
  updateDataList
} from "@/api/marketOrder/arriveNotice.js";
import formList from "@/components/Form/formList";
import SelectOrderTable from "./selectOrderTable";
import commonTable from "@/components/CommonTable";
import AuditRecord from "./AuditRecord";
import lookUp from "@/components/ZLookUp/lookUpImport"; //lookup统一弹窗
import { addone, copyone, deleteone, tablecol, botTablecol } from "./show";
import { formone, formtwo, formThree } from "./form";
import { serachAllType } from "@/api/master/supplierFile";

import looks from "./look";
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
      default: {}
    }
  },
  data() {
    return {
      basicShow: true, //是否显示基本信息的模块
      detailsShow: true, //是否显示详情数据的模块
      isEdit: true, //是否处于编辑状态
      loading: false, //主体是否处于加载状态
      orderVisible: false, //选单的弹窗
      auditVisible: false, //审核弹窗
      activeName: "first",
      queryForm: {}, //所有的表单的数据
      topTableData: [], //融资信息表格
      tableData: [], //下面表格要显示的数据、
      botTableData: [], //原料用料表格数据
      multipleSelection: [], //下main表格选中的数据
      visible: false, //lookup展示条件
      look: {
        method: getDetailList,
        tableColumn: [],
        searchArr: [],
        params: {}
      },
      receiveType: [], //收货
      productGradeList: [] //成品等级下拉
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

          this.tableData = res.data.detailList;
          this.botTableData = res.data.materialInputList;
        })
        .catch(err => {});
    }

    // 成品等级
    serachAllType(["productGrade"]).then(res => {
      if (res.code == 0) {
        console.log(res.data);
        this.productGradeList = res.data.productGrade; //成品等级下拉
      } else {
        this.$message.error(res.msg);
      }
    });
  },

  /**
   * 加载前准备些数据 比如下拉框需要的 还有初始化界面的
   */
  created() {
    this.initFormAndTable();
    this.serachAllType();
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
    }
  },

  methods: {
    formConfigType(type) {
      let obj = {
        1: this.formOne,
        2: this.formTwo,
        3: this.formThree
      };

      return {
        inline: true,
        size: "mini",
        labelWidth: "auto",
        formItemList: obj[type]
      };
    },
    serachAllType() {
      serachAllType(["receiveType"]).then(res => {
        if (res.code == 0) {
          this.receiveType = res.data.receiveType; //运输方式下拉
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //原料使用量操作新增
    addBot() {
      let obj = {};
      this.botTableData.push(obj);
    },
    copyBot() {},
    delBot() {},
    // 选单数据
    selectTable(a) {
      console.log(a);
      if (!this.tableData.length && a.length == 1) {
        this.queryForm.checkItemName = a[0].checkItemName; //加工商名
        this.queryForm.checkItemId = a[0].checkItemId;

        this.tableData = a.map(item => {
          return {
            ...item,
            saleOrderNo: item.orderNo,
            sourceNo: item.materialName,
            sourceType: item.materialDescribe,
            followMan: item.follower,
            salesMan: item.salesman,
            unit: item.unit,
            materialNo: item.materialNo,
            materialName: item.materialName,
            materialDescribe: item.materialDescribe,
            processLossRate: item.processLossRate,
            factLossRate: item.factLossRate
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
          saleOrderNo: item.orderNo,
          sourceNo: item.materialName,
          sourceType: item.materialDescribe,
          followMan: item.follower,
          salesMan: item.salesman,
          unit: item.unit,
          materialNo: item.materialNo,
          materialName: item.materialName,
          materialDescribe: item.materialDescribe,
          processLossRate: item.processLossRate,
          factLossRate: item.factLossRate
        };
      });
      if (!this.tableData.length && a.length > 1) {
        let c = b[0];
        let flag = false;
        this.queryForm.sourceBillNo = c.sourceBillNo;
        this.queryForm.sourceBillType = c.sourceBillType;
        this.queryForm.outsourceNo = c.billNo;
        this.queryForm.orderNo = c.orderNo;
        // this.queryForm.outsourceNo = a.hdrId;

        this.queryForm.productionTaskNo = c.produceTaskId;
        b.forEach(item => {
          if (item.checkItemId == c.checkItemId) {//判断客商相同
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
    //lookup
    setCheckItem(val) {
      if (this.look.type == "checkItemName") {
        if (Array.isArray(val)) {
          this.queryForm.arrivalCompanyName = val[0].companyName;
          this.queryForm.checkItemId = val[0].checkItemId;

          this.queryForm.receiveDistrict = val[0].address;
          this.queryForm.receiveAddress = val[0].addressDtl;
          this.queryForm.checkItemName = val[0].checkItemName;

          // this.queryForm.contactsName = val[0].contactName;
          this.queryForm.contact = val[0].contactName;

          this.queryForm.contactTel = val[0].contactPhoneNumber;
        } else {
          this.queryForm.arrivalCompanyName = val.companyName;
          this.queryForm.checkItemId = val.checkItemId;

          this.queryForm.receiveDistrict = val.address;
          this.queryForm.receiveAddress = val.addressDtl;
          this.queryForm.checkItemName = val.checkItemName;

          // this.queryForm.contactsName = val.contactName;
          this.queryForm.contact = val.contactName;

          this.queryForm.contactTel = val.contactPhoneNumber;
          // this.checkItemId = val.id;
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
    selectLook(val) {
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
      let obj = [...this.formOne, ...this.formTwo, ...this.formThree];
      if (!checkFormData(obj, this.queryForm)) {
        return;
      }

      let bool = true,
        title = "";

      this.tableColumn.forEach(item => {
        if (item.config && item.config.custormRules) {
          this.tableData.forEach((value, key) => {
            value.orderNumber = key + 1;
            if (!value[item.config.key] && value[item.config.key] !== 0) {
              bool = false;
              title =
                "第" + (key + 1) + "行" + item.config.custormRules.message;
            } else if (item.config.key === "deliveryDate") {
              if (
                new Date(value[item.config.key]).getTime() <
                new Date(this.queryForm.billDate).getTime()
              ) {
                bool = false;
                title = "第" + (key + 1) + "行销售交期不能小于订单日期";
              }
            }
          });
        }
      });

      if (!bool) {
        this.$message.error(title);
        return;
      }
      /* 
      this.botTableData = this.botTableData.map(item => {
        return {
          feedQty: item.feedQty || "12",
          materialDescribe: item.materialDescribe || "12",
          materialId: item.materialId || "12",
          materialLot: item.materialLot || "12",
          materialName: item.materialName || "12",
          materialNo: item.materialNo || "12",
          unit: item.unit || "12",
          usedQty: item.usedQty || "12"
        };
      }); */
      this.botTableData = [
        {
          id: 12,
          feedQty: "12",
          materialDescribe: "12",
          materialId: "12",
          materialLot: "12",
          materialName: "12",
          materialNo: "12",
          unit: "12",
          usedQty: "12"
        }
      ];
      console.log(this.botTableData);
      let params = {
        id: this.currentData.id || "",
        ...this.queryForm,
        warehouseId: "12", //仓库没接接口
        detailList: this.tableData,
        materialInputList: this.botTableData
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
        updateDataList(params)
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
        approvalReason: "",
        approvalTime: "",
        arrivalCompanyName: "",
        arrivalDate: "",
        billNo: "",
        billStatus: "",
        billStatusName: "",
        checkItemId: "",
        checkItemName: "",
        checkItemUserName: "",
        contact: "",
        contactTel: "",
        createTime: "",
        createUser: "",
        createUserFullName: "",
        deApprovalReason: "",
        detailList: [],
        fileList: [],
        inspectionFree: false,
        materialInputList: [],
        receiveAddress: "",
        receiveDistrict: "",
        receiveType: "",
        receiveTypeName: "",
        remark: "",
        stock: false,
        updateTime: "",
        updateUser: "",
        updateUserFullName: "",
        usable: true,
        warehouseId: "",
        warehouseName: "",
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
