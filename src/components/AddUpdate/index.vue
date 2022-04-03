<!--
@time:2021/9/26
@author:zhupeikang
-->
<template>
  <div class="popBox">
    <el-dialog
        v-on="$listeners" v-bind="$attrs"
        :title="fullTitle?fullTitle:(isAdd?'新增'+title:(isCopy?'复制':'编辑'+title))" :visible="visible" @close="close" @open="open"
               :close-on-click-modal="false">
      <div class="content">
        <div class="form">
          <z-form ref="form" v-on="$listeners" v-bind="$attrs" :is-add="isAdd" :form-column="formColumn" :model="modelForm" @openLookUp="openLookUp" @opentree="opentree">
<!--            <template #lookup>-->
<!--              <div>-->
<!--                <look-up :visible.sync="look.visible"  :method="look.methods"-->
<!--                         :table-column="look.tableColumn" :search-arr="look.searchArr"></look-up>-->
<!--              </div>-->
<!--            </template>-->
            <template #imageUrl>
              <div class="upload">
                <el-upload
                    :before-upload="handleBeforeUpload"
                    :headers="uploadConfig.headers"
                    :action="uploadConfig.url"
                    :limit="1"
                    ref="upload"
                    :disabled="uploadConfig.uploading"
                    name="file"
                    :on-success="uploadSuccess"
                    list-type="picture-card"
                    :on-progress="uploadProGress"
                    :file-list="fileList"
                    accept="jpg/png">
                  <i slot="default" class="el-icon-plus"></i>
                  <div slot="file" slot-scope="{file}">
                    <el-image
                        class="el-upload-list__item-thumbnail"
                        style="width: 100px; height: 100px"
                        :src="file.url"

                    >
                    </el-image>
                    <span class="el-upload-list__item-actions">
                      <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)"><i
                          class="el-icon-zoom-in"></i></span>
        <span
            v-if="!uploadConfig.uploading"
            class="el-upload-list__item-delete"
            @click="removeFile"
        >
          <i class="el-icon-delete"></i>
        </span>
      </span>
                  </div>
                  <div slot="tip" class="el-upload__tip">图片大小2M以下，尺寸600X600 px ,格式jpg/png/jpeg</div>
                </el-upload>
              </div>
            </template>
          </z-form>
        </div>
      </div>
      <div slot="footer" v-if="!showSure">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="submit" :loading="buttonLoading">确认</el-button>
      </div>
       <div slot="footer" class="dialog-footer" v-else>
        <el-button type="primary" @click="() => close()">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible" modal-append-to-body>
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import ZForm from '@/components/ZForm/ZForm'
import {buttonLoading} from "@/lib/buttonLoading";
import {uploadUrl} from "@/api/common";
import {Base64} from "js-base64";
import website from "@/settings";
import {getToken} from "@/utils/auth";
import lookUp from '@/components/ZLookUp/lookUp'

export default {
  name: "index",
  components: {ZForm, lookUp},
  mixins: [buttonLoading],
  props: {
    look: {
      type: Object,
      default: () => {
        return {}
      }
    },
    showSure: {
      type: Boolean,
      default: false
    },
    visible: {
      type: Boolean,
      default: false
    },
    hasUpload: {
      type: Boolean,
      default: false
    },
    isAdd: {
      type: Boolean,
      default: true
    },
    isCopy: {
      type: Boolean,
      default: false
    },
    model: {
      type: Object,
      default: () => {
        return {}
      }
    },
    title: {
      type: String,
      default: ''
    },
    fullTitle:{
      type: String,
      default: ''
    },
    formColumn: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      fileType:['jpg', 'png', 'jpeg'],
      fileSize:2,
      fileList: [],
      dialogVisible: false,
      disabled: false,
      dialogImageUrl: '',
      modelForm: {},
      fileUrl: '',
      uploadConfig: {
        uploading: false,
        'Blade-Auth': '',
        // 设置上传的请求头部
        headers: {
          Authorization: `Basic ${Base64.encode(
              `${website.clientId}:${website.clientSecret}`
          )}`,
        },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/trade-sm/sys/oss/uploadFile",
      },
    }
  },
  methods: {

    openLookUp(e){
      // console.log(this.formParams)
      this.$emit('openLookUp',e)
    },
    opentree(e){
      this.$emit('opentree',e)
    },
    removeFile() {
      this.fileUrl = ''
      this.uploadConfig.uploading = false
      this.$refs.upload.clearFiles()
    },
    uploadProGress() {
      this.uploadConfig.uploading = true
      this.setButtonLoading()
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //打开弹窗判断是否进行编辑
    open() {
      if (this.isAdd) {
        this.$set(this.modelForm,'usable',true)

      } else {
        if (this.hasUpload) {
          this.fileList.push({url: this.model.imageUrl})
          this.fileUrl = this.model.imageUrl
        }
        this.modelForm = this.model
      }
      if (this.isCopy) {
        // delete this.modelForm .id
      }
    },
    uploadSuccess(response) {
      this.cancelButtonLoading()
      this.fileUrl = response.data
      this.uploadConfig.uploading = false
    },
    // 上传前校检格式和大小
    handleBeforeUpload(file) {
      // 校检文件类型
      if (this.fileType) {
        let fileExtension = "";
        if (file.name.lastIndexOf(".") > -1) {
          fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1);
        }
        const isTypeOk = this.fileType.some((type) => {
          if (file.type.indexOf(type) > -1) return true;
          if (fileExtension && fileExtension.indexOf(type) > -1) return true;
          return false;
        });
        if (!isTypeOk) {
          this.$message.error(`文件格式不正确, 请上传${this.fileType.join("/")}格式文件!`);
          return false;
        }
      }
      // 校检文件大小
      if (this.fileSize) {
        const isLt = file.size / 1024 / 1024 < this.fileSize;
        if (!isLt) {
          this.$message.error(`上传文件大小不能超过 ${this.fileSize} MB!`);
          return false;
        }
      }
      return true;
    },
    //提交表单
    submit() {
      this.setButtonLoading()
      this.$refs.form.checkForm().then(res => {
        this.cancelButtonLoading()
        res.imageUrl = this.fileUrl

        this.$emit('submit', res)
      }).catch((e) => {
        this.cancelButtonLoading()
      })
    },
    //关闭弹窗
    close() {
      if (this.hasUpload) {
        this.fileList = []
      }
      //清除数据
      this.modelForm={}
      //清除验证
      this.$refs.form.$refs.queryForm.clearValidate()
      this.$emit('update:visible', false)
    }
  },
  computed: {},

  watch: {
    //监听选择项变化，变更表单
    model: {
      handler(val) {
        this.modelForm = val
      },
      immediate: true
    }
  },

  beforeCreat() {

  },

  created() {

  },

  beforeMount() {
  },

  mounted() {

    this.uploadConfig.headers['Blade-Auth'] = "bearer " + getToken();

  },

  beforeUpdate() {

  },

  updated() {

  },

  activated() {

  },

  deactivated() {

  },

  beforeDestroy() {

  },

  destroyed() {
  }


}
</script>

<style scoped>
.el-upload__tip {
  font-size: 12px;

  color: #969799;
}


</style>

