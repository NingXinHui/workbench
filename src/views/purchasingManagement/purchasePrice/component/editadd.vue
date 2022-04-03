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
        <div class="z-details-content" v-if="operateType== 'add'">
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
              <form-list
                v-model="queryForm"
                :formConfig="formConfigType(1)"
                class="form form-order-box"
              >
                <slot>
                  <el-button type="primary" @click="search">查询</el-button>
                </slot>
              </form-list>
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
              <span style="font-size:14px">物料信息</span>
              <el-button size="mini" class="ml-10" plain @click="clearPrice"
                >清空价格</el-button
              >
              <el-dropdown>
                <span class="el-dropdown-link changeprice">
                  批量改价<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="changePice('precent')"
                    >按百分比调价</el-dropdown-item
                  >
                  <el-dropdown-item @click.native="changePice('Number')"
                    >按加减数调价</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
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
    <ChangePice
    v-if="priceVisible"  :priceVisible.sync="priceVisible"
      :detailTitle="detailTitle" @changePrice="changePrice"
    ></ChangePice>
    <look-up
      ref="lookup"
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
import formList from "@/components/Form/formList";
import commonTable from "@/components/CommonTable";
import lookUp from "@/components/ZLookUp/lookUpImport"; //lookup统一弹窗
import { tablecol } from "./show";
import { formone } from "./form";
import looks from "./look";
import ChangePice from "./changePrice";
import { getSingleList ,addList,updateList,searchPriceTask} from "@/api/marketOrder/purchasePrice.js";
export default {
  name: "Menuceng",
  components: { formList, commonTable, lookUp, ChangePice },
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
      queryForm: {}, //所有的表单的数据
      topTableData: [], //融资信息表格
      tableData: [], //下面表格要显示的数据、
      multipleSelection: [], //下main表格选中的数据
      visible: false, //lookup展示条件
      priceVisible: false, //改价弹窗,
      detailTitle: "请输入百分比", //改价弹窗label
      look: {
        method: updateList,
        tableColumn: [],
        searchArr: [],
        params: {}
      }
    };
  },

  mounted() {
    console.log(this.operateType)
    if (this.operateType == "details") {
      this.isEdit = false;
    }
    this.$router.replace({
      path: this.$route.path,
      query: {}
    });
    if(this.operateType == 'copy') {
      searchPriceTask({
        ids: this.currentData.ids
      }).then(res => {
        if(res.code == 0) {
           this.tableData = res.data.map(item => {
             return {...item, beforeEditPrice:item.purchasePrice,buyer:item.buyerId}
           });
        } else {
          this.$message.error(res.msg)
        }
      })
    }
    if (this.operateType == 'edit') {
      let id = this.currentData.id;
      getSingleList(id).then(res => {
        this.tableData.push(res.data)
      });
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
    formOne() {
      return formone(this, !this.isEdit);
    }
  },

  methods: {
    formConfigType(type) {
      let obj = {
        1: this.formOne
      };

      return {
        inline: true,
        size: "mini",
        labelWidth: "auto",
        formItemList: obj[type]
      };
    },
    //lookup
    setCheckItem(val) {},

    //lookup弹窗
    selectLook(val) {
      this.look = looks[val];
      this.visible = true;
    },
    //查询
    search() {
    },
    changePrice(val) {
      if(val.detailTitle == '请输入百分比') {
        this.tableData = this.tableData.map(item => {
          return {...item, afterEditPrice: item.beforeEditPrice * (val.number / 100)}
        })
      } else {
         this.tableData = this.tableData.map(item => {
          return {...item, afterEditPrice: Number(item.beforeEditPrice) + Number(val.number)}
        })
      }
    },
    /**
     * @desc 点击添加或编辑
     */
    saveData() {
        if (this.tableData.length < 1) {
          this.$message.error("明细信息未添加");
          return;
        }
        // if (!checkFormData(this.formConfig, this.queryForm)) {
        //   return;
        // }

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
              }
            });
          }
        });

        if (!bool) {
          this.$message.error(title);
          return;
        }
        if(this.operateType == 'add' || this.operateType == 'copy') {
          let arr = this.tableData.map(item => {
              return {...item, createUserName:null,
              buyerName:null,status:'0',
              billStatus:'0',
              remark:"备注",
              taskId: item.id
              }
            });
          addList(arr).then(res => {
            if(res.code == 0) {
               this.$message.success("新增成功");
               this.$emit("submit");
            } else {
              this.$message.error(res.msg)
            }
          })
        } else {
          updateList({
            ...this.tableData[0]
          }).then(res => {
            if(res.code == 0) {
              this.$message.success("修改成功");
               this.$emit("submit");
            } else {
              this.$message.error(res.msg)
            }
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
    clearPrice() {
      this.$confirm("确认清空修改后价格吗?", "", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
         this.tableData = this.tableData.map(item => {
           return {...item, afterEditPrice:1}
         })
        })
        .catch(() => {});
    },
    /**
     * @desc 初始化界面的初始值
     */
    initFormAndTable() {
      this.queryForm = {
        typeName: ""
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
    changePice(val) {
      this.detailTitle = val == "precent" ? "请输入百分比" : "请输入调整价";
      this.priceVisible = true;
    }
  }
};
</script>

<style lang="less" scoped>
.tips {
}
.changeprice {
  padding: 6px 7px;
  background: #fff;
  font-size: 12px;
  border-radius: 3px;
  border: 1px solid #dcdfe6;
  border-color: #dcdfe6;
  margin-left: 10px;
}
</style>
