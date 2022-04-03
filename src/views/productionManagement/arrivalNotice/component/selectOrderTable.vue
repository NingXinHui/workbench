<!--
@time:2021/12/2
@author:chenqian
-->
<template>
  <div class="popBox">
    <el-dialog
      title="查询选择(选单)"
      :visible="orderVisible"
      @close="close"
      :close-on-click-modal="false"
    >
      <div class="content">
        <header-search
          :model="detail"
          :searchArr="searchArr"
          @sureSearch="searchMethod"
        >
          <slot>
            <el-button @click="reset" style="margin-top: -2px;">重置</el-button>
          </slot>
        </header-search>
        <div class="z-content-table">
          <span>订单信息</span>
          <common-table
            is-height
            ref="mainTable"
            :isMain="true"
            :tableColumn="tabletopColumn"
            :tableData="tabletopData"
            :isSelection="false"
            :isRowClick="true"
            :isSelectMore="true"
            :loading="loading"
            :isPage="false"
            :tableheight="200"
            @selePage="handletopItemSelect"
          />
          <span>已选订单</span>
          <common-table
            is-height
            ref="mainTable"
            :isMain="true"
            :tableColumn="tabletopColumn"
            :tableData="tableData"
            :isSelection="false"
            :isRowClick="true"
            :isSelectMore="true"
            :isPage="false"
            :tableheight="200"
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
import HeaderSearch from "@/components/CommonHeadSearch/ZSearch";
import commonTable from "@/components/CommonTable";
import { checkFormData } from "@/lib/common";
import { getOrderList } from "@/api/marketOrder/arriveNotice.js";

export default {
  name: "add",
  components: { HeaderSearch, commonTable },

  mixins: [],

  props: {
    orderVisible: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      loading:false,
      queryForm: {},
      isEdit: true,
      tabletopData: [],
      tableData: [],
      detail: {
        name: "0"
      }
    };
  },
  methods: {
    //获取选单数据
    getOrderList(data = {}) {
      getOrderList({
        current: 1,
        size: 50,
        ...data
      }).then(res => {
        if (res.code == 0) {
          this.tabletopData = res.data.records;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //点击保存
    submit() {
      if (!this.tableData.length) {
        this.$message.error("请选择数据");
        return;
      }
      this.$emit("selectTable", this.tableData);
      this.$emit("update:orderVisible", false);
    },
    //重置
    reset() {
      (this.detail = {
        name: "0"
      }),
        this.getOrderList({});
    },
    handletopItemSelect(val, flag) {
      if (flag) {
        this.tableData.push(val);
        this.tableData = this.tableData.map((item, i) => {
          return { ...item, isIndex: i };
        });
      }
    },
    handleItemSelect(val, flag) {
      if (flag) {
        const index = this.tableData.findIndex(item => {
          return item.isIndex == val.isIndex;
        });
        this.tableData.splice(index, 1);
        this.tableData = this.tableData.map((item, i) => {
          return { ...item, isIndex: i };
        });
      }
    },
    searchMethod(data) {
      this.detail = { ...this.detail, ...data };
      this.getOrderList(data);
    },
    //关闭弹窗
    close() {
      this.$emit("update:orderVisible", false);
    },

    //初始化页面参数
    initQueryForm(data = {}) {
      this.queryForm = {
        remark: "",

        ...data
      };
    }
  },
  computed: {
    searchArr() {
      return [
        {
          label: "上游单据",
          value: "name",
          optionLabel: "label",
          optionValue: "value",
          type: 2,
          clearable: false,
          selectOption: [
            {
              label: "委外加工单",
              value: "0"
            }
          ]
        },
        {
          label: "来源单号",
          value: "sourceNo",
          type: 1,
          maxLength: 40
        },
        {
          label: "客商名称",
          value: "checkItemName",
          type: 1,
          maxLength: 40
        },
        {
          label: "物料",
          value: "materialName",
          type: 1,
          maxLength: 40
        }
      ];
    },
    tabletopColumn() {
      return [
        {
          prop: "sourceNo",
          label: "来源单号"
        },
        {
          prop: "sourceType",
          label: "源单类型"
        },

        {
          prop: "salesman",
          label: "业务员"
        },
        {
          prop: "department",
          label: "业务组"
        },
        {
          prop: "companyName",
          label: "公司主体"
        },
        {
          prop: "checkItemName",
          label: "客商名称"
        },
        {
          prop: "orderQty",
          label: "订单数量"
        },
        {
          prop: "createTime",
          label: "创建时间"
        },
        {
          prop: "materialNo",
          label: "物料编号"
        },
        {
          prop: "materialName",
          label: "物料名称"
        },
        {
          prop: "materialDescribe",
          label: "物料描述"
        },
        {
          prop: "unit",
          label: "计量单位"
        },
        {
          prop: "qty",
          label: "数量"
        },
        {
          prop: "remainQty",
          label: "剩余可选数量"
        }
      ];
    }
  },

  watch: {},

  created() {},

  beforeMount() {},

  mounted() {
    this.initQueryForm();
    this.getOrderList();
  }
};
</script>

<style lang="scss" scoped>
.popBox {
  ::v-deep .el-dialog {
    overflow-y: auto;
    width: 930px !important;
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
</style>
