<template>
  <div>
    <div v-if="!isDetail">
      <div id="zPage">
        <div class="z-header">
          <div class="z-header-button">
            <el-button @click="() => updatePrice()">调整价格</el-button>
            <el-button @click="()=>updateMorePrice()">批量改价</el-button>
            <!-- <el-button @click="del">提交</el-button>
            <el-button @click="role">撤回</el-button>
            <el-button @click="del">审核</el-button> -->
            <!-- <el-button @click="role">导出</el-button> -->
            <el-button @click="() => oldprice()">历史价格表</el-button>
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
                            :pageParams="pageParams"
                            :isSelectMore="true"
                            :isSelection="true"
                            @selePage="handleItemSelect"
                            @pageChange="pageChange" />
            </div>
          </el-card>
        </div>

        <div v-if="openPriceUpdate">
          <div class="popBox">
            <el-dialog title="提示"
                       :visible.sync="openPriceUpdate"
                       :destroy-on-close="true">
              <div class="content">
                <!-- 上面的条件 -->
                <div style="display:flex">
                  <div style="line-height: 26px;width:280px; font-size: 12px; display: flex">
                    <div style="
                        width: 90px;
                        text-align: right;
                        color: rgba(0, 0, 0, 0.3);
                      ">
                      选中的物料:
                    </div>
                    <div style="color:red;width:180px;overflow: hidden !important; text-overflow: ellipsis !important; white-space: nowrap !important;">
                      {{ selectRow.materialName }}
                    </div>
                  </div>
                  <div style="line-height: 26px;width:280px;font-size: 12px; display: flex">
                    <div style="
                        width: 90px;
                        text-align: right;
                        color: rgba(0, 0, 0, 0.3);
                      ">
                      物料描述:
                    </div>
                    <div style="color:red;width:200px;overflow: hidden !important; text-overflow: ellipsis !important; white-space: nowrap !important;">
                      {{ selectRow.materialDescription }}
                    </div>
                  </div>
                </div>

                <!-- 上面的表单 -->

                <!-- <div>
                    <form-list
                v-model="queryForm"
                :formConfig="formMain"
                class="form form-order-box"
              ></form-list>

                </div> -->
                <div >
                  <div style="font-weight:500;font-size:12px;padding-left:6px">
                    基本信息
                  </div>
                  <div class="form">
                    <form-list v-model="queryForm"
                               :formConfig="formMain"
                               class="form form-order-box">
                      <div>
                        <div class="setzifu">
                          <div>上传文件</div>
                          <div>
                            <div v-if="!imageUrl">
                              <div>
                                <el-upload ref="upload"
                                action="upload"
                                           class="avatar-uploader"
                                           :limit="1"
                                           :before-upload="beforeUploadFile"

                                           >
                                  <el-button size="small">点击上传</el-button>
                                </el-upload>
                              </div>
                            </div>
                            <div v-else
                                 @click="imageUrl = ''">
                              {{ showFile.name }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </form-list>
                  </div>
                </div>
                <!-- 下面的表格 -->
                <div>
                  <div class="setbutton">
                    <span style="font-size:12px;font-weight:500;padding:0px 6px">
                      币种信息
                    </span>
                    <el-button @click="() => this.addmodalone()">新增</el-button>
                    <el-button style="color: red; border-color: red"
                               @click="() => delmodalone()">删除</el-button>
                  </div>
                  <div class="z-content-table setmodaltable"
                       style="margin-top: 0px">
                    <common-table is-height
                                  ref="mainTable"
                                  :isMain="true"
                                  :tableColumn="tableColumnModal"
                                  :tableData="tableDataModal"
                                  :tableheight="240"
                                  :isSelection="true"
                                  @selePage="handleItemSelectUpdate" />
                  </div>
                </div>

                <div class="z-content-table setmodaltable">
                  <!-- :data=openRecord.tablelist可以直接使用v-model双向绑定 不改了 -->
                </div>
              </div>
              <span slot="footer"
                    class="dialog-footer">
                <el-button @click="
                    () => {
                      this.openPriceUpdate = false;
                    }
                  ">取 消</el-button>
                <el-button type="primary"
                           @click="() => submitSureModal()">确 定</el-button>
              </span>
            </el-dialog>
          </div>
        </div>

        <div>
          <div class="popBox">
            <el-dialog title="提示"
                       :visible.sync="openMorePrice"
                       :destroy-on-close="true">
              <div class="content"
                   style="font-size: 12px; line-height: 28px">
                <div style="display: flex">
                  <div>当前选中了</div>
                  <div :title="showTitleName"
                       class="setmoren"
                       style="max-width: 300px">
                    <span v-for="(item, index) in multipleSelection"
                          :key="index">
                      {{ item.materialName }},
                    </span>
                  </div>
                  <div>等{{multipleSelection.length}}个物料价格</div>
                </div>

                <div>
                  <div >
                    <div class="form">
                      <form-list v-model="queryForm"
                                 :formConfig="formMain"
                                 class="form form-order-box">
                        <div>
                          <div class="setzifu">
                            <div>上传文件</div>
                            <div>
                              <div v-if="!imageUrl">
                                <div>
                                  <el-upload ref="upload"
                                             class="avatar-uploader"
                                             :limit="1"
                                             :before-upload="beforeUploadFile"
                                             action="aaa">
                                    <el-button size="small">点击上传</el-button>
                                  </el-upload>
                                </div>
                              </div>
                              <div v-else
                                   @click="imageUrl = ''">
                                {{ showFile.name }}
                              </div>
                            </div>
                          </div>
                        </div>
                      </form-list>
                    </div>
                  </div>

                </div>

                <div style="display: flex">
                  <!-- <div>按百分比调价</div> -->
                  <div style="margin-left: 6px; margin-top: 2px">
                    <el-radio v-model="radioOne"
                              label="按百分比调价"
                              @change="(e)=>changePerMore('radioOne')"></el-radio>
                  </div>
                </div>
                <div>
                  <div style="display: flex">
                    <div style="
                        width: 100px;
                        text-align: right;
                        padding-right: 6px;
                      ">
                      请输入百分比
                    </div>
                    <div>
                      <el-input-number v-model="numOne"
                                       style="width: 200px"
                                       controls-position="right"
                                       @change="handleChange"
                                       :min="1"
                                       :max="10"></el-input-number>
                    </div>
                    <div style="margin-left: 6px">
                      (通过正负控制是上下调价，精准到个位数)
                    </div>
                  </div>
                </div>

                <div style="display: flex">
                  <!-- <div> 按加减数调价</div> -->
                  <div style="margin-left: 6px; margin-top: 2px">
                    <el-radio v-model="radioTwo"
                              label="按加减数调价"
                              @change="(e)=>changePerMore('radioTwo')"></el-radio>
                  </div>
                </div>
                <div>
                  <div style="display: flex">
                    <div style="
                        width: 100px;
                        text-align: right;
                        padding-right: 6px;
                      ">
                      请输入需增减价
                    </div>
                    <div>
                      <el-input-number v-model="numTwo"
                                       style="width: 200px"
                                       controls-position="right"
                                       :precision="2"
                                       @change="handleChange"
                                       :min="1"
                                       :max="10"></el-input-number>
                    </div>
                    <div style="margin-left: 6px">
                      （通过正负控制上下调价，精确到小数点后两位）
                    </div>
                  </div>
                </div>
                <!-- {{radioOne }},{{radioThree}},{{radioTwo}} -->
                <div style="display: flex">
                  <!-- <div>按百分比调价</div> -->
                  <div style="margin-left: 6px; margin-top: 2px">
                    <el-radio v-model="radioThree"
                              label="按百分比调价"
                              @change="(e)=>changePerMore('radioThree')"></el-radio>
                  </div>
                </div>
                <div style="margin-bottom: 12px">
                  <div style="display: flex">
                    <div style="
                        width: 100px;
                        text-align: right;
                        padding-right: 6px;
                      ">
                      请输入百分比
                    </div>
                    <div>
                      <el-input-number v-model="numThree"
                                       style="width: 200px"
                                       controls-position="right"
                                       @change="handleChange"
                                       :precision="2"
                                       :min="1"
                                       :max="10"></el-input-number>
                    </div>
                    <div style="margin-left: 6px">
                      (通过正负控制是上下调价，精准到个位数)
                    </div>
                  </div>
                </div>
              </div>
              <span slot="footer"
                    class="dialog-footer">
                <el-button @click="
                    () => {
                      this.openMorePrice = false;
                    }
                  ">取 消</el-button>
                <el-button type="primary"
                           @click="() => submitSureMore()">确 定</el-button>
              </span>
            </el-dialog>
          </div>
        </div>
      </div>
    </div>

    <div v-else>
      <show-detail :selectRow="selectRow"
                   @resetsome="
          () => {
            this.isDetail = false;
          }
        " />
    </div>

    <!--调整价格的弹框 -->

    <!-- 批量改价的弹框 -->
  </div>
</template>
<script>
import HeaderSearch from "@/components/CommonHeadSearch/ZSearch";
import formList from "@/components/Form/formList";
import commonTable from "@/components/CommonTable";
import add from "@/components/AddUpdate";
import { pbBillFormulahdr } from "@/api/xsApi/api";
import ShowDetail from "./showdetail.vue";
import { getToken, downloadsomePost } from "@/utils/auth";
import axios from "axios";
import { checkFormData } from "@/lib/common";
import {
  materialPriceHdrList,
  propertyDefineListAll,
  defineAddBatchByImport,
  listKeyword,
  departmentListSelectPart,
  priceHdrListAllDetail,
} from "@/api/apizhu";
export default {
  components: { HeaderSearch, commonTable, add, ShowDetail, formList },
  name: "index",
  data () {
    return {
      showTitleName:'',
      departList: [], //部门的列表
      selePeople: [], //当前选中的申请人
      tableDataModal: [], //弹框的数组
      showFile: "", //上传文件的名称
      selepagemodal: [],//弹框的数组选中的值
      deleteDetailIdList: [],//删除的数组


      radioOne: '',//按照百分比调价
      radioTwo: '',//按加减数调价
      radioThree: '',//按新价格调价

      numOne: 0,//按照百分比调价
      numTwo: 0,//按加减数调价
      numThree: 0,//按新价格调价


      num: 0,
      isDetail: false,
      openPriceUpdate: false,
      openMorePrice: false,
      radio: false,
      selectRow: {},
      multipleSelection: [],

      tableColumn: [
        {
          prop: "materialNo",
          label: "物料编号",
          align: "left",
          width: 160,
        },
        {
          prop: "materialName",
          label: "物料名称",
          align: "left",
          width: 160,
        },
        {
          prop: "materialDescription",
          label: "物料描述",
          align: "left",
          width: 160,
        },
        {
          prop: "unitName",
          label: "计量单位",
          align: "left",
          width: 160,
        },
        {
          prop: "productForm",
          label: "产品形态",
          align: "left",
          width: 160,
          render: (h, scope) => {
            return h(
              "span",
              {},
              scope.row.productForm == "1" ? "大货" : "样卡"
            );
          },
        },
        {
          prop: "currency",
          label: "币种",
          align: "left",
          width: 260,
        },
        {
          prop: "newPrice",
          label: "价格",
        },

        {
          prop: "orderTypeName",
          label: "是否生效",
          width: "90",
          align: "center",
          render: (h, scope) => {
            return h("el-checkbox", {
              props: {
                value: scope.row.usable,
                disabled: true,
              },
            });
          },
        },
        {
          prop: "effectiveDate",
          label: "生效日期",
          width: "140",
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
          width: "140",
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
          label: "更新人",
        },
        {
          prop: "createTime",
          label: "更新时间",
          width: "140",
        },
        {
          prop: "updateUserName",
          label: "审核人",
        },
        {
          prop: "updateTime",
          label: "审核时间",
          width: "140",
        },
      ],
      pageParams: {
        loading: false,
        pageNo: 1,
        pageSize: 30,
        total: 1,
      },

      tableData: [],

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
        // headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        // url: process.env.VUE_APP_BASE_API + "/sm/file/upload",
      },

      dictTypeList: [],
      queryForm: {},
      imageUrl: "",
    };
  },

  mounted () {
    this.getList();
    defineAddBatchByImport({}).then((res) => {
      if (res.success) {
        this.dictTypeList = res.data.typeTreeList;
      }
    });
  },

  computed: {
    searchArr () {
      return [
        {
          label: "物料",
          value: "materialName",
          type: 1,
        },
        {
          type: "33",
          label: "分类",
          value: "materialTypeNo",
          options: this.dictTypeList,

          attrs: {
            clearable: true,
            props: {
              label: "typeName",
              value: "typeNo",
              children: "childrenList",
            },
          },
        },
        // {
        //   type: 2,
        //   label: "产品形态",
        //   value: "typeCategory",
        //   selectOption: this.unitTypeList,
        //   optionLabel: "label",
        //   optionValue: "value",
        // },
        // {
        //   type: 2,
        //   label: "状态",
        //   value: "typeCategory",
        //   selectOption: this.unitTypeList,
        //   optionLabel: "label",
        //   optionValue: "value",
        // },
        {
          type: 2,
          label: "产品形态",
          value: "productForm",
          selectOption: [
            { id: 1, name: "大货" },
            { id: 2, name: "样卡" },
          ],
          optionLabel: "name",
          optionValue: "id",
        },
        {
          type: 2,
          label: "是否生效",
          value: "usable",
          selectOption: [
            { id: true, name: "是" },
            { id: false, name: "否" },
          ],
          optionLabel: "name",
          optionValue: "id",
        },
        // {
        //   label: "筛选时间",
        //   value: "key",
        //   type: 4,
        //   //   maxLength: "20",
        //   rangedesc: "至",
        //   pickerType: "datetimerange", //选择器类型
        // },
      ];
    },

    tableColumnModal () {
      let that = this;
      return [
        {
          type: "index",
          label: "序号",
        },
        {
          label: "产品形态",
          prop: "productForm",
          isEdit: true,
          config: {
            key: "productForm",
            type: "select",
            options: [
              { id: 1, name: "大货" },
              { id: 2, name: "样卡" },
            ],
            optionLabel: "name",
            optionValue: "id",
          },
        },
        {
          label: "币种",
          prop: "currency",
          isEdit: true,
          config: {
            key: "currency",
            type: "select",
            options: [{ unitName: '金恩' }],
            optionLabel: "unitName",
            optionValue: "unitName",
          },
        },
        {
          label: "当前价格",
          prop: "currentPrice",
          align: "right",
          isEdit: true,
          config: {
            key: "currentPrice",
            type: "number",
            min: 0,
            max: 999999999,
            precision: 0,
            placeholder: " ",
            controls: false,
          },
        },
        {
          label: "新价格",
          prop: "newPrice",
          align: "right",
          isEdit: true,
          config: {
            key: "newPrice",
            type: "number",
            min: 0,
            max: 999999999,
            precision: 0,
            placeholder: " ",
            controls: false,
          },
        },
      ];
    },
    formMain () {
      let formItemList = [
        {
          key: "varietyNo",
          type: "autocomplete",
          subtype: "text",
          label: "申请人",

          remoteMethod: listKeyword,

          rules: {
            required: true,
            trigger: " ",
          },

          listeners: {
            select: (e) => this.changeUser(e),
          },
        },

        {
          key: "departmentId",
          type: "select",
          subtype: "text",
          label: "申请部门",

          options: this.departList,
          optionLabel: "label",
          optionValue: "id",
          placeholder: "请选择",

          rules: {
            required: true,
            trigger: " ",
          },
        },
        {
          key: "effectiveDate",
          type: "date",
          label: "生效日期",

          rules: {
            required: true,
            trigger: " ",
          },
        },
        {
          key: "expirationDate",
          type: "date",
          label: "失效日期",

          rules: {
            required: true,
            trigger: " ",
          },
        },
        {
          key: "forLongTime",
          type: "checkbox",
          label: "长久失效",
          // rules: {
          //   required: true,
          //   trigger: " ",
          // },
        },
        {
          key: "reason",
          type: "input",
          subtype: "textarea",
          label: "申请原因",
          placeholder: '请输入不超过500字备注',
          rules: {
            required: true,
            trigger: " ",
          },

          attrs: {
            showWordLimit: true,
            rows: 2,

          },
          maxlength: 500,
        },
        // {
        //   key: "remark",
        //   type: "input",
        //   subtype: "textarea",
        //   label: "备注",

        //   attrs: {
        //     showWordLimit: true,
        //     rows: 1,
        //   },
        //   maxlength: 200,
        // },
      ];

      if (this.openMorePrice) {
        formItemList.splice(4, 1)
      }

      return {
        inline: true,
        labelWidth: "auto",
        size: "mini",
        formItemList,
      };
    },
  },
  methods: {


    looutsome () {


      let { pageNo, pageSize, ...other } = this.pageParams;
      let params = {
        ...other,
        current: pageNo,
        size: pageSize,
      };
      downloadsomePost(
        "/mdm/material-price/export-list",
        params
      );



    },

    changePerMore (e) {

      // this.radioOne=

      if (e == 'radioOne') {
        this.radioTwo = '';
        this.radioThree = '';
      }
      if (e == 'radioTwo') {
        this.radioOne = '';
        this.radioThree = '';
      }
      if (e == 'radioThree') {
        this.radioTwo = '';
        this.radioOne = '';
      }


    },

    updateMorePrice () {
      if (this.multipleSelection.length < 1) {
        return this.$message.error('请选择数据')
      }


      this.queryForm = {forLongTime:false};
       this.queryForm.varietyNo = JSON.parse(localStorage.userInfoNow).fullName
       if(JSON.parse(localStorage.userInfoNow).departmentIdList&&JSON.parse(localStorage.userInfoNow).departmentIdList.length) {
         departmentListSelectPart(JSON.parse(localStorage.userInfoNow).departmentIdList[0]).then((res) => {
        this.queryForm.departmentId = JSON.parse(localStorage.userInfoNow).departmentIdList[0];
        this.departList = res.data.map((item) => {
          return {
            id: item.departmentId,
            label: item.fullName,
          };
        });
      });
       }
      this.showFile = '';
      this.imageUrl = '';
      this.radioOne = '',//按照百分比调价
        this.radioTwo = '',//按加减数调价
        this.radioThree = '',//按新价格调价

        this.numOne = 0,//按照百分比调价
        this.numTwo = 0,//按加减数调价
        this.numThree = 0,//按新价格调价

        this.openMorePrice = true;

        this.showTitleName=this.multipleSelection.map(item=>item.materialName).toString()
    },






    delmodalone () {

      // console.log(this.selepagemodal);
      if (this.selepagemodal[0].id) {
        this.deleteDetailIdList.push(this.selepagemodal[0].id)
      }
      // this.tableDataModal.splice(this.selepagemodal[0].isIndex+1, 1)

      console.log(this.tableDataModal);
      console.log(this.selepagemodal);
      this.tableDataModal = this.tableDataModal.filter(item => item.isIndex != this.selepagemodal[0].isIndex);
      this.updateIndexModalData()

    },

    submitSureMore () {
      if (
        !checkFormData(
          [...this.formMain.formItemList],
          this.queryForm
        )
      ) {
        return;
      }

      // 如果没有选择比例
      console.log(this.radioOne, this.radioThree, this.radioTwo)
      if (!this.radioOne && !this.radioTwo && !this.radioThree) {
        return this.$message.error('请选择调价选项')
      }

      let formData = new FormData();

      let params = {
        ...this.queryForm,
        fileList:this.showFile,
        changePriceMethod: this.radioOne ? 1 : this.radioTwo ? 2 : this.radioThree ? 3 : '',
        changePriceValue: this.radioOne ? (Number(this.numOne) / 100).toFixed(2) : this.radioTwo ? this.numTwo : this.radioThree ? numThree : '',
        updateDetailIdList:this.multipleSelection.map(item=>item.detailId),

        // materialId:this.selectRow.ma
      };

      for (let i in params) {
        if ( i == 'updateDetailIdList') {
          params[i].map((item,index)=>{
            formData.append(`updateDetailIdList[${index}]`,item)
          })
        } else {
          formData.append(i, params[i]);
        }
      }
      axios
        .post(
          `${process.env.VUE_APP_BASE_API}/mdm/material-price/update-price-batch-with-detail`,
          formData,
          {
            headers: { Authorization: "Bearer " + getToken() },
          }
        )
        .then((res) => {
          this.openMorePrice = false;
        });




    },

    // 调整价格的弹框点击的确定按钮
    submitSureModal () {

      if (
        !checkFormData(
          [...this.formMain.formItemList],
          this.queryForm
        )
      ) {
        return;
      }

      if (this.tableDataModal.length < 1) {
        return this.$message.error('请输入明细')
      }




      console.log(this.deleteDetailIdList);

      let formData = new FormData();

      let params = {
        ...this.queryForm,
        saveDetailListJson: this.tableDataModal.map(item=>{
          return {
            ...item,
            materialId: this.selectRow.materialId
          }
        }),
        billStatus: 0,
        fileList:this.showFile,
        deleteDetailIdList:this.deleteDetailIdList
        // materialId:this.selectRow.ma
      };

      for (let i in params) {
        if (i == "saveDetailListJson"  ) {
          formData.append(i, JSON.stringify(params[i]));
        }
        else if(i == 'deleteDetailIdList'){
           params[i].map((item,index)=>{
            formData.append(`deleteDetailIdList[${index}]`,item)
          })

        }

        else {
          formData.append(i, params[i]);
        }
      }

      axios
        .post(
          `${process.env.VUE_APP_BASE_API}/mdm/material-price/add-delete-batch-with-detail`,
          formData,
          {
            headers: { Authorization: "Bearer " + getToken() },
          }
        )
        .then((res) => {
          this.openPriceUpdate = false;
        });
    },

    updateIndexModalData () {
      this.tableDataModal = this.tableDataModal.map((item, index) => {
        return { ...item, isIndex: index }
      })
      console.log(this.tableDataModal)

    },

    // 调整价格的新增
    addmodalone () {
      this.tableDataModal.push({});
      this.updateIndexModalData()
    },

    // 调整价格的按钮
    updatePrice () {
      if (this.multipleSelection.length < 1) {
        return this.$message.error("请选择操作项");
      }
      if (this.multipleSelection.length > 1) {
        return this.$message.error("此操作不支持多选");
      }
      priceHdrListAllDetail({ materialId: this.selectRow.materialId }).then(
        (res) => {
          this.tableDataModal = res.data.records;
          this.updateIndexModalData()
        }
      );
      this.queryForm = {forLongTime:false};
       this.queryForm.varietyNo = JSON.parse(localStorage.userInfoNow).fullName
       if(JSON.parse(localStorage.userInfoNow).departmentIdList&&JSON.parse(localStorage.userInfoNow).departmentIdList.length) {
         departmentListSelectPart(JSON.parse(localStorage.userInfoNow).departmentIdList[0]).then((res) => {
        this.queryForm.departmentId = JSON.parse(localStorage.userInfoNow).departmentIdList[0];
        console.log(this.queryForm.departmentId)
        this.departList = res.data.map((item) => {
          return {
            id: item.departmentId,
            label: item.fullName,
          };
        });
        console.log(this.departList)
      });
       }

      this.showFile = '';
      this.imageUrl = '';
      this.deleteDetailIdList = [];
      this.openPriceUpdate = true;
    },

    // 调整价格单弹框的表格的选中
    handleItemSelectUpdate (e) {
      this.selepagemodal = e
    },
    // 申请人选中之后 获取申请部门 并且重置所选的值
    changeUser (e) {
      console.log(e)
      this.selePeople = e;
      this.departList = [];
      departmentListSelectPart(e.id).then((res) => {
        this.queryForm.departmentId = undefined;
        this.departList = res.data.map((item) => {
          return {
            id: item.departmentId,
            label: item.fullName,
          };
        });
      });
    },

    handleChange (e) { },
    beforeUploadFile (file) {
      let extension = file.name.substring(file.name.lastIndexOf(".") + 1);
      let size = file.size / 1024 / 1024;

      // if (extension !== "jpg" && extension !== "png") {
      //   this.$message.warning("请上传png或者jpg的图片");
      //   return false;
      // }
      if (size > 10) {
        this.$message.warning("上传大小不能超出10M");
        return false;
      }
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.imageUrl = "   ";

      this.showFile = file;
    },

    // 文件上传中处理
    // handleFileUploadProgress(event, file, fileList) {
    //   this.upload.isUploading = true;

    //   this.imageUrl = "123";
    // },
    // // 文件上传成功处理
    // handleFileSuccess(response, file, fileList) {
    //   fileGet(response.data.fileId)
    //     .then((res) => {
    //       this.upload.open = false;
    //       this.upload.isUploading = false;
    //       this.$refs.upload.clearFiles();
    //       this.imageUrl = res.data.fileUrl;
    //     })
    //     .catch((err) => {
    //       this.upload.open = false;
    //       this.upload.isUploading = false;
    //       this.$refs.upload.clearFiles();
    //     });

    //   // 要根据图片的id访问图片的链接
    //   // this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
    //   // this.getList();
    // },
    getList () {
      this.pageParams.loading = true;

      let { pageNo, pageSize, ...other } = this.pageParams;
      let params = {
        ...other,
        current: pageNo,
        size: pageSize,
      };

      materialPriceHdrList(params).then((res) => {
        if (res.success) {
          this.pageParams.total = res.data.total;
          this.tableData = res.data.records.map((item) => {
            return { ...item, id: item.detailId };
          });
          this.pageParams.loading = false;
        }
      });
    },

    searchMethod (value) {
      let params = {
        ...value,
      };
      if (value.materialTypeNo && Array.isArray(value.materialTypeNo)) {
        params.materialTypeNo =
          value.materialTypeNo[value.materialTypeNo.length - 1];
      }

      this.pageParams = { ...this.pageParams, ...params, pageNo: 1 };
      this.getList();
    },

    //翻页、跳页事件
    pageChange (e) {
      this.pageParams.pageNo = e.page;
      this.pageParams.pageSize = e.limit;
      this.getList();
    },

    //选择事件
    handleItemSelect (val) {
      this.multipleSelection = val;
      this.selectRow = val[0];
    },

    oldprice () {
      this.isDetail = true;
    },
  },
};
</script>
<style lang="less" scoped>
/deep/ .popBox .el-dialog {
  width: 560px !important;
}
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
.setmodaltable {
  /deep/ .el-table {
    width: 600px !important;
  }
  /deep/ th {
    height: 26px !important;
    padding: 1px 0 !important;
    font-weight: 400 !important;
    .el-checkbox {
      margin-left: 9px !important;
    }
  }

  /deep/ td {
    padding: 1px !important;
    .cell {
      padding-left: 0px !important;
      padding-right: 0px !important;

      .el-checkbox {
        margin-left: 18px !important;
      }
    }
  }
  // 鼠标聚焦  出现边框
  /deep/ .el-input__inner {
    padding-left: 4px;
    border: none !important;
    &:focus {
      border: 1px solid #4d7cfe !important;
    }
  }

  // 鼠标悬浮  去除背景色
  /deep/ .el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: transparent !important;
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
</style>


