<template>
  <div class="popData popBox">
    <el-dialog
      :title="billCodeText"
      width="400px !important"
      style="font-weight:bold;"
      :visible="theVisible"
      @close="close"
    >
      <el-form ref="form" label-width="80px" class="mt-10">
        <div v-for="(item, i) in dataList" :key="i" class="pl-10">
          <el-form-item
            :label="item.moduleName"
            label-width="95px"
            class="formItem"
          >
            <el-select
              v-model="item.permission"
              @change="changeItem(item)"
              placeholder="请选择查看范围"
            >
              <el-option
                v-for="(s, o) in optionList"
                :key="o"
                :label="s.label"
                :value="s.value"
              ></el-option>
            </el-select>
            <el-input
              v-if="item.permission == '3'"
              style="margin-top:5px;width:431px"
              @focus="selectPerson(i)"
              v-model="value"
              placeholder="请选择"
            ></el-input>
            <template v-if="item.permission == '3'">
              <el-tag
                class="mr-10"
                v-for="(tag, x) in item.userList"
                :key="x"
                @close="closeTag(i, x)"
                closable
                type="success"
              >
                {{ tag.fullName }}
              </el-tag>
            </template>
            <div v-if="item.permission == '5'" class="departMent mt-10">
              <div class="top" style="margin-top:5px">
                <el-input
                  placeholder="请输入"
                  v-model="item.filterText"
                  maxlength="40"
                >
                </el-input>
                <i
                  class="el-icon-search search"
                  @click="changeTree(item.filterText, i)"
                ></i>
                <span class="tips"
                  >{{
                    item.departmentIdList && item.departmentIdList.length
                      ? item.departmentIdList.length
                      : 0
                  }}
                  / {{ item.treeData.length }}</span
                >
              </div>
              <div class="content">
                <el-tree
                  class="filter-tree"
                  :data="item.treeData"
                  :props="defaultProps"
                  default-expand-all
                  :filter-node-method="filterNode"
                  show-checkbox
                  :default-checked-keys="item.departmentIdList"
                  @check="(a, b) => setcheckbox(a, b, i)"
                  node-key="id"
                  :ref="i + 'tree'"
                >
                </el-tree>
              </div>
            </div>
          </el-form-item>
        </div>
      </el-form>

      <div slot="footer" class="dialog-footer mt-10">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit">确 认</el-button>
      </div>
    </el-dialog>
    <look-up
      ref="lookup"
      :isSelectMore="true"
      :visible.sync="visible"
      @setCheckItem="setCheckItem"
      :method="look.method"
      :table-column="look.tableColumn"
      :search-arr="look.searchArr"
      :params="look.params"
    ></look-up>
  </div>
</template>

