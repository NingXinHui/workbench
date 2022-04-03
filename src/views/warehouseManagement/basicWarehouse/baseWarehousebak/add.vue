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
import { checkFormData } from "@/lib/common";

export default {
  name: "add",
  components: { formList },

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

  data () {
    return {
      queryForm: {},
      isEdit: true,
      salesmanListList: [],
      basic: {
        clauseContent: true,
        billNo: "",
        orderTypeNo: "",
        bill: ""
      }
    };
  },
  methods: {
    //点击保存
    submit () {
      if (!checkFormData(this.formConfig.formItemList, this.queryForm)) {
        return;
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
          label: "编号",
          isEdit,
          placeholder: "请输入",
          rules: {
            required: true,
            trigger: "change"
          }
        },
        {
          key: "bill",
          type: "input",
          subtype: "text",
          label: "仓位名称",
          isEdit,
          placeholder: "请输入",
          rules: {
            required: true,
            trigger: "change"
          }
        },
        {
          key: isEdit ? "orderTypeName" : "orderTypeNo",
          type: isEdit ? "input" : "select",
          subtype: "text",
          label: "所属库",
          isEdit,
          multiple: true,
          options: this.salesmanListList,
          optionLabel: "orderTypeName",
          optionValue: "orderTypeNo",
          placeholder: "请选择",
          rules: {
            required: true,
            message: "关联业务员不能为空"
          }
        },
        {
          key: "bill",
          type: "input",
          subtype: "text",
          label: "仓位名称",
          selctKey: "a",
          appendType: true,
          options: this.salesmanListList,
          optionLabel: "orderTypeName",
          optionValue: "orderTypeNo",
          isEdit,
          placeholder: "请输入",
          rules: {
            required: true,
            trigger: "change"
          }
        },
        {
          key: isEdit ? "orderTypeName" : "orderTypeNo",
          type: isEdit ? "input" : "select",
          subtype: "text",
          label: "",
          isEdit,
          multiple: true,
          options: this.salesmanListList,
          optionLabel: "orderTypeName",
          optionValue: "orderTypeNo",
          placeholder: "",
        },
        {
          key: "clauseContent",
          type: "checkbox",
          subtype: "checkbox",
          label: "是否对外显示",
          isEdit
        }
      ];

      return {
        inline: true,
        size: "mini",
        labelWidth: "85px !important",
        formItemList: formItemList
      };
    }
  },

  watch: {},

  created () { },

  beforeMount () { },

  mounted () {
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
            flex-basis: 39% !important;
            margin-left: -15px;
            .el-form-item__content {
              width: 115px;
              .el-input {
                width: 115px;
              }
            }
          }
          .el-form-item:nth-child(5) {
            flex-basis: 14% !important;
            margin-left: -30px;
            .el-form-item__content {
              width: 66px;
              .el-select {
                width: 66px;
                .el-input {
                  width: 66px;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
