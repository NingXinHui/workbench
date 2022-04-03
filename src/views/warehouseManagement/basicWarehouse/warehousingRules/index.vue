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
        <header-search :model="queryForm" :searchArr="searchArr"
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
import { searchstoreFeeRuleList } from "@/api/wareManagementApi/warehousingRules"
import { storeWarehouseApi } from "@/api/wareManagementApi/permissionMaintenance";
import Add from "./add"
export default {
  name: "WarehousingRules",
  components: {
    HeaderSearch,
    commonTable,
    Add
  },
  mixins: [zhuMiXins],
  data () {
    return {
      queryForm: {
        ruleType:"all",
        usable:"1"
      }, //上面查询的条件

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
      billCodeText: "新增规则",
      detail: {},
      warhouseList:[],
    };
  },

  mounted () {
    this.getDataList();
    this.storeWarehouseApi()
  },

  computed: {
    /**
     * @desc 上面的查询条件  最好放到computed里面 当里面相关的参数发生改变  这个数据就会更新一次
     */
    searchArr () {
      return [
        {
          label: "客商名称",
          value: "checkItemName",
          type: 1,
          maxLength: 40,
        }, {
          label: "仓库名称",
          value: "warehouseId",
          optionLabel: 'warehouseName',
          optionValue: 'id',
          type: 2,
          maxLength: 40,
          selectOption: this.warhouseList,
        },
        {
          label: "规则类型",
          value: "ruleType",
          optionLabel: 'label',
          optionValue: 'value',
          type: 2,
          selectOption: [
            {
              label: "全部",
              value: "all"
            },
            {
              label: "仓储费规则",
              value: "1"
            },
            {
              label: "外部仓储费",
              value: "2"
            }
          ]
        },
        {
          label: "是否可用",
          value: "usable",
          optionLabel: 'label',
          optionValue: 'value',
          type: 2,
          selectOption: [
            {
              label: "全部",
              value: "all"
            },
            {
              label: "是",
              value: "1"
            },
            {
              label: "否",
              value: "0"
            }
          ]
        },
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
          prop: "ruleName",
          label: "规则名称",
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
              scope.row.ruleName
            )
          }
        },
        {
          prop: "ruleType",
          label: "规则类型",
          width: 120,
           render: (h, scope) => {
            return h(
              'span',
              {
              },
              scope.row.ruleType == '1' ? '仓储费规则' : '外部仓储费规则'
            )
          }
        },
        {
          prop: "inventoryNatureName",
          label: "库存性质",
          width: 100
        },
         {
          prop: "checkItemName",
          label: "客商名称",
        },
          {
          prop: "warehouseName",
          label: "仓库名称",
        },
        {
          prop: "usable",
          label: "是否可用",
          render: (h, scope) => {
            return h(
              'el-checkbox',
              {
                props: {
                  value: scope.row.usable,
                  disabled: true,
                }
              }
            )
          },
          width: 70,
          align: "center",
        }, {
          prop: "remark",
          label: "备注",
        },
        {
          prop: "",
          label: "",
        }
      ];
    },
  },

  methods: {
    //查询所有的仓库
    storeWarehouseApi() {
      storeWarehouseApi({
        current: 1,
        size: 50
      }).then(res => {
        if (res.code == 0) {
          this.warhouseList = res.data.records;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    /**
     * @desc 新增编辑详情
     */

    openEdit (type, params) {
      let data = {
        type,
        data: params || {},
      };
      this.billCodeText = type == 'add' ? '新增规则' : type == 'edit' ? '编辑规则' : '查看规则';
      if(this.billCodeText == '查看规则') {
        this.detail = params;
      }
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
     * @desc 初始form表单 请求发送的数据
     */
    initForm () {
      let params = {
        current: this.pageParams.pageNum,
        size: this.pageParams.pageSize,
        checkItemName: this.queryForm.checkItemName,
        warehouseId: this.queryForm.warehouseId,
        usable: this.queryForm.usable == "all" ? "" : this.queryForm.usable,
        ruleType: this.queryForm.ruleType == "all" ? "" : this.queryForm.ruleType
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
     * @desc 获取订单的列表
     */
    getDataList () {
      this.loading = true;
      let params = this.initForm();
      this.clearSelcte();
      searchstoreFeeRuleList(params)
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
