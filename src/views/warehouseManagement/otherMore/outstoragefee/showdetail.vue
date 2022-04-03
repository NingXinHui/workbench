<template>
  <div id="zPage">
    <div class="z-header">
      <div class="z-header-button">
         <el-button type="primary" @click="reset()">生成应付单</el-button>
          <el-button type="primary" @click="reset()">导出</el-button>
        <el-button @click="reset()">返回</el-button>
      </div>
    </div>
    <!-- 单据编码规则 -->
    <div class="z-content">
      <el-card>
        <header-search :searchArr="searchArr" @sureSearch="searchMethod">
        </header-search>
        <div class="z-content-table">
          <common-table
            is-height
            ref="mainTable"
            :isMain="true"
            :tableColumn="tableColumn"
            :tableData="tableData"
            :loading="pageParams.loading"
            :pageParams="pageParams"
            @pageChange="pageChange"
          />
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
import HeaderSearch from "@/components/CommonHeadSearch/ZSearch";
import commonTable from "@/components/CommonTable";
import add from "@/components/AddUpdate";
import { pbBillFormulahdr } from "@/api/xsApi/api";

export default {
  components: { HeaderSearch, commonTable, add },
  name: "index",
  props: {
    selectRow: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },

  data() {
    return {
  
       tableColumn: [
        {
          type: "index",
          label: "序号",
        },
        {
          prop: "defNo",
          label: "物料编号",
          align: "left",
          width: 160,
        },
        {
          prop: "defName",
          label: "物料描述",
          align: "left",
          width: 160,
        },
        {
          prop: "billFormula",
          label: "计量单位",
          align: "left",
          width: 160,
        },
        {
          prop: "billFormulaReset",
          label: "产品形态",
          align: "left",
          width: 160,
        },
        {
          prop: "remark",
          label: "币种",
          align: "left",
          width: 260,
        },
        {
          prop: "price",
          label: "价格",
        },
        {
          prop: "price",
          label: "状态",
        },
        {
          prop: "orderTypeName",
          label: "是否生效",
          width: "90",
          align: "center",
          render: (h, scope) => {
            return h("el-checkbox", {
              props: {
                value: scope.row.orderTypeName,
                disabled: true,
              },
            });
          },
        },
        {
          prop: "price",
          label: "失效日期",
        },
        {
          prop: "price",
          label: "更新人",
        },
        {
          prop: "price",
          label: "更新时间",
        },
        {
          prop: "price",
          label: "审核人",
        },
        {
          prop: "price",
          label: "审核时间",
        },
      ],
      pageParams: {
        loading: false,
        pageNo: 1,
        pageSize: 30,
        total: 1,
      },

      tableData: [],
    };
  },
    computed: {
    searchArr() {
      return [
        {
          label: "查询方案",
          value: "defNo",
          type: 1,
        },
        {
          label: "物料",
          value: "defNo",
          type: 1,
        },
        {
          type: 2,
          label: "产品形态",
          value: "typeCategory",
          selectOption: this.unitTypeList,
          optionLabel: "label",
          optionValue: "value",
        },
        {
          type: 2,
          label: "状态",
          value: "typeCategory",
          selectOption: this.unitTypeList,
          optionLabel: "label",
          optionValue: "value",
        },
        {
          type: 2,
          label: "产品形态",
          value: "是否生效",
          selectOption: this.unitTypeList,
          optionLabel: "label",
          optionValue: "value",
        },
        // {
        //   label: "筛选时间",
        //   value: "key",
        //   type: 4,
        //   //   maxLength: "20",
        //   rangedesc: "至",
        //   pickerType: "datetimerange", //选择器类型
        // },
      ];
    },
  },
  mounted() {
    this.getList();
  },
  methods: {

    reset(){
      this.$emit('resetsome')

    },
    getList() {
      this.pageParams.loading = true;
      pbBillFormulahdr(this.pageParams).then((res) => {
        if (res.success) {
          this.pageParams.total = res.data.total;
          this.tableData = res.data.records;
          this.pageParams.loading = false;
        }
      });
    },

    

    searchMethod(value) {
      this.pageParams = { ...this.pageParams, ...value, pageNo: 1 };
      this.getList();
    },

    //翻页、跳页事件
    pageChange(e) {
      this.pageParams.pageNo = e.page;
      this.pageParams.pageSize = e.limit;
      this.getList();
    },
  },
};
</script>
<style lang="less" scoped>

</style>


