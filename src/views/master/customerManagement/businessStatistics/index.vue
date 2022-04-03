<!--
@time:2021/12/6
@author:chenqian
-->
<template>
  <div class="code-rules setMoreButtonHeadShow" style="margin:8px;box-sizing:border-box">
    <!-- 按钮 -->
    <div class="z-content">
      <el-card>
        <!-- 搜索条件 -->
        <header-search :searchArr="searchArr" @sureSearch="searchMethod">
         <slot>
              <el-button @click="exportTable" style="margin-top: -2px;">导出</el-button>
            </slot>
        </header-search>
        <div class="splitBa setHeadTableMain" style="margin:8px">
        <div class="z-content-table">
          <!-- table -->
          <common-table
            is-height
            ref="mainTable"
            :isMain="true"
            :tableColumn="tableColumn"
            :tableData="tableData"
            :isSelection="true"
            :isSelectMore="false"
            :loading="loading"
            :pageParams="pageParams"
            @selePage="handleItemSelect"
            @pageChange="pageSizeChange"
          />
        </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import HeaderSearch from "@/components/CommonHeadSearch/ZSearch";
import commonTable from "@/components/CommonTable";
import { getDataList } from "@/api/marketOrder";
import zhuMiXins from "@/lib/orderZhu";
import {deepCopy } from "@/lib/common";
export default {
  name: "BusinessStatistics",
  components: {
    HeaderSearch,
    commonTable,
  },
  mixins: [zhuMiXins],
  data() {
    return {
      queryForm: {}, //上面查询的条件

      tableData: [], // 表格显示的数据
      loading: true, //表格是否在加载中

      pageParams: {
        //下面的分页需要的数据
        pageNum: 1,
        pageSize: 30,
        total: 0,
      },
      multipleSelection: [], //表格选中的
      selectRow: {}, //选中的是哪一个
    };
  },

  mounted() {
    this.getDataList();
  },

  computed: {
    /**
     * @desc 上面的查询条件  最好放到computed里面 当里面相关的参数发生改变  这个数据就会更新一次
     */
    searchArr() {
      return [
        {
          label: "客商名称",
          value: "billNo",
          type: 1,
          maxLength: 40,
        },
          {
          label: '机构类别',
          value: 'orderNo',
          optionLabel: 'label',
          optionValue: 'value',
          type: 2,
          selectOption: [{
            label: '草稿',
            value: 0
          }, {
            label: '审核中',
            value: 1
          }, {
            label: '已审核',
            value: 2
          }]
        },
         {
          label: '创建时间',
          value: 'createDate',
          type: 4,
          rangedesc: '至',
          pickerType: 'daterange',
          valueFormat: 'yyyy-MM-dd',
        },
      ];
    },

    /**
     * @desc 上面显示的表格行
     */

    tableColumn() {
      return [
        //表格显示的列
        {
          type: "index",
          label: "序号",
        },
        {
          prop: "",
          label: "客商编号",
          width: 200
        },
         {
          prop: "billNo",
          label: "客商名称",
        },
         {
          prop: "机构类别",
          label: "客商名称",
        },
        {
          prop: "orderTypeName",
          label: "是否启用",
          width: "90",
          align:"center",
          render: (h, scope) => {
            return h(
              "el-checkbox",
              {
                props: {
                  value:scope.row.orderTypeName,
                  disabled: true,
                }
              }
            )
          }
        },
         {
          prop: "customerOrderNo",
          label: "创建日期",
        },
         {
          prop: "customerOrderNo",
          label: "已创建天数",
        },{
          prop: "customerOrderNo",
          label: "最近采购下单时间",
        },
        {
          prop: "customerOrderNo",
          label: "未采购天数",
        },
        {
          prop: "customerOrderNo",
          label: "最近销售下单时间",
        },
        {
          prop: "customerOrderNo",
          label: "未销售天数",
        },
        {
          prop: "",
          label: "",
        }
      ];
    },
  },

  methods: {

    /**
     * @desc 初始form表单 请求发送的数据
     */
    initForm() {
      let params = {
        pageNo: this.pageParams.pageNum,
        pageSize: this.pageParams.pageSize,
        billNo: this.queryForm.billNo,
        checkItemName: this.queryForm.checkItemName,
      };
      if (Array.isArray(this.queryForm.createDate)) {
        let time = this.queryForm.createDate;

        params.beginDate = time[0] + " 00:00:00";
        params.endDate = time[1] + " 23:59:59";
      }
      return params;
    },

    /**
     * @desc 设置选中的表格行
     */
    handleItemSelect(val) {
      this.multipleSelection = val;
      this.selectRow = val[0];
    },

    /**
     * @desc 清除表格的选中项
     */
    clearSelcte() {
      if (this.$refs.mainTable) {
        this.$refs.mainTable.resetSelect();
      }
    },
    /**
     * @desc 获取订单的列表
     */
    getDataList() {
      this.loading = true;
      let params = this.initForm();
      this.clearSelcte();
      getDataList(params)
        .then((res) => {
          this.loading = false;

          this.tableData = res.data.records;
          this.pageParams.total = res.data.total;
        })
        .catch((error) => {
          this.tableData = [];
          this.loading = false;
          this.pageParams.total = 0;
        });
    },

    /**
     * @desc 上面查询条件
     */
    searchMethod(data) {
      this.queryForm = data;
      this.pageParams.pageNum = 1;
      this.getDataList();
    },

    /**
     * @desc 分液器发生改变的方法
     */

    pageSizeChange(data) {
      this.pageParams.pageNum = data.page;
      this.pageParams.pageSize = data.limit;

      this.getDataList();
    },

    /**
     * @desc 导出操作
     */
    exportTable() {
      this.$confirm('确认导出查询的数据？', "", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
        })
        .catch(() => {});
    },
  },
};
</script>


<style lang='less' scoped>
</style>
