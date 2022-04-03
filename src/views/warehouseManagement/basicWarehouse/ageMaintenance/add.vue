<!--
@time:2021/12/1
@author:chenqian
-->
<template>
  <div class="popBox">
    <el-dialog :title="billCodeText"
               :visible="visible"
               @close="close"
               :close-on-click-modal="false">
      <div class="content">
        <div class="form">
          <form-list v-model="queryForm"
                     :formConfig="formConfig"
                     class="form form-order-box"></form-list>
        </div>
        <div v-if="isEdit"
             class="z-details-btn">
          <el-button size="mini"
                     plain
                     @click="addDetails">新增</el-button>
          <el-button size="mini"
                     plain
                     class="delButton"
                     @click="deleteDetails">删除</el-button>
        </div>
        <div class="z-content-table">
          <common-table :class="{ zTable: isEdit }"
                        ref="mainTable"
                        :isSelectMore="true"
                        :isSelection="true"
                        :tableColumn="tableColumn"
                        :tableData="tableData"
                        @selePage="handleSelectionChange"
                        :tableheight="250"
                        :isMain="true"></common-table>
        </div>
      </div>
      <div slot="footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary"
                   @click="submit">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import formList from "@/components/Form/formList";
import commonTable from "@/components/CommonTable";
import { checkFormData } from "@/lib/common";
import { addAge, editAge } from "@/api/wareManagementApi/ageMaintenance";
import { type } from 'os';

export default {
  name: "add",
  components: { formList, commonTable },

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
    },
    type: {
      type: String,
      default: ""
    }
  },

  data () {
    return {
      queryForm: {},
      isEdit: true,
      salesmanListList: [],
      basic: {
        defaultValue: 1,
        usable: 1

      },
      tableData: [],
      selectList: [],
      orderNumber: 1 //新增数据的index
    };
  },
  methods: {
    //表格勾选事件
    handleSelectionChange (val) {
      this.selectList = val;
    },
    //新增一条表格数据
    addDetails () {
      let obj = {
        orderNumber: this.tableData.length + 1
      };
      this.tableData.push(obj);
    },
    //复制一条表格数据
    copyDetails () {
      if (!this.selectList.length) {
        this.$message.error("请勾选操作数据");
        return;
      }
      this.tableData = [...this.tableData, ...this.selectList];
      this.$refs.mainTable.$refs.multipleTable.clearSelection();
    },
    //删除一条表格数据
    deleteDetails () {
      if (!this.selectList.length) {
        this.$message.error("请勾选操作数据");
        return;
      }
      // 删除
      this.selectList.map((item) => {
        delete this.tableData[item.orderNumber - 1]
      })
      this.tableData = this.tableData.filter((item) => { return !!item })
      // 将orderNumber 重新赋值,让他的值和index相等
      this.tableData.map((item, index) => {
        item.orderNumber = index + 1
      })
      // 删除选项清空
      this.selectList = []
      // 删除默认选中的勾勾
      this.clearSelct("mainTable")
    },
    //清空表格勾选数据
    clearSelct (val) {
      this.$refs[val].resetSelect();
    },
    //点击保存
    submit () {
      if (!checkFormData(this.formConfig.formItemList, this.queryForm)) {
        return;
      }
      let params = {}
      Object.assign(params, this.queryForm, {
        list: this.tableData,

      })
      let obj = {
        "add": addAge,
        "edit": editAge,
      }
      if (this.type == "add" || this.type == "edit") {
        obj[this.type](params).then((res) => {
          if (res.success) {
            this.$message.success('操作成功!')
            // 回传刷新页面
            this.$emit("reflushPage")
            this.close()
          }
        }).catch((res) => {
          // this.$message.error(res.message)
        })
      } else {
        this.close()
      }
    },
    //关闭弹窗
    close () {
      this.$emit("update:visible", false);
    },
    //初始化页面参数
    initQueryForm (data = {}) {
      let basic = this.basic;
      this.queryForm = {
        ...basic,
        ...data
      };
    }
  },
  computed: {
    formConfig () {
      let isEdit = !this.isEdit;
      let formItemList = [
        {
          key: "billNo",
          type: "input",
          subtype: "text",
          label: "报表编码",
          isEdit,
          placeholder: "请输入",
          rules: {
            required: true,
            trigger: "change"
          }
        },
        {
          key: "billName",
          type: "input",
          subtype: "text",
          label: "报表名称",
          isEdit,
          placeholder: "请输入",
          rules: {
            required: true,
            trigger: "change"
          }
        },
        {
          key: "remark",
          type: "input",
          subtype: "textarea",
          label: "描述",
          isEdit,
          placeholder: "请输入",
          maxlength: 200,
          rules: {
            required: true,
            trigger: "change"
          }
        },
        {
          key: "defaultValue",
          type: "checkbox",
          subtype: "checkbox",
          label: "是否默认",
          disabled: isEdit ? true : false,
          isEdit
        },
        {
          key: "usable",
          type: "checkbox",
          subtype: "checkbox",
          label: "是否可用",
          disabled: isEdit ? true : false,
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
    tableColumn () {
      let isEdit = this.isEdit;
      return [
        {
          label: "序号",
          type: "index"
        },
        {
          label: "名称",
          prop: "name",
          isEdit: isEdit,
          config: {
            key: "name",
            type: "input",
            subtype: "text",
            placeholder: "请输入"
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
            subtype: "text",
            placeholder: " "
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
            subtype: "text",
            placeholder: " "
          }
        }
      ];
    }
  },

  watch: {},

  created () { },

  beforeMount () { },

  mounted () {
    if (this.type == "edit" || this.billCodeText == "查看货龄") {
      this.isEdit = this.type == "edit" ? true : false;
      this.tableData = this.detail.list
      this.initQueryForm(this.detail);
    }
    this.initQueryForm();

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
          .el-form-item:nth-child(4) {
            flex-basis: 10%;
            margin-right: 0;
            .el-form-item__content {
              width: 30px !important;
            }
          }
          .el-form-item:nth-child(5) {
            flex-basis: 10%;
            margin-right: 330px;
            .el-form-item__content {
              width: 50px !important;
            }
          }
        }
      }
    }
  }
}
</style>
