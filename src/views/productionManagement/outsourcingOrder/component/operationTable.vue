
<template>
  <div class="popBox">
    <el-dialog
      :title="operationTitle"
      :visible="operationVisible"
      @close="close"
      :close-on-click-modal="false"
    >
      <div class="content">
      <div class="z-content-table">
        <common-table
              is-height
              ref="mainTable"
              :isMain="true"
              :tableColumn="tableColumn"
              :tableData="tableData"
              :isSelection="true"
              :isSelectMore="false"
              :tableheight="400"
              :isPage="false"
              @selePage="handleItemSelect"
            />
      </div>
      </div>
      <div slot="footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="submit" style="width:80px !important">
        {{operationTitle== '生产退料' ? '生成退料单' : '生成投料单' }}
        </el-button>
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
    operationVisible: {
      type: Boolean,
      default: false
    },
    operationTitle: {
      type: String,
      default: ""
    },
  },

  data() {
    return {
      tableData: [{}],
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
      this.$emit("update:operationVisible", false);
    },

  },
  computed: {
    tableColumn() {
      if(this.operationTitle == "生产投料") {
        let column = [
           {
          type: 'index',
          label: '序号',
        },
        {
          prop: 'orderTypeName',
          label: '物料编号',
        },
        {
          prop: 'orderTypeName',
          label: '物料名称',
        },{
          prop: 'orderTypeName',
          label: '物料描述',
        },{
          prop: 'orderTypeName',
          label: '批次号',
        },{
          prop: 'orderTypeName',
          label: '计量单位',
        },{
          prop: 'orderTypeName',
          label: '剩余投料数',
        },{
          prop: 'orderTypeName',
          label: '可用库存',
        }, {
        label: "本次投料数",
        prop: "gmwt",
        align: "right",
        isEdit: true,
        width: 120,
        config: {
          key: "gmwt",
          subtype: "text",
          type: "number",
          min: 1,
          max: 99999999,
          precision: 2,
          placeholder: " "
        }
      },
        ]
        return column
      } else {
        let column = [
           {
          type: 'index',
          label: '序号',
        },
        {
          prop: 'orderTypeName',
          label: '物料编号',
        },
        {
          prop: 'orderTypeName',
          label: '物料名称',
        },{
          prop: 'orderTypeName',
          label: '物料描述',
        },{
          prop: 'orderTypeName',
          label: '批次号',
        },{
          prop: 'orderTypeName',
          label: '计量单位',
        },
        {
          prop: 'orderTypeName',
          label: '已投料数量',
        }, {
        label: "本次退料数数",
        prop: "gmwt",
        align: "right",
        isEdit: true,
        width: 120,
        config: {
          key: "gmwt",
          subtype: "text",
          type: "number",
          min: 1,
          max: 99999999,
          precision: 2,
          placeholder: " "
        }
      },{
          prop: '',
          label: '',
        },
        ]
        return column
      }
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
.font_12 {
  font-size: 12px;
  margin-bottom: 4px;
}
</style>
