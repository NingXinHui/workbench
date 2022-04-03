<template>
  <div id="zPage">
    <div class="z-header">
      <div class="z-header-button">
        <el-button @click="reset()">返回</el-button>
      </div>
    </div>
    <!-- 单据编码规则 -->
    <div class="z-content">
      <el-card>
        <header-search :searchArr="searchArr" @sureSearch="searchMethod">
            <slot><el-button type="primary" style="margin-top:2px" @click="()=>this.looutsome()">导出</el-button></slot>
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

import {listHdrWithDtl} from "@/api/apizhu";
import {downloadsomePost } from "@/utils/auth";

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
          prop: "materialNo",
          label: "物料编号",
          align: "left",
          width: 160,
        },
        {
          prop: "materialName",
          label: "物料名称",
          align: "left",
          width: 160,
        },
        {
          prop: "materialDescription",
          label: "物料描述",
          align: "left",
          width: 160,
        },
        {
          prop: "unitName",
          label: "计量单位",
          align: "left",
          width: 160,
        },
        {
          prop: "productForm",
          label: "产品形态",
          align: "left",
          width: 160,
          render: (h, scope) => {
            return h(
              "span",
              {},
              scope.row.productForm == "1" ? "大货" : "样卡"
            );
          },
        },
        {
          prop: "currency",
          label: "币种",
          align: "left",
          width: 260,
        },
        {
          prop: "newPrice",
          label: "价格",
        },

        {
          prop: "orderTypeName",
          label: "是否生效",
          width: "90",
          align: "center",
          render: (h, scope) => {
            return h("el-checkbox", {
              props: {
                value: scope.row.usable,
                disabled: true,
              },
            });
          },
        },
        {
          prop: "effectiveDate",
          label: "生效日期",
          width: "140",
        },
        {
          prop: "expirationDate",
          label: "失效日期",
          width: "140",
        },
        {
          prop: "createUserName",
          label: "更新人",
        },
        {
          prop: "createTime",
          label: "更新时间",
          width: "140",
        },
        {
          prop: "updateUserName",
          label: "审核人",
        },
        {
          prop: "updateTime",
          label: "审核时间",
          width: "140",
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
          label: "物料",
          value: "materialName",
          type: 1,
        },
         {
          type: 2,
          label: "产品形态",
          value: "productForm",
          selectOption: [
            { id: 1, name: "大货" },
            { id: 2, name: "样卡" },
          ],
          optionLabel: "name",
          optionValue: "id",
        },
 
        // {
        //   type: 2,
        //   label: "是否生效",
        //   value: "usable",
        //   selectOption: [
        //     { id: true, name: "是" },
        //     { id: false, name: "否" },
        //   ],
        //   optionLabel: "name",
        //   optionValue: "id",
        // },
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
     looutsome(){
      

      let { pageNo, pageSize, ...other } = this.pageParams;
      let params = {
        ...other,
        current: pageNo,
        size: pageSize,
      };
      downloadsomePost(
        "/mdm/material-price/export-with-detail-list",
        params
      );

      

    },

    reset(){
      this.$emit('resetsome')

    },
    getList() {
      this.pageParams.loading = true;
       this.pageParams.loading = true;

      let { pageNo, pageSize, ...other } = this.pageParams;
      let params = {
        ...other,
        current: pageNo,
        size: pageSize,
      };
      listHdrWithDtl(params).then((res) => {
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


