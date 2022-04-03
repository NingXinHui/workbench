<!--
@time:2021/12/1
@author:chenqian
-->
<template>
  <div id="zPage">
    <!-- 按钮 -->
    <div class="z-header">
      <div class="z-header-button">
        <el-button @click="operationFun('go')"
          >入库</el-button
        >
        <el-button class="delButton" @click="operationFun('delete')"
          >删除</el-button
        >
      </div>
    </div>
    <div class="z-content">
      <el-card>
        <!-- 搜索条件 -->
        <header-search :searchArr="searchArr" @sureSearch="searchMethod">
         <slot>
              <el-button @click="operationFun('export')" style="margin-top: -2px;">导出</el-button>
            </slot>
        </header-search>
        <div class="z-content-table">
        <div class="topTip">
        待入库数量合计<span style="margin-right:50px">0000000</span>
        已入库数量合计<span>0000</span>
        </div>
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
    </div>
  </div>
</template>

<script>
import HeaderSearch from "@/components/CommonHeadSearch/ZSearch";
import commonTable from "@/components/CommonTable";
import { getDataList } from "@/api/marketOrder";
import zhuMiXins from "@/lib/orderZhu";
import {deepCopy } from "@/lib/common";
export default {
  name: "WarehouseTask",
  components: {
    HeaderSearch,
    commonTable,
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
          label: '查询方案',
          value: 'orderNo',
          optionLabel: 'label',
          optionValue: 'value',
          type: 2,
          selectOption: [{
            label: '草稿',
            value: 0
          }, {
            label: '审核中',
            value: 1
          }, {
            label: '已审核',
            value: 2
          }]
        },
        {
          label: '入库任务号',
          value: 'customerName',
          type: 1,
          maxLength: 40,
        },{
          label: '业务状态',
          value: 'orderNo',
          optionLabel: 'label',
          optionValue: 'value',
          type: 2,
          selectOption: [{
            label: '草稿',
            value: 0
          }, {
            label: '审核中',
            value: 1
          }, {
            label: '已审核',
            value: 2
          }]
        },
         {
          label: '到货仓库',
          value: 'customerName',
           optionLabel: 'label',
          optionValue: 'value',
          type: 2,
          selectOption: [{
            label: '草稿',
            value: 0
          }, {
            label: '审核中',
            value: 1
          }, {
            label: '已审核',
            value: 2
          }],
          maxLength: 40,
        },
      ]
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
          label: "入库任务单号",
        },{
          prop: "billNo",
          label: "到货仓库",
        },{
          prop: "billNo",
          label: "预计到货时间",
        },{
          prop: "billNo",
          label: "收货方式",
        },{
          prop: "billNo",
          label: "是否免检",
          width:90,
          align:'center',
          render:(h,scope) => {
            return h(
              'el-checkbox',
              {
                props: {
                  value:scope.row.billNo,
                  disabled:true,
                }
              }
            )
          }
        },{
          prop: "billNo",
          label: "业务状态",
        },{
          prop: "billNo",
          label: "到货备注",
        },{
          prop: "billNo",
          label: "来源单号",
        },{
          prop: "billNo",
          label: "源单类型",
        },{
          prop: "billNo",
          label: "销售订单号",
        },{
          prop: "billNo",
          label: "采购订单号",
        },{
          prop: "billNo",
          label: "供应商编号",
        },{
          prop: "billNo",
          label: "供应商名称",
        },{
          prop: "billNo",
          label: "采购员",
        },{
          prop: "billNo",
          label: "申请人",
        },{
          prop: "billNo",
          label: "物料编码",
        },{
          prop: "billNo",
          label: "物料名称",
        },
        {
          prop: "customerOrderNo",
          label: "物料描述",
        },{
          prop: "customerOrderNo",
          label: "厂家批次",
        },{
          prop: "customerOrderNo",
          label: "批次号",
        },{
          prop: "customerOrderNo",
          label: "缸号",
        },{
          prop: "customerOrderNo",
          label: "成品等级",
        },{
          prop: "customerOrderNo",
          label: "待入库数量",
        },{
          prop: "customerOrderNo",
          label: "已入库数量",
        },{
          prop: "customerOrderNo",
          label: "计量单位",
        },{
          prop: "customerOrderNo",
          label: "运费",
        },{
          prop: "customerOrderNo",
          label: "统计标识",
        },{
          prop: "customerOrderNo",
          label: "集装箱号",
        },{
          prop: "customerOrderNo",
          label: "货运代理费",
        },{
          prop: "customerOrderNo",
          label: "创建人",
        },
        {
          prop: "billDate",
          label: "创建时间",
          width:"170"
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
      // this.$emit("submit", data);
      this.visible = true
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
        go: {
          text: "确认对选中的数据生成入库单吗？",
          fun: this.changePrice,
          check: this.checkOperation,
          key: "billStatus",
          value: "12345",
        },
        export: {
          text: '确认导出查询的数据？',
          fun: this.exportCommonData,
        },
      };

      if (objText[type].check) {
        if (
          !objText[type].check(
            type == 'go' ? 'delete' : type,
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
    changePrice() {
      this.$router.push({
        path: "/purchasingManagement/purchasePrice",
        query: {
          priceType: "1"
        }
      })
    }
  },
};
</script>


<style lang='less' scoped>
.topTip {
font-size: 12px;
font-family: PingFangSC-Regular;
color: #999999;
span {
color: #374256;
}
}
</style>
