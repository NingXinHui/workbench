<!--
@time:2021/9/24
@author:zhupeikang
-->
<template>
  <div id="zPage">
    <div class="z-header">
      <div class="z-header-button">
        <el-button @click="add(1)">新增</el-button>
        <!-- <el-button @click="add(2)">复制</el-button> -->
        <el-button @click="edit()">编辑</el-button>
        <!-- <el-button class="delButton" @click="del()">删除</el-button> -->
        <!--<el-button @click="config">参数设置</el-button>-->
      </div>
    </div>
    <div class="z-content">
      <el-card>
        <header-search :searchArr="searchArr" :model="searchValue" @sureSearch="searchMethod">
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
            :propTableHeight="130"
            @selePage="handleItemSelect"
            @pageChange="pageChange"
          />
        </div>
      </el-card>
    </div>
    <div>
      <add
        ref="add"
        v-if="visible"
        :visible.sync="visible"
        :is-copy="isCopy"
        :model="isAdd ? { usable: true, type: 0, } : { ...selectRow }"
        :is-add="isAdd"
        :form-column="formColumn"
        @submit="getForm"
      ></add>
    </div>

    <div class="popBox" v-if="configVisible">
      <div class="menu">
        <el-dialog :visible.sync="configVisible" title="参数设置">
          <div class="content">
            <div style="display: flex">
              <div class="z-content-table">
                <common-table
                  is-radio
                  is-selection
                  :tableheight="185"
                  :tableColumn="tableColumnConfig"
                  :table-data="tableColumnConfigData"
                  @selePage="handleCurrentChangeConfig"
                />
              </div>
              <div class="form">
                <z-form
                  :can-edit="
                    currentConfigRow !== undefined &&
                      currentConfigRow.hasOwnProperty('id')
                  "
                  ref="form"
                  :form-column="formColumnConfig"
                  :model="currentConfigRow"
                />
              </div>
            </div>
          </div>
          <div slot="footer">
            <el-button @click="configVisible = false">取消</el-button>
            <el-button
              type="primary"
              :disabled="
                currentConfigRow === undefined ||
                  !currentConfigRow.hasOwnProperty('id')
              "
              @click="sure"
              >确定
            </el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderSearch from "@/components/CommonHeadSearch/ZSearch";
import commonTable from "@/components/CommonTable";
import dialogControl from "@/lib/dialogControl";
import add from "@/components/AddUpdate";
import ZForm from "@/components/ZForm/ZForm";
import icons from "@/components/IconSelect/requireIcons";
import {
  queryEdit //编辑菜单
} from "@/api/systemzhu/index";
import {
  menuAddAndCopy,
  menuQueryAll, //获取菜单列表
  editById,
  queryAll,
  deleteMenu
} from "@/api/systemzhu/menu";
import { deepCopy } from "@/lib/common";

