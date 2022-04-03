<!--
@time:2021/12/1
@author:chenqian
-->
<template>
  <div class="popBox">
    <el-dialog
      title="导入"
      :visible="pushVisible"
      @close="close"
      :close-on-click-modal="false"
    >
      <div class="font_12">
        <div><i class="el-icon-warning"></i>请参考此文件格式填写excel表格</div>
        <el-button style="width:100px" type="text" class="mr-10"
          >下载格式模板</el-button
        >
      </div>
      <div class="content">
        <label>上传文件</label>
        <el-upload
          class="upload-demo"
          drag
          :http-request="file => item.upload && item.upload($event, file)"
          accept=".xls,.XLS,.XLSX,.xlsx"
        >
          <div class="el-upload__text"><i style="color:#0066FF;" class="el-icon-upload2"></i><span>添加文件</span></div>
          <div class="el-upload__tip">
            文件后缀.xls或.xlsx，且不超过5000条
          </div>
        </el-upload>
      </div>
      <div slot="footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="submit">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import commonTable from "@/components/CommonTable";
export default {
  name: "add",
  components: { commonTable },

  mixins: [],

  props: {
    pushVisible: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      tableData: [],
      isEdit: true,
      basic: {
        billNo: ""
      },
      orderno: ""
    };
  },
  methods: {
    handleItemSelect(val) {},
    //点击保存
    submit() {
      // if (!checkFormData(this.formConfig.formItemList, this.queryForm)) {
      //   return;
      // }
    },
    //关闭弹窗
    close() {
      this.$emit("update:pushVisible", false);
    }
  },
  computed: {},

  watch: {},

  created() {},

  beforeMount() {},

  mounted() {}
};
</script>

<style lang="scss" scoped>
.popBox {
  ::v-deep .el-dialog {
    width: 565px !important;
    min-height: 110px !important;
    box-sizing: border-box;
    .el-dialog__body {
      padding: 0 !important;
      box-sizing: border-box;
      min-height: 110px !important;
      .content {
        min-height: 110px !important;
        display: flex;
        label {
          font-size: 12px;
          color: black;
          font-weight: normal;
          &::before {
            content: "*";
            color: #ff4949;
            margin-right: 4px;
          }
        }
        .upload-demo  {
          width: 460px;
          margin-left: 5px;
          height: 80px;
          .el-upload-dragger {
            width: 460px;
          height: 80px;
          }
          .el-upload__text {
            margin: 15px auto 0;
            span {
              margin-left: 3px;
              color: black;
            }
          }
          .el-upload__tip {
            color: #969799;
          }
        }
      }
    }
  }
}
.font_12 {
  width: 565px;
  height: 26px;
  box-sizing: border-box;
  line-height: 26px;
  background: #fff2c7;
  font-size: 12px;
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  padding: 0 16px;
  > div {
    color: #ed802c !important;
  }
}
</style>
