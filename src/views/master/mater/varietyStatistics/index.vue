<template>
  <div>

    <div v-if="isShowDetail">
      <show-detail-modal @resetParent="()=>resetParentNews()"
                         :seleItemDetail="seleItemDetail" />

    </div>

    <div v-if="!isShowDetail">
      <div id="zPage">
        <div class="z-header">
          <div class="z-header-button">
            <el-button @click="(openSetUpload = true), (sendUploadFileName = '')">导入excel</el-button>
            <el-button @click="()=>submitOne('submit')">提交</el-button>
            <!-- <el-button @click="del">提交</el-button>
            <el-button @click="role">撤回</el-button>
            <el-button @click="del">审核</el-button> -->
            <!-- <el-button @click="role">导出</el-button> -->
            <el-button @click="() => cheOne()">撤回</el-button>
            <el-button @click="() =>shenOne()">审核</el-button>
            <!-- <el-button @click="role">导入excel</el-button> -->
          </div>
        </div>
        <!-- 单据编码规则 -->
        <div class="z-content">
          <el-card>
            <header-search :searchArr="searchArr"
                           @sureSearch="searchMethod">
              <slot>
                <el-button type="primary"
                           style="margin-top:2px"
                           @click="()=>this.looutsome()">导出</el-button>
              </slot>
            </header-search>
            <div class="z-content-table">
              <common-table is-height
                            ref="mainTable"
                            :isMain="true"
                            :tableColumn="tableColumn"
                            :tableData="tableData"
                            :loading="pageParams.loading"
                            :isSelection="true"
                            :pageParams="pageParams"
                            @pageChange="pageChange"
                            @selePage="handleItemSelect" />
            </div>
          </el-card>
        </div>

        <div>
          <div class="popBox">
            <el-dialog title="审核"
                       :visible.sync="examineModal"
                       :destroy-on-close="true">
              <div class="content">
                <div style="margin-bottom:8px">
                  备注

                </div>
                <div>
                  <el-input type="textarea"
                            :rows="8"
                            placeholder="请输入内容"
                            v-model="textareaShow">
                  </el-input>

                </div>

              </div>
              <span slot="footer"
                    class="dialog-footer">
                <el-button @click="
               () => submitSure()
              ">驳 回</el-button>
                <el-button type="primary"
                           @click="() => submitSure(true)">通 过</el-button>
              </span>
            </el-dialog>
          </div>
        </div>

        <div>
          <div class="popBox">
            <el-dialog title="提示"
                       :visible.sync="openSetUpload"
                       :destroy-on-close="true">
              <div class="content">
                <!-- 上面的条件 -->
                <!-- v-if="!isEnterTabTwo" -->

                <div v-if="!isEnterTabTwo">
                  <div style="background:#FFF2C7;overflow:hidden;padding:3px 8px;margin-bottom:6px">
                    <div style="float:left;margin-top:3px">
                      <div style="display:flex">
                        <div style="margin-right:5px">
                          <i class="el-icon-warning-outline"
                             style="display:block;color:#ED802C;font-size:16px"></i>
                        </div>
                        <div>
                          <span style="display:block;font-size:12px;color:#ED802C">
                            请参考此文件格式填写excel表格
                          </span>
                        </div>
                      </div>
                    </div>
                    <div style="float:right">
                      <a style="color: #1890ff; padding-right: 24px"
                         @click="() => loadSomeModal()">下载格式模板</a>
                    </div>
                  </div>
                  <div v-if="!sendUploadFileName">
                    <!-- 只能上传一次 -->
                    <el-upload class="upload-demo upload-somez"
                               drag
                               multiple
                               ref="upload"
                               :limit="1"
                               accept=".xlsx,.xls"
                               :before-upload="beforeUploadFile"
                               :headers="upload.headers"
                               :action="upload.url"
                               :on-success="handleFileSuccess">
                      <i class="el-icon-upload"></i>
                      <div class="el-upload__text">
                        将文件拖到此处，或<em>点击上传</em>
                      </div>
                    </el-upload>
                  </div>

                  <div v-else>
                    <div style="text-align:center">
                      <i class="el-icon-upload"
                         style="color:#C0C4CC;font-size:84px"></i>
                    </div>
                    <div style="text-align:center">
                      <span>已经上传 {{ sendUploadFileName }}</span>

                      <a @click="sendUploadFileName = ''"
                         style="color:#1890ff;font-size:12px;padding-left:12px">删除</a>
                    </div>
                  </div>
                </div>

                <div v-else>

                  <div style="text-align:center">
                    <i class="el-icon-upload"
                       style="color:#C0C4CC;font-size:84px"></i>
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
                      <a style="color: red"
                         @click="() => loadErrorReason()">
                        失败原因
                      </a>
                    </span>
                  </div>
                </div>
              </div>
              <span slot="footer"
                    class="dialog-footer">
                <el-button @click="
                () => {
                  this.openSetUpload = false;
                  this.isEnterTabTwo = false;
                }
              ">取 消</el-button>
                <el-button type="primary"
                           @click="() => submitSureUpload()">导 入</el-button>
              </span>
            </el-dialog>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>
