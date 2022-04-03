<!--
@time:2021/12/1
@author:chenqian
-->
<template>
  <div>
    <div class="popBox">
      <el-dialog
        :title="billCodeText"
        :visible="visible"
        @close="close"
        :close-on-click-modal="false"
        :modal="visibleshow ? false : false"
      >
        <div class="content">
          <div class="form">
            <el-form>
              <el-form-item
                label="角色名称"
                required
                class="formOne"
                style="flex-basis:0%"
              >
                <el-input  :disabled="billCodeText=='查看'"
                  v-model.trim="queryForm.name"
                  placeholder="请输入"
                ></el-input>
                <!-- <el-tooltip
                class="item"
                effect="dark"
                content="提示文字"
                placement="bottom"
              >
                <el-button> ?</el-button>
              </el-tooltip> -->
              </el-form-item>
              <el-form-item
                label="所属公司"
                class="searchBtn"
                required
                style="flex-basis:0%"
              >
                <el-button
                  type="text"
                  class="rightBtn"  :disabled="billCodeText=='查看'"
                  @click="visibleshow = true"
                  icon="el-icon-search"
                ></el-button>
                <el-select  :disabled="billCodeText=='查看'"
                  :filterable="true"
                  placeholder="请选择"
                  v-model="queryForm.companyId"
                  remote
                  clearable
                >
                  <el-option
                    v-for="o in options"
                    :key="o.name"
                    :label="o.name"
                    :value="o.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="是否可用"
                class="formOne"
                style="flex-basis:0%"
              >
                <el-checkbox v-model="queryForm.usable" :disabled="billCodeText=='查看'"></el-checkbox>
              </el-form-item>
            </el-form>
          </div>
          <div class="pl-20 pr-20">
            <div class="tiltle">
              功能选择
              <!-- <el-tooltip
              class="item"
              effect="dark"
              content="提示文字"
              placement="bottom"
            >
              <el-button> ?</el-button>
            </el-tooltip> -->
            </div>
              <div style="height:333px;border:1px solid #ccc;border-radius:5px">
              <el-tabs v-model="activeName">
                <el-tab-pane label="PC端" name="first">
                    <div style="height:280px;overflow-y:auto;z-index:11111111111111111">
                      <el-tree style="width:400px"
                         ref="tree"
                        :data="tableData"
                        show-checkbox
                        :disabled="billCodeText=='查看'"
                        node-key="id"
                        default-expand-all
                        :default-checked-keys="selRoleIds"
                        @check="setcheckbox"
                        :props="defaultProps"
                      >
                      </el-tree>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="移动端" name="second"></el-tab-pane>
              </el-tabs>
              </div>
          </div>
          <div class="form mt-10">
            <el-form>
              <el-form-item label="备注" class="formTwo" style="flex-basis:90%;margin-left:-30px !important">
                <el-input
                  v-model="queryForm.remark"
                  maxlength="200"  :disabled="billCodeText=='查看'"
                  placeholder="请输入"
                  type="textarea"
                  show-word-limit
                ></el-input>
                <!-- <el-tooltip
                class="item"
                effect="dark"
                content="提示文字"
                placement="bottom"
              >
                <el-button> ?</el-button>
              </el-tooltip> -->
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div slot="footer" class="mt-10">
          <el-button @click="close">取消</el-button>
           <el-button type="primary" v-if="billCodeText=='查看'" @click="edit">编辑</el-button>
        <el-button type="primary" v-if="billCodeText!='查看'" @click="submit">确认</el-button>
        </div>
      </el-dialog>
    </div>
    <look-up
      class="lookup"
      v-if="visibleshow"
      :isSelectMore="false"
      :title="look.title"
      :visible.sync="visibleshow"
      :isClearAll="true"
      @setCheckItem="popSubmit"
      :params="look.params"
      :method="look.methods"
      :table-column="look.tableColumn"
      :search-arr="look.searchArr"
      :lookWidth="'565px !important'"
    ></look-up>
  </div>
