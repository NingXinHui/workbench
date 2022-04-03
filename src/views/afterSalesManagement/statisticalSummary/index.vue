<template>
  <!-- 字典维护 -->
  <div id="zPage">
    <div class="z-header">
      <div class="z-header-button">
        <el-button @click="editAdd('add')">新增</el-button>
        <el-button @click="editAdd('edit')">编辑</el-button>
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
            :isSelection="true"
            :loading="loading"
            :pageParams="pageParams"
            @selePage="handleItemSelect"
            @pageChange="pageSizeChange"
          />
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
import HeaderSearch from "@/components/CommonHeadSearch/ZSearch";
import commonTable from "@/components/CommonTable";
import editAdd from "@/components/DialogForm/index";

import {
  unitListAll,
  dictDataList,
  unitListAllNoPage,
  unitAdd,
  unitUpdate,
  unitGetCode,
  unitDelete,
} from "@/api/apizhu";

export default {
  name: "CommonalityDictionary",
  components: {
    HeaderSearch,
    commonTable,
    editAdd,
  },
  data() {
    return {
      huanUnitList: [], //换算单位
      queryForm: {},
      //列表列
      tableColumn: [
        {
          // width: "60",
          type: "index",
          label: "序号",
        },
        {
          label: "单位代码",
          prop: "unitCode",
        },
        {
          label: "单位名称",
          prop: "unitName",
        },
        {
          label: "单位类型",
          prop: "unitType",
        },
        {
          label: "是否可用",
          prop: "system",
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
          label: "是否标准",
          prop: "usable",
          align: "center",
          render: (h, scope) => {
            let bool = scope.row.standard;

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
          prop: "usable",
          align: "center",
          render: (h, scope) => {
            let bool = scope.row.system;

            return h("el-checkbox", {
              attrs: {
                disabled: true,
                value: bool,
              },
            });
          },
        },
        {
          label: "换算单位",
          prop: "conversionUnitId",
        },
        {
          label: "换算系数",
          prop: "conversionFactor",
        },
        {
          label: "创建人",
          prop: "createUser",
        },
        {
          label: "创建时间",
          prop: "createTime",
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
          label: "单位",
          value: "unitName",
        },

        {
          type: 2,
          label: "单位类型",
          value: "unitType",
          selectOption: this.dictTypeList,
          optionLabel: "value",
          optionValue: "value",
        },
      ];
    },
    formConfig() {
      let bool = false;
      let formItemList = [
        {
          key: "unitName",
          type: "input",
          subtype: "text",
          label: "单位名称",
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
        },
        {
          key: "unitCode",
          type: "input",
          subtype: "text",
          label: "单位代码",
          disabled: bool,
          rules: {
            required: true,
            trigger: "blur",
            validator: (rule, value, callback) => {
              if (value) {
                callback();
              } else {
                this.$message.error("单位代码不能为空");
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
          key: "unitType",
          type: "select",
          label: "单位类型",
          options: this.dictTypeList,
          optionLabel: "value",
          optionValue: "value",
          disabled: bool,
          rules: {
            required: true,
            trigger: "blur",
            validator: (rule, value, callback) => {
              if (value) {
                callback();
              } else {
                this.$message.error("单位类型不能为空");
              }
            },
          },
        },
        {
          key: "conversionUnitId",
          type: "select",
          label: "换算单位",
          options: this.huanUnitList,
          optionLabel: "unitName",
          optionValue: "id",
          //  options:[],
          disabled: bool,
          // rules: {
          //   required: true, trigger: 'blur',
          //   validator: (rule, value, callback) => {
          //     if (value) {
          //       callback()
          //     } else {
          //       this.$message.error('换算单位不能为空')
          //     }
          //   },
          // },
        },
        {
          key: "conversionFactor",
          type: "input",
          subtype: "text",
          label: "换算系数",
          disabled: bool,
          // rules: {
          //   required: true, trigger: 'blur',
          //   validator: (rule, value, callback) => {
          //     if (value) {
          //       callback()
          //     } else {
          //       this.$message.error('换算系数不能为空')
          //     }
          //   },
          // },
        },
        {
          key: "group",
          label: "",
          type: "checkboxGroup",
          options: [
            {
              value: "system",
              label: "是否系统项",
            },
            {
              value: "usable",
              label: "是否可用",
            },
          ],
        },
        // {
        //   key: 'remark',
        //   type: 'input',
        //   subtype: 'textarea',
        //   label: '备注',
        //   maxlength: 200
        // }
      ];

      return {
        inline: true,
        labelWidth: "auto",
        size: "mini",
        formItemList,
      };
    },
  },
  created() {
    this.queryAllData();
    this.pageChange(1);
  },
  methods: {
    /**
     * @desc 查询字典大类下拉选择
     */
    queryAllData() {
      dictDataList("unitType")
        .then((res) => {
          this.dictTypeList = res.data;
        })
        .catch((error) => {
          console.group(error);
          this.dictTypeList = [];
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

      let params = this.queryForm;

      this.clearSelct();
      unitListAll(params)
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
