<!--
@time:2021/12/2
@author:chenqian
-->
<template>
  <div class="popBox">
    <el-dialog
      title="跟进项配置"
      :visible.sync="configureVisible"
      @close="close"
      :close-on-click-modal="false"
    >
      <div class="mt-10" :class="['z-details-content-box']">
        <div class="z-details-btn">
          <el-button size="mini" plain @click="addDetails">新增</el-button>
        </div>
        <div class="z-content-table" style="margin-top:0">
          <common-table
            is-height
            :class="{ zTable: true }"
            ref="mainTable"
            :isMain="true"
            :tableColumn="tabletopColumn"
            :tableData="tableData"
            :isSelection="true"
            :isSelectMore="true"
            :isPage="false"
          />
        </div>
      </div>
      <div slot="footer" class="mt-10">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="submit">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import commonTable from "@/components/CommonTable";
import { followUpList,addFollowUp } from "@/api/production/workingProcedure";
export default {
  name: "add",
  components: { commonTable },

  mixins: [],

  props: {
    configureVisible: {
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

  data() {
    return {
      tableData: []
    };
  },
  mounted() {
    this.getOrderList();
  },
  methods: {
    addDetails() {
      let obj = {
        followUpName: "",
        fieldType: 1,
        required: true,
        usable: true,
        combinationForm: false
      };
      this.tableData.push(obj);
    },
    //查看
    getOrderList() {
      followUpList({
        id: this.selectRow.id
      }).then(res => {
        if (res.code == 0) {
          this.tableData = res.data;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //点击保存
    submit() {
      if (!this.tableData.length) {
        this.$message.error("请添加数据");
        return;
      }
         let bool = true,
        title = "";

      this.tabletopColumn.forEach(item => {
        if (item.config && item.config.custormRules) {
          this.tableData.forEach((value, key) => {
            value.orderNumber = key + 1;
            if (!value[item.config.key] && value[item.config.key] !== 0&&bool) {
              bool = false;
              title =
                "第" + (key + 1) + "行" + item.config.custormRules.message;
            }
          });
        }
      });

      if (!bool) {
        this.$message.error(title);
        return;
        }
      addFollowUp({
        configDelIdList:[],
        procedureId:this.selectRow.id,
        configList:this.tableData}).then(res => {
         if(res.success) {
            this.$message.success("新增成功");
             this.$emit("update:configureVisible", false);
              this.$parent.getDataList();
          } else {
            this.$$message.error(res.msg)
          }
      })
    },
    //关闭弹窗
    close() {
      this.$emit("update:configureVisible", false);
    }
  },
  computed: {
    tabletopColumn() {
      return [
        {
          type: "index",
          label: "序号"
        },
        {
          label: "跟进项名称",
          prop: "followUpName",
          isEdit: true,
          isRequired:true,
          config: {
            key: "followUpName",
            type: "input",
            subtype: "text",
            custormRules: {
              message: "跟进项名称不能为空"
            },
            placeholder: " "
          }
        },
        {
          label: "字段类型",
          prop: "fieldType",
          isEdit: true,
          config: {
            key: "fieldType",
            type: "select",
            options: [{
              name: "文本输入",
              code: 1
            },
            {
              name: "数值型",
              code: 2
            },{
              name: "日期型",
              code: 3
            }],
            optionLabel: "name",
            optionValue: "code",
            subtype: "text",
            placeholder: " "
          }
        },
        {
          label: "是否必填",
          prop: "required",
          align:"center",
          isEdit: true,
          config: {
            key: "required",
            type: "checkbox",
            subtype: "text",
            placeholder: " "
          }
        },
        {
          label: "是否可用",
          prop: "usable",
          align:"center",
          isEdit: true,
          config: {
            key: "usable",
            type: "checkbox",
            subtype: "text",
            placeholder: " "
          }
        },
        {
          label: "是否组合表单",
          prop: "combinationForm",
          align:"center",
          isEdit: true,
          config: {
            key: "combinationForm",
            type: "checkbox",
            subtype: "text",
            placeholder: " "
          }
        }
      ];
    }
  },

  watch: {},

  created() {},

  beforeMount() {}
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
      }
    }
  }
}
.z-details-btn {
  background: #f7f9fd;
  padding: 5px 5px;
}
</style>
