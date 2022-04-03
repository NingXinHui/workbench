<template>
  <div id="zPage" class="market-order-edit">
    <div class="z-header">
      <div v-if="isEdit" class="z-header-button">
        <!-- <el-button plain @click="selectOrder">选单</el-button> -->
        <el-button plain @click="saveData" :disabled="loading">保存</el-button>
        <el-button plain @click="cancel">取消</el-button>
         <el-button v-if="operateType!='add'" @click="() => uploadFile()">附件</el-button>
      </div>
      <div v-else class="z-header-button">
        <el-button plain @click="updateStatus" v-if="queryForm.billStatus == 0"
          >编辑</el-button
        >
        <el-button plain @click="cancel">返回</el-button>
        <el-button plain @click="submitData" v-if="queryForm.billStatus == 0">提交</el-button>
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
                <el-tab-pane label="退货信息" name="second">
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
              明细信息
            </span>
          </div>
          <div
            :class="[
              'z-details-content-box',
              detailsShow ? '' : 'details-height-none'
            ]"
          >
            <div v-if="false" class="z-details-btn">
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
    <SelectOrderTable :orderVisible.sync="orderVisible"></SelectOrderTable>
    <look-up
      ref="lookup"
      v-if="visible"
      :isSelectMore="isSelectMore"
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
        <open-modal :billId="queryForm.id" billType="SALE_RETURN" @closeModal="(value)=>{this.openmodal=false}" />
      </div>
  </div>
</template>

<script>
import formList from "@/components/Form/formList";
import SelectOrderTable from "./selectOrderTable";
import commonTable from "@/components/CommonTable";
import AuditRecord from "./AuditRecord";
import lookUp from "@/components/ZLookUp/lookUpImport"; //lookup统一弹窗
import { addone, copyone, deleteone, tablecol } from "./show";
import { formone, formtwo, formThree } from "./form";
import looks from "./look";
import { checkFormData } from "@/lib/common";
import OpenModal from '@/components/commonUpload'
import { addData, getDetailsData, concatLookUp,receiveMethods,updateData,submitData } from "@/api/marketOrder";

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
      default: {}
    }
  },
  data() {
    return {
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
      auditVisible: false, //审核弹窗
      activeName: "first",
      queryForm: {}, //所有的表单的数据
      topTableData: [], //融资信息表格
      tableData: [], //下面表格要显示的数据、
      multipleSelection: [], //下main表格选中的数据
      visible: false, //lookup展示条件
      look: {
        method: receiveMethods,
        tableColumn: [],
        searchArr: [],
        params: {}
      },
      size: 10,
      current: 1,
      receiveType:"receiveType",
      orderTypeList:[],
      receiveUnitList:[],
      isSelectMore: false,//lookup的多选
      openmodal:false,
    };
  },

  mounted() {
    if (this.operateType == "details") {
      this.isEdit = false;
    } else {

    }
    if (this.operateType == "details" || this.operateType == 'edit') {
      this.init()
    }
// 联系方式的下拉
concatLookUp().then(res=>{
  this.receiveUnitList=res.data
})


    // 收货方式

   receiveMethods(this.receiveType)
      .then(res => {
        // this.look.tableColumn=res.data
        this.orderTypeList=res.data
      })
      .catch(err => {});
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
    },
    formTwo() {
      return formtwo(this, !this.isEdit);
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
    updateStatus() {
      if(this.queryForm.billStatus != 0){
        this.$message.error("当前状态不能编辑");
        return
      }
      this.isEdit = !this.isEdit;
    },
     submitData() {
      if(this.queryForm.billStatus != 0){
        this.$message.error("当前状态不能操作");
        return
      }

      submitData({ids: this.queryForm.id})
        .then(res => {
          this.loading = false;
          this.$message.success("操作成功!");

          this.$emit("submit");
        })
        .catch(error => {
          console.group(error);
          this.loading = false;
        });
    },
    init() {
      let id = this.currentData.id;
      getDetailsData(id)
        .then(res => {
          // 渲染数据
          res.data.planReturnDate = res.data.planReturnDate ? res.data.planReturnDate.substring(0,10) : "";
          // console.log(res);
          this.initFormAndTable(res.data)
          // this.queryForm = res.data;
          this.tableData = res.data.detailVOList;
        })
        .catch(err => {});
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
    //lookup
    setCheckItem(val) {
      // 选种那一项具体的
      this.queryForm.receiveCompanyId=val[val.length-1].id
      this.queryForm.companyName = val[val.length-1].companyName
      this.queryForm.contactName=val[val.length-1].contactName
      this.queryForm.contactPhoneNumber=val[val.length-1].contactPhoneNumber
      this.queryForm.address=val[val.length-1].address
      this.queryForm.addressDtl=val[val.length-1].addressDtl



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
      this.look.params = {
        checkItemNo: this.queryForm.customerName
      }
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
          // add: saveData
          // edit: editData
          edit:1
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

        this.tableColumn.forEach(item => {
          if (item.config && item.config.custormRules) {
            this.tableData.forEach((value, key) => {
              value.orderNumber = key + 1;
              if (!value[item.config.key] && value[item.config.key] !== 0 &&bool) {
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
        updateData({
          ...this.queryForm,
          list:this.tableData
        }).then(res => {
          if(res.code == 0) {
            this.$message.success("操作成功")
             this.loading = false;
              this.$emit("submit");
          } else {
            this.$message.error(res.msg)
          }
        })
        // let params = this.getEditParams(type);

        // console.log(params);

        // if (params) {
        //   this.loading = true;
        //   objFun[type](params)
        //     .then(res => {
        //       console.log(res);
        //       this.$message.success("操作成功");
        //       this.loading = false;
        //       this.$emit("submit");
        //     })
        //     .catch(() => {
        //       this.loading = false;
        //     });
        // }
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
