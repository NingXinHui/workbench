<!--
@time:2021/12/1
@author:chenqian
-->
<template>
  <div class="popBox">
    <el-dialog :title="billCodeText"
               :visible="visible"
               @close="close"
               :close-on-click-modal="false"
               style="font-weight:bold;">
      <div class="content">
        <div class="form">
          <el-form>
            <el-form-item label="上级公司" class="formOne">
              <span style="font-size:12px;">{{parentName}}</span>
            </el-form-item>
            <form-list v-model="queryForm"
                       :formConfig="formConfig"
                       class="form form-order-box"></form-list>
          </el-form>
        </div>
      </div>
      <div slot="footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" class="sureBtn"
                   @click="submit">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import formList from "@/components/Form/formList";
import commonTable from "@/components/CommonTable";
import { checkFormData } from "@/lib/common";
import { addCompany, updateCompany } from "@/api/systemzhu/company"
export default {
  name: "add",
  components: { formList, commonTable },

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
    },
    parentName: {
      type: String,
      default: "",
    }
  },

  data () {
    return {
      queryForm: {},
      isEdit: true,
      salesmanListList: [],
      basic: {
        name: "",
      },
      tableData: [],
      selectList: []
    };
  },
  methods: {
    //点击保存
    submit () {
      if (!checkFormData(this.formConfig.formItemList, this.queryForm)) {
        return;
      }
      if (this.billCodeText == '新增公司') {
        addCompany({
          ...this.queryForm,
          shortName: this.queryForm.name,
          parentId: this.$parent.company.id
        }).then(res => {
          if (res.success) {
            this.$message.success("新增成功");
            this.$emit("update:visible", false);
            this.$parent.getCompanyList();
          } else {
            this.$$message.error(res.msg)
          }
        })
      } else {
        updateCompany({          ...this.queryForm,
          shortName: this.queryForm.name,
          parentId: this.$parent.company.id
        }).then(res => {
          if (res.success) {
            this.$message.success("修改成功");
            this.$emit("update:visible", false);
            this.$parent.getCompanyList();
          } else {
            this.$$message.error(res.msg)
          }
        })
      }
    },
    //关闭弹窗
    close () {
      this.$emit("update:visible", false);
    },
    //初始化页面参数
    initQueryForm (data = {}) {
      let basic = this.basic;
      this.queryForm = {
        ...basic,
        ...data
      };
    }
  },
  computed: {
    formConfig () {
      let isEdit = !this.isEdit;
      let formItemList = [
        {
          key: "name",
          type: "input",
          subtype: "text",
          label: "公司名称",
          multiple: true,
          isEdit,
          rules: {
            required: true,
            trigger: "blur"
          }
        }
      ];

      return {
        inline: true,
        size: "mini",
        labelWidth: "85px !important",
        formItemList: formItemList
      };
    },
  },

  watch: {},

  created () { },

  beforeMount () { },

  mounted () {
    this.initQueryForm();
    if (this.billCodeText == "编辑公司") {
      this.initQueryForm(this.detail);
    }
  }
};
</script>

<style lang="scss" scoped>
.popBox {
  ::v-deep .el-dialog {
    overflow-y: auto;
    width: 565px !important;
    min-height: 100px !important;
    .el-dialog__body {
      padding: 0 !important;
      min-height: 100px !important;
      .content {
        min-height: 100px !important;
        overflow-x: auto;
        .form-order-box {
          .el-form-item {
            flex-basis: 100% !important;
            .el-form-item__content {
              width: 450px;
              .el-select {
                width: 100%;
              }
              .el-input {
                width: 100%;
              }
            }
          }
        }
      }
    }
  }
}
.formOne {
 ::v-deep .el-form-item__label {
  color: #999999 !important;
  font-weight: normal !important;
 }
}
.sureBtn {
background: #0066ff;
}
</style>
<template>
  <div id="zPage">
    <div class="z-content">
      <div class="verApp">
        <div class="left">
          <el-input
            size="mini"
            placeholder="请输入查询内容"
            prefix-icon="el-icon-search"
            v-model="queryForm.name"
            maxlength="40"
            @blur="getCompanyList"
            @keyup.enter.native="getCompanyList"
          >
          </el-input>

          <div class="list">

            <div style="color:rgba(0,0,0,0.45);margin:20px auto" v-if="!company.childList ||  company.childList.length==0">
              暂无数据
            </div>

            <div v-else>
              <span
              class="title"
              :class="{ activeTitle: rowIndex == -1 }"
              @click="(rowIndex = -1), (tableData = [...company.childList])"
              >{{ company.name }}</span
            >
            <div
              class="item"
              :class="{ active: rowIndex == index }"
              v-for="(item, index) in company.childList"
              :key="index"
              :title="item.name"
              @click="nodeClick(item, index)"
            >
              {{ item.name }}
            </div>
            </div>


          </div>
        </div>
        <div class="right">
          <div>
            <!-- 按钮的权限判断 -->
             <el-button @click="openLook('add')"> 新增</el-button>
             <!--<el-button v-if="isShowPermiss('system:jia:add')" @click="openLook('add')"> 新增</el-button> -->
            <el-button @click="openLook('edit')">编辑</el-button>
            <el-button @click="deletepeople" class="delButton"> 删除</el-button>
            <!-- <el-button v-if="isShowPermiss('system:jia:delete')" @click="deletepeople" class="delButton"> 删除</el-button>-->
          </div>
          <div class="z-content-table">
            <common-table
              ref="mainTable"
              :isMain="true"
              :isSelection="true"
              :typeStripe="true"
              :tableColumn="tableColumn"
              :tableData="tableData"
              @selePage="handleItemSelect"
              :pageParams="pageParams"
            />
          </div>
        </div>
      </div>
    </div>
    <div></div>
    <Add
      v-if="visible"
      :visible.sync="visible"
      :billCodeText="billCodeText"
      :detail="detail"
      :parentName="company.name"
    ></Add>
  </div>
