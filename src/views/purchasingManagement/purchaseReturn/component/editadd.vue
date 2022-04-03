<template>
  <div id="zPage" class="market-order-edit">
    <div class="z-header">
      <div v-if="isEdit" class="z-header-button">
        <el-button plain @click="selectOrder" v-show="!currentData.id"
          >选单</el-button
        >
        <el-button plain @click="saveData" :disabled="loading">保存</el-button>
        <el-button plain @click="cancel">取消</el-button>
         <el-button v-if="operateType!='add'" @click="() => uploadFile()">附件</el-button>
      </div>
      <div v-else class="z-header-button">
        <el-button plain @click="updateStatus" v-if="this.queryForm.billStatus==0">编辑</el-button>
        <el-button plain @click="cancel">返回</el-button>
        <el-button plain @click="updateSubmit" v-if="this.queryForm.billStatus==0">提交</el-button>
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
                    class="form form-order-box formOne"
                  ></form-list>
                </el-tab-pane>
                <el-tab-pane label="退货信息" name="three">
                  <form-list
                    v-model="queryForm"
                    :formConfig="formConfigType(3)"
                    class="form form-order-box"
                  ></form-list>
                </el-tab-pane>
                <el-tab-pane label="其他信息" name="second">
                  <form-list
                    v-model="queryForm"
                    :formConfig="formConfigType(2)"
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
      </el-card>
    </div>
    <AuditRecord :auditVisible.sync="auditVisible"></AuditRecord>

    <SelectOrderTable
      v-if="orderVisible"
      :orderVisible.sync="orderVisible"
      @selectTable="selectTable"
    ></SelectOrderTable>
    <look-up
      ref="lookup"
      v-if="visible"
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
        <open-modal :billId="queryForm.id" billType="PURCHASE_RETURN" @closeModal="(value)=>{this.openmodal=false}" />
      </div>
  </div>
</template>

<script>
import { checkFormData } from "@/lib/common";

import formList from "@/components/Form/formList";
import SelectOrderTable from "./selectOrderTable";
import commonTable from "@/components/CommonTable";
import AuditRecord from "./AuditRecord";
import OpenModal from '@/components/commonUpload';
import lookUp from "@/components/ZLookUp/lookUpImport"; //lookup统一弹窗
import { addone, copyone, deleteone, tablecol } from "./show";
import { formone, formThree, formTwo } from "./form";
import looks from "./look";
import { serachAllType } from "@/api/master/supplierFile";
import { getDataList } from "@/api/marketOrder";

