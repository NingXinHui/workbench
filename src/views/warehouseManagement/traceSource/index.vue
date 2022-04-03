<!--
@time:2021/12/1
@author:chenqian
-->
<template>
  <div id="zPage">
    <!-- 按钮 -->
    <div class="z-header">
      <div class="z-header-button">
      <el-button @click="sourceVisible=true">溯源</el-button>
        <el-button @click="openEdit('add')">新增</el-button>
        <el-button @click="openEdit('edit')">编辑</el-button>
      </div>
    </div>
    <div class="z-content">
      <el-card>
        <!-- 搜索条件 -->
        <header-search :searchArr="searchArr" @sureSearch="searchMethod">
         <slot>
          <el-button @click="operationFun('print')" style="margin-top: -2px;">打印</el-button>
              <el-button @click="operationFun('export')" style="margin-top: -2px;">导出</el-button>
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
      <Add v-if="addvisible" :addvisible.sync="addvisible" :billCodeText="billCodeText" :detail="detail"></Add>
      <Source v-if="sourceVisible" :sourceVisible.sync="sourceVisible" />
    </div>
  </div>
</template>

<script>
import HeaderSearch from "@/components/CommonHeadSearch/ZSearch";
import commonTable from "@/components/CommonTable";
import { getDataList } from "@/api/marketOrder";
import zhuMiXins from "@/lib/orderZhu";
import {deepCopy } from "@/lib/common";
import Add from "./add"
import Source from "./Source"
export default {
  name: "TraceSource",
  components: {
    HeaderSearch,
    commonTable,
    Add,
    Source
  },
  mixins: [zhuMiXins],
  data() {
    return {
      queryForm: {}, //上面查询的条件

      tableData: [], // 表格显示的数据
      loading: true, //表格是否在加载中

      pageParams: {
        //下面的分页需要的数据
        pageNum: 1,
        pageSize: 30,
        total: 0,
      },
      multipleSelection: [], //表格选中的
      selectRow: {}, //选中的是哪一个
      addvisible: false,
      sourceVisible:false,
      billCodeText: "新增",
      detail: {}
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
          label: "追溯单号",
          value: "billNo",
          type: 1,
          maxLength: 40,
        }, {
          label: "物料",
          value: "billNo",
          type: 1,
          maxLength: 40,
        },  {
          label: '入库时间',
          value: 'createDate',
          type: 4,
          rangedesc: '至',
          pickerType: 'daterange',
          valueFormat: 'yyyy-MM-dd',
        },
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
          label: "序号",
        },
        {
          prop: "billNo",
          label: "追溯单号",
          width:200,
          // render: (h,scope) => {
          //   return h(
          //     'a',
          //     {
          //      style: {
          //         color: "blue",
          //      },
          //       on: {
          //         click:() => {
          //         this.openEdit('detail',scope.row)
          //       }
          //       }
          //     },
          //     scope.row.billNo
          //   )
          // }
        },
         {
          prop: "billNo",
          label: "顺序号",
          width: 120
        },
         {
          prop: "billNo",
          label: "物料编号",
          width: 100
        }, {
          prop: "billNo",
          label: "物料分类",
          width: 120
        },
        {
          prop: "customerOrderNo",
          label: "入库批次号",
          width: 100
        }, {
          prop: "customerOrderNo",
          label: "物料名称",
          width: 100
        }, {
          prop: "customerOrderNo",
          label: "物料描述",
          width: 100
        }, {
          prop: "customerOrderNo",
          label: "产地-国家",
          width: 100
        }, {
          prop: "customerOrderNo",
          label: "产地-地区",
          width: 100
        }, {
          prop: "customerOrderNo",
          label: "产地-兵团",
          width: 100
        }, {
          prop: "customerOrderNo",
          label: "品牌",
          width: 100
        }, {
          prop: "customerOrderNo",
          label: "来源单号",
          width: 100
        }, {
          prop: "customerOrderNo",
          label: "源单类型",
          width: 100
        }, {
          prop: "customerOrderNo",
          label: "销售订单号",
          width: 100
        }, {
          prop: "customerOrderNo",
          label: "销售指导价",
          width: 100
        }, {
          prop: "customerOrderNo",
          label: "销售价",
          width: 100
        }, {
          prop: "customerOrderNo",
          label: "销售业务员",
          width: 100
        }, {
          prop: "customerOrderNo",
          label: "采购订单号",
          width: 100
        }, {
          prop: "customerOrderNo",
          label: "采购入库单价",
          width: 100
        }, {
          prop: "customerOrderNo",
          label: "供应商",
          width: 100
        }, {
          prop: "customerOrderNo",
          label: "采购业务员",
          width: 100
        }, {
          prop: "customerOrderNo",
          label: "生产业务员",
          width: 100
        }, {
          prop: "customerOrderNo",
          label: "委外加工单号",
          width: 100
        }, {
          prop: "customerOrderNo",
          label: "生产入库单价",
          width: 100
        }, {
          prop: "customerOrderNo",
          label: "跟单员",
          width: 100
        }, {
          prop: "customerOrderNo",
          label: "生产厂家",
          width: 100
        }, {
          prop: "customerOrderNo",
          label: "生产批次号",
          width: 100
        }, {
          prop: "customerOrderNo",
          label: "缸号",
          width: 100
        },
        {
          prop: "",
          label: "附件",
        }
      ];
    },
  },

  methods: {
    /**
     * @desc 新增编辑详情
     */

    openEdit(type, params) {
      let data = {
        type,
        data: params || {},
      };
       this.billCodeText = type == 'add' ? '新增' : type == 'edit' ? '编辑' : '查看';
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
          this.detail = deepCopy(this.multipleSelection[0]);
        }
      }
      // this.$emit("submit", data);
      this.addvisible = true
    },
    /**
     * @desc 初始form表单 请求发送的数据
     */
    initForm() {
      let params = {
        pageNo: this.pageParams.pageNum,
        pageSize: this.pageParams.pageSize,
        billNo: this.queryForm.billNo,
        checkItemName: this.queryForm.checkItemName,
      };
      if (Array.isArray(this.queryForm.createDate)) {
        let time = this.queryForm.createDate;

        params.beginDate = time[0] + " 00:00:00";
        params.endDate = time[1] + " 23:59:59";
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
      getDataList(params)
        .then((res) => {
          this.loading = false;

          this.tableData = res.data.records;
          this.pageParams.total = res.data.total;
        })
        .catch((error) => {
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
        delete: {
          text: "确认删除选中的数据吗？",
          fun: this.delData,
          check: this.checkOperation,
          key: "billStatus",
          value: "12345",
        },
        export: {
          text: '确认导出查询的数据？',
          fun: this.exportCommonData,
        },
        print: {
          text: '确认打印选中的数据吗？',
          fun: this.exportCommonData,
        },
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
        type: "warning",
      })
        .then(() => {
          objText[type].fun();
        })
        .catch(() => {});
    },
    //删除事件
    delData() {},
  },
};
</script>


<style lang='less' scoped>
</style>
