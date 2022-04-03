<!--
@time:2021/12/1
@author:chenqian
-->
<template>
  <div id="zPage">
    <!-- 按钮 -->
    <div class="z-header">
      <div class="z-header-button">
        <el-button v-if="isShowPermiss('system:warehouse:addArea')"
                   @click="openEdit('area')">新增地区</el-button>
        <el-button @click="openEdit('ware')">新增仓</el-button>
        <el-button @click="openEdit('house')">新增库</el-button>
        <el-button @click="openEdit('last')">新增仓位</el-button>
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
      <Add :visible.sync="visible"
           :billCodeText="billCodeText"
           :detail="detail"></Add>
      <Addarea v-if="areaVisible"
               :areaVisible.sync="areaVisible"
               :billCodeText="billCodeText"
               :detail="detail"></Addarea>
      <AddHouse v-if="houseVisible"
                :houseVisible.sync="houseVisible"
                :billCodeText="billCodeText"
                :detail="detail"></AddHouse>
      <AddWare v-if="wareVisible"
               :wareVisible.sync="wareVisible"
               :billCodeText="billCodeText"
               :detail="detail"></AddWare>
    </div>
  </div>
</template>

<script>
import HeaderSearch from "@/components/CommonHeadSearch/ZSearch";
import commonTable from "@/components/CommonTable";
import { getDataList } from "@/api/marketOrder";
import zhuMiXins from "@/lib/orderZhu";
import { deepCopy } from "@/lib/common";
import Addarea from "./addArea.vue";
import AddHouse from "./addHouse"
import AddWare from "./addWare"
import Add from "./add"
export default {
  name: "BaseWarehouse",
  components: {
    HeaderSearch,
    commonTable,
    Add, Addarea, AddHouse, AddWare
  },
  mixins: [zhuMiXins],
  data () {
    return {
      areaVisible: false, //新增地区
      houseVisible: false, //新增库
      wareVisible: false, //新增仓
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
      billCodeText: "新增",
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
          label: "编号",
          value: "billNo",
          type: 1,
          maxLength: 40,
        },
        {
          label: "名称",
          value: "billNo",
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
          prop: "billNo",
          label: "编号",
          render: (h, scope) => {
            return h(
              'a',
              {
                style: { color: "blue" },
                on: {                  click: () => {

                  }
                }
              },
              scope.row.billNo
            )
          }
        },
        {
          prop: "billNo",
          label: "地区名称",
        },
        {
          prop: "billNo",
          label: "仓名称",
        },
        {
          prop: "billNo",
          label: "库名称",
        },
        {
          prop: "billNo",
          label: "仓位名称",
        },
        {
          prop: "billNo",
          label: "库位容量",
        }, {
          prop: "billNo",
          label: "省市区",
        },
        {
          prop: "billNo",
          label: "详细地址",
        },
        {
          prop: "customerOrderNo",
          label: "管理员",
        },
        {
          prop: "billDate",
          label: "联系电话",
          width: "170"
        }
      ];
    },
  },

  methods: {
    /**
     * @desc 新增编辑详情
     */

    openEdit (type, params) {
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
      if (type == 'area') {
        this.areaVisible = true;
        this.billCodeText = "新增地区";
      } else if (type == 'ware') {
        this.billCodeText = "新增仓";
        this.wareVisible = true
      } else if (type == 'house') {
        this.billCodeText = "新增库";
        this.houseVisible = true
      } else {
        this.billCodeText = "新增库位";
        this.visible = true;
      }
    },
    /**
     * @desc 初始form表单 请求发送的数据
     */
    initForm () {
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
