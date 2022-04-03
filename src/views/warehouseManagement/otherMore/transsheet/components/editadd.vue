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
           <form-list
                    v-model="queryForm"
                    :formConfig="formConfigType(1)"
                    class="form form-order-box"
                  ></form-list>
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
              detailsShow ? '' : 'details-height-none',
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
                :tableheight="450"
                :isMain="true"
              ></common-table>
            </div>
          </div>
        </div>
      </el-card>
    </div>
    <!-- <div>
            <look-up :title="look.title" :visible.sync="popConfig.show" :isClearAll="true" @setCheckItem="popSubmit" :params="look.params"  :method="look.methods" :table-column="look.tableColumn" :search-arr="look.searchArr" ></look-up>
        </div> -->
  </div>
</template>

<script>
import formList from "@/components/Form/formList";
import commonTable from "@/components/CommonTable";
import { addone, copyone, deleteone, tablecol } from "./show";
import { formone } from "./form";
export default {
  name: "Menuceng",
  components: { formList, commonTable },
  data() {
    return {
      basicShow: true, //是否显示基本信息的模块
      detailsShow: false, //是否显示详情数据的模块
      isEdit: true, //是否处于编辑状态
      loading: false, //主体是否处于加载状态

      activeName: "first",

      queryForm: {}, //所有的表单的数据

      tableData: [], //下面表格要显示的数据、
      multipleSelection: [], //下main表格选中的数据
    };
  },

  mounted() {},

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
    formOne() {
      return formone(this, !this.isEdit);
    },

  },

  methods: {
    formConfigType(type) {
      let obj = {
        1: this.formOne,
       
      };

      return {
        inline: true,
        size: "mini",
        labelWidth: "auto",
        formItemList: obj[type],
      };
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
    initFormAndTable() {},

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

    selectSalesGroupName() {
      if (!this.queryForm.checkItemId) {
        this.$message.error("请先选择客户");
        return;
      }
      this.materialCategoryNo = "sale";
      this.popConfig.show = true;
    },
  },
};
</script>

<style lang="less">
.market-order-edit {
    .form-order-box {
        width: 1360px;

        .form-item-textarea .el-form-item__content {
            width: 88% !important;

            .clause-content-box {
                height: 120px;

                .el-textarea__inner {
                    height: 100%;
                }
            }
        }
    }
}
</style>
<style lang='less' scoped>
</style>