<script>
import HeaderSearch from "@/components/CommonHeadSearch/ZSearch";
import commonTable from "@/components/CommonTable";
import add from "@/components/AddUpdate";
import { pbBillFormulahdr } from "@/api/xsApi/api";

import { priceHdrListHdr, updateBillStatusWhenVerify } from "@/api/apizhu";
import { getToken, downloadsome, downloadsomePost } from "@/utils/auth";

import ShowDetailModal from './showDetail.vue';

export default {
  components: { HeaderSearch, commonTable, add, ShowDetailModal },
  name: "index",
  data () {
    return {

      examineModal: false,//审核的弹框
      textareaShow: '',//审核弹框的信息


      multipleSelection: [],//表格选中的数据

      isShowDetail: false,//是否显示的是详情的内容
      seleItemDetail: {},//点击的详情的按钮 选中的对象


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
          "/mdm/material-price/add-batch-by-import",
      },//上传文件的代码
      openSetUpload: false, //是否展示导入的弹框
      isEnterTabTwo: false, //是否进入导入界面的显示结果的界面
      sendUploadFileName: "", //上传文件的文件名称
      failNewsShow: {}, //上传文件后端返回的信息





      searchArr: [
        {
          label: "申请人",
          value: "applicantFullName",
          type: 1,
        },
        {
          type: 2,
          label: '单据状态',
          value: 'billStatus',
          selectOption: [{ label: '草稿', id: '0' }, { label: '审核中', id: 1 }, { label: '已审核', id: 2 }],
          optionLabel: 'label',
          optionValue: 'id',
        },
        {
          label: "创建时间",
          value: "key",
          type: 4,
          //   maxLength: "20",
          valueFormat: "yyyy/MM/dd",
          rangedesc: "至",
          pickerType: "datetimerange", //选择器类型
        },
      ],
      tableColumn: [
        {
          type: "index",
          label: "序号",
        },
        {
          prop: "billNo",
          label: "调价单号",
          align: "left",
          render: (h, scope) => {
            return h(
              'a',
              {
                style: {
                  color: "blue",
                },
                on: {
                  click: () => {

                    this.seleItemDetail = scope.row,
                      this.isShowDetail = true
                  }
                }
              },
              scope.row.billNo
            )
          }

        },
        {
          prop: "applicantName",
          label: "申请人",
          align: "left",

        },
        {
          prop: "departmentName",
          label: "申请部门",
          align: "left",

        },
        {
          prop: "reason",
          label: "申请原因",
          align: "left",

        },
        {
          prop: "billStatus",
          label: "单据状态",
          align: "left",
          render: (h, scope) => {
            let obj = {
              "0": '草稿',
              "1": '审核中',
              "2": '已审核',
            }
            return h(
              "span",
              {},
              obj[scope.row.billStatus]
            );
          },

        },
        {
          prop: "effectiveDate",
          label: "生效日期",
          align: "left",
           render: (h, scope) => {
            return h(
              "span",
              {},
              scope.row.effectiveDate && scope.row.effectiveDate.split(' ')[0]
            );
          },

        },
        {
          prop: "expirationDate",
          label: "失效日期",
          align: "left",
           render: (h, scope) => {
            return h(
              "span",
              {},
              scope.row.expirationDate && scope.row.expirationDate.split(' ')[0]
            );
          },

        },
        {
          prop: "createUserName",
          label: "创建人",
          align: "left",

        },
        {
          prop: "createTime",
          label: "创建时间",
          align: "left",

        },
        {
          prop: "updateUserName",
          label: "审核人",
          align: "left",

        },
        {
          prop: "updateTime",
          label: "审核时间",
          align: "left",

        },

      ],
      pageParams: {
        loading: false,
        pageNo: 1,
        pageSize: 30,
        total: 1,
      },

      tableData: [],
    };
  },
  mounted () {
    this.getList();
  },
  methods: {

    looutsome () {
      let { pageNo, pageSize, ...other } = this.pageParams;
      let params = {
        ...other,
        current: pageNo,
        size: pageSize,
      };
      console.log(params);
      downloadsomePost(
        "/mdm/material-price/export-basic-list",
        params
      );



    },



    loadErrorReason () {
      downloadsomePost(
        "/mdm/material-price/export-import-fail-data",
        this.failNewsShow
      );
    },


    submitSureUpload () {
      if (!this.sendUploadFileName) {
        return this.$message.error("请先上传文件");
      }

      this.isEnterTabTwo = true;
    },


    // 通过驳回的操作

    submitSure (value = false) {
      this.updateBillStatus({ id: this.multipleSelection[0].id, billStatus: value ? 2 : 0, remark: this.textareaShow })
    },
    handleItemSelect (val) {
      this.multipleSelection = val;
    },

    checkCount () {
      if (this.multipleSelection.length < 1) {
        this.$message.error('请选择操作箱');
        return false
      }
      return true
    },

    updateBillStatus (value) {
      updateBillStatusWhenVerify(value).then(res => {
        if (res.success) {
          this.$message.success('状态修改成功');
          this.$refs.mainTable.resetSelect();
          this.examineModal = false;
          this.getList()
        }
      })

    },


    // 提交
    submitOne () {
      if (!this.checkCount()) {
        return;
      }
      if (this.multipleSelection[0].billStatus != 0) {
        return this.$message.error('请选择草稿状态进行提交')
      }
      this.updateBillStatus({ id: this.multipleSelection[0].id, billStatus: 1, remark: '提交' })
    },
    // 撤回
    cheOne () {
      if (!this.checkCount()) {
        return;
      }
      if (this.multipleSelection[0].billStatus != 1) {
        return this.$message.error('请选择审核中的状态进行提交')
      }
      this.updateBillStatus({ id: this.multipleSelection[0].id, billStatus: 0, remark: '撤回' })

    },

    // 审核 {this.examineModal=true,this.textareaShow=''}
    shenOne () {
      if (!this.checkCount()) {
        return;
      }
      if (this.multipleSelection[0].billStatus != 1) {
        return this.$message.error('请选择审核中的状态进行提交')
      }

      this.examineModal = true
      this.textareaShow = ''
    },




    resetParentNews () {
      this.isShowDetail = false;
      this.getList()

    },

    loadSomeModal () {
      downloadsome("/mdm/material-price/export-import-template");
    },

    //  上传文件前做的操作 做大小和类型限制
    beforeUploadFile (file) {
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

    //  文件上传成功的回调
    handleFileSuccess (response, file, fileList) {
      if (response.success) {
        this.sendUploadFileName = file.name;
        this.failNewsShow = response.data;
      }
      else {
        this.$message.error(response.msg);
        this.$refs.upload.clearFiles();
      }
    },
    getList () {
      this.pageParams.loading = true;

      let { pageNo, pageSize, ...other } = this.pageParams;
      let params = {
        ...other,
        current: pageNo,
        size: pageSize,
      };

      console.log(params);
      console.log(9990)
      priceHdrListHdr(params).then((res) => {
        if (res.success) {
          this.pageParams.total = res.data.total;
          this.tableData = res.data.records;
          this.pageParams.loading = false;
        }
      });
    },

    searchMethod (value) {

      let { key = [], ...other } = value;
      if (key.length > 0) {
        other.effectiveDate = key[0];
        other.expirationDate = key[1]

      }


      this.pageParams = { ...this.pageParams, ...other, pageNo: 1 };
      this.getList();
    },

    //翻页、跳页事件
    pageChange (e) {
      this.pageParams.pageNo = e.page;
      this.pageParams.pageSize = e.limit;
      this.getList();
    },
  },
};
</script>
<style lang="less" scoped>
// #zPage /deep/ .el-card__body {
//   height: calc(100vh - 114px);

//   /deep/ .z-content {
//     height: calc(100vh - 95px);
//   }
// }

.upload-somez {
  /deep/ .el-upload-dragger {
    width: 535px !important;
    margin-bottom: 6px;
  }
}
</style>


