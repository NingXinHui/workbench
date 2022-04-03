<!--
@time:2021/12/1
@author:chenqian
-->
<template>
  <div class="popBox">
    <el-dialog
      title="改价"
      :visible="priceVisible"
      @close="close"
      :close-on-click-modal="false"
    >
      <div class="content">
        <div class="form" style="width:500px">
          <form-list
            v-model="queryForm"
            :formConfig="formConfig"
            class="form form-order-box"
          ></form-list>
        </div>
      </div>
      <div slot="footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="submit">确认</el-button>
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
    priceVisible: {
      type: Boolean,
      default: false
    },
    detailTitle: {
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
      isEdit: true
    };
  },
  methods: {
    //点击保存
    submit() {
      if (!checkFormData(this.formConfig.formItemList, this.queryForm)) {
        return;
      }
      let obj = {
        detailTitle:this.detailTitle,
        number: this.queryForm.number
      }
      this.$emit("changePrice",obj);
      this.$emit("update:priceVisible", false);
    },
    //关闭弹窗
    close() {
      this.$emit("update:priceVisible", false);
    },
    //初始化页面参数
    initQueryForm(data = {}) {
      this.queryForm = {
        number: "",
      };
    }
  },
  computed: {
    formConfig() {
      let isEdit = !this.isEdit;
      let title = this.detailTitle;
      let formItemList = [
        {
          key: "number",
          type: "input",
          type: "number",
          min: 1,
          max: 99999999,
          precision: 2,
          label: title,
          isEdit,
          placeholder: "请输入",
          rules: {
            required: true,
            trigger: "change"
          }
        }
      ];

      return {
        inline: true,
        size: "mini",
        labelWidth: "95px !important",
        formItemList: formItemList
      };
    }
  },

  watch: {},

  created() {},

  beforeMount() {},

  mounted() {
    this.initQueryForm();
  }
};
</script>

<style lang="scss" scoped>
.popBox {
  ::v-deep .el-dialog {
    overflow-y: auto;
    width: 545px !important;
    min-height: 60px !important;
    .el-dialog__body {
      padding: 0 !important;
      min-height: 60px;
      .content {
        min-height: 60px !important;
        overflow-x: auto;
      }
    }
  }
}
.el-form ::v-deep .el-form-item {
   .el-form-item__content {
  width: 440px !important;
}
 .el-input {
    width: 440px !important;
    .el-input__inner {
      width: 440px;
    }
  }
  .el-input-number {
    width: 440px !important;
  }
}
</style>
