<template>
  <div id="zPage">
    <!-- <div class="z-header">
      <div class="z-header-button">
        <el-button v-if="!isSave" @click="() => (isSave = true)"
          >编辑</el-button
        >
        <el-button v-if="isSave" @click="() => updateNews('')">保存</el-button>
        <el-button v-if="isSave" @click="() => closeNews()">取消</el-button>
      </div>
    </div> -->
    <div class="z-content">
      <div class="verApp">
        <div class="left">
          <div style="
              text-align: left;
              font-size: 14px;
              padding: 6px;
              font-weight: 500;
            ">
            字典名称
          </div>
          <div class="list">
            <div class="item"
                 :class="{ active: rowIndex == index }"
                 v-for="(item, index) in appList"
                 :key="index"
                 @click="nodeClick(item, index)">
              <div style="display: flex; justify-content: space-between">
                <div style="
                    width: 120px;
                    line-height: 26px;
                    white-space: normal;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                  ">
                  <div v-if="editinput && rowIndex == index">
                    <el-input v-model="showEditName"
                              maxlength="40"> </el-input>
                  </div>
                  <span v-else :title="item.name">
                    {{ item.name }}
                  </span>
                </div>
                <div></div>
                <div class="z-header-button"
                     style="width: 70px"
                     v-if="rowIndex == index && isSave && !editinput">
                  <el-button @click="() => editLeft(item)"> 编辑 </el-button>
                  <!-- <el-button
                    @click="() => deleteLeft(item)"
                    style="border-color: red; color: red"
                  >
                    删除
                  </el-button> -->
                </div>

                <div class="z-header-button"
                     style="width: 120px"
                     v-if="rowIndex == index && isSave && editinput">
                  <el-button class="ml-10" @click="() => saveLeftName(item)">
                    保存
                  </el-button>
                  <el-button @click="editinput = false"
                             style="border-color: red; color: red">
                    取消
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="right">
          <div class="z-header-button">
            <el-button @click="() => addNewRight()"> 新增</el-button>
            <el-button @click="saveRightButton()"> 保存</el-button>

            <!-- <el-button
              @click="saveRightButton(true)"
              style="border-color: red; color: red"
            >
              删除</el-button
            > -->
          </div>
          <div class="z-content-table">
            <common-table ref="mainTable"
                          :isMain="true"
                          :isFixedToBottom="isFixedToBottom"
                          :isSelection="true"
                          :typeStripe="true"
                          :tableColumn="tableColumn"
                          :tableData="tableData"
                          @selePage="handleItemSelect"
                          :pageParams="pageParams" />
          </div>
        </div>
      </div>
    </div>
    <div>
      <look-up title="查询信息"
               :visible.sync="look.visible"
               @setCheckItem="setCheckItem"
               :method="look.methods"
               :table-column="look.tableColumn"
               :search-arr="look.searchArr"></look-up>
    </div>
  </div>
</template>

<script>
import {
  actRoleList,
  actRoleUserDelete,
  actRoleUserList,
  actRoleUserSave,
  userQueryPage,
} from "@/api/systemzhu";
import commonTable from "@/components/CommonTable";
import lookUp from "@/components/ZLookUp/lookUp";
import {
  dictTypeListAll,
  dictDataList,
  dictTypeUpdate,
  dictTypeDelete,
  dictDataAdd,
  dictDataUpdate,
  dictDataDelete,
} from "@/api/apizhu";

