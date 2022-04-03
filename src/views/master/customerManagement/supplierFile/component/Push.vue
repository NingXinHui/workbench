
<!--
@time:2021/12/1
@author:chenqian
-->
<template>
  <div class="popBox">
    <el-dialog
      title="工商同步"
      :visible="pushVisible"
      @close="close"
      :close-on-click-modal="false"
    >
      <div class="content">
      <div class="font_12" style="margin-bottom:4px">请确认勾选需要同步的信息接口</div>
      <div class="font_12" style="margin-bottom:4px"><el-checkbox v-model="checked">工商详情/基础工商信息</el-checkbox></div>
      <div class="font_12" style="margin-bottom:4px"><el-checkbox v-model="checked">股东列表/获取股东信息列表</el-checkbox></div>
      <div class="font_12" style="margin-bottom:4px"><el-checkbox v-model="checked">纳税人识别号与开户行/财务披露信息</el-checkbox></div>
      <div class="font_12" style="margin-bottom:4px"><el-checkbox v-model="checked">裁判文书查询/关联的纠纷裁判文书等信息</el-checkbox></div>
      </div>
      <div slot="footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="submit">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import commonTable from '@/components/CommonTable'
export default {
  name: "add",
  components: { commonTable },

  mixins: [],

  props: {
    pushVisible: {
      type: Boolean,
      default: false
    },
    pushlText: {
      type: String,
      default: ""
    },
  },

  data() {
    return {
      checked: true,
      basic: {
        billNo: "",
      },
      orderno: ""
    };
  },
  methods: {
    //点击保存
    submit() {
      // if (!checkFormData(this.formConfig.formItemList, this.queryForm)) {
      //   return;
      // }
    },
    //关闭弹窗
    close() {
      this.$emit("update:pushVisible", false);
    },

  },
  computed: {
  },

  watch: {},

  created() {},

  beforeMount() {},

  mounted() {
  }
};
</script>

<style lang="scss" scoped>
.popBox {
  ::v-deep .el-dialog {
    overflow-y: auto;
    width: 465px !important;
    min-height: 230px !important;
    .el-dialog__body {
      padding: 0 !important;
      min-height: 100px !important;
      .content {
        min-height: 100px !important;
        overflow-x: auto;
      }
    }
  }
  ::v-deep .wid_800 {
    ::v-deep .el-dialog {
    overflow-y: auto;
    width: 800px !important;
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
}
.font_12 {
  font-size: 12px;
  margin-bottom: 4px;
  ::v-deep .el-checkbox__label {
    font-size: 12px;
  }
}
</style>
