<!--
@time:2021/12/1
@author:chenqian
-->
<template>
  <div id="zPage">
    <!-- 按钮 -->
    <div class="z-header">
      <div class="z-header-button">

        <el-button @click="operationFun('settle')"
          >结清</el-button
        >
        <el-button @click="operationFun('free')"
          >免息</el-button
        >
      </div>
    </div>
    <div class="z-content">
      <el-card>
        <!-- 搜索条件 -->
        <header-search :searchArr="searchArr" @sureSearch="searchMethod">
        <slot>
              <el-button @click="operationFun('export')" style="margin-top: -2px;">导出</el-button>
            </slot>
        </header-search>
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
  name: "Breach",
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
      visible: false,
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
          label: '查询方案',
          value: 'orderNo',
          optionLabel: 'label',
          optionValue: 'value',
          type: 2,
          selectOption: [{
            label: '1',
            value: 0
          }, {
            label: '2',
            value: 1
          }, {
            label: '3',
            value: 2
          }]
        },
        {
          label: "销售订单号",
          value: "billNo",
          type: 1,
          maxLength: 40,
        },
        {
          label: "客户名称",
          value: "billNo",
          type: 1,
          maxLength: 40,
        }
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
          label: "销售订单号",
        },
         {
          prop: "",
          label: "客户名称",
        },
         {
          prop: "",
          label: "应收单号",
        },
         {
          prop: "",
          label: "应收款",
        },
         {
          prop: "",
          label: "到期日",
        },
         {
          prop: "",
          label: "免息天数",
        },
         {
          prop: "",
          label: "真实到期日",
        },
        {
          prop: "orderTypeName",
          label: "是否已结清",
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
          prop: "",
          label: "实收款订单号",
        },
        {
          prop: "customerOrderNo",
          label: "收款日期",
        },
         {
          prop: "",
          label: "收款金额",
        },
         {
          prop: "",
          label: "余额",
        },
         {
          prop: "",
          label: "违约天数",
        },
        {
          prop: "billDate",
          label: "违约罚息",
          width:"170"
        },
        {
          prop: "checkItemName",
          label: "主管罚息",
        },
        {
          prop: "checkItemContactName",
          label: "责任人",
          width:"170"
        },
        {
          prop: "",
          label: "责任人主管",
        }
      ];
    },
  },

  methods: {
    /**
     * @desc 新增编辑详情
     */

    openEdit(type, params) {
      let data = {
        type,
        data: params || {},
      };

      if (type === "edit") {
        if (
          !this.checkOperation(
            type,
            this.multipleSelection,
            "billStatus",
            "12345"
          )
        ) {
          return;
        } else {
          this.billCodeText = "编辑";
          this.detail = deepCopy(this.multipleSelection[0]);
        }
      }
      // this.$emit("submit", data);
      this.visible = true
    },
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
     * @desc 上面的按钮进行的操作
     */
    operationFun(type) {
      let objText = {
        free: {
          text: "确认免息选中的数据吗？",
          fun: this.freeData,
          check: this.checkOperation,
          key: "billStatus",
          value: "12345",
        },
        settle: {
          text: "确认结清选中的数据吗？",
          fun: this.settleData,
          check: this.checkOperation,
          key: "billStatus",
          value: "12345",
        },
        export: {
          text: '确认导出查询的数据？',
          fun: this.exportCommonData,
        },
      };

      if (objText[type].check) {
        if (
          !objText[type].check(
            'delete',
            this.multipleSelection,
            objText[type].key,
            objText[type].value
          )
        ) {
          return;
        }
      }
      this.$confirm(objText[type].text, "", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          objText[type].fun();
        })
        .catch(() => {});
    },
    //免息
    freeData() {},
    //结清
    settleData() {},
    //导出数据
    exportCommonData() {},
  },
};
</script>


<style lang='less' scoped>
</style>
