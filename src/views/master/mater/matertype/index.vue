<template>
  <!-- 字典维护 -->
  <div id="zPage">
    <div class="z-header">
      <div class="z-header-button">
        <el-button @click="editAdd('add')">新增</el-button>
        <el-button @click="editAdd('edit')">编辑</el-button>
        <el-button class="delButton"
                   @click="() => deleteOne()">删除</el-button>
      </div>
    </div>
    <div class="z-content">
      <el-card>
        <header-search :searchArr="searchArr"
                       @sureSearch="searchMethod"></header-search>
        <div class="z-content-table">
          <common-table ref="mainTable"
                        :isMain="true"
                        :tableColumn="tableColumn"
                        :tableData="tableData"
                        :tree-props="{children: 'childrenList', hasChildren: 'hasChildren'}"
                        :isSelection="true"
                        :loading="loading"
                        :pageParams="pageParams"
                        @selePage="handleItemSelect"
                        @pageChange="pageSizeChange" />
        </div>
      </el-card>
    </div>

    <edit-add v-if="config.show"
              :config="config"
              :editLoading="editLoading"
              :formConfig="formConfig"
              :editData="editAddData"
              @close="config.show = false"
              @submit="submit"></edit-add>
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
  defineAddBatchByImport,
  materialTypeList,
  materialTypeListAll,
  materialTypeAdd,
  materialTypeUpdate,
  materialTypeDelete,
  materialTypeGet,
} from "@/api/apizhu";
import { stringify } from 'querystring';

