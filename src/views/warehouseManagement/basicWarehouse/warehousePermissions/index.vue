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
                        :isSelectMore="true"
                        :loading="loading"
                        :pageParams="pageParams"
                        @selePage="handleItemSelect"
                        @pageChange="pageSizeChange" />
        </div>
      </el-card>
      <Add v-if="showAddBox"
           :showAddBox.sync="showAddBox"
           :billCodeText="billCodeText"
           @initList="onInitList"
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


import { searchJurisdictionListApi, addJurisdictionApi, deleteJurisdictionApi, searchJurisdictionApi, jurisdictionUpdateApi } from "@/api/wareManagementApi/permissionMaintenance";



import Add from "./add"
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
      showAddBox: false,
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
          label: "用户名称",
          value: "userName",
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
          prop: "userId",
          label: "用户编号",
          width: 200,
        },
        {
          prop: "userName",
          label: "用户名称",
          width: 200
        },
        {
          prop: "warehouseNo",
          label: "仓库权限",
          width: 200
        },
        {
          prop: "",
          label: "",
        }
      ];
    },
  },

  methods: {
    //子组件传递确认事件
    onInitList () {
      this.getDataList()
    },
    /**
     * @desc 新增编辑详情
     */

    openEdit (type, params) {
      let data = {
        type,
        data: params || {},
      };
      this.billCodeText = type == 'add' ? '新增' : type == 'edit' ? '编辑' : '查看';
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
      this.showAddBox = true
    },
    /**
     * @desc 初始form表单 请求发送的数据
     */
    initForm () {
      let params = {
        current: this.pageParams.pageNum,
        size: this.pageParams.pageSize,
        userName: this.queryForm.userName
        // billNo: this.queryForm.billNo,
        // checkItemName: this.queryForm.checkItemName,
      };
      // if (Array.isArray(this.queryForm.createDate)) {
      //   let time = this.queryForm.createDate;

      //   params.beginDate = time[0] + " 00:00:00";
      //   params.endDate = time[1] + " 23:59:59";
      // }
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
      searchJurisdictionListApi(params)
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
    delData () {
      let ids = []
      this.multipleSelection.map((item, v) => {
        ids.push(item.id)
      })
      let params = {
        ids: ids.toString()
      }
      deleteJurisdictionApi(params).then((res) => {
        if (res.success) {
          this.$message.success("删除成功!")
        }
      }).catch()
    },
  },
};
</script>


<style lang='less' scoped>
</style>
