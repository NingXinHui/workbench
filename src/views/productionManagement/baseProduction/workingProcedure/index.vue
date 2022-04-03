<!--
@time:2021/12/1
@author:chenqian
-->
<template>
  <div id="zPage">
    <!-- 按钮 -->
    <div class="z-header">
      <div class="z-header-button">
        <el-button @click="openEdit('add')">新增</el-button>
        <el-button @click="openEdit('edit')">编辑</el-button>
        <el-button @click="configure">跟进项配置</el-button>
      </div>
    </div>
    <div class="z-content">
      <el-card>
        <!-- 搜索条件 -->
        <header-search
          :model="queryForm"
          :searchArr="searchArr"
          @sureSearch="searchMethod"
        >
          <slot>
            <el-button @click="operationFun('export')" style="margin-top: -2px;"
              >导出</el-button
            >
          </slot>
        </header-search>
        <div class="z-content-table">
          <!-- table -->
          <common-table
            is-height
            ref="mainTable"
            :isMain="true"
            :tableColumn="tableColumn"
            :tableData="tableData"
            :isSelection="true"
            :isSelectMore="false"
            :loading="loading"
            :pageParams="pageParams"
            @selePage="handleItemSelect"
            @pageChange="pageSizeChange"
          />
        </div>
      </el-card>
      <Add
        v-if="visible"
        :visible.sync="visible"
        :billCodeText="billCodeText"
        :detail="detail"
      ></Add>
      <Configure  v-if="configureVisible"
        :configureVisible.sync="configureVisible" :selectRow="selectRow"></Configure>
    </div>
  </div>
</template>

<script>
import HeaderSearch from "@/components/CommonHeadSearch/ZSearch";
import commonTable from "@/components/CommonTable";
import {
  getWorkprocedurelist,
} from "@/api/production/workingProcedure";
import {downloadsome} from "@/utils/auth"
import zhuMiXins from "@/lib/orderZhu";
import { deepCopy } from "@/lib/common";
import Add from "./add";
import Configure from "./configure";
export default {
  name: "WorkingProcedure",
  components: {
    HeaderSearch,
    commonTable,
    Add,
    Configure
  },
  mixins: [zhuMiXins],
  data() {
    return {
      queryForm: {
        usable: "1"
      }, //上面查询的条件

      tableData: [], // 表格显示的数据
      loading: true, //表格是否在加载中

      pageParams: {
        //下面的分页需要的数据
        pageNum: 1,
        pageSize: 30,
        total: 0
      },
      multipleSelection: [], //表格选中的
      selectRow: {}, //选中的是哪一个
      visible: false,
      billCodeText: "新增",
      detail: {},
      configureVisible:false,
    };
  },

  mounted() {
    this.getDataList();
  },

  computed: {
    /**
     * @desc 上面的查询条件  最好放到computed里面 当里面相关的参数发生改变  这个数据就会更新一次
     */
    searchArr() {
      return [
        {
          label: "工序名称",
          value: "procedureName",
          type: 1,
          maxLength: 40
        },
        {
          label: "是否可用",
          value: "usable",
          optionLabel: "label",
          optionValue: "value",
          type: 2,
          selectOption: [
            {
              label: "全部",
              value: "all"
            },
            {
              label: "是",
              value: "1"
            },
            {
              label: "否",
              value: "0"
            }
          ]
        },
        {
          label: "创建时间",
          value: "createDate",
          type: 4,
          rangedesc: "至",
          pickerType: "daterange",
          valueFormat: "yyyy-MM-dd"
        }
      ];
    },

    /**
     * @desc 上面显示的表格行
     */

    tableColumn() {
      return [
        //表格显示的列
        {
          type: "index",
          label: "序号"
        },
        {
          prop: "procedureNo",
          label: "工序编号",
          width: 130
        },
        {
          prop: "procedureName",
          label: "工序名称",
          width: 130
        },
        {
          prop: "usable",
          label: "是否可用",
          width: "90",
          align: "center",
          render: (h, scope) => {
            return h("el-checkbox", {
              props: {
                value: scope.row.usable,
                disabled: true
              }
            });
          }
        },
        {
          prop: "createUserFullName",
          label: "创建人",
          width: 100
        },
        {
          prop: "createTime",
          label: "创建时间",
          width: "170"
        },
        {
          prop: "",
          label: ""
        }
      ];
    }
  },

  methods: {
    configure() {
      if(this.multipleSelection.length) {
        this.configureVisible = true;
      }else {
        this.$message.error("请选择操作项")
    }
    },
    /**
     * @desc 新增编辑详情
     */

    openEdit(type, params) {
      this.billCodeText = "新增";
      if (type === "edit") {
        if (
          !this.checkOperation(
            type,
            this.multipleSelection,
            "billStatus",
            "12345"
          )
        ) {
          return;
        } else {
          this.billCodeText = "编辑";
          this.detail = deepCopy(this.multipleSelection[0]);
        }
      }
      this.visible = true;
    },
    /**
     * @desc 初始form表单 请求发送的数据
     */
    initForm() {
      let params = {
        current: this.pageParams.pageNum,
        size: this.pageParams.pageSize,
        procedureName: this.queryForm.procedureName,
        usable: this.queryForm.usable == "all" ? "" : this.queryForm.usable
      };
      if (Array.isArray(this.queryForm.createDate)) {
        let time = this.queryForm.createDate;

        params.startTime = time[0] + " 00:00:00";
        params.endTime = time[1] + " 23:59:59";
      }
      return params;
    },

    /**
     * @desc 设置选中的表格行
     */
    handleItemSelect(val) {
      this.multipleSelection = val;
      this.selectRow = val[0];
    },

    /**
     * @desc 清除表格的选中项
     */
    clearSelcte() {
      if (this.$refs.mainTable) {
        this.$refs.mainTable.resetSelect();
      }
    },
    /**
     * @desc 获取订单的列表
     */
    getDataList() {
      this.loading = true;
      let params = this.initForm();
      this.clearSelcte();
      getWorkprocedurelist(params)
        .then(res => {
          this.loading = false;

          this.tableData = res.data.records;
          this.pageParams.total = res.data.total;
        })
        .catch(error => {
          this.tableData = [];
          this.loading = false;
          this.pageParams.total = 0;
        });
    },

    /**
     * @desc 上面查询条件
     */
    searchMethod(data) {
      this.queryForm = data;
      this.pageParams.pageNum = 1;
      this.getDataList();
    },

    /**
     * @desc 分液器发生改变的方法
     */

    pageSizeChange(data) {
      this.pageParams.pageNum = data.page;
      this.pageParams.pageSize = data.limit;

      this.getDataList();
    },

    /**
     * @desc 上面的按钮进行的操作
     */
    operationFun(type) {
      let objText = {
        export: {
          text: "确认导出查询的数据？",
          fun: this.exportCommonData
        }
      };

      if (objText[type].check) {
        if (
          !objText[type].check(
            type,
            this.multipleSelection,
            objText[type].key,
            objText[type].value
          )
        ) {
          return;
        }
      }
      this.$confirm(objText[type].text, "", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          objText[type].fun();
        })
        .catch(() => {});
    },
    //导出事件
    exportCommonData() {
      let params = this.initForm();
      downloadsome(
        '/pd/work-procedure/export', params, '工序管理模块清单.xls'
      )
    }
  }
};
</script>

<style lang="less" scoped></style>