</template>

<script>
import formList from "@/components/Form/formList";
import { checkFormData } from "@/lib/common";
import { menuQueryAll } from "@/api/systemzhu/menu";
import {
  addRole,
  updateRole,
  selectCompany,
  searchRole
} from "@/api/systemzhu/role";
import lookUp from "@/components/ZLookUp/lookUp";
export default {
  name: "add",
  components: { formList, lookUp },

  mixins: [],

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    billCodeText: {
      type: String,
      default: ""
    },
    detail: {
      type: Object,
      default: {}
    }
  },

  data() {
    return {
      tableData: [],
      options: [],
      selRoleIds: [],
      halfCheckedKeys: [],
      visibleshow: false,
      activeName: "first",
      queryForm: {},
      defaultProps: {
        children: "children",
        label: "name",
        disabled:this.diabledtn
      },
      look: {
        title: "查询选择(公司)",
        params: {},
        searchArr: [
          {
            label: "公司名称",
            field: "checkCode",
            type: 1
          }
        ],
        methods: selectCompany,
        tableColumn: [
          {
            label: "公司名称",
            prop: "name"
          },
          {
            label: "公司简称",
            prop: "shortName"
          },
          {
            label: "",
            prop: ""
          }
        ]
      },
      formColumnConfig: [
        {
          label: "角色名称",
          key: "name",
          type: 1,
          rules: {
            required: true,
            trigger: "blur"
          }
        },
        {
          label: "所属公司",
          key: "companyId",
          type: 1,
          rules: {
            required: true,
            trigger: "blur"
          }
        }
      ]
    };
  },
  methods: {
    diabledtn() {
      if(this.billCodeText == '查看') {
        return true;
      }
       },
    edit() {
      this.$parent.billCodeText = '编辑';
    },
    setcheckbox(a, b) {
      this.halfCheckedKeys = b.halfCheckedKeys;
      this.selRoleIds = b.checkedKeys;
    },
    selectCompany() {
      selectCompany({
        pageNo: 1,
        pageSize: 50
      }).then(res => {
        if (res.code == 0) {
          this.options = res.data.records;
          if (this.billCodeText == "编辑"||this.billCodeText == "查看") {
            this.init();
          }
        }
      });
    },
    //查看详情
    init() {
      searchRole({
        id: this.detail.id
      }).then(res => {
        if (res.code == 0) {
          this.initQueryForm(res.data)
          let obj = [
            {
              id: res.data.companyId,
              name: res.data.companyName
            }
          ];
          this.popSubmit(obj);
          this.selRoleIds = res.data.menuIdList;
          this.$nextTick(() => {
             let allKeys = this.$refs.tree.getCheckedKeys();
          //获取所有菜单与客户菜单的差集
          let diff = allKeys.filter(val => {
            return res.data.menuIdList.indexOf(val) === -1;
          });
          //解决组件BUG强关联时候的bug，手动取消选中
          diff.map(item => {
            this.$refs.tree.setChecked(item, false);
          });
          })
          setTimeout(() => {
              let allKeys = this.$refs.tree.getCheckedKeys();
          //获取所有菜单与客户菜单的差集
          let diff = allKeys.filter(val => {
            return res.data.menuIdList.indexOf(val) === -1;
          });
          //解决组件BUG强关联时候的bug，手动取消选中
          diff.map(item => {
            this.$refs.tree.setChecked(item, false);
          });
          },200)
        }
      });
    },
    //点击保存
    submit() {
      if (!checkFormData(this.formColumnConfig, this.queryForm)) {
        return;
      }
      if(!this.selRoleIds.length) {
        this.$message.error("请给角色配置菜单");
        return
      }
      if (this.billCodeText == "新增") {
        addRole({
          ...this.queryForm,
          menuIdList: [...this.selRoleIds,...this.halfCheckedKeys]
        }).then(res => {
          if (res.code == 0) {
            this.$message.success("新增成功");
            this.$emit("update:visible", false);
            this.$parent.getList();
          } else {
            this.$$message.error(res.msg);
          }
        });
      } else {
        let { selRoleIds = []} = this;
        updateRole({
          ...this.queryForm,
          menuIdList: [...selRoleIds,...this.halfCheckedKeys]
        }).then(res => {
          if (res.code == 0) {
            this.$message.success("修改成功");
            this.$emit("update:visible", false);
            this.$parent.getList();
          } else {
            this.$$message.error(res.msg);
          }
        });
      }
    },
    getList() {
      let that = this;
      // this.pageParams.loading = true;
      menuQueryAll({
        usable: "1"
      }).then(res => {
        if (res.success) {
          this.tableData = res.data;
        }
      });
    },
    //look弹窗事件
    popSubmit(val) {
      this.options = [...val, ...this.options];
      this.queryForm.companyId = val[0].id;
      var a = {};
      this.options = this.options.reduce((item, next) => {
        a[next.id] ? "" : (a[next.id] = true && item.push(next));
        return item;
      }, []);
    },
    //关闭弹窗
    close() {
      this.$emit("update:visible", false);
    },
    //初始化页面参数
    initQueryForm(data = {}) {
      this.queryForm = {
        remark: "",
        companyId: "",
        menuIdList: [],
        name: "",
        usable: true,
        ...data
      };
    }
  },
  computed: {},

  watch: {},

  created() {},

  beforeMount() {},

  mounted() {
    this.initQueryForm();
    this.getList();
    this.selectCompany();
  }
};
</script>

