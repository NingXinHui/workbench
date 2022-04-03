<!--
@time:2021/12/1
@author:chenqian
-->
<template>
  <div id="zPage">
    <!-- 按钮 -->
    <div class="z-header">
      <div class="z-header-button">
        <el-button @click="openEdit('add')">新增</el-button>
        <el-button @click="openEdit('edit')">编辑</el-button>
        <!-- <el-button class="delButton"
                   @click="operationFun('delete')">删除</el-button> -->
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
           :detail="detail"
           :type="type"
           @reflushPage="onReflushPage"></Add>
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

import { searchAgeMaintenceApi } from "@/api/wareManagementApi/ageMaintenance";

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
      billCodeText: "新增货龄",
      detail: {},
      type: 'add'
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
          label: "报表名称",
          value: "billName",
          type: 1,
          maxLength: 40,
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
          prop: "billName",
          label: "报表名称",
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
              scope.row.billName
            )
          }
        },
        {
          prop: "billNo",
          label: "报表编码",
          width: 120
        },
        {
          prop: "isDefault",
          label: "是否默认",
          width: "90",
          align: "center",
          render: (h, scope) => {
            return h(
              "el-checkbox",
              {
                props: {
                  value: scope.row.orderTypeName,
                  disabled: true,
                }
              }
            )
          }
        }, {
          prop: "usable",
          label: "是否可用",
          width: "90",
          align: "center",
          render: (h, scope) => {
            return h(
              "el-checkbox",
              {
                props: {
                  value: scope.row.orderTypeName,
                  disabled: true,
                }
              }
            )
          }
        },
        {
          prop: "count",
          label: "明细数量",
          width: 100
        }, {
          prop: "remark",
          label: "描述",
          width: 120
        },
        {
          prop: "updateUser",
          label: "更新人",
          width: 100
        },
        {
          prop: "updateTime",
          label: "更新时间",
          width: "170"
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
     * @desc 新增编辑详情
     */

    openEdit (type, params) {
      this.type = type
      let data = {
        type,
        data: params || {},
      };
      this.billCodeText = type == 'add' ? '新增货龄' : type == 'edit' ? '编辑货龄' : '查看货龄';
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
      if (type === "detail") {
        this.detail = data.data;
        console.log('我是查看的detail', this.detail)
      }
      // this.$emit("submit", data);
      this.visible = true
    },
    /**
     * @desc 初始form表单 请求发送的数据
     */
    initForm () {
      let params = {
        pageNo: this.pageParams.pageNum,
        pageSize: this.pageParams.pageSize,
        billName: this.queryForm.billName,
      };
      return params;
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
     * @desc 刷新页面
     */
    onReflushPage () {
      this.getDataList()
    },
    /**
     * @desc 获取订单的列表
     */
    getDataList () {
      this.loading = true;
      let params = this.initForm();
      console.log(params)
      this.clearSelcte();
      searchAgeMaintenceApi(params)
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
    delData () { },
  },
};
</script>


<style lang='less' scoped>
</style>
