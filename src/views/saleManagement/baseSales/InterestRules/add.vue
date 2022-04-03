<!--
@time:2021/12/1
@author:chenqian
-->
<template>
  <div class="popBox">
    <el-dialog
      :title="billCodeText"
      :visible="visible"
      @close="close"
      :close-on-click-modal="false"
    >
      <div class="content">
        <div class="form">
          <form-list
            v-model="queryForm"
            :formConfig="formConfig"
            class="form form-order-box"
          >
          </form-list>
        </div>
         <div class="z-details-btn">
         <span style="font-size:14px">明细项目</span>
              <el-button v-if="isEdit" class="ml-10" size="mini" plain @click="addDetails">新增</el-button>
              <el-button v-if="isEdit" size="mini" plain @click="copyDetails">复制</el-button>
              <el-button v-if="isEdit"
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

      <div slot="footer">
        <el-button @click="close">取消</el-button>
       <el-button type="primary" v-if="billCodeText=='查看'" @click="edit">编辑</el-button>
        <el-button type="primary" v-if="billCodeText!='查看'" @click="submit">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import formList from "@/components/Form/formList";
import commonTable from "@/components/CommonTable";
import { checkFormData } from "@/lib/common";
import {addInterestRules,updateInterestRules,searchInterestRules} from "@/api/sale/base"
export default {
  name: "add",
  components: { formList,commonTable },

  mixins: [],

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    billCodeText: {
      type: String,
      default: ""
    },
    detail: {
      type: Object,
      default: {}
    }
  },

  data() {
    return {
      queryForm: {},
      isEdit: true,
      salesmanListList: [],
      tableData: [],
      selectList: [],
      basic: {
        usable: true,
        defaultValue: true,
        billNo: "",
        ruleName: "",
        effectiveDate:"",
        expirationDate:"",
        remark: ""
      }
    };
  },
  methods: {
    edit() {
      this.$parent.billCodeText = '编辑';
      this.isEdit = !this.isEdit;
    },
    //表格勾选事件
    handleSelectionChange(val) {
      this.selectList = val;
    },
    //新增一条表格数据
    addDetails() {
      let obj = {
        interestRate:"",
        maxDays:"",
        minDays:"",
        name:"",
        orderNumber:this.tableData.length,
        personLiableRate:"",
        hdrId: this.queryForm.id ? this.queryForm.id : "",
      }
      this.tableData.push(obj);
    },
    //复制一条表格数据
    copyDetails(){
      if(!this.selectList.length) {
        this.$message.error("请勾选操作数据");
        return
      }
      let arr = [...this.tableData, ...this.selectList].map((item,index)=> {
        return {...item, orderNumber:index}
      })
      this.tableData = arr;
      this.$refs.mainTable.$refs.multipleTable.clearSelection();
    },
    //删除一条表格数据
    deleteDetails(){
      if(!this.selectList.length) {
        this.$message.error("请勾选操作数据");
        return
      }
      this.selectList.forEach(item => {
       let index = this.tableData.findIndex(r => {return r.orderNumber == item.orderNumber});
       if(index > -1) {
         this.tableData.splice(index, 1)
       }
      })
      this.tableData = this.tableData.map((s,i)=> {
        return {...s, orderNumber:i}
      })
    },
    //点击保存
    submit() {
      if (!checkFormData(this.formConfig.formItemList, this.queryForm)) {
        return;
      }
       let bool = true,
          title = "";
       this.tableColumn.forEach((item) => {
          if (item.config && item.config.custormRules) {
            this.tableData.forEach((value, key) => {
              if (!value[item.config.key] && value[item.config.key] !== 0) {
                bool = false;
                title =
                  "第" + (key + 1) + "行" + item.config.custormRules.message;
              } else if (Number(value.maxDays) < Number(value.minDays)) {
                  bool = false;
                title =
                  "第" + (key + 1) + "行最大天数小于最小天数";
              }
            });
          }
        });
        if (!bool) {
          this.$message.error(title);
          return;
        }
         if (!this.tableData.length) {
          this.$message.error("请添加明细数据!!!");
          return;
        }
        if(this.billCodeText == '新增') {
        addInterestRules({
          ...this.queryForm,
          rulesDetailAddDTOList:this.tableData
        }).then(res => {
          if(res.code == 0) {
            this.$message.success("新增成功");
             this.$emit("update:visible", false);
              this.$parent.getDataList();
          } else {
            this.$$message.error(res.msg)
          }
        })
      } else {
        delete this.queryForm.rulesDetailVOList
         updateInterestRules({...this.queryForm,
         rulesDetailUpdateDTOList:this.tableData,
         id:this.detail.id}).then(res => {
          if(res.code == 0) {
            this.$message.success("修改成功");
             this.$emit("update:visible", false);
             this.$parent.getDataList();
          } else {
            this.$$message.error(res.msg)
          }
        })
      }
    },
    //关闭弹窗
    close() {
      this.$emit("update:visible", false);
    },
    //初始化页面参数
    initQueryForm(data = {}) {
      let basic = this.basic;
      this.queryForm = {
        ...basic,
        ...data
      };
    }
  },
  computed: {
    formConfig() {
      let isEdit = !this.isEdit;
      let formItemList = [
        {
          key: "ruleName",
          type: "input",
          subtype: "text",
          label: "计息规则",
          isEdit,
          placeholder: "请输入",
          rules: {
            required: true,
            trigger: "change"
          }
        },
        {
          key: "billNo",
          type: "input",
          subtype: "text",
          label: "规则编号",
          isEdit,
          placeholder: "请输入",
          rules: {
            required: true,
            trigger: "change"
          }
        },
         {
        key: "effectiveDate",
        type: "date",
        subtype: "date",
        valueFormat: "yyyy-MM-dd",
        label: "生效日期",
        listeners: {
          change: (val) => {
             if (this.queryForm.expirationDate && new Date(this.queryForm.expirationDate) < new Date(this.queryForm.effectiveDate)) {
               this.$message.error("生效日期不能大于失效日期")
               this.queryForm.effectiveDate = "";
              }
          },
        },
        rules: {
            required: true,
            trigger: "change"
          },
        isEdit
      },
       {
        key: "expirationDate",
        type: "date",
        subtype: "date",
        valueFormat: "yyyy-MM-dd",
        label: "失效日期",
        listeners: {
          change: (val) => {
             if (this.queryForm.effectiveDate && new Date(this.queryForm.expirationDate) < new Date(this.queryForm.effectiveDate)) {
               this.$message.error("失效日期不能小于生效日期")
               this.queryForm.expirationDate = "";
              }
          },
        },
        rules: {
            required: true,
            trigger: "change"
          },
        isEdit
      },
        {
          key: "remark",
          type: "input",
          subtype: "textarea",
          label: "描述",
          isEdit,
          placeholder: "请输入",
          maxlength:200,
        },
        // {
        //   key: "defaultValue",
        //   type: "checkbox",
        //   subtype: "checkbox",
        //   disabled:this.billCodeText == '查看' ? true : false,
        //   showCheckWidth: true,
        //   label: "是否默认",
        //   isEdit
        // },
        {
          key: "usable",
          type: "checkbox",
          subtype: "checkbox",
          disabled:isEdit,
          label: "是否可用",
          isEdit
        }
      ];

      return {
        inline: true,
        size: "mini",
        labelWidth: "70px !important",
        formItemList: formItemList
      };
    },
    tableColumn() {
      let isEdit = this.isEdit;
       return [
      {
        label: "序号",
        type: "index"
      },
      {
        label: "罚息名目",
        prop: "name",
        isEdit: isEdit,
        config: {
          key: "name",
          type: "input",
          subtype: "text",
          placeholder: "请输入",
          custormRules: {
            message: "罚息名目不能为空"
          }
        }
      },
      {
        label: "最小天数",
        prop: "minDays",
        align: "right",
        isEdit: isEdit,
        config: {
          key: "minDays",
          type: "input",
           type: "number",
          min: 1,
          max: 99999999,
          precision: 2,
          custormRules: {
            message: "最小天数不能为空"
          }
        }
      },
      {
        label: "最大天数",
        prop: "maxDays",
        align: "right",
        isEdit: isEdit,
        config: {
          key: "maxDays",
          type: "input",
           type: "number",
          min: 1,
          max: 99999999,
          precision: 2,
          custormRules: {
            message: "最大天数不能为空"
          }
        }
      },
      {
        label: "罚息(%)",
        prop: "interestRate",
        align: "right",
        isEdit: isEdit,
        config: {
          key: "interestRate",
          type: "input",
           type: "number",
          min: 0,
          max: 1,
          precision: 2,
          custormRules: {
            message: "罚息不能为空"
          }
        }
      },
      {
        label: "主管连带(%)",
        prop: "personLiableRate",
        align: "right",
        isEdit: isEdit,
        config: {
          key: "personLiableRate",
          type: "input",
           type: "number",
          min: 0,
          max: 1,
          precision: 2,
          custormRules: {
            message: "主管连带不能为空"
          }
        }
      }
    ];
    }
  },

  watch: {},

  created() {},

  beforeMount() {},

  mounted() {
    this.initQueryForm();
    if(this.billCodeText == "编辑" || this.billCodeText == '查看') {
      if(this.billCodeText == '查看') {
        this.isEdit = false;
      }
      searchInterestRules({id: this.detail.id}).then(res => {
        if(res.success) {
          this.initQueryForm({
            ...res.data,
          })
          this.tableData = res.data.rulesDetailVOList;
        } else {
          this.$message.error(res.msg);
        }
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.popBox {
  ::v-deep .el-dialog {
    overflow-y: auto;
    width: 565px !important;
    min-height: 100px !important;
    .el-dialog__body {
      padding: 0 !important;
      min-height: 100px !important;
      .content {
        min-height: 100px !important;
        overflow-x: auto;
        .form-order-box {
         .el-form-item:nth-child(3) {
           .el-form-item__content {
           .el-input {
           margin-right: 0 !important;
           .el-input__inner {
           padding-left: 24px !important;
           }
           .el-icon-date {
           display: block !important;
           }
           }
           }
          }
           .el-form-item:nth-child(4) {
           .el-form-item__content {
           .el-input {
           margin-right: 0 !important;
           .el-input__inner {
           padding-left: 24px !important;
           }
           .el-icon-date {
           display: block !important;
           }
           }
           }
          }

        }
      }
    }
  }
  .z-details-btn {
  background: #f8f8f9;
  border: 1px solid #dfe6ec;
  border-bottom: none;
  padding: 5px 0 5px 13px;
  }
  .z-content-table {
  margin-top: 0 !important;}
}
</style>