</template>

<script>
import Add from "./add";
import {
  actRoleList,
  actRoleUserDelete,
  actRoleUserList,
  actRoleUserSave,
  userQueryPage
} from "@/api/systemzhu";
import { getCompanyList,deleteCompany } from "@/api/systemzhu/company";
import commonTable from "@/components/CommonTable";

export default {
  props: {},
  data() {
    return {
      seleRowArr: [],
      queryForm: {
        name: ""
      },
      visible: false,
      billCodeText: "新增",
      detail: {},
      appList: [],
      rowIndex: -1,
      tableColumn: [
        {
          label: "序号",
          type: "index"
        },
        {
          prop: "name",
          label: "公司名称",
          width: 300
        },
        {
          prop: "",
          label: ""
        }
      ],
      tableData: [],
      company: {},
      detailData: [],
      // 分页信息
      pageParams: {
        total: 0,
        pageNum: 1,
        pageSize: 10
      }
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.getCompanyList();
  },
  watch: {},
  methods: {
    getCompanyList() {
      getCompanyList({
        current: 1,
        size: 50,
        name: this.queryForm.name
      }).then(res => {
        if (res.code == 0) {
          this.company = res.data.records.length ? res.data.records[0] : {};
          console.log(this.company)
          if (res.data.records.length) {
            this.tableData = [...res.data.records[0].childList];
          }
          this.$refs.mainTable.$refs.multipleTable.clearSelection();
        }
      });
    },
    handleItemSelect(value) {
      this.seleRowArr = value;
    },
    openLook(val) {
      if (this.rowIndex != -1) {
        this.$message.error("当前选择公司不能操作");
        return;
      }
      if (val == "add") {
        this.visible = true;
        this.billCodeText = "新增公司";
        this.detail = {};
      } else {
        if (!this.seleRowArr.length) {
          this.$message.error("请选择操作项");
          return;
        }
        this.visible = true;
        this.billCodeText = "编辑公司";
        this.detail = this.seleRowArr[0];
      }
    },
    deletepeople() {
      if (!this.seleRowArr.length) {
        return this.$message.error("请选择操作项");
      }
      this.$confirm("确认删除选中的数据吗？", "", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            id: this.seleRowArr[0].id,
          };
          deleteCompany(params).then(res => {
            if (res.success) {
              this.$message.success("操作成功");
              this.getCompanyList();
            } else {
              this.$message.error(res.msg);
            }
          });
        })
        .catch(() => {});
    },
    nodeClick(item, index) {
      this.rowIndex = index;
      this.tableData = [];
    }
  },
  components: {
    commonTable,
    Add
  }
};
</script>

<style scoped>
.verApp {
  width: 100%;
  height: 100%;
  display: flex;
}

.verApp .left {
  width: 176px;
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
  padding-left: 15px;
  font-size: 12px;
  color: #374256;
  text-align: left;
  text-indent: 8px;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
}

.verApp .left .list .item.active {
  border-left: 4px solid #2367fa;
  background: #f0f5ff;
  padding-left: 11px;
}
.activeTitle {
  border-left: 4px solid #2367fa;
  background: #f0f5ff;
  padding-left: 2px;
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
.title {
  display: inline-block;
  text-align: left;
  color: #374256;
  width: 100%;
  padding: 5px;
  font-weight: 900;
  font-size: 14px;
  box-sizing: border-box;
  cursor: pointer;
}
</style>
