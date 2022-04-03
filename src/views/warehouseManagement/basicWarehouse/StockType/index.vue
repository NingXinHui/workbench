<!--
@time:2021/1/21
@author:shaoliting
-->
<template>
  <div id="zPage">
    <!-- 按钮 -->
    <div class="z-header">
      <div class="z-header-button">
        <el-button @click="openEdit('add')">新增</el-button>
        <el-button @click="openEdit('edit')">编辑</el-button>
        <el-button class="delButton"
                   @click="operationFun('delete')">删除</el-button>
      </div>
    </div>
    <div class="z-content">
      <el-card>
        <!-- 搜索条件 -->
        <header-search :searchArr="searchArr"
                       @sureSearch="searchMethod">
        </header-search>
        <div class="z-content-table">
          <!-- table -->
          <common-table is-height
                        ref="mainTable"
                        :isMain="true"
                        :tableColumn="tableColumn"
                        :tableData="tableData"
                        :isSelection="true"
                        :isSelectMore="false"
                        :loading="loading"
                        :pageParams="pageParams"
                        @selePage="handleItemSelect"
                        @pageChange="pageSizeChange" />
        </div>
      </el-card>
      <Add v-if="visible"
           :visible.sync="visible"
           :billCodeText="billCodeText"
           :detail="detail"></Add>
    </div>
  </div>
</template>

<script>
import HeaderSearch from "@/components/CommonHeadSearch/ZSearch";
import commonTable from "@/components/CommonTable";
import { getDataList } from "@/api/marketOrder";
import zhuMiXins from "@/lib/orderZhu";
import { deepCopy } from "@/lib/common";
import Add from "./add"


import { addStockTypeApi, deleteStockTypeApi, searchStockTypeApi, searchStockTypeListApi, stockTypeUpdateApi } from "@/api/wareManagementApi/stockType";

export default {
  name: "PurchasingType",
  components: {
    HeaderSearch,
    commonTable,
    Add
  },
  mixins: [zhuMiXins],
  data () {
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
      billCodeText: "新增类型",
      detail: {}
    };
  },

  mounted () {
    this.getDataList();
  },

  computed: {
    /**
     * @desc 上面的查询条件  最好放到computed里面 当里面相关的参数发生改变  这个数据就会更新一次
     */
    searchArr () {
      return [
        {
          label: "类型名称",
          value: "name",
          type: 1,
          maxLength: 40,
        },
        {
          label: '出/入',
          value: 'inOutType',
          optionLabel: 'label',
          optionValue: 'value',
          type: 2,
          selectOption: [{
            label: '出库',
            value: 1
          }, {
            label: '入库',
            value: 2
          }]
        }, {
          label: '客商类型',
          value: 'checkItemType',
          optionLabel: 'label',
          optionValue: 'value',
          type: 2,
          selectOption: [{
            label: '类型1',
            value: 1
          }, {
            label: '类型2',
            value: 2
          }]
        }
      ];
    },

    /**
     * @desc 上面显示的表格行
     */

    tableColumn () {
      return [
        //表格显示的列
        {
          type: "index",
          label: "序号",
        },
        {
          prop: "name",
          label: "类型名称",
          width: 200,
          render: (h, scope) => {
            return h(
              'a',
              {
                style: {
                  color: "blue",
                },
                on: {
                  click: () => {
                    this.openEdit('detail', scope.row)
                  }
                }
              },
              scope.row.billNo
            )
          }
        },
        {
          prop: "billNo",
          label: "类型编码",
          width: 120
        },
        {
          prop: "inOutType",
          label: "出/入",
          width: 100
        }, {
          prop: "checkItemType",
          label: "客商类型",
          width: 120
        },
        {
          prop: "subTypeName",
          label: "子类类型",
          width: 100
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
    initForm () {
      let params = {
        current: 1,
        size: 30,
        name: this.queryForm.name,  //类型名称
        inOutType: this.queryForm.inOutType, //出入库类型
        checkItemType: this.queryForm.checkItemType //客商类型
      };
      return params;
    },


    /**
     * @desc 新增编辑详情
     */

    openEdit (type, params) {
      let data = {
        type,
        data: params || {},
      };
      this.billCodeText = type == 'add' ? '新增类型' : type == 'edit' ? '编辑类型' : '查看类型';
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
          this.detail = deepCopy(this.multipleSelection[0]);
        }
      }
      // this.$emit("submit", data);
      this.visible = true
    },

    /**
     * @desc 设置选中的表格行
     */
    handleItemSelect (val) {
      this.multipleSelection = val;
      this.selectRow = val[0];
    },

    /**
     * @desc 清除表格的选中项
     */
    clearSelcte () {
      if (this.$refs.mainTable) {
        this.$refs.mainTable.resetSelect();
      }
    },
    /**
     * @desc 获取订单的列表  searchStockTypeListApi
     */
    getDataList () {
      this.loading = true;
      let params = this.initForm();
      this.clearSelcte();
      console.log('我是查询参数', params)
      searchStockTypeListApi(params)
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
    searchMethod (data) {
      console.log("我是查询条件", data)
      this.queryForm = data;
      this.pageParams.pageNum = 1;
      this.getDataList();
    },

    /**
     * @desc 分液器发生改变的方法
     */

    pageSizeChange (data) {
      this.pageParams.pageNum = data.page;
      this.pageParams.pageSize = data.limit;

      this.getDataList();
    },

    /**
     * @desc 上面的按钮进行的操作
     */
    operationFun (type) {
      let objText = {
        delete: {
          text: "确认删除选中的数据吗？",
          fun: this.delData,
          check: this.checkOperation,
          key: "billStatus",
          value: "12345",
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
        .catch(() => { });
    },
    //删除事件
    delData () {
      let params = {
        ids: [1, 2, 3]
      }
      deleteStockTypeApi(params).then((res) => {
        if (res.success) {
          this.$message('删除成功!')
        }
      }).catch(() => {

      })
    },
  },
};
</script>


<style lang='less' scoped>
</style>
