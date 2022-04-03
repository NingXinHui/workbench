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
                        :isSelectMore="false"
                        :loading="loading"
                        :ispage="false"
                        :propTableHeight="130"
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
import { geteDpartmentList, deleteDpartment } from "@/api/systemzhu/department";
import zhuMiXins from "@/lib/orderZhu";
import { deepCopy } from "@/lib/common";
import { selectCompany } from "@/api/systemzhu/role";
import Add from "./add";
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
        total: 0
      },
      multipleSelection: [], //表格选中的
      selectRow: {}, //选中的是哪一个
      visible: false,
      billCodeText: "新增",
      detail: {},
      companyList: []
    };
  },

  mounted () {
    this.getDataList();
    this.selectCompany();
  },

  computed: {
    /**
     * @desc 上面的查询条件  最好放到computed里面 当里面相关的参数发生改变  这个数据就会更新一次
     */
    searchArr () {
      return [
        {
          label: "部门名称",
          value: "fullName",
          type: 1,
          maxLength: 40
        },
        {
          label: "所属公司",
          value: "companyId",
          type: 2,
          selectOption: this.companyList,
          optionLabel: "name",
          optionValue: "id",
          maxLength: 40
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
          label: "序号"
        },
        {
          prop: "departmentNo",
          label: "部门编号",
          width: 240
        },
        {
          prop: "fullName",
          label: "部门名称",
          width: 240
        },
        {
          prop: "companyName",
          label: "所属公司",
          width: 240
        },
        {
          prop: "remark",
          label: "备注",
          width: 240
        },
        {
          prop: "",
          label: ""
        }
      ];
    }
  },

  methods: {
    //企业下拉
    selectCompany () {
      selectCompany({
        pageNo: 1,
        pageSize: 50
      }).then(res => {
        if (res.code == 0) {
          this.companyList = res.data.records;
        }
      });
    },
    /**
     * @desc 新增编辑详情
     */

    openEdit (type, params) {
      let data = {
        type,
        data: params || {}
      };
      this.billCodeText = "新增部门";
      this.detail = {};
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
          this.billCodeText = "编辑部门";
          this.detail = deepCopy(this.multipleSelection[0]);
        }
      }
      // this.$emit("submit", data);
      this.visible = true;
    },
    /**
     * @desc 初始form表单 请求发送的数据
     */
    initForm () {
      let params = {
        current: 1,
        size: 500,
        companyId: this.queryForm.companyId,
        fullName: this.queryForm.fullName
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
     * @desc 获取订单的列表
     */
    getDataList () {
      this.loading = true;
      let params = this.initForm();
      this.clearSelcte();
      geteDpartmentList(params)
        .then(res => {
          this.loading = false;
          this.tableData = res.data.records;
          this.pageParams.total = res.data.total;
        })
        .catch(error => {
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
          text: "确认删除选中的数据？",
          fun: this.delData,
          check: this.checkOperation,
          key: "billStatus",
          value: "12345"
        }
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
        type: "warning"
      })
        .then(() => {
          objText[type].fun();
        })
        .catch(() => { });
    },
    //删除事件
    delData () {
      deleteDpartment({ id: this.selectRow.id }).then(res => {
        if (res.success) {
          this.$message.success("操作成功");
          this.getDataList();
        } else {
          this.$message.error(res.msg);
        }
      });
    }
  }
};
</script>

<style lang="less" scoped></style>
