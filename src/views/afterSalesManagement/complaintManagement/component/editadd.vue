<template>
  <div id="zPage" class="market-order-edit">
    <div class="z-header">
      <div v-if="isEdit" class="z-header-button">
        <el-button plain @click="saveData" :disabled="loading">保存</el-button>
        <el-button plain @click="cancel">取消</el-button>
      </div>
      <div v-else class="z-header-button">
        <el-button plain @click="updateStatus" :disabled="!isCanEdit"
          >编辑</el-button
        >
        <el-button plain @click="cancel">返回</el-button>
          <el-button plain @click="updateStatus"
          >提交</el-button
        >
         <el-button plain @click="auditVisible = true"
          >审核记录</el-button
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
              basicShow ? '' : 'details-height-none',
            ]"
          >
           <div style="padding-left:24px">
           <form-list
                  v-model="queryForm"
                  :formConfig="formConfigType(1)"
                  class="form form-order-box"
                ></form-list>
           </div>
          </div>
        </div>
        <div class="z-details-content" v-if="showHandle">
          <div class="z-details-icon">
            <span @click="isCancel('detailsShow', !detailsShow)">
              <i
                :class="
                  detailsShow ? 'el-icon-caret-bottom' : 'el-icon-caret-right'
                "
              ></i>
              处理进度
            </span>
          </div>
          <div
            :class="[
              'z-details-content-box',
              detailsShow ? '' : 'details-height-none',
            ]"
          >
            <div v-if="isEdit" class="z-details-btn">
              <el-button size="mini" plain @click="addDetails">新增</el-button>
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
                :tableheight="150"
                :isMain="true"
              ></common-table>
            </div>
          </div>
        </div>
           <div class="z-details-content" v-if="showHandle">
          <div class="z-details-icon">
            <span @click="isCancel('costShow', !costShow)">
              <i
                :class="
                  costShow ? 'el-icon-caret-bottom' : 'el-icon-caret-right'
                "
              ></i>
              外部费用明细
            </span>
          </div>
          <div
            :class="[
              'z-details-content-box',
              costShow ? '' : 'details-height-none',
            ]"
          >
            <div v-if="isEdit" class="z-details-btn">
              <el-button size="mini" plain @click="addDetails">新增</el-button>
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
                :tableColumn="Tabletwocol"
                :tableData="tableData"
                @selePage="handleSelectionChange"
                :tableheight="150"
                :isMain="true"
              ></common-table>
            </div>
          </div>
        </div>
            <div class="z-details-content" v-if="showHandle">
          <div class="z-details-icon">
            <span @click="isCancel('resultShow', !resultShow)">
              <i
                :class="
                  resultShow ? 'el-icon-caret-bottom' : 'el-icon-caret-right'
                "
              ></i>
              判定结果
            </span>
          </div>
          <div
            :class="[
              'z-details-content-box',
              resultShow ? '' : 'details-height-none',
            ]"
          >
            <div v-if="isEdit" class="z-details-btn">
              <el-button size="mini" plain @click="addDetails">新增</el-button>
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
                :tableColumn="Tablethreecol"
                :tableData="tableData"
                @selePage="handleSelectionChange"
                :tableheight="150"
                :isMain="true"
              ></common-table>
            </div>
          </div>
        </div>
               <div class="z-details-content" v-if="showHandle">
          <div class="z-details-icon">
            <span @click="isCancel('assessmentShow', !assessmentShow)">
              <i
                :class="
                  assessmentShow ? 'el-icon-caret-bottom' : 'el-icon-caret-right'
                "
              ></i>
              考核承担
            </span>
          </div>
          <div
            :class="[
              'z-details-content-box',
              assessmentShow ? '' : 'details-height-none',
            ]"
          >
           <div style="display:flex;justify-content:space-between">
          <div style="width:47%">
            <div v-if="isEdit" class="z-details-btn">
              <el-button size="mini" plain @click="addDetails">新增</el-button>
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
                :tableColumn="Tablefourcol"
                :tableData="tableData"
                @selePage="handleSelectionChange"
                :tableheight="150"
                :isMain="true"
              ></common-table>
            </div>
          </div>
          <div style="width:50%">
            <div v-if="isEdit" class="z-details-btn">
              <el-button size="mini" plain @click="addDetails">新增</el-button>
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
                :tableColumn="Tablefivecol"
                :tableData="tableData"
                @selePage="handleSelectionChange"
                :tableheight="150"
                :isMain="true"
              ></common-table>
            </div>
          </div>
           </div>
          </div>
        </div>
         <div class="z-details-content" v-if="showHandle">
          <div class="z-details-icon">
            <span @click="isCancel('summaryShow', !summaryShow)">
              <i
                :class="
                  summaryShow ? 'el-icon-caret-bottom' : 'el-icon-caret-right'
                "
              ></i>
              总结
            </span>
          </div>
          <div
            :class="[
              'z-details-content-box',
              summaryShow ? '' : 'details-height-none',
            ]"
          >
          <div style="padding-left:24px">
           <form-list
                  v-model="queryForm"
                  :formConfig="formConfigType(2)"
                  class="form form-order-box formTwo"
                ></form-list>
           </div>
          </div>
        </div>
             <div class="z-details-content" v-if="showEvaluate">
          <div class="z-details-icon">
            <span @click="isCancel('evaluateShow', !evaluateShow)">
              <i
                :class="
                  evaluateShow ? 'el-icon-caret-bottom' : 'el-icon-caret-right'
                "
              ></i>
              评价反馈
            </span>
          </div>
          <div
            :class="[
              'z-details-content-box',
             evaluateShow ? '' : 'details-height-none',
            ]"
          >
          <div style="padding-left:24px">
           <form-list
                  v-model="queryForm"
                  :formConfig="formConfigType(3)"
                  class="form form-order-box formthree"
                ></form-list>
           </div>
          </div>
        </div>
      </el-card>
    </div>
    <AuditRecord :auditVisible.sync="auditVisible"></AuditRecord>
    <SelectOrderTable  :orderVisible.sync="orderVisible"></SelectOrderTable>
     <look-up ref="lookup"
      :visible.sync="visible" @setCheckItem="setCheckItem" :method="look.method" :table-column="look.tableColumn" :search-arr="look.searchArr" :params="look.params" ></look-up>
    <!-- <div>
            <look-up :title="look.title" :visible.sync="popConfig.show" :isClearAll="true" @setCheckItem="popSubmit" :params="look.params"  :method="look.methods" :table-column="look.tableColumn" :search-arr="look.searchArr" ></look-up>
        </div> -->
  </div>
