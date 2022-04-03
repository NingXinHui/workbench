
<!--
@time:2021/12/1
@author:chenqian
-->
<template>
  <div :class="{wid_800: pushlText=='联查'? true : false, popBox:pushlText=='联查'? false : true}">
    <el-dialog
      :title="pushlText"
      :visible="pushVisible"
      @close="close"
      :close-on-click-modal="false"
    >
      <div class="content">
      <div class="font_12" style="margin-bottom:4px">关于"2121151{{orderno}}"销售订单的上下级关系如下。</div>
      <div class="z-content-table">
        <common-table
              is-height
              ref="mainTable"
              :isMain="true"
              :tableColumn="tableColumn"
              :tableData="tableData"
              :isSelection="false"
              :isSelectMore="false"
              :tableheight="260"
              :isPage="false"
              @selePage="handleItemSelect"
            />
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
      tableData: [],
      isEdit: true,
      basic: {
        billNo: "",
      },
      orderno: ""
    };
  },
  methods: {
    handleItemSelect(val) {},
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
    tableColumn() {
      let column = [
           {
          type: 'index',
          label: '序号',
        },
        {
          prop: 'orderTypeName',
          label: '单据类别',
        },
        {
          prop: 'orderTypeName',
          label: '单据类型',
        },
        {
          prop: 'orderTypeName',
          label: '单据编号',
        },
        {
          prop: 'orderTypeName',
          label: '单据状态',
        },
        {
          prop: 'orderTypeName',
          label: '创建方式',
        },
        {
          prop: 'orderTypeName',
          label: '创建人',
        },
        {
          prop: 'orderTypeName',
          label: '创建时间',
        },
        ]
        return column
    }
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
}
</style>
