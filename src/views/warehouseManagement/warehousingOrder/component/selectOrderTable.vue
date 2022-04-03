
<!--
@time:2021/12/2
@author:chenqian
-->
<template>
  <div class="popBox">
    <el-dialog
      title="生成条码"
      :visible="orderVisible"
      @close="close"
      :close-on-click-modal="false"
    >
      <div class="content">
      <div class="tips">当前要生成条码的物料是“有机再生棉”</div>
           <div class="form">
          <form-list
            v-model="queryForm"
            :formConfig="formConfig"
            class="form form-order-box"
          ><el-button type="primary" @click="submit">生成</el-button></form-list>
        </div>
         <div class="form formOne">
          <form-list
            v-model="queryForm"
            :formConfig="formConfigOne"
            class="form form-order-box"
          ></form-list>
        </div>
           <div class="tips">已生成条码</div>
        <div class="z-content-table">
          <common-table
            :class="{ zTable: isEdit }"
            ref="mainTable"
            :isSelectMore="false"
            :isSelection="false"
            :tableColumn="tableColumn"
            :tableData="tableData"
            :ispage="false"
            :tableheight="250"
            :isMain="true"
          ></common-table>
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
import HeaderSearch from '@/components/CommonHeadSearch/ZSearch'
import commonTable from '@/components/CommonTable'
import formList from "@/components/Form/formList";
import { checkFormData } from "@/lib/common";

export default {
  name: "add",
  components: { HeaderSearch,commonTable,formList },

  mixins: [],

  props: {
    orderVisible: {
      type: Boolean,
      default: false
    },
  },

  data() {
    return {
      queryForm: {},
      isEdit: true,
      tabletopData: [],
      tableData: [],
    };
  },
  methods: {
    //点击保存
    submit() {
      if (!checkFormData(this.formConfig.formItemList, this.queryForm)) {
        return;
      }
    },
    handletopItemSelect(val) {},
    handleItemSelect(val) {},
    searchMethod(){

    },
    //关闭弹窗
    close() {
      this.$emit("update:orderVisible", false);
    },
    //初始化页面参数
    initQueryForm(data = {}) {
      this.queryForm = {
        remark: "",
      };
    }
  },
   computed: {
    formConfig() {
      let isEdit = !this.isEdit;
      let formItemList = [
        {
          key: "billNo",
          type: "input",
          subtype: "text",
          label: "整包件数",
          isEdit,
          placeholder: "请输入",
          rules: {
            required: true,
            trigger: "change"
          }
        },
      ];

      return {
        inline: true,
        size: "mini",
        labelWidth: "70px !important",
        formItemList: formItemList
      };
    },
       formConfigOne() {
      let isEdit = !this.isEdit;
      let formItemList = [
        {
          key: "billNo",
          type: "input",
          subtype: "text",
          label: "整包数量",
          isEdit,
          placeholder: "请输入",

        }, {
          key: "billNo",
          type: "input",
          subtype: "text",
          label: "整包米数",
          isEdit,
          placeholder: "请输入",
        }, {
          key: "billNo",
          type: "input",
          subtype: "text",
          label: "整包码数",
          isEdit,
          placeholder: "请输入",
        }, {
          key: "billNo",
          type: "input",
          subtype: "text",
          label: "零包数量",
          isEdit,
          placeholder: "请输入",
        }, {
          key: "billNo",
          type: "input",
          subtype: "text",
          label: "零包数量",
          isEdit,
          placeholder: "请输入",
        }, {
          key: "billNo",
          type: "input",
          subtype: "text",
          label: "零包数量",
          isEdit,
          placeholder: "请输入",
        },
      ];

      return {
        inline: true,
        size: "mini",
        labelWidth: "70px !important",
        formItemList: formItemList
      };
    },
    tableColumn() {
      let isEdit = this.isEdit;
          return [
        {
          label: "序号",
          type: "index",
          align:"center"
        },
        {
          label: "物料编号",
          prop: "materialNo",
          isEdit: isEdit,
          config: {
            key: "materialNo",
            type: "input",
            subtype: "text",
            placeholder: "请输入"
          }
        },
        {
          label: "物料名称",
          prop: "width",
          align: "right",
          width:70,
          isEdit: isEdit,
          config: {
            key: "width",
            type: "input",
            subtype: "text",
            placeholder: " "
          }
        },
        {
          label: "物料描述",
          prop: "width",
          align: "right",
          isEdit: isEdit,
          width:70,
          config: {
            key: "width",
            type: "input",
            subtype: "text",
            placeholder: " "
          }
        },  {
          label: "整包数量",
          prop: "width",
          align: "right",
          width:70,
          isEdit: isEdit,
          config: {
            key: "width",
            type: "input",
            subtype: "text",
            placeholder: " "
          }
        }, {
          label: "整包数量(码)",
          prop: "width",
          align: "right",
          isEdit: isEdit,
          width:90,
          config: {
            key: "width",
            type: "input",
            subtype: "text",
            placeholder: " "
          }
        },
        {
          label: "条码",
          prop: "width",
          width: 50,
          align: "right",
          isEdit: isEdit,
          config: {
            key: "width",
            type: "input",
            subtype: "text",
            placeholder: " "
          }
        },
        {
          label: "仓位信息",
          prop: "width",
          align: "center",
          width: 70,
          isEdit: isEdit,
          config: {
            key: "width",
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

  beforeMount() {},

  mounted() {
    this.initQueryForm();
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
        .form {
          .el-form-item {
            flex-basis: 30%;
            .el-form-item__content {
              width: 110px !important;
              .el-input {
                width: 110px !important;
                .el-input__inner {
                  width: 110px !important;
                }
              }
            }
          }
        }
      }
    }
  }
}
.tips {
  font-family: PingFangSC-Regular;
color: #374256;
font-size: 12px;
margin: 5px;
}
</style>
