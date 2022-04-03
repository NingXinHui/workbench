<!--
@time:2021/10/25
@author:zhupeikang
订单进度查询
-->
<template>
  <div id="zPage">
    <div class="z-header">
      <div class="z-header-button">
        <el-button @click="editAdd('add')">新增</el-button>
        <el-button @click="editAdd('edit')">编辑</el-button>
        <el-button class="delButton" @click="operationFun('delete')"
          >删除</el-button
        >
        <!-- <el-button @click="operationFun('submit')">提交</el-button>
          <el-button @click="operationFun('withdraw')">撤回</el-button> -->
        <el-button @click="auditFun(1)">审核</el-button>
        <el-button @click="operationFun('auditee')">反审核</el-button>
        <!-- <el-button @click="operationFun('complete')">完成</el-button>
          <el-button @click="operationFun('cancelComplete')">取消完成</el-button> -->
      </div>
    </div>
    <div class="z-content">
      <el-card>
        <div class="z-content-search">
          <header-search
            :searchArr="searchArr"
            @getMore="getMore"
            @sureSearch="sureSearch"
          >
          </header-search>
        </div>
        <div class="z-content-table">
          <common-table
            is-height
            ref="mainTable"
            :isMain="true"
            :tableColumn="tableColumn"
            :tableData="tableData"
            :isSelection="true"
            :loading="pageParams.loading"
            :pageParams="pageParams"
            :propTableHeight="isMore ? 174 : 175"
            @selePage="handleItemSelect"
            @pageChange="pageChange"
          />
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import HeaderSearch from "@/components/CommonHeadSearch/ZmoreSearch";
import commonTable from "@/components/CommonTable/secondTable";
import { deepCopy, checkExistData, } from "@/lib/common"

// import { userQueryPage } from "@/api/systemzhu";

export default {
  name: "progress",
  components: { HeaderSearch, commonTable },
  mixins: [],
  props: {},
  data() {
    return {
      searchArr: [
        {
          label: "订单编号",
          value: "billNo",
          type: 1,
        },
        {
          label: "物料编号",
          value: "materialNo",
          type: 1,
          maxLength: "20",
        },
        {
          label: "物料名称",
          value: "materialName",
          type: 1,
        },
        {
          label: "花型号",
          value: "pattenNo",
          type: 1,
        },
        // {
        //   label: "进度状态",
        //   value: "billStatus",
        //   optionLabel: 'label',
        //   optionValue: 'value',
        //   type: 2,
        //   selectOption: [{
        //     label: '草稿',
        //     value: 0
        //   }, {
        //     label: '审核中',
        //     value: 1
        //   }, {
        //     label: '已审核',
        //     value: 2
        //   }]
        // }
        // ,
        {
          label: "客户名称",
          value: "customerName",
          type: 1,
        },
        {
          label: "销售组",
          value: "salesGroupName",
          type: 1,
        },
        {
          label: "销售员",
          value: "salesName",
          type: 1,
        },
        {
          pickerType: "daterange",
          label: "下单日期",
          value: "billDate",
          type: 4,
          maxLength: "20",
        },
        // {
        //   label: '客户',
        //   value: 'customerName',
        //   type: 1,
        //   maxLength: '20'
        // },
        // {
        //   label: '客户',
        //   value: 'customerName',
        //   type: 1,
        //   maxLength: '20'
        // },
      ],
      tableColumn: [
        {
          type: "index",
          label: "序号",
          width: 80,
          align: "left",
        },
        {
          width: "200",
          prop: "billNo",
          label: "发货通知单",
          align: "left",
          render: (h, scope) => {
            return h(
              "el-link",
              {
                attrs: {
                  type: "primary",
                },
                on: {
                  click: () => {
                    this.setData(scope.row);
                    this.setShowType(["edit", false]);
                  },
                },
              },
              scope.row.billNo
            );
          },
        },

        {
          prop: "billStatusName",
          label: "审核状态",
        },
        {
          prop: "billDate",
          label: "发货日期",
        },

        {
          prop: "customerName",
          label: "客户名称",
        },

        {
          prop: "salesName",
          label: "客户联系人",
        },
        {
          prop: "salesPeople",
          label: "销售员",
        },
        {
          prop: "salesGroupName",
          label: "销售组",
        },
        {
          prop: "salesCount",
          label: "销售组",
        },

        {
          prop: "unit",
          label: "单位",
        },
        {
          prop: "remark",
          label: "备注",
        },
        {
          prop: "orderNo",
          label: "订单号",
        },
        {
          prop: "materNo",
          label: "物料编号",
        },
        {
          prop: "materName",
          label: "物料名称",
        },
      ],
      pageParams: {
        loading: false,
        pageNo: 1,
        pageSize: 30,
        total: 1,
      },
      tableData: [],
      isMore: false,
    };
  },
  computed: {},

  watch: {},

  beforeCreat() {},

  created() {},

  beforeMount() {},

  mounted() {
    this.getList();
  },
  methods: {
    getMore(value) {
      this.isMore = value;
    },
     /**
     * @desc 新增编辑查看
     */
    editAdd(type, params) {
      let data = {
        type,
        data: deepCopy(params),
      }
      if(type === 'edit') {
        let bool = this.checkMultip()
        if (bool) {
          data.data = deepCopy(this.multipleSelection[0])
        } else {
          return
        }
      }
      this.$emit('submit', data)
    },
    getList() {
      this.pageParams.loading = true;
      let { loading, ...other } = this.pageParams;

      //   这是随便找的一个接口  真是需要改一下
      // userQueryPage(other).then((res) => {
      //   if (res.success) {
      //     this.pageParams.total = res.data.total;
      //     this.tableData = res.data.records;
      //     this.pageParams.loading = false;
      //   }
      // });
    },
    sureSearch(value) {
      this.pageParams = { ...this.pageParams, ...value, pageNum: 1 };
      this.getList();
    },
    //选择事件
    handleItemSelect(val) {
      this.multipleSelection = val;
      this.selectRow = val[0];
    },
    //翻页、跳页事件
    pageChange(e) {
      this.pageParams.pageNo = e.page;
      this.pageParams.pageSize = e.limit;
      this.getList();
    },
  },
  beforeUpdate() {},

  updated() {},

  activated() {},

  deactivated() {},

  beforeDestroy() {},

  destroyed() {},
};
</script>

<style lang='less' scoped>
/deep/ .el-card__body {
  padding: 8px 12px;
  height: calc(100vh - 134px) !important;
  overflow: auto;
}
</style>