export default {
  name: "CommonalityDictionary",
  components: {
    HeaderSearch,
    commonTable,
    editAdd,
  },
  data () {
    return {
      isTreeTable: true, //是否显示树表格
      parentTypeName: '',
      queryForm: {},

      //列表列
      tableColumn: [
        {
          // width: "60",
          type: "index",
          label: "序号",
        },
        {
          label: "分类编号",
          prop: "typeNo",
          render: (h, scope) => {
            return h('el-link', {
              style: "color:#1890ff",
              on: {
                click: () => {
                  this.editAdd('look', scope.row)
                }
              }
            }, scope.row.typeNo)
          }
        },
        {
          label: "分类名称",
          prop: "typeName",
        },

        {
          label: "上级分类",
          prop: "parentTypeName",
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
          label: "是否未节点",
          prop: "usable",
          align: "center",
          render: (h, scope) => {
            let bool = scope.row.leafNode;

            return h("el-checkbox", {
              attrs: {
                disabled: true,
                value: bool,
              },
            });
          },
        },

        {
          label: "税率",
          prop: "taxRate",
        },
        {
          label: "描述",
          prop: "remark",
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
      editAddData: { taxRate: 0 },
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
    searchArr () {
      return [
        {
          type: 1,
          label: "分类",
          value: "dictTypeNo",
        },
      ];
    },
    formConfig () {
      let bool = this.config.type !== "add";
      let isEdit = this.config.type == 'look';
      let obj = {
        key: "dictCategotyId",
        type: "select",
        label: "单位名称",
        options: this.dictTypeList,
        disabled: bool,
        rules: {
          required: true,
          trigger: "blur",
          validator: (rule, value, callback) => {
            if (value) {
              callback();
            } else {
              this.$message.error("单位名称不能为空");
            }
          },
        },
      };
      if (bool) {
        obj = {
          key: "dictCategotyName",
          type: "input",
          subtype: "text",
          label: "字典大类",
          disabled: bool,
        };
      }
      let formItemList = [
        {
          key: "typeNo",
          type: "input",
          subtype: "text",
          label: "分类编码",
          disabled: bool,
          isEdit,
          rules: {
            required: true,
            trigger: "blur",
            validator: (rule, value, callback) => {
              if (value) {
                callback();
              } else {
                this.$message.error("分类编码不能为空");
              }
            },
          },
        },
        {
          key: "taxRate",
          type: "number",
           min: 0,
           max: 1,
           precision: 2,
          subtype: "text",
          isEdit,
          label: "税率(%)",
          // isEdit:true,
          // disabled: bool,
          // rules: {
          //   required: true,
          //   trigger: "blur",
          //   validator: (rule, value, callback) => {
          //     if (value) {
          //       callback();
          //     } else {
          //       this.$message.error("大类编号不能为空");
          //     }
          //   },
          // },
        },
        {
          key: "typeName",
          type: "input",
          subtype: "text",
          isEdit,
          label: "分类名称",
          // disabled: bool,
          rules: {
            required: true,
            trigger: "blur",
            validator: (rule, value, callback) => {
              if (value) {
                callback();
              } else {
                this.$message.error("分类名称不能为空");
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
          key: isEdit ? 'parentTypeName' : "parentId",
          type: isEdit ? 'input' : "cascader",
          label: "上级分类",
          options: this.dictTypeList,
          isEdit,
          // disabled: isEdit,
          attrs: {
            props: {
              label: "typeName",
              value: "id",
              children: "childrenList",
              checkStrictly: true,
            },
          },
          // rules: {
          //   required: true,
          //   trigger: "blur",
          //   validator: (rule, value, callback) => {
          //     if (value) {
          //       callback();
          //     } else {
          //       this.$message.error("上级分类不能为空");
          //     }
          //   },
          // },
        },

        {
          key: "remark",
          isEdit,
          type: "input",
          subtype: "textarea",
          label: "描述",

          attrs: {
            rows: 1,
          },
          maxlength: 100,
        },
        {
          key: "remarkEn",
          type: "input",
          isEdit,
          subtype: "textarea",
          label: "英文描述",
          attrs: {
            rows: 1,
          },
          maxlength: 100,
        },
        {
          key: "group",
          label: "",
          type: "checkboxGroup",
          options: [
            {
              value: "leafNode",
              label: "是否未节点",
               disabled:isEdit,
            },
            {
              value: "usable",
              label: "是否可用",
               disabled:isEdit,
            },
          ],
        },
      ];

      return {
        inline: true,
        labelWidth: "auto",
        size: "mini",
        formItemList,
      };
    },
  },
  created () {
    // this.queryAllData();

    this.pageChange(1);
  },
  methods: {
    /**
     * @desc 选择条数校验
     */
    checkCount () {
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
    //   materialTypeListAll({parentId:0})
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
    dictConfig () {
      if (!this.checkCount()) {
        return;
      }
      this.editAddData = this.multipleSelection[0];
      this.popCancel(true);
    },
    /**
     * @desc 字典配置弹框显隐
     */
    popCancel (data) {
      this.popConfig.show = data;
    },

    deleteOne () {
      if (!this.checkCount()) {
        return;
      }
      this.$confirm('确定删除选中的数据', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        materialTypeDelete(this.multipleSelection[0].id).then((res) => {
          if (res.success) {
            this.clearSelct();
            this.getDataList();
            this.$message({
              message: "删除成功",
              type: "success"
            });
          }
        });
      });
    },
    /**
     * @desc 获取分类树
     */

    getTreeListSortType (id = "") {
      defineAddBatchByImport(id ? { id } : {}).then((res) => {
        if (res.success) {
          if (id) {
            setTimeout(() => {
              console.log(this.editAddData);

              res.data.currentNodeIdList.shift();
              res.data.currentNodeIdList.pop();
              this.editAddData = {
                ...this.editAddData,
                parentId: res.data.currentNodeIdList,
              };

              console.log(this.editAddData);
              console.log("李兰");
            }, 1000);
          }
          // console.log('李兰丽娜')
          this.dictTypeList = res.data.typeTreeList;
        }
      });
    },
    /**
     * @desc 点击添加编辑
     */
    editAdd (type = "add", item) {
      let title = "新增分类";

      if (type !== "add") {
        if (type != 'look' && !this.checkCount()) {
          return;
        }
        if (type === "edit") {
          title = "编辑分类";
          // this.getTreeListSortType(this.multipleSelection[0].id);
          this.getDetailsData();
        }
        if (type == 'look') {
          title = "查看";


          this.getDetailsData(item);
        }
      } else {
        // this.getTreeListSortType();

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
    getDetailsData (item = {}) {
      let params = {
        id: item.id ? item.id : this.multipleSelection[0].id,
      };

      materialTypeGet(params.id)
        .then((res) => {
          this.initEditData(res.data, item);
        })
        .catch((error) => {
          console.group(error);
          this.initEditData();
        });
    },
    /**
     * @desc 初始化新增和编辑数据
     */
    initEditData (data = {}, item = {}) {
      this.$nextTick(() => {
        let basic = {
          dictCategotyId: "",
          dictTypeName: "",
          dictTypeNo: "",
          isSystem: true,
          remark: "",
          usable: true,
          group: this.config.type === "add" ? ["isSystem", "usable"] : [],
        };

        if (data.usable) {
          basic.group.push("usable");
        }

        if (data.leafNode) {
          basic.group.push("leafNode");
        }


        // if(data.parentId){
        //   // if(!Array.isArray(data.parentId)){
        //   //   data.parentId=data.parentId.split(',')

        //   // }
        // }
        // data.parentId=['1473902623782060101','1473902623782060103']
        // console.log(data);

        defineAddBatchByImport(data.id ? { id: data.id } : {}).then((res) => {
          if (res.success) {
            let obj = {};
            if (data.id) {
              res.data.currentNodeIdList.pop();
              res.data.currentNodeIdList.shift();
              obj.parentId = res.data.currentNodeIdList;
            }
            if (item.id) {
              obj.parentTypeName = item.parentTypeName
            }
            this.editAddData = {
              taxRate: 0,
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

    //对象为空或者属性值为空校验
    paramsValidate (params) {
      let flag = true;
      if (JSON.stringify(params) == '{}') {
        return false;
      }
      for (let key in params) {
        if ((params[key] != '0' && !params[key])) {
          return false;
        }
      }
      return true;
    },

    /**
     * @desc 点击查询列表
     */
    searchMethod (data) {
      this.queryForm = data;
      this.isTreeTable = !this.paramsValidate(this.queryForm)
      this.getDataList();
    },
    /**
     * @desc 获取数据列表
     */
    getDataList () {

      let objType = this.isTreeTable ? defineAddBatchByImport : materialTypeList
      this.loading = true;

      let params = this.getQueryParams();

      this.clearSelct();
      let { pageNo, pageSize, ...other } = params;
      let showParams = {
        current: pageNo,
        size: pageSize,
        ...other,
      };
      objType(showParams)
        .then((res) => {
          this.loading = false;
          this.tableData = this.isTreeTable ? res.data.typeTreeList : res.data.records;
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
    getQueryParams () {
      let params = {
        pageNo: this.pageParams.pageNum,
        pageSize: this.pageParams.pageSize,
      },
        objParams = {
          // dictCategotyId: "dictCategotyId",
          // dictTypeName: "dictTypeName",
          typeName: "dictTypeNo",
        };

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
    handleItemSelect (val) {
      this.multipleSelection = val;
    },

    /**
     * @desc 页面发生变化
     */
    pageChange (page) {
      this.pageParams.pageNum = page;

      this.getDataList();
    },
    /**
     * @desc 页面页码页面数字改变
     */
    pageSizeChange (data) {
      this.pageParams.pageNum = data.page;
      this.pageParams.pageSize = data.limit;

      this.getDataList();
    },
    /**
     * @desc 编辑或添加取对应值
     */
    getEditParams () {
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
    submit (data) {
      let objFun = {
        add: materialTypeAdd,
        edit: materialTypeUpdate,
      },
        type = this.config.type;

      if (type == 'look') {
        this.editLoading = false;
        this.config.show = false;
        return;
      }
      if (objFun[type]) {
        this.editLoading = true;
        this.editAddData = data;
        // let params = this.getEditParams();
        let params = this.editAddData;

        console.log(params);
        console.log("李兰兰");

        let {
          dictCategotyId,
          dictTypeName,
          dictTypeNo,
          group,
          isSystem,
          ...other
        } = params;

        console.log(group);
        console.log("dacs");
        console.log(other);

        let showParams = {
          ...other,
          usable: group.find((item) => item == "usable") ? true : false,
          leafNode: group.find((item) => item == "leafNode") ? true : false,
          parentId: !other.parentId || (other.parentId&&other.parentId.length==0) ? 0 : other.parentId[other.parentId.length - 1],
        };

        objFun[type](showParams)
          .then((res) => {
            this.editLoading = false;
            this.config.show = false;
            this.getDataList();
            this.$message({
              message: type == 'add' ? '新增成功' : '编辑成功',
              type: "success"
            });
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
    clearSelct () {
      if (this.$refs.mainTable) {
        this.$refs.mainTable.resetSelect();
      }
    },
  },
};
</script>
