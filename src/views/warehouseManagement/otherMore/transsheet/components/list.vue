<template>
  <div id="zPage">
    <!-- 按钮 -->
    <div class="z-header">
      <div class="z-header-button">
        <el-button @click="openEdit('add')">新增</el-button>
        <el-button @click="openEdit('edit')">编辑</el-button>
        <el-button class="delButton" @click="operationFun('delete')"
          >删除</el-button
        >
        <el-button @click="operationFun('submit')">提交</el-button>
        <el-button @click="operationFun('withdraw')">撤回</el-button>
      </div>
    </div>
    <div class="z-content">
      <el-card>
        <!-- 搜索条件 -->
        <header-search :searchArr="searchArr" @sureSearch="searchMethod">
          <slot>
            <!-- <el-button @click="operationFun('print')">打印</el-button> -->
            <el-button @click="operationFun('export')" style="margin-top: -2px"
              >导出</el-button
            >
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
export default {
  name: "Menuceng",
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
          label: "订单日期",
          value: "createDate",
          type: 4,
          rangedesc: "至",
          pickerType: "daterange",
          valueFormat: "yyyy-MM-dd",
        },
        {
          label: "销售订单号",
          value: "billNo",
          type: 1,
          maxLength: 40,
        },
        {
          label: "客户名称",
          value: "checkItemName",
          type: 1,
          maxLength: 40,
        },
        {
           label: "客户名称",
          value: "checkItemName",
          type: 2,
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
          prop: "billNo",
          label: "销售订单号",
          render: (h, scope) => {
            return h(
              "a",
              {
                style: "color:blue",
                on: { click: () => this.openEdit("details", scope.row) },
              },
              scope.row.billNo
            );
          },
        },
        {
          prop: "orderTypeName",
          label: "销售类型",
        },
        {
          prop: "customerOrderNo",
          label: "客户订单号",
        },
        {
          prop: "billDate",
          label: "订单日期",
        },
        {
          prop: "checkItemName",
          label: "客户名称",
        },
        {
          prop: "checkItemContactName",
          label: "客户联系人",
        },
        {
          prop: "salesName",
          label: "销售员",
        },
        {
          prop: "salesGroupName",
          label: "销售组",
        },
        {
          prop: "currencyName",
          label: "币种",
        },
        {
          prop: "remark",
          label: "备注",
        },
        {
          prop: "updateUserName",
          label: "更新人",
        },
        {
          prop: "updateTime",
          label: "更新时间",
        },
        {
          prop: "billStatusName",
          label: "单据状态",
        },
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
          data.data = deepCopy(this.multipleSelection[0]);
        }
      }
      this.$emit("submit", data);
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
          console.group(error);
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
        delete: {
          text: "确认删除选中的数据吗？",
          fun: this.delData,
          check: this.checkOperation,
          key: "billStatus",
          value: "12345",
        },
        submit: {
          text: "确认提交选中的数据吗？",
          fun: this.submitData,
          check: this.checkOperation,
          key: "billStatus",
          value: "12345",
        },
        withdraw: {
          text: "确认撤回选中的数据吗？",
          fun: this.withdrawData,
          check: this.checkOperation,
          key: "billStatus",
          value: "0",
        },
        print: {
          text: "确认打印选中的数据吗？",
          fun: this.printCommonData,
        },
        export: {
          text: "确认导出查询的数据？",
          fun: this.exportCommonData,
        },
      };

      if (objText[type].check) {
        if (
          !objText[type].check(
            type,
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
  },
};
</script>


<style lang='less' scoped>
</style>