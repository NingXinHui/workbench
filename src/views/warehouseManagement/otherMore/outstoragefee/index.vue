<template>
 <div>
   <div v-if="!isDetail">
      <div id="zPage">
    <!-- 单据编码规则 -->
    <div class="z-header">
      <div class="z-header-button">
        <el-button @click="role">导出</el-button>
        <el-button type="primary" @click="() => oldprice()">账单</el-button>
      </div>
    </div>
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


   </div>
  <div v-else>
      <show-detail
        :selectRow="selectRow"
        @resetsome="
          () => {
            this.isDetail = false;
          }
        "
      />
    </div>

 </div>
</template>
<script>
import HeaderSearch from "@/components/CommonHeadSearch/ZSearch";
import commonTable from "@/components/CommonTable";
import add from "@/components/AddUpdate";
import { pbBillFormulahdr } from "@/api/xsApi/api";
import ShowDetail from "./showdetail.vue";

export default {
  components: { HeaderSearch, commonTable, add ,ShowDetail},
  name: "index",
  data() {
    return {
      isDetail:false,
      searchArr: [
        {
          type: 2,
          label: "报表选择",
          value: "dictCategotyId",
          selectOption: this.dictTypeList,
          optionLabel: "label",
          optionValue: "value",
        },

        {
          type: 2,
          label: "统计维度",
          value: "dictCategotyId",
          selectOption: this.dictTypeList,
          optionLabel: "label",
          optionValue: "value",
        },
        {
          label: "物料编号",
          value: "defName",
          type: 1,
        },
        {
          type: 2,
          label: "仓库名称",
          value: "dictCategotyId",
          selectOption: this.dictTypeList,
          optionLabel: "label",
          optionValue: "value",
        },
      ],
      tableColumn: [
        {
          prop: "defNo",
          label: "物料编号",
          align: "left",
          width: 220,
        },
        {
          prop: "defName",
          label: "物料名称",
          align: "left",
          width: 180,
        },
        {
          prop: "billFormula",
          label: "单位",
          align: "left",
          width: 120,
        },
        {
          prop: "billFormulaReset",
          label: "仓库名称",
          align: "left",
          width: 240,
        },
        {
          prop: "remark",
          label: "物料批次",
          align: "left",
          width: 180,
        },
        {
          prop: "defName",
          label: "等级",
        },
        {
          prop: "defName",
          label: "颜色",
        },

        {
          prop: "defName",
          label: "汇总",
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

    oldprice() {
      this.isDetail = true;
    },
  },
};
</script>
<style lang="less" scoped>
</style>


