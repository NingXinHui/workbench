<!--
@time:2021/12/1
@author:chenqian
-->
<template>
  <div class="popBox">
    <el-dialog
      :title="billCodeText"
      :visible="visible"
      @close="close"
      :close-on-click-modal="false"
      width="800px"
    >
      <div class="content">
        <div class="setmain">
          <div>
            <div class="form">
              <form-list
                v-model="queryForm"
                :formConfig="formConfig"
                class="form form-order-box"
              ></form-list>
            </div>
          </div>
          <div>
            <div class="showright" style="height: 280px">
              <div>主表字段</div>
              <div style="height: 250px">
                <el-scrollbar style="height:100%">
                  <div
                    class="setonelist"
                    v-for="(item, index) in [
                      '物料信息',
                      '随心飞飞',
                      '看到小心',
                      '之乎者也',
                      '人生爱是',
                      '不外如是',
                      '天天',
                    ]"
                    :key="index"
                    @dblclick="()=>changeRemark(item)"
                  >
                    {{ item }}
                  </div>
                </el-scrollbar>
              </div>
            </div>
            <div class="showright" style="height: 140px;margin-top:12px">
              <div>明细字段</div>
              <div style="height: 100px">
                <el-scrollbar style="height:100%">
                  <div
                    class="setonelist"
                    v-for="(item, index) in [
                      '物料信息',
                      '随心飞飞',
                      '看到小心',
                      '之乎者也',
                      '人生爱是',
                      '不外如是',
                      '天天',
                    ]"
                    :key="index"
                  >
                    {{ item }}
                  </div>
                </el-scrollbar>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="submit">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import formList from "@/components/Form/formList";
import { checkFormData } from "@/lib/common";

export default {
  name: "add",
  components: { formList },

  mixins: [],

  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    billCodeText: {
      type: String,
      default: "",
    },
    detail: {
      type: Object,
      default: {},
    },
  },

  data() {
    return {
      queryForm: {
        remark:'看到'
      },
      isEdit: true,
      salesmanListList: [],
      basic: {
        clauseContent: true,
        billNo: "",
        orderTypeNo: "",
        bill: "",
        remark:''
      },
    };
  },
  methods: {
    changeRemark(remark){
      this.queryForm.remark=this.queryForm.remark+`[${remark}]`

    },
    //点击保存
    submit() {
      if (!checkFormData(this.formConfig.formItemList, this.queryForm)) {
        return;
      }
    },
    //关闭弹窗
    close() {
      this.$emit("update:visible", false);
    },
    //初始化页面参数
    initQueryForm(data = {}) {
      let basic = this.basic;
      this.queryForm = {
        ...basic,
        ...data,
      };
    },
  },
  computed: {
    formConfig() {
      let isEdit = !this.isEdit;
      let formItemList = [
          {
          key: "billNo",
          type: "input",
          subtype: "text",
          label: "消息编号",
          isEdit,
          placeholder: "请输入",
          rules: {
            required: true,
            trigger: "change",
          },
        },
        {
          key: isEdit ? "orderTypeName" : "orderTypeNo",
          type: isEdit ? "input" : "select",
          subtype: "text",
          label: "单据类型",
          isEdit,
          //   multiple: true,
          options: this.salesmanListList,
          optionLabel: "orderTypeName",
          optionValue: "orderTypeNo",
          placeholder: "请选择",
          rules: {
            required: true,
            message: "上级部门",
          },
        },
      
        // {
        //   key: "bill",
        //   type: "input",
        //   subtype: "text",
        //   label: "类型名称",
        //   isEdit,
        //   placeholder: "请输入",
        //   rules: {
        //     required: true,
        //     trigger: "change"
        //   }
        // },
        {
          key: isEdit ? "orderTypeName" : "orderTypeNo",
          type: isEdit ? "input" : "select",
          subtype: "text",
          label: "业务节点",
          isEdit,
          //   multiple: true,
          options: this.salesmanListList,
          optionLabel: "orderTypeName",
          optionValue: "orderTypeNo",
          placeholder: "请选择",
          rules: {
            required: true,
            message: "关联业务员不能为空",
          },
        },
    
        {
          key: "remark",
          type: "input",
          subtype: "textarea",
          label: "消息模板",
          isEdit,
          attrs: {
            showWordLimit: true,
            rows:4
          },
          maxlength: 200,
        },

         {
          key: isEdit ? "orderTypeName" : "orderTypeNo",
          type: isEdit ? "input" : "select",
          subtype: "text",
          label: "提醒固定对象",
          isEdit,
          //   multiple: true,
          options: this.salesmanListList,
          optionLabel: "orderTypeName",
          optionValue: "orderTypeNo",
          placeholder: "请选择",
          rules: {
            required: true,
            message: "上级部门",
          },
        },

         {
          key: isEdit ? "orderTypeName" : "orderTypeNo",
          type: isEdit ? "input" : "select",
          subtype: "text",
          label: "提醒表单对象",
          isEdit,
          //   multiple: true,
          options: this.salesmanListList,
          optionLabel: "orderTypeName",
          optionValue: "orderTypeNo",
          placeholder: "请选择",
          rules: {
            required: true,
            message: "上级部门",
          },
        },
         {
          key: isEdit ? "orderTypeName" : "orderTypeNo",
          type: isEdit ? "input" : "select",
          subtype: "text",
          label: "提醒方式",
          isEdit,
          //   multiple: true,
          options: this.salesmanListList,
          optionLabel: "orderTypeName",
          optionValue: "orderTypeNo",
          placeholder: "请选择",
          rules: {
            required: true,
            message: "上级部门",
          },
        },
         {
          key: isEdit ? "orderTypeName" : "orderTypeNo",
          type: isEdit ? "input" : "select",
          subtype: "text",
          label: "提醒频次",
          isEdit,
          //   multiple: true,
          options: this.salesmanListList,
          optionLabel: "orderTypeName",
          optionValue: "orderTypeNo",
          placeholder: "请选择",
          rules: {
            required: true,
            message: "上级部门",
          },
        },
            {
          key: "clauseContent",
          type: "checkbox",
          subtype: "checkbox",
          label: "是否可用",
          isEdit
        }
         
        

      ];

      return {
        inline: true,
        size: "mini",
        labelWidth: "85px !important",
        formItemList: formItemList,
      };
    },
  },

  watch: {},

  created() {},

  beforeMount() {},

  mounted() {
    this.initQueryForm();
  },
};
</script>

<style lang="scss" scoped>
.popBox {
  ::v-deep .el-dialog {
    overflow-y: auto;
    width: 800px !important;
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
</style>
<style lang="less" scoped>
.setmain {
  display: flex;
  height: 450px;

  & > div:last-child {
    width: 250px;
    flex-shrink: 0;
  }
  .showright {
    border: 1px solid rgba(222, 230, 242, 1);
    margin-left: 6px;

    & > div:first-child {
      background: #eaeef4 !important;
      font-size: 12px;
      font-weight: 500;
      padding: 4px 0px;
      color: #374256;
      padding-left: 8px;
    }
    & > div:last-child {
      // overflow: auto;
      .setonelist {
        font-size: 12px;
        padding:4px 8px;
        cursor: pointer;
      }
    }
  }
}
</style>