import {
  getSinglList,
  updateList,
  addSinglList,
  getChooseData,
  detailSubmit
} from "@/api/marketOrder/puchaseReturn.js";
export default {
  name: "Menuceng",
  components: { formList, commonTable, SelectOrderTable, lookUp, AuditRecord,OpenModal },
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
      multipleSelection: [], //下main表格选中的数据
      visible: false, //lookup展示条件
      look: {
        method: getDataList,
        tableColumn: [],
        searchArr: [],
        params: {}
      },
      selectId: "", //选中的申请人的id
      checkItemId: "", //选中的单位的id
      applicantId: "", //选中的申请人的id
      receiveType: [] ,//运输方式下拉,
      isTheEdit:true,//定义的编辑

    };
  },

  mounted() {
    if (this.operateType == "details") {
      this.isEdit = false;
      // this.isTheEdit=false
    }

    if (this.operateType == "edit") {
      this.isTheEdit =false;
    }
    // 点击的单条数据进行渲染
    if (this.operateType == "edit" || this.operateType == "details") {
      let id = this.currentData.id;
      getSinglList(id)
        .then(res => {
          if (res.success) {
            // console.log(res);
            // console.log(this.queryForm);
            res.data.planReturnTime = res.data.planReturnTime ? res.data.planReturnTime.substring(0,10) : ""
            this.initFormAndTable(res.data);
            this.queryForm.checkItemId = res.data.checkItemId.toString();
            this.queryForm.deliveryType = res.data.deliveryType.toString();

            this.tableData = res.data.detailList;
          }
        })
        .catch(err => {});
    }
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
    formOne() {
      return formone(this, !this.isEdit);
    },

    formTwo() {
      return formTwo(this, !this.isEdit);
    },
    formThree() {
      return formThree(this, !this.isEdit);
    }
  },

  methods: {
    //查看文件
    uploadFile() {
      if(!this.queryForm.id) return;
      this.openmodal=true;
    },
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
    // 详情页的提交
    updateSubmit() {
      if (this.queryForm.billStatus != 0) {
        this.$message.error("当前状态不能提交审核");
        return;
      }

      this.loading = true;
      detailSubmit({
        ids: this.queryForm.id
      })
        .then(res => {
          if (res.code == 0) {
            this.$message.success("操作成功");
            this.loading = false;
            this.$emit("submit");
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    updateStatus() {
      if (this.queryForm.billStatus != 0) {
        this.$message.error("当前状态不能编辑");
        return;
      }
      this.isEdit = !this.isEdit;
    },
    //lookup
    setCheckItem(val) {
      // lookup的勾选
      console.log(val);
      if (this.look.type == "applyMan") {
        if (Array.isArray(val)) {
          this.queryForm.applicantName = val[0].fullName;
          this.queryForm.applicantId = val[0].id;
          // this.selectId = val[0].id;
        } else {
          this.queryForm.applicantName = val.fullName;
          // this.selectId = val.id;
          this.queryForm.applicantId = val.id;
        }
      } else if (this.look.type == "checkItemName") {
        if (Array.isArray(val)) {
          this.queryForm.checkItemName = val[0].checkItemName;
          this.queryForm.addressArea = val[0].address;
          this.queryForm.detailAddress = val[0].addressDtl;
          this.queryForm.contactsName = val[0].contactName;
          this.queryForm.contacts = val[0].contactName;

          this.queryForm.telephone = val[0].contactPhoneNumber;
          // this.checkItemId = val[0].id;
          this.queryForm.checkItemId = val[0].checkItemId;
        } else {
          this.queryForm.addressArea = val.address;
          this.queryForm.detailAddress = val.addressDtl;
          this.queryForm.contactsName = val.contactName;
          this.queryForm.contacts = val.contactName;
          this.queryForm.telephone = val.contactPhoneNumber;
          this.queryForm.checkItemName = val.checkItemName;
          this.queryForm.checkItemId = val.checkItemId;

          // this.checkItemId = val.id;
        }
      }
    },
    // 词典
    serachAllType() {
      serachAllType(["receiveType"]).then(res => {
        if (res.code == 0) {
          this.receiveType = res.data.receiveType; //运输方式下拉
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    selectTable(a) {
      console.log(a);
      if (!this.tableData.length && a.length == 1) {
        this.queryForm.billNo = a[0].billNo;
        // this.queryForm.saleOrderNo=a[0]//关联销售单号
        this.queryForm.sourceBillNo = a[0].sourceBillNo;
        this.queryForm.sourceBillType = a[0].sourceBillType;
        this.queryForm.supplierName = a[0].supplierName;
        this.queryForm.supplierId = a[0].supplierId;

        this.tableData = a.map(item => {
          return {
            ...item,
            salesQty: item.qty,
            shipmentQty: 1,
            remainingOptionalQty: item.remainingOptionalQty,
            storeId: "1"
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
          salesQty: item.qty,
          shipmentQty: 1,
          remainingOptionalQty: item.remainingOptionalQty,
          storeId: "1"
        };
      });
      if (!this.tableData.length && a.length > 1) {
        let a = b[0];
        let flag = false;
        this.queryForm.sourceBillNo = a.sourceBillNo;
        this.queryForm.sourceBillType = a.sourceBillType;
        b.forEach(item => {
          /*  if (item.billNo == a.billNo) {
            this.tableData.push(item);
          } else {
            flag = true;
          } */

          if (item.materialNo == a.billNo) {
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
    /*  handleItem(val) {
      console.log(val);
      this.queryForm = val[0];
    }, */
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
      let detailList = {
        ...this.tableData,
        current: 1,
        size: 30
      };
      // console.log(params);

      if (this.operateType === "add") {
        addSinglList({
          ...this.queryForm,
          // applicantId: this.selectId,
          detailList: this.tableData
          // checkItemId: this.checkItemId
        })
          .then(res => {
            this.$message.success("操作成功");
            this.loading = false;
            this.$emit("submit");
          })
          .catch(() => {
            this.loading = false;
          });
      } else {
        console.log(this.queryForm);
        updateList({
          ...this.queryForm,
          // applicantId: this.selectId,
          id: this.currentData.id,
          ...detailList
        })
          .then(res => {
            if (res.success) {
              this.$message.success("操作成功");
              this.loading = false;
              this.$emit("submit");
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
        typeName: "",
        addressArea: "",
        applicantId: "",
        applyTime: this.$moment(new Date()).format("yyyy-MM-DD"),
        billStatus: "",
        businessStatus: "",
        cancelCloseReason: "",
        cancelCompleteReason: "",
        checkItemId: "",
        closeReason: "",
        completeReason: "",
        contacts: "",
        deliverStatus: "",
        deliveryType: "",
        detailAddress: "",
        detailList: [],
        fileId: "",
        fileName: "",
        fileUrl: "",
        freight: "",
        invoiceStatus: "",
        paymentStatus: "",
        planReturnTime: this.$moment(new Date()).format("yyyy-MM-DD"),
        remark: "",
        saleOrderNo: "",
        sourceBillNo: "",
        sourceBillType: "",
        supplierId: "",
        telephone: "",
        usable: true,
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
/* .tips {
} */
</style>
