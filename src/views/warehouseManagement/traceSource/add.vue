<!--
@time:2021/12/1
@author:chenqian
-->
<template>
 <div>
  <div class="popBox">
    <el-dialog
    :title="billCodeText"
      :visible="addvisible"
      @close="close"
      :close-on-click-modal="false"
    >
      <div class="content">
        <div class="form">
          <form-list
            v-model="queryForm"
            :formConfig="formConfig"
            class="form form-order-box"
          ></form-list>
        </div>
      </div>
      <div slot="footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="submit">确认</el-button>
      </div>
    </el-dialog>

     <look-up ref="lookup"
      :visible.sync="visible" @setCheckItem="setCheckItem" :method="look.method" :table-column="look.tableColumn" :search-arr="look.searchArr" :params="look.params" ></look-up>
  </div>
  <SelectOrderTable  :orderVisible.sync="orderVisible"></SelectOrderTable>
 </div>
</template>

<script>
import formList from "@/components/Form/formList";
import commonTable from "@/components/CommonTable";
import { checkFormData } from "@/lib/common";
import SelectOrderTable from "./selectOrderTable"
import lookUp from '@/components/ZLookUp/lookUpImport'; //lookup统一弹窗
import { getDataList } from '@/api/marketOrder'
export default {
  name: "add",
  components: { formList, commonTable,lookUp,SelectOrderTable },

  mixins: [],

  props: {
    addvisible: {
      type: Boolean,
      default: false
    },
    billCodeText: {
      type:String,
      default:'',
    }
  },

  data() {
    return {
      queryForm: {},
      isEdit: true,
      salesmanListList: [],
      basic: {
        orderTypeNo3: '入库',
        billNo: "",
        orderTypeNo: "",
        bill: ""
      },
      look: {
       method: getDataList,
    visible: false,
    params: {},
    searchArr: [
      {
        label: "物料编号",
        field: "orderNo",
        type: 1,
        maxLength: "60"
      },
      {
        label: "物料名称",
        field: "orderNo",
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
        label: "物料编号",
        prop: "arrangeNo"
      },
      {
        label: "物料名称",
        prop: "orderNo"
      },
      {
        label: "物料描述",
        prop: "orderNo"
      },
      {
        label: "",
        prop: ""
      }
    ]
      },
      tableData: [],
      selectList: [],
      visible:false,
      orderVisible:false,
    };
  },
  methods: {
    setCheckItem() {},
    //点击保存
    submit() {
      if (!checkFormData(this.formConfig.formItemList, this.queryForm)) {
        return;
      }
    },
    //关闭弹窗
    close() {
      this.$emit("update:addvisible", false);
    },
    //初始化页面参数
    initQueryForm(data = {}) {
      let basic = this.basic;
      this.queryForm = {
        ...basic,
        ...data
      };
    }
  },
  computed: {
    formConfig() {
      let isEdit = !this.isEdit;
      let formItemList = [
         {
          key: "bill",
          type: "input",
          subtype: "text",
          label: "追溯单号",
          isEdit,
          placeholder: "请输入",
          maxlength: 200,
          rules: {
            required: true,
            trigger: "change"
          }
        }, {
          key: "bill",
          type: "input",
          subtype: "text",
          label: "顺序号",
          isEdit,
          placeholder: "请输入",
          maxlength: 200,
          rules: {
            required: true,
            trigger: "change"
          }
        },
        {
          key: "billNo",
          type: "input",
          subtype: "text",
          label: "物料编号",
          isEdit,
          placeholder: "请输入",
           attrs: {
          readonly: true,
          suffixIcon: "el-icon-arrow-down"
        },
        listeners: {
          focus: () => this.visible = true
        },
          rules: {
            required: true,
            trigger: "change"
          }
        }, {
          key: "bill",
          type: "input",
          subtype: "text",
          label: "物料分类",
          isEdit,
          placeholder: "请输入",
          maxlength: 200,
          rules: {
            required: true,
            trigger: "change"
          }
        }, {
          key: "bill",
          type: "input",
          subtype: "text",
          label: "物料名称",
          isEdit,
          placeholder: "请输入",
          maxlength: 200,
          rules: {
            required: true,
            trigger: "change"
          }
        }, {
          key: "bill",
          type: "input",
          subtype: "text",
          label: "物料描述",
          isEdit,
          placeholder: "请输入",
          maxlength: 200,
          rules: {
            required: true,
            trigger: "change"
          }
        },
        {
        key: isEdit ? "orderTypeName3" : "orderTypeNo3",
        type: isEdit ? "input" : "select",
        subtype: "text",
        label: "入库批次号",
        isEdit,
        options: [{
          label: "出库",
          value: "出库"
        },{
          label: "入库",
          value: "入库"
        }],
        optionLabel: "label",
        optionValue: "value",
        rules: {
          required: true,
          trigger: "blur"
        }
      },
        {
          key: "bill",
          type: "input",
          subtype: "text",
          label: "产地-国家",
          isEdit,
          placeholder: "请输入",
          maxlength: 200,
          rules: {
            required: true,
            trigger: "change"
          }
        }, {
          key: "bill",
          type: "input",
          subtype: "text",
          label: "产地-地区",
          isEdit,
          placeholder: "请输入",
          maxlength: 200,
          rules: {
            required: true,
            trigger: "change"
          }
        }, {
          key: "bill",
          type: "input",
          subtype: "text",
          label: "产地-兵团",
          isEdit,
          placeholder: "请输入",
          maxlength: 200,
          rules: {
            required: true,
            trigger: "change"
          }
        }, {
          key: "bill",
          type: "input",
          subtype: "text",
          label: "品牌",
          isEdit,
          placeholder: "请输入",
          maxlength: 200,
          rules: {
            required: true,
            trigger: "change"
          }
        }, {
          key: "bill",
          type: "input",
          subtype: "text",
          label: "来源单号",
          isEdit,
          placeholder: "请输入",
          maxlength: 200,
          rules: {
            required: true,
            trigger: "change"
          }
        }, {
          key: "bill",
          type: "input",
          subtype: "text",
          label: "源单类型",
          isEdit,
          placeholder: "请输入",
          maxlength: 200,
          rules: {
            required: true,
            trigger: "change"
          }
        },  {
          key: "billNo",
          type: "input",
          subtype: "text",
          label: "销售订单号",
          isEdit,
          placeholder: "请输入",
           attrs: {
          readonly: true,
          suffixIcon: "el-icon-arrow-down"
        },
        listeners: {
          focus: () => this.orderVisible = true
        },
          rules: {
            required: true,
            trigger: "change"
          }
        },
        {
          key: "bill",
          type: "input",
          subtype: "text",
          label: "销售指导价",
          isEdit,
          placeholder: "请输入",
          maxlength: 200,
          rules: {
            required: true,
            trigger: "change"
          }
        },{
          key: "bill",
          type: "input",
          subtype: "text",
          label: "销售价",
          isEdit,
          placeholder: "请输入",
          maxlength: 200,
          rules: {
            required: true,
            trigger: "change"
          }
        },{
          key: "bill",
          type: "input",
          subtype: "text",
          label: "销售业务员",
          isEdit,
          placeholder: "请输入",
          maxlength: 200,
          rules: {
            required: true,
            trigger: "change"
          }
        },{
          key: "billNo",
          type: "input",
          subtype: "text",
          label: "采购订单号",
          isEdit,
          placeholder: "请输入",
           attrs: {
          readonly: true,
          suffixIcon: "el-icon-arrow-down"
        },
        listeners: {
          focus: () => this.visible = true
        },
          rules: {
            required: true,
            trigger: "change"
          }
        },{
          key: "bill",
          type: "input",
          subtype: "text",
          label: "采购入库单价",
          isEdit,
          placeholder: "请输入",
          maxlength: 200,
          rules: {
            required: true,
            trigger: "change"
          }
        },{
          key: "bill",
          type: "input",
          subtype: "text",
          label: "采购业务员",
          isEdit,
          placeholder: "请输入",
          maxlength: 200,
          rules: {
            required: true,
            trigger: "change"
          }
        },{
          key: "bill",
          type: "input",
          subtype: "text",
          label: "供应商",
          isEdit,
          placeholder: "请输入",
          maxlength: 200,
          rules: {
            required: true,
            trigger: "change"
          }
        },{
          key: "bill",
          type: "input",
          subtype: "text",
          label: "生产任务号",
          isEdit,
          placeholder: "请输入",
          maxlength: 200,
          rules: {
            required: true,
            trigger: "change"
          }
        },{
          key: "billNo",
          type: "input",
          subtype: "text",
          label: "委外加工单号",
          isEdit,
          placeholder: "请输入",
           attrs: {
          readonly: true,
          suffixIcon: "el-icon-arrow-down"
        },
        listeners: {
          focus: () => this.orderVisible = true
        },
          rules: {
            required: true,
            trigger: "change"
          }
        },{
          key: "bill",
          type: "input",
          subtype: "text",
          label: "生产入库单价",
          isEdit,
          placeholder: "请输入",
          maxlength: 200,
          rules: {
            required: true,
            trigger: "change"
          }
        },{
          key: "bill",
          type: "input",
          subtype: "text",
          label: "生产厂家",
          isEdit,
          placeholder: "请输入",
          maxlength: 200,
          rules: {
            required: true,
            trigger: "change"
          }
        },{
          key: "bill",
          type: "input",
          subtype: "text",
          label: "跟单员",
          isEdit,
          placeholder: "请输入",
          maxlength: 200,
          rules: {
            required: true,
            trigger: "change"
          }
        },{
          key: "bill",
          type: "input",
          subtype: "text",
          label: "生产批次号",
          isEdit,
          placeholder: "请输入",
          maxlength: 200,
          rules: {
            required: true,
            trigger: "change"
          }
        },{
          key: "bill",
          type: "input",
          subtype: "text",
          label: "缸号",
          isEdit,
          placeholder: "请输入",
          maxlength: 200,
          rules: {
            required: true,
            trigger: "change"
          }
        }, {
        key: "orderTypeNo5a",
        type: "upload",
        subtype: "text",
        label: "附件",
        isEdit
      },
      ];

      return {
        inline: true,
        size: "mini",
        labelWidth: "90px !important",
        formItemList: formItemList
      };
    },
  },

  watch: {},

  created() {},

  beforeMount() {},

  mounted() {
    if (this.billCodeText == "查看") {
      this.isEdit = false;
    }
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
    max-height: 700px !important;
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
