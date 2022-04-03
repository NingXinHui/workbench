
<!--
@time:2021/12/1
@author:chenqian
-->
<template>
  <div class="popBox">
    <el-dialog
      :title="approvalText"
      :visible="approvalVisible"
      @close="close"
      :close-on-click-modal="false"
    >
      <div class="content">
        <div class="form">
          <form-list
            v-model="queryForm"
            :formConfig="formConfig"
            class="form form-order-box"
          ></form-list>
        </div>
      </div>
      <!-- <div slot="footer" v-if="approvalText!='反审核'">
        <el-button @click="close">驳回</el-button>
        <el-button type="primary" @click="submit">通过</el-button>
      </div> -->
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
import { completeTrack,cancelCompleteTrack,closeTrack,cancelCloseTrack} from "@/api/production/productionDocumentary"
export default {
  name: "add",
  components: { formList },

  mixins: [],

  props: {
    approvalVisible: {
      type: Boolean,
      default: false
    },
    approvalText: {
      type: String,
      default: ""
    },
    titletype: {
      type: String,
      default: ""
    },
    ids: {
      type: String,
      default: ""
    }
  },

  data() {
    return {
      queryForm: {},
      isEdit: true,
    };
  },
  methods: {
    //点击保存
    submit() {
      if (!checkFormData(this.formConfig.formItemList, this.queryForm)) {
        return;
      }
       console.log("111")
      if(this.titletype == "请填写完成原因") {
        completeTrack({
          ids:this.ids,
          completeReason:this.queryForm.remark
        }).then(res => {
          if(res.code == 0) {
            this.$message.success("操作成功");
            this.$emit("update:approvalVisible", false);
            this.$parent.getDataList();
          }
        })
      } else if (this.titletype == "请填写取消完成原因") {
        cancelCompleteTrack({
          ids:this.ids,
          cancelCompleteReason:this.queryForm.remark
        }).then(res => {
          if(res.code == 0) {
            this.$message.success("操作成功");
            this.$emit("update:approvalVisible", false);
            this.$parent.getDataList();
          }
        })
      } else if (this.titletype == "请填写取消关闭原因") {
        cancelCloseTrack({
          ids:this.ids,
          cancelCloseReason:this.queryForm.remark
        }).then(res => {
          if(res.code == 0) {
            this.$message.success("操作成功");
            this.$emit("update:approvalVisible", false);
            this.$parent.getDataList();
          }
        })
      } else if (this.titletype == "请填写关闭原因") {
        closeTrack({
          ids:this.ids,
          closeReason:this.queryForm.remark
        }).then(res => {
          if(res.code == 0) {
            this.$message.success("操作成功");
            this.$emit("update:approvalVisible", false);
            this.$parent.getDataList();
          }
        })
      }
    },
    //关闭弹窗
    close() {
      this.$emit("update:approvalVisible", false);
    },
    //初始化页面参数
    initQueryForm(data = {}) {
      this.queryForm = {
        remark: "",
      };
    }
  },
  computed: {
    formConfig() {
      let isEdit = !this.isEdit;
      let title = this.titletype;
      let formItemList = [
        {
          key: "remark",
          type: "input",
          subtype: "textarea",
          label: title,
          isEdit,
          placeholder: "请输入",
          maxlength: 50,
          rules: {
            required: true,
            trigger: "change"
          }
        },
      ];

      return {
        inline: true,
        size: "mini",
        labelWidth: title == '审核原因' ?"auto !important" : "auto !important",
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
    width: 565px !important;
    min-height: 100px !important;
    .el-dialog__body {
      padding: 0 !important;
      min-height: 100px !important;
      .content {
        min-height: 100px !important;
        overflow-x: auto;
      }
    }
  }
}
.form {
  ::v-deep .el-form-item {
    flex-direction: column;

  }
  ::v-deep .el-form-item__content {
      width: 550px !important;
    }
  ::v-deep .el-form-item__label {
    text-align: left !important;
  }
  ::v-deep .el-textarea__inner {
    min-height: 180px !important;
  }
}
</style>
