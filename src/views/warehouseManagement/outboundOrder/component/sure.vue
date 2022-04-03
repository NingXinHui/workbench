<!--
@time:2021/12/1
@author:chenqian
-->
<template>
  <div class="popBox">
    <el-dialog title="收货确认"
               :visible="visible"
               @close="close"
               :close-on-click-modal="false">
      <div class="content">
        <div class="form">
          <form-list v-model="queryForm"
                     :formConfig="formConfig"
                     class="form form-order-box"></form-list>
        </div>
        <div class="form">
          <form-list v-model="queryForm"
                     :formConfig="formOne"
                     class="form form-order-box">
            <el-form-item label="上传凭证"
                          required>
              <el-upload class="avatar-uploader"
                         :http-request="(file) =>upload($event, file)"
                         :show-file-list="false"
                         :before-upload="beforeAvatarUpload">
                <img v-if="imageUrl"
                     :src="imageUrl"
                     class="avatar">
                <i v-else
                   class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <div class="tips">只能上传jpg/png文件，且不超过500kb</div>
            </el-form-item>
          </form-list>
        </div>
      </div>
      <div slot="footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary"
                   @click="submit">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import formList from "@/components/Form/formList";
import commonTable from "@/components/CommonTable";
import { checkFormData } from "@/lib/common";
import { trueOutWareManagerApi } from "@/api/wareManagementApi/outWareManagemen";

export default {
  name: "add",
  components: { formList, commonTable },

  mixins: [],

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    details: {
      type: String,
      default: ''
    }
  },

  data () {
    return {
      queryForm: {},
      isEdit: true,
      imageUrl: "",
      salesmanListList: [],
      basic: {
        receiveStatus: 0
      },
      tableData: [],
      selectList: []
    };
  },
  methods: {
    upload () { },
    beforeAvatarUpload () { },
    //点击保存
    submit () {
      if (!checkFormData(this.formConfig.formItemList, this.queryForm)) {
        return;
      }
      let params = this.queryForm
      Object.assign(params, {
        id: this.details.id,
        receiveStatus: !!this.queryForm.receiveStatus ? 1 : 0
      })
      console.log(params)
      trueOutWareManagerApi(params).then((res) => {
        this.$message.success("操作成功");
        this.loading = false;
        this.$emit("submit");
        this.$emit("update:visible", false);
      }).catch(() => {

      })
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
          key: "receiveStatus",
          type: "checkbox",
          subtype: "checkbox",
          label: "收货确认",
          isEdit,
          rules: {
            required: true,
            trigger: "change"
          }
        }
      ];

      return {
        inline: true,
        size: "mini",
        labelWidth: "90px !important",
        formItemList: formItemList
      };
    },
    formOne () {
      let isEdit = !this.isEdit;
      let formItemList = [
        {
          key: "transportUnit",
          type: "input",
          subtype: "text",
          label: "运输单位",
          disabled: false,
          isEdit,
          placeholder: "请输入",
        },
        {
          key: "transportFeeType",
          type: "input",
          subtype: "text",
          label: "运输类型",
          disabled: false,
          isEdit,
          placeholder: "请输入",
        }, {
          key: "transportFee",
          type: "input",
          subtype: "text",
          label: "运费",
          isEdit,
          placeholder: "请输入",
          rules: {
            required: true,
            trigger: "change"
          }
        }, {
          key: "receiveDate",
          type: "date",
          subtype: "date",
          valueFormat: "yyyy-MM-dd",
          label: "实际签收日期",
          rules: {
            required: true,
            trigger: "change"
          },
          isEdit
        },
        {
          key: "receiveRemark",
          type: "input",
          subtype: "textarea",
          label: "签收备注",
          isEdit,
          placeholder: "请输入",
          maxlength: 200,

        }
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

  created () { },

  beforeMount () { },

  mounted () {
    if (this.billCodeText == "查看货龄") {
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
        .form-order-box {
          .el-form-item:nth-child(6) {
            .el-form-item__content {
              width: 300px !important;
            }
          }
        }
      }
    }
  }
}
::v-deep .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9 !important;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  line-height: 80px;
  text-align: center;
}
.avatar {
  width: 80px;
  height: 80px;
  display: block;
}
.tips {
  font-size: 12px;
  font-family: PingFangSC-Regular;
  color: #969799;
}
</style>
