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
import { addWorkprocedure,updateWorkprocedure,getWorkprocedureDetail } from "@/api/production/workingProcedure";
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
      salesmanListList: [],
      basic: {
        procedureName: "",
        usable: true,
      }
    };
  },
  methods: {
    //获取详情
    init() {
      getWorkprocedureDetail({
        id:this.detail.id
      }).then(res => {
        if(res.code == 0) {
          this.initQueryForm(res.data)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    //点击保存
    submit() {
      if (!checkFormData(this.formConfig.formItemList, this.queryForm)) {
        return;
      }
         if(this.billCodeText == '新增') {
        addWorkprocedure({
          ...this.queryForm,
        }).then(res => {
          if(res.success) {
            this.$message.success("新增成功");
             this.$emit("update:visible", false);
              this.$parent.getDataList();
          } else {
            this.$$message.error(res.msg)
          }
        })
      } else {
         updateWorkprocedure({...this.queryForm,
        }).then(res => {
          if(res.success) {
            this.$message.success("修改成功");
             this.$emit("update:visible", false);
             this.$parent.getDataList();
          } else {
            this.$$message.error(res.msg)
          }
        })
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
        ...data
      };
    }
  },
  computed: {
    formConfig() {
      let isEdit = !this.isEdit;
      let formItemList = [
        {
          key: "procedureNo",
          type: "input",
          subtype: "text",
          label: "工序编号",
          isEdit,
          placeholder: "保存成功之后生成",
          disabled: true
        },
        {
          key: "procedureName",
          type: "input",
          subtype: "text",
          label: "工序名称",
          isEdit,
          placeholder: "请输入",
          rules: {
            required: true,
            trigger: "blur"
          }
        },
        {
          key: "usable",
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
        formItemList: formItemList
      };
    }
  },

  watch: {},

  created() {},

  beforeMount() {},

  mounted() {
    this.initQueryForm();
    if(this.billCodeText == '编辑') {
      this.init();
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