</template>

<script>
import formList from "@/components/Form/formList";
import SelectOrderTable from "./selectOrderTable"
import commonTable from "@/components/CommonTable";
import AuditRecord from "./AuditRecord"
import lookUp from '@/components/ZLookUp/lookUpImport'; //lookup统一弹窗
import { addone, copyone, deleteone, tablecol,Tabletwocol,
  Tablethreecol,
  Tablefourcol,
  Tablefivecol, } from "./show";
import { formone,formTwo,formthree } from "./form";
import looks from "./look"
export default {
  name: "Menuceng",
  components: { formList, commonTable,SelectOrderTable,lookUp,AuditRecord},
  props: {
    operateType: {
      type: String,
      default: "edit",
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
      basicShow: true, //是否显示基本信息的模块
      detailsShow: true, //是否显示详情数据的模块
      costShow:true, //外部费用明细
      resultShow: true, //判定结果展示
      assessmentShow:true, //考核承担展示
      summaryShow: true, //总结展示
      evaluateShow:true, //评价展示
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
      showHandle:false,
      showEvaluate:false,
      look: {
        method: "",
        tableColumn: [],
        searchArr: [],
        params: {},
      },
    };
  },

  mounted() {
    if(this.operateType == 'details') {
      this.isEdit = false;
    }
    if(this.operateType == 'handle') {
      this.formOne.forEach(item => {
        item.disabled = true;
      })
      this.showHandle = true;
    }
    if(this.operateType == 'evaluate') {
      // this.formOne.forEach(item => {
      //   item.disabled = true;
      // })
      this.showHandle = true;
      this.showEvaluate = true;
    }
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
    Tabletwocol() {
      let isEdit = this.isEdit;
      return Tabletwocol(this, isEdit);
    },
    Tablethreecol() {
      let isEdit = this.isEdit;
      return Tablethreecol(this, isEdit);
    },
    Tablefourcol() {
      let isEdit = this.isEdit;
      return Tablefourcol(this, isEdit);
    },
    Tablefivecol() {
      let isEdit = this.isEdit;
      return Tablefivecol(this, isEdit);
    },
    formOne() {formTwo
      return formone(this, !this.isEdit);
    },
    formTwo() {
      return formTwo(this, !this.isEdit);
    },
    formthree() {
      return formthree(this, !this.isEdit);
    }
  },

  methods: {


    formConfigType(type) {
      let obj = {
        1: this.formOne,
        2: this.formTwo,
        3: this.formthree
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
      let objFun = {
          add: saveData,
          edit: editData,
        },
        type = this.operateType === "details" ? "edit" : this.operateType;

      if (objFun[type]) {
        if (this.tableData.length < 1) {
          this.$message.error("明细信息未添加");
          return;
        }
        if (!checkFormData(this.formConfig, this.queryForm)) {
          return;
        }

        let bool = true,
          title = "";

        this.tableColumn.forEach((item) => {
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
        let params = this.getEditParams(type);

        if (params) {
          this.loading = true;
          objFun[type](params)
            .then((res) => {
              this.$message.success("操作成功");
              this.loading = false;
              this.$emit("submit");
            })
            .catch(() => {
              this.loading = false;
            });
        }
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
    initFormAndTable() {
      this.queryForm = {
        typeName: ""
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
  },
};
</script>


<style lang='less' scoped>
/deep/ .form {
 .el-form-item:nth-child(6) {
   flex-basis: 75% !important;
   .el-form-item__content {
    .el-input {
      .el-input__inner {
        width: 712px !important;
       }
    }
   }
 }
 .el-form-item:nth-child(15) {
   flex-basis: 75% !important;
   .el-form-item__content {
    .el-input {
      .el-input__inner {
        width: 712px !important;
       }
    }
   }
 }
}
/deep/ .formTwo {
 .el-form-item:nth-child(1) {
   flex-basis: 75% !important;
   .el-form-item__content {
    .el-input {
      .el-input__inner {
         width: 1000px !important;
       }
    }
   }
 } .el-form-item:nth-child(2) {
   flex-basis: 75% !important;
   .el-form-item__content {
    .el-input {
      .el-input__inner {
        width: 1000px !important;
       }
    }
   }
 } .el-form-item:nth-child(3) {
   flex-basis: 75% !important;
   .el-form-item__content {
    .el-input {
      .el-input__inner {
        width: 1000px !important;
       }
    }
   }
 }
}
</style>