<script>
import lookUp from "@/components/ZLookUp/lookUpImport"; //lookup统一弹窗
import { userListAll, searchPermission, operatePermission } from "@/api/apizhu";
import { geteDpartmentList } from "@/api/systemzhu/department";
export default {
  name: "datapermission",
  components: {
    lookUp
  },
  data() {
    const randerList = () => {
      let arr = [
        "客商档案",
        "销售订单",
        "采购订单",
        "生产任务书",
        "委外加工单",
        "客户投诉单",
        "供应商投诉单",
        "进项发票",
        "付款申请",
        "开票申请"
      ];
      let data = arr.map((item, i) => {
        return {
          moduleName: item,
          moduleType: i + 1,
          permission: "1",
          userList: []
        };
      });
      return data;
    };
    return {
      billCodeText: "数据权限配置",
      isShow: false,
      dataList: randerList(),
      optionList: [
        {
          label: "不允许查看",
          value: "1"
        },
        {
          label: "仅允许查看自己",
          value: "2"
        },
        {
          label: "允许查看指定人",
          value: "3"
        },
        {
          label: "允许查看指定部门",
          value: "5"
        },
        {
          label: "允许查看所有人",
          value: "4"
        }
      ],
      treeData: [],
      defaultProps: {
        children: "children",
        label: "fullName"
      },
      selectIndex: 0,
      value: "",
      visible: false,
      look: {
        method: userListAll,
        params: {},
        searchArr: [
          {
            label: "员工姓名",
            field: "keyword",
            type: 1,
            maxLength: "60"
          }
        ],
        tableColumn: [
          {
            label: "序号",
            type: "index",
            maxLength: "20"
          },
          {
            label: "员工姓名",
            prop: "fullName"
          }
        ]
      }
    };
  },
  props: {
    theVisible: {
      type: Boolean,
      default: false
    },
    selectRow: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  mounted() {
    this.getDepartMent();
  },
  methods: {
    setcheckbox(a, b, i) {
      this.dataList[i].departmentIdList = b.checkedKeys;
    },
    changeTree(val, i) {
      this.$refs[i + "tree"][0].filter(val);
    },
    filterNode(val, data) {
      if (!val) {
        return true;
      }
      return data.fullName.indexOf(val) !== -1;
    },
    changeItem(val) {
      if (val.permission != "3") {
        // val.userList = [];
      }
    },
    getDepartMent() {
      geteDpartmentList({
        current: 1,
        size: 50,
        companyId:JSON.parse(localStorage.userInfoNow).companyId,
      })
        .then(res => {
          this.treeData = res.data.records;
          this.init();
        })
        .catch(error => {
          this.treeData = [];
        });
    },
    init() {
      searchPermission({
        id: this.selectRow.id
      }).then(res => {
        if (res.code == 0) {
          if (res.data.length) {
            this.dataList = res.data.map(item => {
              return {
                ...item,
                permission: String(item.permission),
                departmentIdList: item.departmentIdList ? item.departmentIdList.split(",") : [],
                treeData: this.treeData,
                filterText: ""
              };
            });
            this.dataList.forEach((o, i) => {
              if (o.permission == 5) {
                this.$nextTick(() => {
                  let allKeys = this.$refs[i + "tree"][0].getCheckedKeys();
                  //获取所有菜单与客户菜单的差集
                  let diff = allKeys.filter(val => {
                    return o.departmentIdList.indexOf(val) === -1;
                  });
                  //解决组件BUG强关联时候的bug，手动取消选中
                  diff.map(a => {
                    this.$refs[i + "tree"][0].setChecked(a, false);
                  });
                });
              }
            });
          } else {
            this.dataList = this.dataList.map(item => {
              return { ...item, treeData: this.treeData, filterText: "" };
            });
          }
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //删除选中的人
    closeTag(i, index) {
      this.dataList[i].userList.splice(index, 1);
    },
    //失焦的问题
    selectPerson(i) {
      this.selectIndex = i;
      this.visible = true;
    },
    //lookup选择事件
    setCheckItem(val) {
      let arr = [];
      if (Array.isArray(val)) {
        arr = val.map(item => {
          return {
            fullName: item.fullName,
            id: item.id
          };
        });
      } else {
        arr = [
          {
            fullName: val.fullName,
            id: val.id
          }
        ];
      }
      this.dataList[this.selectIndex].userList = [
        ...this.dataList[this.selectIndex].userList,
        ...arr
      ];
      var a = {};
      this.dataList[this.selectIndex].userList = this.dataList[
        this.selectIndex
      ].userList.reduce((item, next) => {
        a[next.id] ? "" : (a[next.id] = true && item.push(next));
        return item;
      }, []);
    },
    //关闭弹窗
    close() {
      this.$emit("update:theVisible", false);
    },
    submit() {
      this.dataList = this.dataList.map(item => {
        return {
          ...item,
          userIdList: item.userList
            .map(item => {
              return item.id;
            })
            .toString(),
          departmentIdList: item.departmentIdList.toString()
        };
      });
      operatePermission({
        userId: this.selectRow.id,
        companyId:JSON.parse(localStorage.userInfoNow).companyId,
        permissionList: this.dataList
      }).then(res => {
        if (res.code == 0) {
          this.$message.success("操作成功");
          this.$emit("update:theVisible", false);
          this.$parent.getDataList();
        } else {
          this.$message.error(res.msg);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.popBox {
  ::v-deep .el-dialog {
    overflow-y: auto;
    width: 564px !important;
    min-width: 564px !important;
  }
}
.popData {
  ::v-deep .el-dialog {
    .el-dialog__header {
      padding: 6px 10px;
      .el-dialog__title {
        line-height: 17px !important;
        font-size: 12px !important;
      }

      .el-dialog__headerbtn {
        top: 6px;
      }
    }
    .el-form-item {
      margin-bottom: 10px;
      .el-select {
        width: 431px;
      }
    }
    .el-form-item--mini {
      .el-form-item__label {
        line-height: 28px;
        font-size: 12px;
        font-weight: normal;
      }
    }
    .el-transfer-panel {
      width: 175px !important;
    }
    .el-transfer__buttons {
      padding: 0 10px;
      .el-transfer-panel {
        border-radius: 50%;
      }
    }
  }

  .pop-table-btn {
    background-color: #f8f8f9;
    padding: 8px;
    border: 1px solid #dfe6ec;
    border-bottom: 0;

    .el-button {
      width: auto !important;
    }
  }
  .el-form–inline {
    .formItem {
      div.el-input {
        width: 450px;
      }
    }
  }
}
.departMent {
  width: 431px;
  height: 270px;
  border: 1px solid #ebebeb;
  overflow: hidden;
  overflow-y: auto;
  .top {
    position: relative;
    display: flex;
    ::v-deep .el-input__inner {
      width: 370px !important;
      border-radius: 17px !important;
      margin-left: 5px;
    }
    .search {
      position: absolute;
      right: 47px;
      top: 4px;
      cursor: pointer;
    }
    .tips {
      font-size: 12px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      text-align: right;
      color: #333333;
      white-space: nowrap;
      padding-right: 3px;
    }
  }
  .content {
    width: 100%;
    height: 230px;
    overflow: hidden;
    overflow-y: auto;
  }
  ::v-deep .el-tree-node__label {
    font-weight: normal !important;
    font-size: 12px !important;
    font-family: PingFangSC, PingFangSC-Regular !important;
    color: #333333 !important;
  }
}
</style>
