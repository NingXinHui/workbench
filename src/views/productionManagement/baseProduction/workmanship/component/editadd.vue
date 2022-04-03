<template>
  <div id="zPage" class="market-order-edit">
    <div class="z-header">
      <div v-if="isEdit" class="z-header-button">
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
              <form-list
                v-model="queryForm"
                :formConfig="formConfigType(1)"
                class="form form-order-box"
              ></form-list>
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
              配料明细
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
                :isSelection="isEdit"
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
        <open-modal :billId="queryForm.id" billType="PURCHASE_ORDER" @closeModal="(value)=>{this.openmodal=false}" />
      </div>
  </div>
</template>

<script>
import formList from "@/components/Form/formList";
import commonTable from "@/components/CommonTable";
import AuditRecord from "./AuditRecord";
import OpenModal from '@/components/commonUpload';
import lookUp from "@/components/ZLookUp/lookUpImport"; //lookup统一弹窗
import { addone, deleteone, tablecol } from "./show";
import { formone } from "./form";
import { checkFormData } from "@/lib/common";
import { addBom,updateBom,getBomDetail,submitBom } from '@/api/production/workmanship'
import looks from "./look";
export default {
  name: "Menuceng",
  components: { formList, commonTable, lookUp, AuditRecord,OpenModal },
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
      auditVisible: false, //审核弹窗
      activeName: "first",
      queryForm: {}, //所有的表单的数据
      topTableData: [], //融资信息表格
      tableData: [], //下面表格要显示的数据、
      multipleSelection: [], //下main表格选中的数据
      visible: false, //
      selectIndex:0, //表格lookup索引
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
    if (this.operateType == "edit" || this.operateType == "details" || this.operateType == "copy") {
      this.init();
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
      submitBom({
        ids: this.queryForm.id
      }).then(res => {
        if(res.code == 0 ){
          this.$message.success("操作成功");
              this.loading = false;
              this.$emit("submit");
        }
      })
    },
    //查询订单详情
    init() {
      getBomDetail({
        id: this.currentData.id
      }).then(res => {
        if (res.code == 0) {
          this.initFormAndTable(res.data);
          this.tableData = res.data.detailList.map((item,i) => {
            return {...item, isIndex:i}
          });
          // this.searchSaleType();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
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
    setCheckItem(val) {
        if (!val) {
        return;
      }
      if (this.look.type == "materil") {
        if (Array.isArray(val)) {
          this.queryForm.materialId = val[0].id;
          this.queryForm.materialName = val[0].materialName;
          this.queryForm.materialNo = val[0].materialNo;
          this.queryForm.unit = val[0].unit;
          this.queryForm.propertyMerge = val[0].propertyMerge;
          this.queryForm.materialDescribe = val[0].materialDescription;
        } else {
          this.queryForm.materialId = val.id;
          this.queryForm.materialName = val.materialName;
          this.queryForm.materialNo = val.materialNo;
          this.queryForm.unit = val.unit;
          this.queryForm.propertyMerge = val.propertyMerge;
          this.queryForm.materialDescribe = val.materialDescription;
        }
      } else if (this.look.type == "table") {
        if (Array.isArray(val)) {
          this.tableData[this.selectIndex].materialId = val[0].id;
          this.tableData[this.selectIndex].materialName = val[0].materialName;
          this.tableData[this.selectIndex].materialNo = val[0].materialNo;
          this.tableData[this.selectIndex].unit = val[0].unit;
          this.tableData[this.selectIndex].propertyMerge = val[0].propertyMerge;
          this.tableData[this.selectIndex].materialDescribe = val[0].materialDescription;
        } else {
          this.tableData[this.selectIndex].materialId = val.id;
          this.tableData[this.selectIndex].materialName = val.materialName;
          this.tableData[this.selectIndex].materialNo = val.materialNo;
          this.tableData[this.selectIndex].unit = val.unit;
          this.tableData[this.selectIndex].propertyMerge = val.propertyMerge;
          this.tableData[this.selectIndex].materialDescribe = val.materialDescription;
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
     * @desc 点击添加或编辑
     */
    saveData() {


        if (this.tableData.length < 1) {
          this.$message.error("明细信息未添加");
          return;
        }
        if (!checkFormData(this.formOne, this.queryForm)) {
          return;
        }

        let bool = true,
          title = "";

        this.tableColumn.forEach(item => {
          if (item.config && item.config.custormRules) {
            this.tableData.forEach((value, key) => {
              if (!value[item.config.key] && value[item.config.key] !== 0&&bool) {
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
        this.loading = true;
        if (this.operateType == "add"||this.operateType == "copy") {
          addBom({
            ...this.queryForm,
            id:null,
            detailList: this.tableData.map(item => {
              return {...item, id:null}
            })
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
          updateBom({
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
    initFormAndTable(data={}) {
      this.queryForm = {
        billName: "",
        detailList: [],
        fileIdList: [],
        materialDescribe: "",
        materialId: '',
        materialName: "",
        materialNo: "",
        propertyMerge: "",
        remark: "",
        unit: "",
        usable: true,
        ...data,
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
