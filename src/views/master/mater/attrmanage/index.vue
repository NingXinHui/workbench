<template>
  <!-- 字典维护 -->
  <div id="zPage">
    <div class="z-header">
      <div class="z-header-button">
        <el-button @click="editAdd('add')">新增</el-button>
        <el-button @click="editAdd('edit')">编辑</el-button>
        <el-button class="delButton" @click="() => deleteOne()">删除</el-button>
        <el-button @click="() => setMoreChild()">配置</el-button>
        <el-button @click="(openSetUpload = true), (sendUploadFileName = '')"
          >导入</el-button
        >
        <el-button @click="() => copySome()">复制</el-button>
      </div>
    </div>
    <div class="z-content">
      <el-card>
        <header-search
          :searchArr="searchArr"
          @sureSearch="searchMethod"
        ></header-search>
        <div class="z-content-table">
          <common-table
            ref="mainTable"
            :isMain="true"
            :tableColumn="tableColumn"
            :tableData="tableData"
            :isSelectMore="true"
            :isSelection="true"
            :loading="loading"
            :pageParams="pageParams"
            @selePage="handleItemSelect"
            @pageChange="pageSizeChange"
          />
        </div>
      </el-card>
    </div>

  <div  v-if="config.show">

      <edit-add
      v-if="config.show"
      :config="config"
      :editLoading="editLoading"
      :formConfig="formConfig"
      :editData="editAddData"
      @close="()=>closeModalAdd()"
      @submit="submit"
    >
      <!-- 下面的属性的拼接 -->
      <div v-if="addeditcheckmore == 'FORMULA'">

        <div class="setMainFlex">
          <div>拼接公式</div>
          <div>
            <div
              style="
                min-height: 24px;
                border-bottom: 1px solid #dee6f2;
                display: flex;
              "
            >
              <div
                v-for="(item, index) in selshulist"
                :key="index"
                style="font-size: 12px"
              >
                {{ item.propertyName }}{{sureZifu}}
              </div>
            </div>

            <div class="setshuxingadd" v-if="attrType">
              <div>品种属性</div>
              <div >
                <div
                  v-for="(item, index) in pinzhongattr"
                  :key="index"
                  @click="() => updateshulistone(item)"
                >
                  {{ item.propertyName}}
                </div>
              </div>
            </div>
            <div class="setshuxingadd" v-if="attrType&&attrType!='VARIETIES'">
              <div>物料属性</div>
              <div>
                <div
                  v-for="(item, index) in wuliaoattr"
                  :key="index"
                  @click="() => updateshulisttwo(item)"
                >
                  {{ item.propertyName}}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div class="setzifu">
            <div>拼接字符</div>
            <div>
              <el-input
                placeholder="请输入内容"
                v-model="zifu"
                style="width: 260px"
                class="input-with-select"
              >
                <el-button
                  style="background: #1890ff; color: white"
                  slot="append"
                  type="primary"
                  @click="sureZifu=zifu"
                  >插入</el-button
                >
              </el-input>
            </div>
          </div>
        </div>
        <div>
          <div class="setzifu" style="margin-bottom: 24px">
            <div>描述</div>
            <div>
              <el-input
                placeholder="请输入内容"
                v-model="shudesc"
                class="input-with-select"
              >
              </el-input>
            </div>
          </div>
        </div>
      </div>
    </edit-add>
  </div>

    <div>
      <div class="popBox">
        <el-dialog
          title="提示"
          :visible.sync="openPriceUpdate"
          :destroy-on-close="true"
        >
          <div class="content">
            <!-- 上面的条件 -->
            <div>
              <div style="line-height: 26px; font-size: 12px; display: flex">
                <div style="display: flex">
                  <div>你选择了</div>
                  <div class="setmoren">
                    <span
                      v-for="(item, index) in multipleSelection"
                      :key="index"
                    >
                      {{ item.materialTypeName }},
                    </span>
                  </div>
                  <div>等{{ multipleSelection.length }}个属性</div>
                </div>
              </div>
              <div style="margin-bottom: 12px">
                <header-search
                  :searchArr="searchTwo"
                  @sureSearch="searchMethodCopy"
                ></header-search>
              </div>
            </div>
            <!-- 下面的表格 -->
            <div>
              <div
                class="z-content-table setmodaltable"
                style="margin-top: 0px"
              >
                <common-table
                  is-height
                  ref="mainTableCopy"
                  :isMain="true"
                  :tableColumn="tableColumnModal"
                  :tableData="copyModalList"
                  :loading="pageParams.loading"
                  :tableheight="300"
                  :isSelection="true"
                  @selePage="handleItemSelectCopy"
                />
              </div>
            </div>

            <div class="z-content-table setmodaltable">
              <!-- :data=openRecord.tablelist可以直接使用v-model双向绑定 不改了 -->
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <!-- 取消去掉一些里面的弹框使用的数据 -->
            <el-button
              @click="
                () => {
                  this.openPriceUpdate = false;
                }
              "
              >取 消</el-button
            >
            <el-button type="primary" @click="() => submitSureModal()"
              >确 定</el-button
            >
          </span>
        </el-dialog>
      </div>
    </div>

    <div>
      <div class="popBox">
        <el-dialog
          title="提示"
          :visible.sync="openSetModal"
          :destroy-on-close="true"
        >
          <div class="content">
            <!-- 上面的条件 -->

            <div style="font-size: 12px; margin-bottom: 8px">
              <span style="opacity: 0.6"> 属性名称 </span>
              <span style="padding-left: 6px">
                {{
                  multipleSelection.length && multipleSelection[0].propertyName
                }}
              </span>
            </div>
            <div>
              <div style="margin-bottom: 12px">
                <header-search
                  :searchArr="searchTwoSet"
                  @sureSearch="searchMethodSet"
                ></header-search>
              </div>
            </div>
            <!-- 下面的表格 -->
            <div>
              <div
                class="z-content-table setmodaltable"
                style="margin-top: 0px"
              >
                <div class="resetbutton">
                  <el-button size="mini" plain @click="() => addnewsetone()"
                    >新增</el-button
                  >

                  <el-button
                    size="mini"
                    @click="() => deletenewset()"
                    plain
                    class="delButton"
                    >删除</el-button
                  >
                </div>
                <common-table
                  is-height
                  ref="mainTableSet"
                  :isMain="true"
                  :tableColumn="tableColumnSet"
                  :tableData="tablesetList"
                  :loading="pageParams.loading"
                  :tableheight="300"
                  :isSelectMore="true"
                  :isSelection="true"
                  @selePage="handleItemSelectSet"
                />
              </div>
            </div>

            <div class="z-content-table setmodaltable">
              <!-- :data=openRecord.tablelist可以直接使用v-model双向绑定 不改了 -->
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button
              @click="
                () => {
                  this.openSetModal = false;
                }
              "
              >取 消</el-button
            >
            <el-button type="primary" @click="() => submitSureSet()"
              >确 定</el-button
            >
          </span>
        </el-dialog>
      </div>
    </div>

    <div>
      <div class="popBox">
        <el-dialog
          title="提示"
          :visible.sync="openSetUpload"
          :destroy-on-close="true"
        >
          <div class="content">
            <!-- 上面的条件 -->
            <!-- v-if="!isEnterTabTwo" -->

            <div v-if="!isEnterTabTwo">
                           <div style="background:#FFF2C7;overflow:hidden;padding:3px 8px;margin-bottom:6px">
                <div style="float:left;margin-top:3px">
                    <div style="display:flex">
                      <div style="margin-right:5px">
                        <i class="el-icon-warning-outline" style="display:block;color:#ED802C;font-size:16px"></i>
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
                   <i class="el-icon-upload" style="color:#C0C4CC;font-size:84px"></i>
                </div>
                <div style="text-align:center">
                    <span>已经上传 {{ sendUploadFileName }}</span>

                    <a   @click="sendUploadFileName = ''" style="color:#1890ff;font-size:12px;padding-left:12px">删除</a>
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
                  this.openSetUpload = false;
                  this.isEnterTabTwo = false;
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
    </div>
  </div>