<style lang="scss" scoped>
.popBox {
  ::v-deep .el-dialog {
    overflow-y: auto;
    width: 1100px !important;
    min-height: 100px !important;
    .el-dialog__body {
      padding: 0 !important;
      min-height: 100px !important;
      .content {
        min-height: 100px !important;
        overflow-x: auto;
        .el-form {
          justify-content: flex-start;
        }
        .formOne {
          .el-form-item__content {
            display: flex;
            .el-button {
              margin: 7px;
              min-width: 14px;
              min-height: 14px;
              width: 14px !important;
              height: 14px !important;
              border-radius: 50% !important;
              padding: 0 !important;
              border-color: #0066ff;
              span {
                font-size: 10px;
                background: transparent;
                color: #0066ff;
              }
            }
          }
        }
        .formTwo {
          .el-form-item__content {
          margin-left: 0 !important;
            width: 880px !important;
            .el-input {
              width: 880px !important;
            }
            .el-button {
              margin: 7px;
              min-width: 14px;
              min-height: 14px;
              width: 14px !important;
              height: 14px !important;
              border-radius: 50% !important;
              padding: 0 !important;
              border-color: #0066ff;
              span {
                font-size: 10px;
                background: transparent;
                color: #0066ff;
              }
            }
          }
        }
      }
    }
  }
}
.tiltle {
&::before {
 content: "*";
 color: red;
}
  font-size: 14px;
   margin-bottom: 5px;
  .el-button {
    margin: 7px;
    min-width: 14px;
    min-height: 14px;
    width: 14px !important;
    height: 14px !important;
    border-radius: 50% !important;
    padding: 0 !important;
    border-color: #0066ff;
    span {
      font-size: 10px;
      background: transparent;
      color: #0066ff;
    }
  }
}
::v-deep .el-card__body {
  padding: 0 !important;
}
.searchBtn {
  position: relative;
  ::v-deep .el-input__inner {
    padding-right: 35px !important;
  }
  ::v-deep .el-input__suffix {
    right: 15px !important;
  }
  ::v-deep .el-select__tags {
    max-width: 163px !important;
    .el-tag:nth-child(1) {
      width: 93px !important;
    }
  }
  .rightBtn {
    width: 20px !important;
    padding: 0 !important;
    min-width: 20px !important;
    position: absolute;
    right: 2px;
    font-size: 14px !important;
    top: 1px;
    line-height: 26px;
    z-index: 11;
  }
}
</style>
