<!--
@time:2021/12/1
@author:chenqian
-->
<template>
  <div class="popBox">
    <el-dialog
      title="提示"
      :visible.sync="pushVisible"
      @close="close"
      :destroy-on-close="true"
    >
      <div class="content">
        <!-- 上面的条件 -->
        <!-- v-if="!isEnterTabTwo" -->

        <div v-if="!isEnterTabTwo">
          <div
            style="background:#FFF2C7;overflow:hidden;padding:3px 8px;margin-bottom:6px"
          >
            <div style="float:left;margin-top:3px">
              <div style="display:flex">
                <div style="margin-right:5px">
                  <i
                    class="el-icon-warning-outline"
                    style="display:block;color:#ED802C;font-size:16px"
                  ></i>
                </div>
                <div>
                  <span style="display:block;font-size:12px;color:#ED802C">
                    请参考此文件格式填写excel表格
                  </span>
                </div>
              </div>
            </div>
            <div style="float:right">
              <a
                style="color: #1890ff; padding-right: 24px"
                @click="() => loadSomeModal()"
                >下载格式模板</a
              >
            </div>
          </div>
          <div v-if="!sendUploadFileName">
            <!-- 只能上传一次 -->
            <el-upload
              class="upload-demo  upload-somez"
              drag
              multiple
              ref="upload"
              :limit="1"
              accept=".xlsx,.xls"
              :before-upload="beforeUploadFile"
              :headers="upload.headers"
              :action="upload.url"
              :on-success="handleFileSuccess"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处，或<em>点击上传</em>
              </div>
            </el-upload>
          </div>

          <div v-else>
            <div style="text-align:center">
              <i
                class="el-icon-upload"
                style="color:#C0C4CC;font-size:84px"
              ></i>
            </div>
            <div style="text-align:center">
              <span>已经上传 {{ sendUploadFileName }}</span>

              <a
                @click="sendUploadFileName = ''"
                style="color:#1890ff;font-size:12px;padding-left:12px"
                >删除</a
              >
            </div>
          </div>
        </div>

        <div v-else>
          <div style="text-align:center">
            <i class="el-icon-upload" style="color:#C0C4CC;font-size:84px"></i>
          </div>
          <div style="text-align: center">导入完成</div>
          <div style="font-size:12px;text-align:center;margin-top:12px">
            <span> 本次导入成功导入{{ failNewsShow.successQty }}, </span>
            <span v-if="failNewsShow.failQty">
              <span> 导入失败 </span>
              <span style="color: red">
                {{ failNewsShow.failQty }}
              </span>
              <span> 条，请下载 </span>
              <a style="color: red" @click="() => loadErrorReason()">
                失败原因
              </a>
            </span>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="
            () => {
              this.isEnterTabTwo = false;
              close();
            }
          "
          >取 消</el-button
        >
        <el-button type="primary" @click="() => submitSureUpload()"
          >导 入</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import commonTable from "@/components/CommonTable";
import { getToken, downloadsome, downloadsomePost } from "@/utils/auth";
import { uploadPhoto } from "@/api/marketOrder";
import { importDataList } from "@/api/apizhu/index.js";

import { debuglog } from "util";

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
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url:
          process.env.VUE_APP_BASE_API +
          "mdm/material-property-define/add-batch-by-import"
      },
      isEnterTabTwo: false, //是否进入导入界面的显示结果的界面
      sendUploadFileName: "", //上传文件的文件名称

      // 上传文件的列表
      fileList: [],
      tableData: [],
      isEdit: true,
      basic: {
        billNo: ""
      },
      orderno: "",
      file: "", //文件
      fileFormData: ""
    };
  },
  methods: {
    // 文件格式类型判断 不要删除

    beforeUploadFile(file) {
      let extension = file.name.substring(file.name.lastIndexOf(".") + 1);
      let size = file.size / 1024 / 1024;

      if (extension !== "xls" && extension !== "xlsx") {
        this.$message.warning("请上传xls或者xlsx的文件");
        return false;
      }
      if (size > 10) {
        this.$message.warning("上传大小不能超出10M");
        return false;
      }
    },
    // 调取接口上传数据
    uploadHttpRequest(data) {
      // 上传接口
      /*   uploadPhoto(params)
        .then(res => {
          console.log(res);
        })
        .catch(error => {}); */
    },
    //点击保存
    submitSureUpload() {
      if (!this.sendUploadFileName) {
        return this.$message.error("请先上传文件");
      } else {
        console.log(this.file);
        let formData = new FormData();
        formData.append("file", this.file);
        importDataList(formData).then(res => {
          if (res.code === 200) {
            this.$message.success("导入成功");
            this.$emit("update:pushVisible", false);
          }
        });
      }
    },
    // 上传文件的列表
    handleUploadChange(file, fileList) {
      console.log(file, fileList);
      this.file = file;

      this.fileList = fileList;
    },
    uploadFile() {},
    loadSomeModal() {
      downloadsome("mdm/material-property-define/export-import-template");
    },
    //关闭弹窗
    close() {
      this.$emit("update:pushVisible", false);
    },

    //  文件上传成功的回调
    handleFileSuccess(response, file, fileList) {
      console.log(response, file, fileList);
      this.sendUploadFileName = file.name;
      this.failNewsShow = response.data;
      this.file = file.raw;
    }
  },
  computed: {},

  watch: {},

  created() {},

  beforeMount() {},

  mounted() {}
};
</script>
<style lang="less" scoped>
.setmoren {
  max-width: 300px;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}
.setbutton {
  background: #f7f9fd;
  padding: 4px 4px;
  /deep/ .el-button {
    padding: 0px 3px !important;
    width: 40px !important;
    height: 24px !important;
    font-size: 12px !important;
  }
}
.setMainFlex {
  display: flex;
  & > div:first-child {
    width: 81px;
    font-size: 12px;
    text-align: right;
  }
  & > div:last-child {
    border: 1px solid #dee6f2;
    width: 452px;
    margin-left: 6px;
    .setshuxingadd {
      display: flex;
      font-size: 12px;
      padding: 4px;
      & > div:first-child {
        width: 60px;
        opacity: 0.6;
      }
      & > div:last-child {
        display: flex;
        & > div {
          margin-right: 4px;
        }
      }
    }
  }
}
.upload-somez {
  /deep/ .el-upload-dragger {
    width: 535px !important;
    margin-bottom: 6px;
  }
}

.setzifu {
  display: flex;
  margin-top: 8px;
  & > div:first-child {
    width: 81px;
    font-size: 12px;
    text-align: right;
    line-height: 24px;
  }
  & > div:last-child {
    flex: 1;
    margin-left: 4px;
  }
}
.resetbutton {
  background: #f7f9fd;
  padding: 4px 8px;

  /deep/ .el-button {
    padding: 6px 7px !important;
    width: 40px !important ;
    height: 24px !important;
  }
}
</style>
<style lang="scss" scoped>
/* .popBox {
  ::v-deep .el-dialog {
    width: 565px !important;
    min-height: 110px !important;
    box-sizing: border-box;
    .el-dialog__body {
      padding: 0 !important;
      box-sizing: border-box;
      min-height: 110px !important;
      .content {
        margin-bottom: 25px;
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
        .upload-demo {
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
} */
</style>