</template>
<script>
import {
  getDictDataList,
  addDictData,
  editDictData,
  getDictDetailsData,
  queryAllData,
} from "@/api/basicConfig/commonality/dict";
import HeaderSearch from "@/components/CommonHeadSearch/ZSearch";
import commonTable from "@/components/CommonTable";
import editAdd from "@/components/DialogForm/index";

import {
  itemDefineListAll,
  materialPropertyDefineList,
  materialTypeListAll,
  materialPropertyDefineAdd,
  materialPropertyDefineUpdate,
  materialPropertyDefineDelete,
  materialPropertyDefineGet,
  addDeleteUpdateBatch,
  defineAddBatchByCopy,
  defineAddBatchByImport,
  propertyDefineListAll,
  exportImportTemplate,
} from "@/api/apizhu";
import { getToken, downloadsome, downloadsomePost } from "@/utils/auth";

import axios from "axios";

export default {
  name: "CommonalityDictionary",
  components: {
    HeaderSearch,
    commonTable,
    editAdd,
  },
  data() {
    return {
      dictTypeListInList:[],
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
          "/mdm/material-property-define/add-batch-by-import",
      },
      loadurlmodal: "", //url路径 下载模板
      selshulist: [], //拼接公式的上面显示的

      shulistone: [], //第一行上面选中的
      shulisttwo: [], //第二行上面选中的

      zifu: "", //字符
      sureZifu:'',//确认的字符
      shudesc: "", //拼接属性的值

      attrType:'',//属性类别是那种  VARIETIES：品种   MATERIAL：物料

      pinzhongattr:[],//品种属性的列表
      wuliaoattr:[],//物料属性的列表




      attrList: [], //属性类别的列表

      setkeyword: "", //设置弹框的关键字

      tablesetList: [], //设置弹框的数组

      selectSetModalList: [], //设置弹框选择的按钮

      openSetModal: false, //打开甚至弹框的按钮

      deleteIdListModalSet: [], //弹框配置的删除服务器的数据

      copyModalList: [], //复制弹框的列表数据

      openPriceUpdate: false, //是否打开复制的弹框

      selcopylist: [], //选择复制弹框的那几行

      openSetUpload: false, //是否展示导入的弹框
      sendUploadFileName: "", //上传文件的文件名称
      failNewsShow: {}, //上传文件后端返回的信息
      isEnterTabTwo: false, //是否进入导入界面的显示结果的界面

      tableColumnModal: [
        {
          type: "index",
          label: "序号",
        },
        {
          label: "分类编号",
          prop: "typeNo",
        },
        {
          label: "分类名称",
          prop: "typeName",
        },
      ],
      addeditcheckmore: 0,
      checkTypeShow: [
        {
          label: "文本输入",
          id: "TEXT",
        },
        {
          label: "枚举值",
          id: "ENUM",
        },
        {
          label: "属性拼接",
          id: "FORMULA",
        },
      ],
      queryForm: {},
      //列表列
      tableColumn: [
        {
          // width: "60",
          type: "index",
          label: "序号",
        },
        {
          label: "属性编号",
          prop: "propertyNo",
        },
        {
          label: "属性名称",
          prop: "propertyName",
        },

        {
          label: "所属分类",
          prop: "materialTypeName",
        },
        {
          label: "所属类别",
          prop: "propertyType",
          render: (h, scope) => {
            return h("span", {
            },scope.row.propertyType == 'VARIETIES' ?'品种':'物料');
          },
        },
        {
          label: "控件类型",
          prop: "propertyDataType",
        },
        {
          label: "是否必填",
          prop: "isSystem",
          align: "center",
          render: (h, scope) => {
            let bool = scope.row.required;

            return h("el-checkbox", {
              attrs: {
                disabled: true,
                value: bool,
              },
            });
          },
        },
        {
          label: "是否可用",
          prop: "isSystem",
          align: "center",
          render: (h, scope) => {
            let bool = scope.row.usable;

            return h("el-checkbox", {
              attrs: {
                disabled: true,
                value: bool,
              },
            });
          },
        },
        {
          label: "是否系统",
          prop: "isSystem",
          align: "center",
          render: (h, scope) => {
            let bool = scope.row.usable;

            return h("el-checkbox", {
              attrs: {
                disabled: true,
                value: bool,
              },
            });
          },
        },
        {
          label: "是否多选",
          prop: "usable",
          align: "center",
          render: (h, scope) => {
            let bool = scope.row.multiselect;

            return h("el-checkbox", {
              attrs: {
                disabled: true,
                value: bool,
              },
            });
          },
        },

        {
          label: "描述",
          prop: "remark",
        },
        {
          label: "属性值",
          prop: "itemNames",
        },
      ],
      //列表数据
      tableData: [],
      //加载效果
      loading: false,
      //分页
      pageParams: {
        pageNum: 1,
        pageSize: 30,
        total: 1,
      },
      //当前选中数据
      multipleSelection: [],
      //当前编辑数据
      editAddData: {},
      config: {
        show: false,
        type: "add",
        title: "",
      },
      //字典大类列表
      dictTypeList: [],
      popConfig: {
        show: false,
      },

      editLoading: false,
    };
  },
  computed: {
    //查询条件
    searchArr() {
      return [
        {
          type: 1,
          label: "属性名称",
          value: "dictTypeNo",
        },
         {
          type: 2,
          label: "属性类别",
          optionList:[{name:'品种属性',id:'VARIETIES'},{name:'物料属性',id:'MATERIAL'}],
          value: "propertyType",
          optionLabel:'name',
          optionValue:'id',
        },
           {
          type: "33",
          label: "所属分类",
          value: "materialTypeNo",
          options: this.dictTypeListInList,

          attrs: {
            clearable:true,
            props: {
              label: "typeName",
              value: "typeNo",
              children: "childrenList",
            },
          },
        },
      ];
    },
    searchTwoSet() {
      return [
        {
          type: 1,
          label: "编号/属性值",
          value: "setkey",
        },
      ];
    },

    searchTwo() {
      return [
        {
          type: 1,
          label: "编号/属性值",
          value: "dictTypeNo",
        },
      ];
    },

    formConfig() {
      let that = this;
      // let isThree= this.formConfig;
      let bool = false;
      let showmorecheck = this.addeditcheckmore;
      let obj = {};
      if (showmorecheck == "ENUM") {
        obj = {
          key: "multiselect",
          label: "是否多选",
          type: "checkbox",
        };
      }
      let formItemList = [
        {
          key: "propertyNo",
          type: "input",
          subtype: "text",
          label: "属性编号",
          disabled: this.config.type=='edit',
          // rules: {
          //   required: true,
          //   trigger: "blur",
          //   validator: (rule, value, callback) => {
          //     if (value) {
          //       callback();
          //     } else {
          //       this.$message.error("属性编号不能为空");
          //     }
          //   },
          // },
        },
        {
          key: "propertyName",
          type: "input",
          subtype: "text",
          label: "属性名称",
          disabled: bool,
          rules: {
            required: true,
            trigger: "blur",
            validator: (rule, value, callback) => {
              if (value) {
                callback();
              } else {
                this.$message.error("大类编号不能为空");
              }
            },
          },
        },
        {
          key: "materialTypeNo",
          type: "cascader",
          options: this.dictTypeList,
          subtype: "text",
          label: "所属分类",
          attrs: {
            props: {
              label: "typeName",
              value: "typeNo",
              children: "childrenList",
              // checkStrictly: true,
            },
          },
           listeners: {
            change: (value,a) => that.changeMaterType(value,a),
          },

          disabled: bool,
          rules: {
            required: true,
            trigger: "blur",
            validator: (rule, value, callback) => {
              if (value) {
                callback();
              } else {
                this.$message.error("大类编号不能为空");
              }
            },
          },
        },
        // {
        //   key: 'dictTypeName',
        //   type: 'input',
        //   subtype: 'text',
        //   label: '类型名称',
        //   disabled: bool,
        //   rules: {
        //     required: true, trigger: 'blur',
        //     validator: (rule, value, callback) => {
        //       if (value) {
        //         callback()
        //       } else {
        //         this.$message.error('大类名称不能为空')
        //       }
        //     },
        //   },
        // },
        {
          key: "propertyType",
          type: "select",
          label: "属性类别",
          options: this.attrList,
          optionLabel: "value",
          optionValue: "id",

          disabled: bool,
          rules: {
            required: true,
            trigger: "blur",
            validator: (rule, value, callback) => {
              if (value) {
                callback();
              } else {
                this.$message.error("字典大类不能为空");
              }
            },
          },
           listeners: {
            change: (value) => that.changeAttrType(value),
          },

        },

        {
          key: "propertyDataType",
          type: "select",
          label: "字段类型",
          options: this.checkTypeShow,
          disabled: bool,

          optionLabel: "label",
          optionValue: "id",

          listeners: {
            change: (value) => that.changeShowMoreCheck(value),
          },

          rules: {
            required: true,
            trigger: "blur",
            validator: (rule, value, callback) => {
              if (value) {
                callback();
              } else {
                this.$message.error("字典大类不能为空");
              }
            },
          },
        },

        {
          key: "group",
          label: "",
          type: "checkboxGroup",
          options: [
            {
              value: "required",
              label: "是否必填",
            },
            {
              value: "usable",
              label: "是否可用",
            },
          ],
        },
        {
          ...obj,
        },

        {
          key: "remark",
          type: "input",
          subtype: "textarea",
          label: "描述",

          attrs: {
            rows: 1,
          },
          maxlength: 100,
        },
      ];

      if (showmorecheck == "FORMULA") {
        formItemList = [
          ...formItemList.slice(0, 5),
          {
            key: "usable",
            label: "是否可用",
            type: "checkbox",
          },
        ];
      }

      return {
        inline: true,
        labelWidth: "auto",
        size: "mini",
        formItemList,
      };
    },

    tableColumnSet() {
      let isEdit = true;
      return [
        {
          label: "序号",
          isEdit: true,
          prop: "itemNo",
          width: 80,
          config: {
            key: "itemNo",
            type: "input",
            subtype: "text",
            placeholder: " ",
          },
        },
        {
          prop: "itemName",
          label: "属性值",
          width: 120,

          isEdit: true,
          config: {
            key: "itemName",
            type: "input",
            subtype: "text",
            placeholder: " ",
          },
        },
        // {
        //   prop: "value",
        //   label: "值",

        //   width: 200,
        //   isEdit: true,
        //   config: {
        //     key: "value",
        //     type: "input",
        //     subtype: "text",
        //     placeholder: " ",
        //   },
        // },
        {
          prop: "usable",
          label: "是否可用",
          width: 100,
          align: "center",
          isEdit: true,
          config: {
            key: "usable",
            type: "checkbox",

            placeholder: " ",
          },
          // render: (h, scope) => {
          //   return h("el-checkbox", {
          //     props: {
          //       value: scope.row.usable,
          //       disabled: true,
          //     },
          //   });
          // },
        },
        {
          prop: "remark",
          label: "备注",

          isEdit: true,
          config: {
            key: "remark",
            type: "input",
            subtype: "text",
            placeholder: " ",
          },
        },
      ];
    },
  },
  created() {
    // this.queryAllData();
    this.pageChange(1);


    // 获取下所有的分类
    defineAddBatchByImport( {}).then((res) => {
        if (res.success) {
          this.dictTypeListInList = res.data.typeTreeList;
        }
      });



    this.attrList = [
      {
        id: "VARIETIES",
        value: "品种属性",
      },
      {
        id: "MATERIAL",
        value: "物料属性",
      },
    ];
  },
  methods: {

    closeModalAdd(){
      this.config.show = false;


                this.addeditcheckmore=0;

                this.shudesc='';
               this.sureZifu='';
               this.zifu='';




      this.attrType='';//属性类别是那种  VARIETIES：品种   MATERIAL：物料

     this.pinzhongattr=[];//品种属性的列表
      this.wuliaoattr=[];//物料属性的列表





      this.selshulist=[]
    },



    // 修改属性类别的事件
    changeAttrType(e){

      this.attrType=e

    },
    // 修改所属分类的事件
    changeMaterType(value,arr){
      propertyDefineListAll({materialTypeNo:value[value.length-1]}).then(res=>{
        this.pinzhongattr=res.data.filter(item=>item.propertyType=="VARIETIES");
        this.wuliaoattr=res.data.filter(item=>item.propertyType=='MATERIAL');
         this.selshulist=[];
        if(arr&&arr.length>0){
           this.selshulist=arr.map(item=>{
             let newItem=res.data.find(itemx=>itemx.id==item);
             return newItem
           })

        }
      })
    },
    // 下载失败原因
    loadErrorReason() {
      downloadsomePost(
        "/mdm/material-property-define/export-import-fail-data",
        this.failNewsShow
      );
    },

    // 点击上传文件 看下导入的结果
    submitSureUpload() {
      if (!this.sendUploadFileName) {
        return this.$message.error("请先上传文件");
      }

      this.isEnterTabTwo = true;
    },

    //  上传文件前做的操作 做大小和类型限制
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

    //  文件上传成功的回调
    handleFileSuccess(response, file, fileList) {
      console.log(response);
      this.sendUploadFileName = file.name;
      this.failNewsShow = response.data;
    },

    // 下载

    loadSomeModal() {
      downloadsome("/mdm/material-property-define/export-import-template");
    },

    //  选择复制弹框的表格的数据
    handleItemSelectCopy(value) {
      this.selcopylist = value;
    },

    //  获取复制弹框列表的数据

    getCopyModalList(value = "") {
      materialTypeListAll({
        leafNode: true,
        typeName: value,
        typeNo: value,
      }).then((res) => {
        this.copyModalList = res.data;
      });
    },

    //  点击的复制的annual
    copySome() {
      let count = this.multipleSelection.length;

      if (count < 1) {
        return this.$message.error("请选择操作项");
      }
      this.openPriceUpdate = true;
      this.getCopyModalList();

      // defineAddBatchByCopy
    },

    // 复制弹框的查询的按钮点击的操作

    searchMethodCopy(value) {
      // dictTypeNo
      this.getCopyModalList(value.dictTypeNo);
    },

    // 提交弹框复制的
    submitSureModal() {
      let params = {
        materialTypeNo: this.selcopylist[0].typeNo,
        idList: this.multipleSelection.map((item) => item.id),
      };
      defineAddBatchByCopy(params).then((res) => {
        if (res.success) {
          this.selcopylist = [];
          this.openPriceUpdate = false;
          this.clearSelct();
          this.getDataList();
          this.$message.success("复制成功");
        }
      });
    },

    // 提交配置弹框的按钮
    submitSureSet() {
      //  addDeleteUpdateBatch

      let params = {
        deleteIdList: this.deleteIdListModalSet,
        propertyId: this.multipleSelection[0].id,
        saveOrUpdateDtoList: this.tablesetList,
      };
      addDeleteUpdateBatch(params).then((res) => {
        if (res.success) {
          this.deleteIdListModalSet = [];
          this.tablesetList = [];
          this.openSetModal = false;
          this.clearSelct();
          this.$message.success("配置成功");
        }
      });
    },

    //  给弹框的每一个数据加一个独立的索引值
    setIndexModalSet() {
      this.tablesetList = this.tablesetList.map((item, index) => {
        return {
          ...item,
          isIndex: index,
        };
      });
    },
    //  清楚设置表格的弹框的选中
    clearSelcteSetModal() {
      if (this.$refs.mainTableSet) {
        this.$refs.mainTableSet.resetSelect();
      }
    },

    // 配置弹框的选中表格

    handleItemSelectSet(value) {
      this.selectSetModalList = value;
    },

    // 删除弹框的选种项
    deletenewset() {
      let arr = [];

      this.tablesetList.map((item, index) => {
        if (
          !this.selectSetModalList.find(
            (itemx) => itemx.isIndex == item.isIndex
          )
        ) {
          arr.push(item);
        } else {
          if (item.id) {
            this.deleteIdListModalSet.push(item.id);
          }
        }
      });
      this.tablesetList = arr;
      this.clearSelcteSetModal();
      this.setIndexModalSet();
    },

    // 新增一个配置弹框的
    addnewsetone() {
      this.tablesetList.push({
        remark: "",
        usable: false,
        itemNo: "",
        itemName: "",
      });
      this.setIndexModalSet();
    },

    //  获取配置界面的弹框的list数据
    getSetList(value = "") {
      itemDefineListAll({
        itemName: value,
        itemNo: value,
        propertyId: this.multipleSelection[0].id,
      }).then((res) => {
        if (res.success) {
          this.tablesetList = res.data;
          this.deleteIdListModalSet = [];
          //  清空下选择记录的数据
          this.clearSelcteSetModal();
          this.setIndexModalSet();
        }
      });
    },

    // 配置界面的设置的列表查询
    searchMethodSet(data) {
      this.getSetList(data.setkey);
    },

    // 配置的弹框
    setMoreChild() {
      if (!this.checkCount()) {
        return;
      }
      this.getSetList();
      this.openSetModal = true;
    },

    deleteOne() {
      if (!this.checkCount()) {
        return;
      }
      materialPropertyDefineDelete(this.multipleSelection[0].id).then((res) => {
        if (res.success) {
          this.clearSelct();
          this.getDataList();
        }
      });
    },
    updateshulistone(value) {
      this.shulistone.push(value);
      this.selshulist.push(value);
    },
    updateshulisttwo(value) {
      this.shulisttwo.push(value);
      this.selshulist.push(value);
    },
    changeShowMoreCheck(value) {
      this.addeditcheckmore = value;
    },
    /**
     * @desc 选择条数校验
     */
    checkCount() {
      let bool = true,
        count = this.multipleSelection.length;

      if (count != 1) {
        let title = "此操作只允许操作一条数据";

        if (count < 1) {
          title = "请选择操作项";
        }

        this.$message({
          message: title,
          type: "error",
          showClose: true,
        });
        bool = false;
      }

      return bool;
    },
    /**
     * @desc 查询字典大类下拉选择
     */
    // queryAllData() {
    //   materialTypeListAll({ parentId: 0 })
    //     .then((res) => {
    //       res.data.forEach((item) => {
    //         item.label = item.dictCategoryName;
    //         item.value = item.id;
    //       });
    //       this.dictTypeList = res.data;
    //     })
    //     .catch((error) => {
    //       console.group(error);
    //       this.dictTypeList = [];
    //     });
    // },
    /**
     * @desc 字典配置
     */
    dictConfig() {
      if (!this.checkCount()) {
        return;
      }
      this.editAddData = this.multipleSelection[0];
      this.popCancel(true);
    },
    /**
     * @desc 字典配置弹框显隐
     */
    popCancel(data) {
      this.popConfig.show = data;
    },

    /**
     * @desc 获取分类树
     */
    getTreeListSortType(id = "") {
      defineAddBatchByImport(id ? { id } : {}).then((res) => {
        if (res.success) {
          if (id) {
            setTimeout(() => {

              res.data.currentNodeIdList.shift();
              res.data.currentNodeIdList.pop();
              this.editAddData = {
                ...this.editAddData,
                parentId: res.data.currentNodeIdList,
              };
            }, 1000);
          }
          this.dictTypeList = res.data.typeTreeList;
        }
      });
    },
    /**
     * @desc 点击添加编辑
     */
    editAdd(type = "add") {
      let title = "新增字典类型";

      if (type !== "add") {
        if (!this.checkCount()) {
          return;
        }
        if (type === "edit") {
          title = "编辑字典类型";
          this.getDetailsData();
        }
      } else {
        this.initEditData();
      }
      this.config = {
        ...this.config,
        type,
        title,
      };
    },
    /**
     * @desc 获取列表详情
     */
    getDetailsData() {
      let params = {
        id: this.multipleSelection[0].id,
      };

      materialPropertyDefineGet(params.id)
        .then((res) => {
          this.initEditData(res.data);
        })
        .catch((error) => {
          console.group(error);
          this.initEditData();
        });
    },
    /**
     * @desc 初始化新增和编辑数据
     */
    initEditData(data = {}) {
      this.$nextTick(() => {
        let basic = {
          remark: "",
          usable: true,
          group: ['usable'],
        };
        if(data.id) {
          if (data.usable) {
          basic.group.push("usable");
        } else {
          basic.group = []
        }
        }
          if (data.required) {
          basic.group.push("required");
        }

        if (data.isSystem) {
          basic.group.push("isSystem");
        }
        // if (data.materialTypeNo) {
        //   if (!Array.isArray(data.materialTypeNo)) {
        //     data.materialTypeNo = data.materialTypeNo.split(",");
        //   }
        // }

        defineAddBatchByImport(
          data.materialTypeNo ? { typeNo: data.materialTypeNo } : {}
        ).then((res) => {
          if (res.success) {
            let obj = {};
            if (data.id) {
              // res.data.currentNodeNoList.pop();
              res.data.currentNodeNoList.shift();
              // obj.parentId = res.data.currentNodeIdList;

              obj.materialTypeNo=res.data.currentNodeNoList;


          //  如果是属性拼接的  需要做其他的处理
            if(data.propertyDataType== "FORMULA"){
                this.addeditcheckmore=data.propertyDataType;

                this.shudesc=data.remark;
               this.sureZifu=data.separator;
               this.zifu=data.separator;
          // this.formula=this.selshulist.map(item=>item.id).toString();
          this.changeAttrType(data.propertyType);

          this.changeMaterType([data.materialTypeNo],data.formula.split(','))
            }


            }


            this.editAddData = {
              ...basic,
              ...data,

              ...obj,
            };


            this.config.show = true;
            // console.log('李兰丽娜')
            this.dictTypeList = res.data.typeTreeList;
          }
        });
      });
    },
    /**
     * @desc 点击查询列表
     */

    searchMethod(data) {
      this.queryForm = data;

      this.getDataList();
    },
    /**
     * @desc 获取数据列表
     */
    getDataList() {
      this.loading = true;

      let params = this.getQueryParams();

      this.clearSelct();

      let { pageNo, pageSize, ...other } = params;
      let showParams = {
        current: pageNo,
        size: pageSize,
        ...other,
      };

      materialPropertyDefineList(showParams)
        .then((res) => {
          this.loading = false;

          this.tableData = res.data.records;
          this.pageParams.total = res.data.total;
        })
        .catch(() => {
          this.loading = false;
          this.tableData = [];
          this.pageParams.total = 0;
        });
    },
    /**
     * @desc 初始化接口参数
     */
    getQueryParams() {
      let params = {
          pageNo: this.pageParams.pageNum,
          pageSize: this.pageParams.pageSize,
        },
        objParams = {
          // dictCategotyId: "dictCategotyId",
          // dictTypeName: "dictTypeName",
          // dictTypeNo: "dictTypeNo",
          propertyName: "dictTypeNo",
          materialTypeNo:'materialTypeNo',
          propertyType:'propertyType',

        };
        if(objParams.materialTypeNo){
          objParams.materialTypeNo=objParams.materialTypeNo[objParams.materialTypeNo.length-1]

        }

      Object.keys(objParams).forEach((item) => {
        if (
          typeof this.queryForm[objParams[item]] != "undefined" &&
          this.queryForm[objParams[item]] != ""
        ) {
          params[item] = this.queryForm[objParams[item]];
        }
      });

      return params;
    },
    /**
     * @desc 获取选中的数据
     */
    handleItemSelect(val) {
      this.multipleSelection = val;
    },

    /**
     * @desc 页面发生变化
     */
    pageChange(page) {
      this.pageParams.pageNum = page;

      this.getDataList();
    },
    /**
     * @desc 页面页码页面数字改变
     */
    pageSizeChange(data) {
      this.pageParams.pageNum = data.page;
      this.pageParams.pageSize = data.limit;

      this.getDataList();
    },
    /**
     * @desc 编辑或添加取对应值
     */
    getEditParams() {
      let params = {},
        objParams = {
          dictCategotyId: "dictCategotyId",
          dictTypeName: "dictTypeName",
          dictTypeNo: "dictTypeNo",
          isSystem: "isSystem",
          remark: "remark",
          usable: "usable",
          id: "id",
        };

      Object.keys(objParams).forEach((item) => {
        let value = this.editAddData[objParams[item]];

        if (typeof value != "undefined" || value === 0) {
          params[item] = value;
        }
      });

      let group = this.editAddData.group;

      if (group.includes("usable")) {
        params.usable = true;
      } else {
        params.usable = false;
      }

      if (group.includes("isSystem")) {
        params.isSystem = true;
      } else {
        params.isSystem = false;
      }

      return params;
    },
    /**
     * @desc 点击添加或编辑
     */
    submit(data) {
      let objFun = {
          add: materialPropertyDefineAdd,
          edit: materialPropertyDefineUpdate,
        },
        type = this.config.type;

      let { group, usable, multiselect, ...other } = data;

      let showparams = {
        ...other,

        usable: group.find((item) => item == "usable") ? true : false,
        materialTypeNo: data.materialTypeNo[data.materialTypeNo.length - 1],
      };

      // 如果不是属性拼接
      if (data.propertyDataType != "FORMULA") {

        showparams.required = group.find((item) => item == "required")
          ? true
          : false;
        if (data.propertyDataType == "ENUM") {
          showparams.multiselect = multiselect ? true : false;
        }
      }
      // 如果是属性拼接  需要传递的值

      else{
        showparams.usable=usable;
        showparams.remark=this.shudesc;
        showparams.separator=this.sureZifu;
        showparams.formula=this.selshulist.map(item=>item.id).toString()
      }

      if (objFun[type]) {
        this.editLoading = true;
        this.editAddData = data;
        // let params = this.getEditParams();
        let params = showparams;

        objFun[type](params)
          .then((res) => {
            this.editLoading = false;
            this.config.show = false;
            this.getDataList();
          })
          .catch((error) => {
            this.editLoading = false;
            console.group(error);
          });
      }
    },
    /**
     * @desc 清空选中数据
     */
    clearSelct() {
      if (this.$refs.mainTable) {
        this.$refs.mainTable.resetSelect();
      }
    },
  },
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
.upload-somez{
  /deep/ .el-upload-dragger{
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