export default {
  props: {},
  data () {
    return {
      isFixedToBottom: false, //滚动条是否需要定位到表格底部
      seleRowArr: [],

      isSave: true,

      look: {
        visible: false,
        params: {
          workShopId: "",
        },
        tableColumn: [
          {
            type: "index",
            label: "序号",
          },
          {
            prop: "account",
            label: "编码",
            isEdit: false,
          },
          {
            prop: "name",
            label: "值",
          },
          {
            prop: "phone",
            label: "是否可用",
          },

          {
            prop: "phone",
            label: "备注",
          },
          {
            prop: "",
            label: "",
          },
        ],
        searchArr: [
          {
            label: "用户编号",
            field: "account",
            type: 1,
            maxLength: "20",
          },
          {
            label: "用户名称 ",
            field: "name",
            type: 1,
            maxLength: "20",
          },
        ],
        // methods: userQueryPage,
      },
      queryForm: {
        name: "",
      },
      appList: [],

      tableData: [],
      // 分页信息
      pageParams: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
      },
      showEditName: "", //左侧输入框显示的名字
      editinput: false, //显示左侧输入框 （编辑删除  还是取消保存）
      rowIndex: 0, //当前显示的左侧是哪个
      isRightAdd: false, //右侧是否新增过了
    };
  },
  computed: {
    tableColumn () {
      let isEdit = this.isSave;
      return [
        {
          type: "index",
          label: "序号",
        },
        {
          prop: "code",
          label: "编码",
          width: 120,

          isEdit: true,
          config: {
            key: "code",
            type: "input",
            subtype: "text",
            placeholder: " ",
          },
        },
        {
          prop: "value",
          label: "值",

          width: 200,
          isEdit: true,
          config: {
            key: "value",
            type: "input",
            subtype: "text",
            placeholder: " ",
          },
        },
        {
          prop: "system",
          label: "是否系统",
          width: 120,
          align: "center",
          isEdit: true,
          config: {
            key: "system",
            type: "checkbox",

            placeholder: " ",
          },
        },
        {
          prop: "usable",
          label: "是否可用",
          width: 120,
          align: "center",
          isEdit: true,
          config: {
            key: "usable",
            type: "checkbox",

            placeholder: " ",
          },
          // render: (h, scope) => {
          //   return h("el-checkbox", {
          //     props: {
          //       value: scope.row.usable,
          //       disabled: true,
          //     },
          //   });
          // },
        },
        {
          prop: "remark",
          label: "备注",
          width: 320,
          isEdit: true,
          config: {
            key: "remark",
            type: "input",
            subtype: "text",
            placeholder: " ",
          },
        },
        {
          prop: "",
          label: "",
        },
      ];
    },
  },
  created () { },
  mounted () {
    this.getList();
  },
  watch: {},
  methods: {
    //  右侧的保存的按钮
    saveRightButton (isdel = false) {
      if (this.seleRowArr.length < 1) {
        return this.$message.error("请选择要操作的数据 ");
      }

      let obj = {
        1: dictDataAdd,
        2: dictDataUpdate,
        3: dictDataDelete,
      };
      if (!this.seleRowArr[0].id && isdel) {
        this.isRightAdd = false;
        this.$refs.mainTable.resetSelect();
        this.getRightTable(this.appList[this.rowIndex].code);
        return;
      }

      // 在保存的时候 判断下是否必填
      if (!isdel) {
        console.log(this.seleRowArr[0]);
        console.log('李兰');

        let { code = '', value = '' } = this.seleRowArr[0];
        if (!(code.trim())) {
          return this.$message.error('请输入编码')
        }
        if (!(value.trim())) {
          return this.$message.error('请输入值')
        }

      }

      obj[isdel ? 3 : this.seleRowArr[0].id ? 2 : 1](
        isdel
          ? this.seleRowArr[0].id
          : this.seleRowArr[0].id
            ? { ...this.seleRowArr[0] }
            : {
              ...this.seleRowArr[0],
              typeCode: "",
              orderNumber: 0,
              defaults: true,
              system: false,
              typeCode: this.appList[this.rowIndex].code,
              label: "",
            }
      ).then((res) => {

        console.log(this.appList);
        console.log(this.rowIndex);


        if (res.success) {
          //重新请求下数据 并且可以再次新增  清空表格
          this.isRightAdd = false;
          this.$refs.mainTable.resetSelect();
          this.getRightTable(this.appList[this.rowIndex].code);
        }
      });
    },
    // 新增右侧的
    addNewRight () {

      if (this.isRightAdd) {
        return;
      } else {
        this.isRightAdd = true;
        this.tableData.push({ value: '', code: '', usable: true, system: false });
        this.$nextTick(() => {
          setTimeout(() => {
            this.$refs.mainTable.setCurrentParent()
            // 需要定位到表格底部,传参给子组件
            this.isFixedToBottom = true
          }, 10);
        })
      }
    },

    // 删除左侧的

    deleteLeft (item) {
      dictTypeDelete(item.id).then((res) => {
        this.isRightAdd = false;
        this.getRightTable(item.code);
      });
    },

    /**
     * @desc 编辑左侧的
     */
    editLeft (value) {
      this.editinput = true;
      this.showEditName = value.name;
    },
    /**
     * @desc 数据库保存左侧的
     */
    saveLeftName (item) {
      console.log(item);
      console.log(this.showEditName);
      let { code, system, remark, usable } = item;
      let params = {
        code,
        system,
        remark,
        usable,
        id: item.id,
        orderNumber: 1,
        name: this.showEditName,
      };
      dictTypeUpdate(params).then((res) => {
        if (res.success) {
          this.editinput = false;
          this.appList[this.rowIndex].name = this.showEditName;
        }
      });
    },

    handleItemSelect (value) {
      this.seleRowArr = value;
    },
    openLook () {
      this.look.visible = true;
    },
    deletepeople () {
      if (this.seleRowArr.length < 1) {
        return this.$message.error("请选择要删除的用户");
      }
      this.$confirm("确认删除这条用户数据吗？", "", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let params = {
            userId: this.seleRowArr[0].id,
            roleId: this.appList[this.rowIndex].id,
          };
          actRoleUserDelete(params).then((res) => {
            if (res.success) {
              this.getTenantListByEdition();
            } else {
              this.$message.error(res.msg);
            }
          });
        })
        .catch(() => { });
    },

    setCheckItem (e) {
      //  将选择的用户和角色配置相关起来
      let params = {
        userId: e.id,
        roleId: this.appList[this.rowIndex].id,
      };

      actRoleUserSave(params).then((res) => {
        if (res.success) {
          this.getTenantListByEdition();
          this.look.visible = false;
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    getRightTable (queryId) {
      let that = this
      console.log(queryId);

      dictDataList(queryId).then((res) => {
        this.tableData = res.data;
      });
    },
    // 获取版本
    getList () {
      dictTypeListAll({}).then((res) => {
        if (res.success) {
          this.appList = res.data.filter(item => {
            return !!item.usable
          });
          // this.getTenantListByEdition();
          this.getRightTable(res.data[0].code);
        }
      });
    },
    // 获取版本租户
    getTenantListByEdition () {
      actRoleUserList({
        roleId: this.appList[this.rowIndex].id,
      }).then((res) => {
        if (res.success) {
          this.tableData = res.data;
          // this.tableData = [{ id: 2, name: "zhuzhu" }];
          this.$refs.mainTable.resetSelect();
        }
      });
    },
    nodeClick (item, index) {
      if (index == this.rowIndex) {
        return;
      }
      this.editinput = false;
      this.isRightAdd = false;
      this.rowIndex = index;
      // this.getTenantListByEdition();
      this.getRightTable(item.code);
    },
  },
  components: {
    commonTable,
    lookUp,
  },
};
</script>

<style scoped>
.verApp {
  width: 100%;
  height: 100%;
  display: flex;
}

.verApp .left {
  width: 240px;
  height: 100%;
  background: #ffffff;
  padding: 8px 0;
  text-align: center;
  overflow: auto;
}

.verApp .left .el-input {
  width: 156px;
}

.verApp .left .list {
  margin-top: 8px;
}

.verApp .left .list .item {
  padding: 9px 0;
  font-size: 12px;
  color: #374256;
  text-align: left;
  padding-left: 8px;
  cursor: pointer;
}

.verApp .left .list .item.active {
  border-left: 4px solid #2367fa;
  background: #f0f5ff;
  padding-left: 4px;
}

.verApp .right {
  flex: 1;
  background: #fff;
  height: 100%;
  margin-left: 8px;
  padding: 12px;
  box-sizing: border-box;
  overflow: auto;
}

.verApp .right /deep/ .el-tree-node__children .el-tree-node__children {
  display: flex;
  flex-wrap: wrap;
}
</style>
<style lang="less" scoped>
#zPage {
  .z-content {
    height: calc(100vh - 94px) !important;
  }

  /deep/ .el-card__body {
    height: calc(100vh - 94px) !important;
  }
}
.resetButton {
}
</style>
