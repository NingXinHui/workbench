<template>
  <div id="zPage">
    <!-- 按钮 -->
    <div class="z-header">
      <div class="z-header-button">
        <el-button @click="init()">确认初始化</el-button>
        <el-button @click="pushVisible=true">导入</el-button>
      </div>
    </div>

    <div style="display:flex;background:#eaeef3">
      <div style="width:15%;flex-shrink:0;margin-top:8px">
         <el-card>
            <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick">
             <span class="custom-tree-node" slot-scope="{ node, data }" style="width:180px;display:flex;justify-content:space-between">
       <span style="font-size:12px">{{ node.label }}</span>
        <span class="treeTip">
        已初始化
        </span>
      </span>
            </el-tree>
         </el-card>

      </div>

      <div style="flex:1; width:79%">
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
<Import :pushVisible.sync="pushVisible" ></Import>
    </div>
  </div>
</template>

<script>
import HeaderSearch from "@/components/CommonHeadSearch/ZSearch";
import commonTable from "@/components/CommonTable";
import { getDataList } from "@/api/marketOrder";
import Import from "./Import";
import zhuMiXins from "@/lib/orderZhu";
export default {
  name: "InitializationHouse",
  components: {
    HeaderSearch,
    commonTable,
    Import
  },
  mixins: [zhuMiXins],
  data() {
    return {
      queryForm: {}, //上面查询的条件

      tableData: [], // 表格显示的数据
      loading: true, //表格是否在加载中
      pushVisible:false,
      pageParams: {
        //下面的分页需要的数据
        pageNum: 1,
        pageSize: 30,
        total: 0,
      },
      multipleSelection: [], //表格选中的
      selectRow: {}, //选中的是哪一个

       data: [{
          label: '一级 1',
          children: [{
            label: '二级 1-1',

          }]
        }, {
          label: '一级 2',
          children: [{
            label: '二级 2-1',

          }, {
            label: '二级 2-2',

          }]
        }, {
          label: '一级 3',
          children: [{
            label: '二级 3-1',

          }, {
            label: '二级 3-2',

          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
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
          label: "物料",
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
          prop: "billNo",
          label: "物料编号",
          // render: (h, scope) => {
          //   return h(
          //     "a",
          //     {
          //       style: "color:blue",
          //       on: { click: () => this.openEdit("details", scope.row) },
          //     },
          //     scope.row.billNo
          //   );
          // },
        },
        {
          prop: "orderTypeName",
          label: "物料名称",
        },
        {
          prop: "customerOrderNo",
          label: "物料描述",
        },
        {
          prop: "billDate",
          label: "批次号",
        },
        {
          prop: "checkItemName",
          label: "计量单位",
        },
        {
          prop: "checkItemContactName",
          label: "未税单价",
        },
        {
          prop: "salesName",
          label: "自有",
        },
        {
          prop: "salesGroupName",
          label: "代销",
        },
        {
          prop: "currencyName",
          label: "代购质押",
        },
        {
          prop: "remark",
          label: "抵押",
        },
        {
          prop: "updateUserName",
          label: "抵押冻结",
        },
        {
          prop: "updateTime",
          label: "代储",
        }, {
          prop: "updateTime",
          label: "冻结",
        }, {
          prop: "updateTime",
          label: "电商库存",
        }, {
          prop: "updateTime",
          label: "货主",
        }, {
          prop: "updateTime",
          label: "所在仓库",
        },
        {
          prop: "billStatusName",
          label: "初始化时间",
        },
      ];
    },
  },

  methods: {

    handleNodeClick(e){
      console.log(e);
      console.log('李大柱')


    },
    /**
     * @desc 新增编辑详情
     */

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
    init() {
      let obj = '一号仓'
        this.$confirm("确定对'"+ obj + "'初始化吗？", "", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
        })
        .catch(() => {});
    },
    /**
     * @desc 上面的按钮进行的操作
     */
    operationFun(type) {
      let objText = {
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
.treeTip {
display: inline-block;
font-size: 12px;
background: #FFFFFF;
border: 1px solid rgba(237,87,81,1);
font-family: PingFangSC-Regular;
border-radius: 3px;
padding: 2px;
color: #ED5751 ;
}
</style>
