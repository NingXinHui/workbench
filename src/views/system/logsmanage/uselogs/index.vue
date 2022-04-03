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
          label: "使用人员",
          value: "defNo",
          type: 1,
        },
        {
          label: "访问模块",
          value: "defName",
          type: 1,
        },
        {
          label: "时间筛选",
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
          width:220,
        },
        {
          prop: "defName",
          label: "访问模块",
          align: "left",
           width:180,
        },
        {
          prop: "billFormula",
          label: "使用人员",
          align: "left",
           width:120,
        },
        {
          prop: "billFormulaReset",
          label: "使用人手机号",
          align: "left",
           width:240,
        },
        {
          prop: "remark",
          label: "访问时间",
          align: "left",
           width:180,
        },
        {
          prop: "",
          label: "",

        }
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