export default {
  name: "Menu",

  components: { HeaderSearch, commonTable, add, ZForm },

  mixins: [dialogControl],

  props: {},

  data() {
    let _this = this;

    return {
      options: [], //所有的菜单
      icons,
      currentConfigRow: {},
      configVisible: false,
      isCopy: false,
      selectRow: {},
      isAdd: true,
      pageParams: {
        loading: false,
        pageNo: 1,
        pageSize: 30,
        total: 0
      },
      searchValue: {
        usable:"1"
      }, //查询条件
      tableColumn: [
        {
          type: "index",
          label: "序号",
          width: 80
        },
        {
          prop: "name",
          label: "菜单名称",
          width: 200
        },
        {
          prop: "code",
          label: "菜单编号",
          width: 200
        },

        {
          prop: "orderNumber",
          label: "排序号",
          width: 120
        },
        {
          prop: "type",
          label: "菜单类型",
          width: 180,
          render: (h, scope) => {
            return h("span", {}, scope.row.type == "0" ? "菜单" : "按钮");
          }
        },
        {
          prop: "path",
          label: "路由地址",
          width: 320
        },
        {
          width: 80,
          prop: "usable",
          label: "是否可用",
          align: "center",
          render: (h, scope) => {
            return h("el-checkbox", {
              props: {
                value: scope.row.usable,
                disabled: "disabled"
              }
            });
          }
        },
        {
          prop: "remark",
          label: "备注",
          width: 300
        },

        {
          prop: "",
          label: ""
        }
      ],
      //参数配置表头项
      tableColumnConfig: [
        {
          width: 128,
          prop: "parameterName",
          label: "参数名称"
        },
        {
          width: 128,

          prop: "parameterCaption",
          label: "参数中文名称"
        },
        {
          prop: "controlType",
          label: "参数类型"
        },
        {
          width: 80,
          prop: "usable",
          label: "是否可用",
          align: "center",
          render: (h, scope) => {
            return h("el-checkbox", {
              props: {
                value: scope.row.usable,
                disabled: "disabled"
              }
            });
          }
        }
      ],

      tableColumnConfigData: [],
      tableData: [],
      searchArr: [
        // {
        //   label: "菜单编号",
        //   value: "code",
        //   type: 1
        // },
        {
          label: "菜单名称",
          value: "name",
          type: 1
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
      ],
      multipleSelection: [],
      formColumn: [
        {
          label: "菜单编号",
          field: "code",
          type: 1,
          disabled: false,
          rules: {
            required: true
          }
        },
        {
          label: "菜单名称",
          field: "name",
          type: 1,
          rules: {
            required: true
          }
        },
        {
          label: "菜单图标",
          field: "source",
          type: 21,
          optionList: icons,
          rules: {
            required: true
          }
        },
        {
          label: "选择菜单",
          field: "parentName",
          type: 22,
          optionList: [],
          rules: {
            required: true
          }
          // currentChange(row, column, cell, event){
          //   console.log(_this)
          //   _this.changeParams(row)
          // }
        },

        {
          label: "排序号",
          field: "orderNumber",
          type: 8,
          rules: {
            required: true
          }
        },
        {
          label: "路由地址",
          field: "path",
          type: 1,
          // disabled: true,
          maxLength: 26,
          rules: {
            required: true
          }
        },

        {
          // disabled: true,
          label: "网页地址",
          field: "component",
          maxLength: 66,
          type: 1,
          rules: {
            required: true
          }
        },
        {
          label: "菜单类型",
          field: "type",
          change: val => {
            if (val == 3) {
              this.formColumn[2].rules.required = false;
              this.formColumn[4].rules.required = false;
              this.formColumn[5].rules.required = false;
              this.formColumn[6].rules.required = false;
            } else {
              this.formColumn[2].rules.required = true;
              this.formColumn[4].rules.required = true;
              this.formColumn[5].rules.required = true;
              this.formColumn[6].rules.required = true;
            }
          },
          optionList: [
            {
              label: "菜单",
              value: 0
            },
            {
              label: "按钮",
              value: 1
            }
          ],
          optionValue: "value",
          optionLabel: "label",
          type: 86,
          rules: {
            required: true
          }
        },
        {
          label: "是否缓存",
          field: "cache",
          type: 7
        },
        {
          label: "是否可用",
          field: "usable",
          type: 7
        },
        {
          label: "备注",
          field: "remark",
          type: 4,
          maxlength: 200,
        }
      ],
      formColumnConfig: [
        {
          label: "参数名称",
          field: "parameterName",
          type: 1,
          disabled: true,
          rules: {
            required: true,
            trigger: "blur"
          }
        },
        {
          label: "参数中文名称",
          field: "parameterCaption",
          type: 1,
          disabled: true
        },
        {
          label: "sql语句",
          field: "valueScript",
          type: 1,
          disabled: true
        },
        {
          label: "参数值",
          field: "parameterValue",
          type: 1
        },
        {
          label: "录入方式",
          field: "controlType",
          type: 2,
          optionLabel: "label",
          optionValue: "value",
          disabled: true,
          optionList: [
            {
              label: "输入框",
              value: 1
            },
            {
              label: "下拉框",
              value: 2
            },
            {
              label: "下拉多选框",
              value: 3
            }
          ],
          rules: {
            required: true,
            trigger: "blur"
          }
        },

        {
          label: "参数描述",
          disabled: true,
          field: "parameterDescription",
          type: 4
        },
        {
          label: "是否可用",
          disabled: true,
          field: "usable",
          type: 7
        }
      ]
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
    del() {
      if (this.multipleSelection.length > 1) {
        this.$message({
          message: "此操作不允许多条同时编辑",
          type: "error",
          showClose: true
        });
        return;
      }
      this.$confirm("确认删除所选的数据吗？", "", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteMenu({
            id: this.multipleSelection[0].id
          }).then(res => {
            if (res.data) {
              this.$message.success("删除成功");
              this.getList();
            }
          });
        })
        .catch(() => {});
    },
    //更改表单
    changeParams(e) {
      this.$refs.add.$refs.form.formParams.path = e.path;
      this.$refs.add.$refs.form.formParams.component = e.component;
      this.$forceUpdate();
    },
    sure() {
      queryEdit(this.$refs.form.formParams).then(res => {
        console.log(res);
      });
    },
    //选中配置表格项数据
    handleCurrentChange(e) {
      e.checked = true;
    },
    //选中配置
    handleCurrentChangeConfig(e) {
      this.currentConfigRow = e[0];
      if (e[0].systemMenu) {
        this.formColumnConfig[3].disabled = true;
      } else {
        this.formColumnConfig[3].disabled = false;
      }
    },
    config() {
      if (this.multipleSelection.length > 1) {
        this.$message({
          message: "此操作不允许多条同时复制",
          type: "error",
          showClose: true
        });
        return;
      }
      if (this.multipleSelection.length < 1) {
        this.$message({
          message: "请选择数据后进行操作",
          type: "error",
          showClose: true
        });
        return;
      }

      if (this.selectRow.parentId == "0") {
        return this.$message.error("一级菜单不能编辑");
      }

      //  可以获取具体的路径 后端需要的
      let zhu = this.options.filter(item => item.id == this.selectRow.id)[0];
      if (!zhu) {
        return this.$message.error("请选择具体的菜单进行配置");
      }
      //
      let params = {
        router: zhu.value,
        id: zhu.id
        // menuId:zhu.id
      };
      queryAll(params).then(res => {
        this.tableColumnConfigData = res.data;
        if (res.data.length == 0) {
          this.currentConfigRow = {};
        }
      });

      this.configVisible = true;

      // 打开之前获取下菜单 并且将数据传递到组件里面
    },
    //获取编辑的表单信息
    getForm(e) {
      // 如果是复制的话
      if (e.id) {
        // 如果是复制的haul
        if (this.isCopy) {
          let { id, ...other } = e;
          menuAddAndCopy({
            ...other,
            icon: e.source,
            cache: e.cache ? true : false,
            usable: e.usable ? true : false,
            systemMenu: true
          }).then(res => {
            if (res.success) {
              this.$message.success("复制成功");
              this.visible = false;
              this.getList();
            } else {
              this.$message.error(res.msg);
            }
          });
        }
        // 如果是编辑的话
        else {
          editById({
            ...e,
            systemMenu: true,
            cache: e.cache ? true : false,
            usable: e.usable ? true : false,
            icon: e.source
          }).then(res => {
            if (res.success) {
              this.$message.success("修改成功");
              this.visible = false;

              this.getList();
            } else {
              this.$message.error(res.msg);
            }
          });
        }
      } else {
        menuAddAndCopy({
          ...e,
          systemMenu: true,
          cache: e.cache ? true : false,
          usable: e.usable ? true : false,
          icon: e.source
        }).then(res => {
          if (res.success) {
            this.$message.success("新增成功");
            this.visible = false;
            this.getList();
          } else {
            this.$message.error(res.msg);
          }
        });
      }
    },
    //获取数据
    getList() {
      let that = this;
      // this.pageParams.loading = true;
      menuQueryAll({...this.searchValue,
      usable: this.searchValue.usable == "all" ? "" : this.searchValue.usable
      }).then(res => {
        if (res.success) {
          this.pageParams.total = res.data.length;
          this.tableData = res.data;
          that.$refs.mainTable.resetSelect();
          this.pageParams.loading = false;

          this.nowRouter = res.data.filter(item => item.id);
          let nowoption = [];

          function returnPath(arr) {
            let path = "";
            arr[0] = arr[0].split("/")[1];
            arr.map(item => {
              path = path + "/" + item;
            });
            return path;
          }

          function a(arr, pathshow) {
            arr.map(item => {
              if (
                (pathshow && !item.children) ||
                (item.children && item.children.length == 0)
              ) {
                nowoption.push({
                  label: item.name,
                  id: item.id,
                  // value: pathshow[0] + "/" + pathshow[1] + "/" + item.path,
                  value: returnPath([...pathshow, item.path])
                });
              }
              if (item.children) {
                a(item.children, [...pathshow, item.path]);
              }
            });
          }

          a(this.nowRouter, []);
          this.options = nowoption;
        }
      });
    },
    //点击新增按钮
    add(num) {
      this.formColumn[0].disabled = false;
      if (num == "2") {
        this.formColumn[0].disabled = false;
        this.isCopy = true;
        if (this.multipleSelection.length > 1) {
          this.$message({
            message: "此操作不允许多条同时复制",
            type: "error",
            showClose: true
          });
          return;
        }
        if (this.multipleSelection.length < 1) {
          this.$message({
            message: "请选择数据后进行操作",
            type: "error",
            showClose: true
          });
          return;
        }
      }

      menuQueryAll({type:0}).then(res => {
        if (res.success) {
          // 因为没有新增  本地开发有点问题 测服的时候去除

          this.formColumn[3].optionList = [
            { name: "顶级", id: "0" },
            ...res.data
          ];
          // 因为没有新增  本地开发有点问题 测服的时候去除
          // if (this.selectRow.parentId == '0') {
          //   this.selectRow.parentName = '顶级'
          // }
          this.isAdd = false;
          this.isCopy = true;
          if (num == 1) {
            this.formColumn[5].disabled = false;
            this.formColumn[6].disabled = false;
            this.isAdd = true;
          }
          this.openDialog().then(() => {
            this.$refs.add.$refs.form.formParams.code = "";
          });
        }
      });
    },
    //点击编辑按钮
    edit(e) {
      if (this.multipleSelection.length > 1) {
        this.$message({
          message: "此操作不允许多条同时编辑",
          type: "error",
          showClose: true
        });
        return;
      }
      if (this.multipleSelection.length < 1) {
        this.$message({
          message: "请选择数据后进行操作",
          type: "error",
          showClose: true
        });
        return;
      }
      this.formColumn[0].disabled = true;
      if (this.selectRow.type == 3) {
        this.formColumn[2].rules.required = false;
        this.formColumn[4].rules.required = false;
        this.formColumn[5].rules.required = false;
        this.formColumn[6].rules.required = false;
      } else {
        this.formColumn[2].rules.required = true;
        this.formColumn[4].rules.required = true;
        this.formColumn[5].rules.required = true;
        this.formColumn[6].rules.required = true;
      }
      menuQueryAll({type:0}).then(res => {
        if (res.success) {
          this.formColumn[3].optionList = [
            { name: "顶级", id: "0" },
            ...res.data
          ];
          // 因为没有新增  本地开发有点问题 测服的时候去除
          if (this.selectRow.parentId == "0") {
            this.selectRow.parentName = "顶级";
          }
          this.isAdd = false;
          this.isCopy = false;
          this.visible = true;
        }
      });
    },
    //点击删除按钮
    // del() {
    //   this.$confirm("确认删除所选的数据吗？", "", {
    //     confirmButtonText: "确认",
    //     cancelButtonText: "取消",
    //     type: "warning",
    //   })
    //       .then(() => {
    //         this.$message({
    //           type: "success",
    //           message: "删除成功!",
    //         });
    //       })
    //       .catch(() => {
    //       });
    // },
    searchMethod(value) {
      this.searchValue = value;

      this.getList();
    },
    //选择事件
    handleItemSelect(val) {
      this.selectRow = val[0];
      this.multipleSelection = val;
    },
    //翻页事件
    pageChange(e) {
      this.pageParams.pageNo = e.page;
      this.pageParams.pageSize = e.limit;
      this.getList();
    }
  },
  beforeUpdate() {},

  updated() {},

  activated() {},

  deactivated() {},

  beforeDestroy() {},

  destroyed() {}
};
</script>

<style scoped lang="less">
/deep/ .popBox {
  .menu {
    .el-dialog {
      width: 1090px !important;
      height: 295px !important;
    }
  }
}
</style>
