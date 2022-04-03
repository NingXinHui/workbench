<template>
  <div id="zPage">
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
  data() {
    return {
      searchArr: [
        {
          label: "修改人",
          value: "defNo",
          type: 1,
        },
        {
          type: 2,
          label: '应用名称',
          value: 'typeCategory',
          selectOption: this.unitTypeList,
          optionLabel: 'label',
          optionValue: 'value',
        },
        {
          label: "筛选时间",
          value: "key",
          type: 4,
          //   maxLength: "20",
          rangedesc: "至",
          pickerType: "datetimerange", //选择器类型
        },
      ],
      tableColumn: [
        {
          type: "index",
          label: "序号",
        },
        {
          prop: "defNo",
          label: "日志编号",
          align: "left",
          width:160,
        },
        {
          prop: "defName",
          label: "菜单路径",
          align: "left",
           width:160,
        },
        {
          prop: "billFormula",
          label: "菜单名称",
          align: "left",
           width:160,
        },
        {
          prop: "billFormulaReset",
          label: "操作内容",
          align: "left",
           width:360,
        },
         {
          prop: "remark",
          label: "修改人",
          align: "left",
           width:260,
        },
        {
          prop: "remark",
          label: "修改时间",
          align: "left",
           width:260,
        },
         {
          prop: "",
          label: "",
         
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
  mounted() {
    this.getList();
  },
  methods: {
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
#zPage /deep/ .el-card__body {
  height: calc(100vh - 114px);

  /deep/ .z-content {
    height: calc(100vh - 95px);
  }
}






</style>


