<!--
@time:2021/9/24
@author:zhupeikang
-->
<template>
  <div id="zPage">
    <div class="z-header">
      <div class="z-header-button">
        <el-button @click="add()">新增</el-button>
        <el-button @click="edit()">编辑</el-button>
        <!-- <el-button class="delButton" @click="del">删除</el-button> -->
      </div>
    </div>
    <div class="z-content">
      <el-card>
        <header-search :searchArr="searchArr" @sureSearch="searchMethod">
        </header-search>
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
              @selePage="handleItemSelect"
              @pageChange="pageChange"
          />
        </div>
      </el-card>
    </div>
    <div v-if="visible">
      <add v-if="visible"
          :visible.sync="visible"
          :detail="isAdd?{}:selectRow"
          :billCodeText="billCodeText"
          :form-column="formColumn"
      ></add>
    </div>
  </div>
</template>

<script>
import HeaderSearch from "@/components/CommonHeadSearch/ZSearch";
import commonTable from "@/components/CommonTable";
import dialogControl from "@/lib/dialogControl";
import add from "./add";
import {roleList,deleteRole} from "@/api/systemzhu/role";

import {
  roleDeleteById,
} from "@/api/systemzhu/index";

export default {
  name: "index",

  components: {HeaderSearch, commonTable, add},

  mixins: [dialogControl],

  props: {},

  data() {
    return {
      roleDialog: false,
      selRoleIds: [],
      data: [],
      selectRow: {},
      billCodeText:"新增",
      isAdd: true,
      pageParams: {
        loading: false,
        pageNo: 1,
        pageSize: 30,
        total: 0,
      },
      name: "",
      tableColumn: [
        {
          type: "index",
          label: "序号",
          width: 80,
        },

        {
          prop: "name",
          label: "角色名称",
          width:150,
          render: (h,scope) => {
            return h('a',{
              style: {
                color:"blue",
              },
              on: {
                click: () => {
                  this.billCodeText = '查看';
                  this.selectRow = scope.row;
                  this.isAdd = false;
                  this.visible = true;
                }
              }
            },
            scope.row.name
            )
          }
        },
        {
          prop: "companyName",
          label: "所属公司",
          width:200,
        },{
          prop: "usable",
          label: "是否可用",
          align:'center',
          width:70,
          render:(h,scope) => {
            return h(
              'el-checkbox',
              {
                props: {
                  value:scope.row.usable,
                  disabled:true
                }
              }
            )
          }
        }, {
          prop: "remark",
          label: "备注",
          width:200,
        },{
          prop: "",
          label: "",
        },
      ],
      tableData: [],
      searchArr: [
        {
          label: "角色名称",
          value: "name",
          type: 1,
        },
      ],
      multipleSelection: [],
      formColumn: [
        {
          label: "角色名称",
          field: "roleName",
          type: 1,
          rules: {
            required: true,
            trigger: 'blur',
          },
        },
        {
          label: "描述",
          field: "remark",
          type: 1,
        },

        {
          label: "是否可用",
          field: "usable",
          type: 7,
        },
      ],
    };
  },
  computed: {},

  watch: {},

  beforeCreat() {
  },

  created() {
  },

  beforeMount() {
  },

  mounted() {
    this.getList();
  },
  methods: {

    //获取数据
    getList() {
      // this.pageParams.loading = true;
      let {pageNo = 1, pageSize = 10} = this.pageParams;
      let params = {
       current: pageNo,
        size:pageSize,
        name: this.name,
      };
      roleList(params).then((res) => {
        this.$refs.mainTable.resetSelect();
        if (res.success) {
          this.pageParams.total = res.data.total;
          this.tableData = res.data.records;
          this.pageParams.loading = false;
        }
      });
    },
    //点击新增按钮
    add() {
      this.isAdd = true;
      this.billCodeText = '新增';
      this.openDialog();
    },
    //点击编辑按钮
    edit(e) {
      if (this.multipleSelection.length > 1) {
        this.$message({
          message: "此操作不允许多条同时编辑",
          type: "error",
          showClose: true,
        });
        return;
      }
      if (this.multipleSelection.length < 1) {
        this.$message({
          message: "请选择数据后进行操作",
          type: "error",
          showClose: true,
        });
        return;
      }
      this.isAdd = false;
      this.billCodeText = '编辑';
      this.visible = true;
    },
    //点击删除按钮
    del() {
      if (!this.multipleSelection.length) {
        this.$message({
          message: "请选择数据后进行操作",
          type: "error",
          showClose: true,
        });
        return;
      }
      if (!this.selectRow.usable) {
        this.$message.warning('不可操作')
        return false
      }
      this.$confirm("确认删除所选的数据吗？", "", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
          .then(() => {
            deleteRole({id: this.selectRow.id}).then((res) => {
              if (res.success) {
                this.getList();
                return this.$message.success("删除成功");
              } else {
                this.$message.error(res.msg);
              }
            });
          })
          .catch(() => {
          });
    },
    searchMethod(e) {
      this.name = e.name;
      this.pageParams.pageNo = 1;
      this.getList();
    },
    //选择事件
    handleItemSelect(val) {
      this.selectRow = val.filter(
          (item) => !this.multipleSelection.includes(item)
      )[0];
      this.multipleSelection = val;
      this.selectRow = val[0];
    },
    //翻页事件
    pageChange(e) {
      this.pageParams.pageNo = e.page;
      this.pageParams.pageSize = e.limit;
      this.getList();
    },
  },
  beforeUpdate() {
  },

  updated() {
  },

  activated() {
  },

  deactivated() {
  },

  beforeDestroy() {
  },

  destroyed() {
  },
};
</script>

<style scoped lang="less">
.roleDialog {
  display: flex;
  flex-wrap: wrap;

  .item {
    flex-basis: 25%;
  }
}

/deep/ .el-tree-node {
  .el-tree-node__children {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
