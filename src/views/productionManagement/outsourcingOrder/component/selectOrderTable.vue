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
          :searchArr="searchArr"
          ref="suixin"
          @sureSearch="searchMethod"
        >
          <slot>
            <el-button @click="operationFun('export')" style="margin-top: -2px;"
              >重置</el-button
            >
          </slot>
        </header-search>
        <div class="z-content-table">
          <span>订单信息</span>
          <common-table
            is-height
            ref="mainTable"
            :isMain="true"
            :pageParams="pageParams"
            :tableColumn="tabletopColumn"
            :tableData="tabletopData"
            :isSelection="false"
            :isSelectMore="false"
            :loading="loading"
            :isRowClick="true"
            :isPage="false"
            :tableheight="200"
            @selePage="handletopItemSelect"
          />
          <span>已选订单</span>
          <common-table
            is-height
            ref="mainTable"
            :isMain="true"
            :pageParams="pageParams"
            :tableColumn="tabletopColumn"
            :tableData="tableData"
            :isSelection="false"
            :isSelectMore="false"
            :isPage="false"
            :isRowClick="true"
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
import { getOrderList } from "@/api/marketOrder/outsourcing.js";

import HeaderSearch from "@/components/CommonHeadSearch/ZSearch";
import commonTable from "@/components/CommonTable";
import { checkFormData } from "@/lib/common";

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
      loading: false,
      queryForm: {},
      isEdit: true,
      tabletopData: [],
      tableData: [],
      pageParams: {
        pageNum: 1,
        pageSize: 30,
        total: 0
      }
    };
  },
  methods: {
    //点击保存
    submit() {
      /*    if (!checkFormData(this.formConfig.formItemList, this.queryForm)) {
        return;
      } */

      if (!this.tableData.length) {
        this.$message.error("请选择数据");
        return;
      }
      this.$emit("selectTable", this.tableData);
      this.$emit("update:orderVisible", false);

      //
      // this.$emit("handleItem", this.tableData);
      this.close();
    },
    getOrderList() {
      let data = {
        current: 1,
        size: 30,
        // id: "",
        sourceBillNo: this.queryForm.sourceBillNo,
        checkItemName: this.queryForm.checkItemName,
        materialName: this.queryForm.materialName
      };

      getOrderList(data)
        .then(res => {
          console.log(res);
          this.tabletopData = res.data;
          /*  this.tabletopData = this.tabletopData.map((item, index) => {
            return {
              ...item,
              detailId: item.id,
              id: item.id
            };
          }); */
          // console.log(this.tabletopData);
        })
        .catch(err => {});
    },
    handletopItemSelect(val) {
      console.log(val);
      if (this.tableData.length >= 1) return;
      this.tableData.push(val);
    },
    handleItemSelect(val) {},
    searchMethod(data) {
      this.queryForm = data;
      this.pageChange(1);
    },
    pageChange(page) {
      this.pageParams.pageNum = page;
      this.getOrderList();
    },
    // 重置
    operationFun(e) {
      let data = {
        current: 1,
        size: 10,
        sourceBillNo: "",
        checkItemName: "",
        materialName: ""
      };

      this.$refs.suixin.resetForm({
        billNo1: undefined,
        sourceBillNo: undefined,
        checkItemName: undefined,
        materialName: undefined
      });

      getOrderList(data)
        .then(res => {
          console.log(res);
          this.tabletopData = res.data;
          this.tabletopData = this.tabletopData.map((item, index) => {
            return {
              ...item,
              detailId: item.id,
              id: index
            };
          });
          console.log(this.tabletopData);
        })
        .catch(err => {});
    },

    //关闭弹窗
    close() {
      this.$emit("update:orderVisible", false);
    },
    //初始化页面参数
    initQueryForm(data = {}) {
      this.queryForm = {
        remark: ""
      };
    }
  },
  computed: {
    searchArr() {
      return [
        {
          label: "上游单据",
          // value: "customerName",
          value: "name",
          optionLabel: "label",
          optionValue: "value",
          type: 2,
          clearable: false,
          selectOption: [
            {
              label: "生产任务书",
              value: "0"
            }
          ]
        },
        {
          label: "来源单号",
          value: "sourceBillNo",
          type: 1,
          maxLength: 50
        },
        {
          label: "客商名称",
          value: "checkItemName",
          type: 1,
          maxLength: 50
        },
        {
          label: "物料名称",
          value: "materialName",
          type: 1,
          maxLength: 40
        }
      ];
    },
    tabletopColumn() {
      return [
        {
          prop: "sourceBillType",
          label: "源单类型"
        },
        {
          prop: "sourceBillNo",
          label: "来源单号"
        },
        {
          prop: "checkItemName",
          label: "客商名称"
        },
        {
          prop: "salesManName",
          label: "业务员"
        },

        {
          prop: "salesManDepartmentName",
          label: "业务组"
        },
        {
          prop: "companyName",
          label: "公司主体"
        },
        {
          prop: "totalMaterialQty",
          label: "订单数量"
        },
        {
          prop: "createTime",
          label: "创建时间"
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
    width: 900px !important;
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
