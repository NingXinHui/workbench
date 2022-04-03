<!--
@time:2021/12/1
@author:chenqian
-->
<template>
  <div class="popBox">
    <el-dialog
    title="溯源"
      :visible="sourceVisible"
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
</template>

<script>
import formList from "@/components/Form/formList";
import commonTable from "@/components/CommonTable";
import { checkFormData } from "@/lib/common";
import lookUp from '@/components/ZLookUp/lookUpImport'; //lookup统一弹窗
import { getDataList } from '@/api/marketOrder'
export default {
  name: "add",
  components: { formList, commonTable,lookUp },

  mixins: [],

  props: {
    sourceVisible: {
      type: Boolean,
      default: false
    },
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
      this.$emit("update:sourceVisible", false);
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
        key: "billDate",
        type: "date",
        subtype: "date",
        valueFormat: "yyyy-MM-dd",
        label: "入库时间",
        isEdit
      }
      ];

      return {
        inline: true,
        size: "mini",
        labelWidth: "80px !important",
        formItemList: formItemList
      };
    },
  },

  watch: {},

  created() {},

  beforeMount() {},

  mounted() {
    if (this.billCodeText == "查看类型") {
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
