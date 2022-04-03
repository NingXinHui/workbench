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
        <div class="form" style="width:500px">
          <form-list
            v-model="queryForm"
            :formConfig="formConfig"
            class="form form-order-box"
          ></form-list>
        </div>
        <quill-editor
          style="width:100%;height:400px"
          v-model="queryForm.termsContent"
          ref="myQuillEditor"
          :disabled="billCodeText=='查看'"
          :options="editorOption"
          maxlength="1000"
          @blur="onEditorBlur($event)"
          @focus="onEditorFocus($event)"
          @change="onEditorChange($event)"
        >
        </quill-editor>
      </div>
      <div slot="footer">
        <el-button @click="close">取消</el-button>
          <el-button type="primary" v-if="billCodeText=='查看'" @click="edit">编辑</el-button>
        <el-button type="primary" v-if="billCodeText!='查看'" @click="submit">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import formList from "@/components/Form/formList";
import { checkFormData } from "@/lib/common";
import {addContract,searchContract,updateContract} from "@/api/sale/base"
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
      content: "",
      editorOption: {
        theme: "snow",
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"], //加粗 斜体下划线删除线["blockquote"，"code-block"]，1/ 引用代码块
            [{ header: 1 }, { header: 2 }], // 1、2级标题
            [{ list: "ordered" }, { list: "bullet" }], //有序、无序列表
            [{ script: "sub" }, { script: "super" }], //上标/下标
            [{ indent: "-1" }, { indent: "+1" }], //缩进
            [{ direction: "rtl" }],
            //文本方向
            [{ size: ["small", false, "large", "huge"] }], //字体大小
            [{ header: [1, 2, 3, 4, 5, 6, false] }], //标题
            [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色[{ font:[]}]，1/字体种类
            [{ align: [] }], // 对齐方式
            ["clean"], // 清除文本格式
            ["link", "image", "video"] //链接、图片、视频
          ]
        }
      },
      queryForm: {},
      isEdit: true
    };
  },
  methods: {
    edit() {
      this.$parent.billCodeText = '编辑';
    },
    //点击保存
    submit() {
      if (!checkFormData(this.formConfig.formItemList, this.queryForm)) {
        return;
      }
      if(!this.queryForm.termsContent) {
        this.$message.error("条款内容必填");
        return
      }
      if(this.billCodeText == '新增') {
        addContract(this.queryForm).then(res => {
          if(res.success) {
            this.$message.success("新增成功");
             this.$emit("update:visible", false);
              this.$parent.getDataList();
          } else {
            this.$$message.error(res.msg)
          }
        })
      } else {
         updateContract({...this.queryForm,
         id:this.detail.id}).then(res => {
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
    //富文本失焦事件
    onEditorBlur() {},
    //富文本获取焦点事件
    onEditorFocus() {},
    //富文本改变事件
    onEditorChange() {},
    //初始化页面参数
    initQueryForm(data = {}) {
      this.queryForm = {
        termsName: "",
        usable: true,
        orderNumber:1,
        termsContent:"",
        ...data
      };
    }
  },
  computed: {
    formConfig() {
      let isEdit = !this.isEdit;
      let formItemList = [
        {
          key: "termsName",
          type: "input",
          subtype: "text",
          label: "条款名称",
          isEdit,
          placeholder: "请输入",
          disabled:this.billCodeText == '查看',
          rules: {
            required: true,
            trigger: "change"
          }
        },
        {
          key: "usable",
          type: "checkbox",
          subtype: "checkbox",
          disabled:this.billCodeText == '查看',
          label: "是否可用",
          isEdit
        }
      ];

      return {
        inline: true,
        size: "mini",
        labelWidth: "65px !important",
        formItemList: formItemList
      };
    }
  },

  watch: {},

  created() {},

  beforeMount() {},

  mounted() {
    this.initQueryForm();
    if(this.billCodeText == "编辑"||this.billCodeText == "查看") {
      searchContract({id: this.detail.id}).then(res => {
        if(res.success) {
          this.initQueryForm(res.data)
        } else {
          this.$message.error(res.msg);
        }
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.popBox {
  ::v-deep .el-dialog {
    overflow-y: auto;
    width: 1000px !important;
    min-height: 550px !important;
    .el-dialog__body {
      padding: 0 !important;
      min-height: 500px;
      .content {
        min-height: 500px !important;
        overflow-x: auto;
      }
    }
  }
}
</style>
