<!--
@time:2021/12/1
@author:chenqian
-->
<template>
  <div class="popBox">
    <el-dialog
      title="推荐列表"
      :visible="visible"
      @close="close"
      :close-on-click-modal="false"
    >
      <div class="content">
        <div class="topTip">
        选中的物料<span style="margin-right:50px">0000000</span>
        </div>
        <div class="z-content-table">
          <common-table
            :class="{ zTable: isEdit }"
            ref="mainTable"
            :isSelectMore="true"
            :isSelection="true"
            :tableColumn="tableColumn"
            :tableData="tableData"
            :ispage="false"
            :tableheight="400"
            :isMain="true"
          ></common-table>
        </div>
      </div>
      <div slot="footer" class="mt-10">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="submit">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import formList from "@/components/Form/formList";
import commonTable from "@/components/CommonTable";
import { checkFormData } from "@/lib/common";

export default {
  name: "add",
  components: { formList, commonTable },

  mixins: [],

  props: {
    visible: {
      type: Boolean,
      default: false
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
      basic: {
        clauseContent: true,
        billNo: "",
        orderTypeNo: "",
        bill: ""
      },
      tableData: [],
      selectList: []
    };
  },
  methods: {
    //新增一条表格数据
    //点击保存
    submit() {
      if (!checkFormData(this.formConfig.formItemList, this.queryForm)) {
        return;
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
    tableColumn() {
      let isEdit = this.isEdit;
      return [
        {
          label: "序号",
          type: "index"
        },
        {
          label: "仓位信息",
          prop: "materialNo",
        },  {
          label: "批次号",
          prop: "materialNo",
        },  {
          label: "可用库位",
          prop: "materialNo",
        },  {
          label: "包装数量",
          prop: "materialNo",
        },  {
          label: "包装件数",
          prop: "materialNo",
        },  {
          label: "零包数量",
          prop: "materialNo",
        },  {
          label: "零包件数",
          prop: "materialNo",
        },  {
          label: "入库时间",
          prop: "materialNo",
        },
      ];
    }
  },

  watch: {},

  created() {},

  beforeMount() {},

  mounted() {
    if (this.billCodeText == "查看货龄") {
      this.isEdit = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.popBox {
  ::v-deep .el-dialog {
    overflow-y: auto;
    width: 765px !important;
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
.topTip {
font-size: 12px;
font-family: PingFangSC-Regular;
color: #999999;
span {
color: #374256;
}
}
</style>
