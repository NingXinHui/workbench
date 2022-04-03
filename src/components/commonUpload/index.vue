<template>
  <div id="commonaddupdadteone">
    <el-dialog
      @close="() => this.closeModal()"
      :close-on-click-modal="false"
      title="上传附件"
      width="600px"
      :visible.sync="dialogFormVisible"
    >
      <div style="display: flex">
        <el-upload
          ref="upload"
          :before-upload="beforeUploadFile"
          :headers="upload.headers"
          :action="upload.url"
          :show-file-list="false"

          :http-request="(file) => uploadOne(file, 'legalPersonIdcardFrontUrl')"
        >
          <el-button style="margin-right: 12px" size="small" type="primary"
            >上传</el-button
          >
        </el-upload>
        <el-button type="primary" @click="() => deleteOneFile()">
          删除
        </el-button>
        <el-button type="primary" @click="() => seelook()"> 查看 </el-button>
        <el-button type="primary" @click="() => download()"> 下载 </el-button>
      </div>
      <div class="z-content-table">
        <common-table
          is-height
          ref="mainTable"
          :isMain="true"
          :isPage="true"
          :tableColumn="tableColumn"
          :tableData="tableData"
          :isSelection="true"
          :tableheight="300"
          @selePage="handleItemSelect"
        />
      </div>
       <span slot="footer" class="dialog-footer">
    <el-button @click="()=>this.closeModal()">取 消</el-button>

  </span>
    </el-dialog>

    <el-image-viewer
      v-if="visibleImg"
      :on-close="() => this.visibleImg=false"
      style="z-index: 20000000"
      :url-list="[multipleSelection[0].filePath || multipleSelection[0].fileUrl]"
    />
  </div>
</template>

<script>
// import render from "./table-render.js";
import commonTable from "@/components/CommonTable";
import { getToken ,downloadsomeTwo} from "@/utils/auth";
import { deleteMenuFileToId, fileListAll ,uploadFileTanKuang,fileListBill} from "@/api/common";
import ElImageViewer from "element-ui/packages/image/src/image-viewer";
export default {
  name: "kaka",
  components: {
    commonTable,
    ElImageViewer,
  },
  props: {
    fileIds: {
      type: Array,
      default: () => [],
    },
    billType:{
      type:String,
      default:''
    },
     billId:{
      type:String,
      default:''
    },

  }, //是不是编辑   发送过来的数据
  data() {
    return {
      dialogFormVisible: false,
      tableData: [],
      visibleImg: false,
      multipleSelection: [],
      showFile:'',//上传的文件
      tableColumn: [
        {
          prop: "fileName",
          label: "附件文件名",
          align: "center",
        },
        {
          prop: "createUserName",
          label: "上传人",
          align: "center",
        },
        {
          prop: "createTime",
          label: "上传时间",
          align: "center",
        },
      ],

      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",

        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "sm/file/upload",
      },
    };
  },
  mounted() {
    // if (this.fileIds && this.fileIds.length > 0) {
    //   // fileListAll({idList:this.fileIds.toString()}).then(res=>{
    //   //     // this.tableData=res.data
    //   // })
    // }
    // 加载下附件列表的数据
    fileListBill({billType:this.billType,billId:this.billId}).then(res=>{
      if(res.success){
        this.tableData=res.data
      }
    })

    this.dialogFormVisible = true;
  },
  methods: {
    // 上传前操作 判断上传大小
    beforeUploadFile(file) {
      let size = file.size / 1024 / 1024;

      if (size > 20) {
        this.$message.warning("上传大小不能超出20M");
        return false;
      }

    },



    // 重置上传路径方式
    uploadOne(file, type) {
      if(this.tableData.length > 10) {
        this.$message.error("附件不能超过十条");
        return
      }
       let formData = new FormData();
       formData.append("file", file.file);
       formData.append('billType',this.billType);
       formData.append('billId',this.billId);

       uploadFileTanKuang(formData).then(res => {
         if(res.success) {
              fileListBill({billType:this.billType,billId:this.billId}).then(res=>{
      if(res.success){
        this.tableData=res.data
      }
    })
              this.showFile=''
         } else {
           this.$message.error(res.msg);
         }
       }
       )
    },

    // 预览图片
    seelook() {
      function isAssetTypeAnImage(ext) {
        return (
          [
            "png",
            "jpg",
            "jpeg",
            "bmp",
            "gif",
            "webp",
            "psd",
            "svg",
            "tiff",
          ].indexOf(ext.toLowerCase()) !== -1
        );
      }

      if (this.multipleSelection.length < 1) {
        return this.$message.error("请选择要查看的文件");
      }

      let seeImage = this.multipleSelection[0].fileName.split(".")[1];
      if (!isAssetTypeAnImage(seeImage)) {
        return this.$message.error("请查看图片文件");
      }
      this.visibleImg = true;
    },
    // 删除上传的文件
    deleteOneFile() {
      if (this.multipleSelection.length < 1) {
        return this.$message.error("请选择要删除的文件");
      }

      deleteMenuFileToId({ fileId: this.multipleSelection[0].id }).then(
        (res) => {
          if (res.success) {
            this.tableData = this.tableData.filter(
              (item) => item.id != this.multipleSelection[0].id
            );
            this.$refs.maintable.resetSelect();
          }
        }
      );
    },
    // 下载文件
    download() {
      if (this.multipleSelection.length < 1) {
        return this.$message.error("请选择要下载的文件");
      }
      // const elink = document.createElement("a");
      // elink.download = this.multipleSelection[0].fileName; //下载的资源文件必须与网页是在同一个域名下，或者资源文件开发core，否则download属性就会失效
      // elink.style.display = "none";
      // elink.href = this.multipleSelection[0].filePath || this.multipleSelection[0].fileUrl;
      // document.body.appendChild(elink);
      // elink.click();
      // URL.revokeObjectURL(elink.href);
      // document.body.removeChild(elink);
      downloadsomeTwo('sm/file/download',{fileUrl:this.multipleSelection[0].filePath || this.multipleSelection[0].fileUrl},this.multipleSelection[0].fileName)
    },

    //选择事件
    handleItemSelect(val) {
      this.multipleSelection = val;
    },
    closeModal() {
        this.dialogFormVisible=false;
      this.$emit("closeModal",this.tableData);
    },
  },
};
</script>

<style  lang="less" scoped>
#commonaddupdadteone {
  /deep/ .el-dialog .el-dialog__body {
    padding: 12px !important;
  }
}
</style>
