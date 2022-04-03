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
        <el-button @click="handleUpload" style="margin-top: -2px;"
          >导入</el-button
        >
        <!-- <el-button class="delButton" @click="operationFun('delete')"
          >删除</el-button
        > -->
        <el-button @click="handleDataPermission">数据权限配置</el-button>
      </div>
    </div>
    <div class="z-content">
      <el-card>
        <!-- 搜索条件 -->
        <header-search
          :searchArr="searchArr"
          @sureSearch="searchMethod"
          ref="theSearch"
        >
          <slot>
            <!-- <el-button @click="handleUpload" style="margin-top: -2px;"
              >导入</el-button
            > -->
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
      <div v-if="visible">
        <Add
          :visible.sync="visible"
          @getparentlist="() => getDataList()"
          :billCodeText="billCodeText"
          :detail="detail"
        ></Add>
      </div>
      <div v-if="theVisible">
        <Datapermission
          v-if="theVisible"
          :theVisible.sync="theVisible"
          :selectRow="selectRow"
        ></Datapermission>
      </div>
      <Import :pushVisible.sync="pushVisible"></Import>
    </div>
  </div>
</template>

<script>
import HeaderSearch from "@/components/CommonHeadSearch/ZSearch";
import commonTable from "@/components/CommonTable";
import zhuMiXins from "@/lib/orderZhu";
import { deepCopy } from "@/lib/common";
import Add from "./add";
import Datapermission from "./datapermission";
import { userListAll } from "@/api/apizhu";
import Import from "./Import";

import {
  fileGet,
  userAddOne,
  userGetDetail,
  dictDataList,
  deleteSelect,
  companyListSelect,
  departmentListSelect,
  theDepartmentListSelect
} from "@/api/apizhu";
export default {
  name: "PurchasingType",
  components: {
    HeaderSearch,
    commonTable,
    Add,
    Datapermission,
    Import
  },
  mixins: [zhuMiXins],
  data() {
    return {
      pushVisible: false, //导入数据

      theVisible: false, //展示数据权限

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
      billCodeText: "新增员工",
      detail: {},
      unitTypeList: [],
      departmentList: [],
      companyId: "",
      departmentId: ""
    };
  },

  mounted() {
    this.getDataList();
    let data = {
      current: 1,
      size: 30
    };

    companyListSelect(data).then(res => {
      if (res.success) {
        // console.log(res.data.records);
        console.log("李大芬");
        this.unitTypeList = res.data.records;
      }
    });
  },

  computed: {
    /**
     * @desc 上面的查询条件  最好放到computed里面 当里面相关的参数发生改变  这个数据就会更新一次
     */
    searchArr() {
      return [
        {
          label: "姓名/手机号",
          value: "keyword",
          type: 1,
          maxLength: 40
        },
        {
          type: 2,
          label: "所属公司",
          value: "companyId",
          selectOption: this.unitTypeList,
          optionLabel: "name",
          optionValue: "id",
          clearable: true,

          listeners: {
            change: (e, b) => {
              this.$set(this.$refs.theSearch.formParams, "departmentId", "");

              if (e != "") {
                let data = {
                  companyId: e
                };
                // 部门
                departmentListSelect(data).then(res => {
                  console.log(res);
                  if (res.success) {
                    this.departmentList = res.data.records;
                  }
                });
              }
            }
          }
        },
        {
          type: 2,
          label: "所属部门",
          value: "departmentId",
          selectOption: this.departmentList,
          optionLabel: "fullName",
          optionValue: "id"
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
          label: "序号"
        },
        {
          prop: "fullName",
          label: "姓名",
          width: 120
        },
        {
          prop: "phone",
          label: "手机号(登录名)",
          width: 200
        },

        {
          prop: "sex",
          label: "性别",
          width: 80,
          render: (h, scope) => {
            return h("a", {}, scope.row.sex == 1 ? "男" : "女");
          }
        },
        {
          prop: "email",
          label: "邮箱",
          width: 250
        },
        {
          prop: "isEnable",
          label: "是否可用",
          align: "center",
          width: 120,
          render: (h, scope) => {
            // console.log(h,scope);
            // let bool = scope.row.isEnabled == 1 ? true : false;
            let bool = scope.row.usable == 1 ? true : false;

            return h("el-checkbox", {
              attrs: {
                disabled: true,
                value: bool
              }
            });
          }
        },

        {
          prop: "createUserFullName",
          label: "创建人",
          width: 120
        },
        {
          prop: "createTime",
          label: "创建时间",
          width: "200"
        },
        {
          prop: "",
          label: "",
          width: ""
        }
      ];
    }
  },

  methods: {
    handleUpload() {
      this.pushVisible = true;
    },

    handleDataPermission() {
      if (this.multipleSelection.length != 1) {
        this.$message.error("请选择一条操作项");
        return;
      }
      this.theVisible = true;
    },

    /**
     * @desc 新增编辑详情
     */

    openEdit(type, params) {
      console.log(type, params);
      let data = {
        type,
        data: params || {}
      };
      if (type === "edit") {
        console.log(type);
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
          this.billCodeText = "编辑员工";
          this.detail = deepCopy(this.multipleSelection[0]);
        }
      } else {
        this.billCodeText = "新增员工";
        console.log(this.billCodeText);

        this.detail = {};
      }
      // this.$emit("submit", data);
      this.visible = true;
    },
    /**
     * @desc 初始form表单 请求发送的数据
     */
    initForm() {
      let params = {
        current: this.pageParams.pageNum,
        size: this.pageParams.pageSize,
        keyword: this.queryForm.keyword,
        companyId: this.queryForm.companyId,
        departmentId: this.queryForm.departmentId,
        fullName: this.queryForm.fullName
        // checkItemName: this.queryForm.checkItemName,
      };

      return params;
    },

    /**
     * @desc 设置选中的表格行
     */
    handleItemSelect(val) {
      console.log(val);
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
      // console.log(params);
      this.clearSelcte();
      userListAll(params)
        .then(res => {
          console.log(res);
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
    searchMethod(data) {
      // console.log(data);
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
        .then(res => {
          objText[type].fun();
        })
        .catch(() => {});
    },
    //删除事件
    delData() {
      let id = this.selectRow.id;
      // console.log(id);
      deleteSelect(id)
        .then(res => {
          console.log(res);
          this.$message.success("删除数据成功");
          this.getDataList();
          this.clearSelcte();
          // this.tableData= this.tableData.filter(item=>item.id!==id)
        })
        .catch(error => {
          // console.log(error);
          // this.$message.error("删除数据失败");
        });
    }
  }
};
</script>

<style lang="less" scoped></style>
