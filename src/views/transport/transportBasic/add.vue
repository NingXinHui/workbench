<!--
@time:2022/1/10
@author:shaoliting
-->
<template>
  <div class="popBox">
    <el-dialog
      :title="billCodeText"
      :visible="visible"
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
  </div>
</template>

<script>
import formList from "@/components/Form/formList";
import { checkFormData } from "@/lib/common";
import {
  addDpartment,
  updateDpartment,
  selectDpartment
} from "@/api/systemzhu/department";
import { selectCompany } from "@/api/systemzhu/role";
export default {
  name: "add",
  components: { formList },

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
      queryForm: {},
      isEdit: true,
      companyList: [],
      departmentList: [
        {
          id: "0",
          fullName: "顶级"
        }
      ],
      basic: {
        departmentNo: "",
        fullName: "",
        companyId: "",
        parentId: "0",
        usable:true,
        orderNumber:1,
        remark: ""
      }
    };
  },
  methods: {
    //点击保存
    submit() {
      if (!checkFormData(this.formConfig.formItemList, this.queryForm)) {
        return;
      }
      if (this.billCodeText == "新增") {
        addDpartment({
          ...this.queryForm,
          name:this.queryForm.fullName,
        }).then(res => {
          if (res.success) {
            this.$message.success("新增成功");
            this.$emit("update:visible", false);
            this.$parent.getDataList();
          } else {
            this.$$message.error(res.msg);
          }
        });
      } else {
        updateDpartment({ ...this.queryForm,
        name:this.queryForm.fullName,
        }).then(res => {
          if (res.success) {
            this.$message.success("修改成功");
            this.$emit("update:visible", false);
            this.$parent.getDataList();
          } else {
            this.$$message.error(res.msg);
          }
        });
      }
    },
    selectDpartment(val) {
      selectDpartment({
        companyId: val
      }).then(res => {
        if (res.code == 0) {
          this.departmentList = [{
                    id: '0',
                    fullName: "顶级"
                  },...res.data];
        }
      });
    },
    selectCompany() {
      selectCompany({
        pageNo: 1,
        pageSize: 50
      }).then(res => {
        if (res.code == 0) {
          this.companyList = res.data.records;
        }
      });
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
        ...data
      };
    }
  },
  computed: {
    formConfig() {
      let isEdit = !this.isEdit;
      let formItemList = [
        {
          key: "departmentNo",
          type: "input",
          subtype: "text",
          label: "编号",
          isEdit,
          placeholder: "请输入",
        },
        {
          key: "fullName",
          type: "input",
          subtype: "text",
          label: "车牌号",
          isEdit,
          placeholder: "请输入",
          rules: {
            required: true,
            trigger: "change"
          }
        },
          {
          key: "departmentNo",
          type: "input",
          subtype: "text",
          label: "司机姓名",
          isEdit,
          placeholder: "请输入",
        },
          {
          key: "departmentNo",
          type: "input",
          subtype: "text",
          label: "司机联系方式",
          isEdit,
          placeholder: "请输入",
        },
        {
          key: "departmentNo",
          type: "input",
          subtype: "text",
          label: "备注",
          isEdit,
          placeholder: "请输入",
        },
         {
          key: "usable",
          type: "checkbox",
          subtype: "checkbox",
          label: "是否可用",
          isEdit
        },
      ];

      return {
        inline: true,
        size: "mini",
        labelWidth: "85px !important",
        formItemList: formItemList
      };
    }
  },

  watch: {},

  created() {},

  beforeMount() {},

  mounted() {
    this.selectCompany();
    this.initQueryForm();
    console.log(this.detail)
    if(this.billCodeText == '编辑') {
      this.initQueryForm(this.detail)
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
      }
    }
  }
}
</style>
