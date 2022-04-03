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
          >出库</el-button
        >
        <el-button class="delButton" @click="operationFun('delete')"
          >删除</el-button
        >
        <el-button @click="operationFun('print')"
          >打印拣配单</el-button
        >
      </div>
    </div>
    <div class="z-content">
        <!-- 搜索条件 -->
         <el-card class="z-details-box">
           <header-search :searchArr="searchArr" @sureSearch="searchMethod">
         <slot>
              <el-button @click="operationFun('export')" style="margin-top: -2px;">导出</el-button>
            </slot>
        </header-search>
            <div class="z-details-content">
          <div class="z-details-icon">
            <span @click="isCancel('basicShow', !basicShow)">
              <i
                :class="
                  basicShow ? 'el-icon-caret-bottom' : 'el-icon-caret-right'
                "
              ></i>
              出库列表
            </span>
          </div>
          <div
            :class="[
              'z-details-content-box',
              basicShow ? '' : 'details-height-none',
            ]"
          >
           <div style="padding-left:24px">
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
            :ispage="false"
            :tableColumn="tableColumn"
            :tableData="tableData"
            :isSelection="true"
            :isSelectMore="false"
            :tableheight="250"
            :loading="loading"
            :pageParams="pageParams"
            @selePage="handleItemSelect"
            @pageChange="pageSizeChange"
          />
        </div>
           </div>
          </div>
        </div>
             <div class="z-details-content">
          <div class="z-details-icon">
            <span @click="isCancel('recommendShow', !recommendShow)">
              <i
                :class="
                  recommendShow ? 'el-icon-caret-bottom' : 'el-icon-caret-right'
                "
              ></i>
              推荐货位
            </span>
          </div>
          <div
            :class="[
              'z-details-content-box',
              recommendShow ? '' : 'details-height-none',
            ]"
          >
           <div style="padding-left:24px">
              <div class="z-content-table">
          <!-- table -->
          <common-table
            is-height
            ref="mainTable"
            :isMain="true"
            :ispage="false"
            :tableColumn="midTableColumn"
            :tableData="midTableData"
            :isSelection="true"
            :isSelectMore="false"
            :tableheight="250"
            :loading="loading"
            :pageParams="pageParams"
            @selePage="handleItemSelect"
            @pageChange="pageSizeChange"
          />
        </div>
           </div>
          </div>
        </div>
              <div class="z-details-content">
          <div class="z-details-icon">
            <span @click="isCancel('detailShow', !detailShow)">
              <i
                :class="
                  detailShow ? 'el-icon-caret-bottom' : 'el-icon-caret-right'
                "
              ></i>
              派车单信息
            </span>
          </div>
          <div
            :class="[
              'z-details-content-box',
              detailShow ? '' : 'details-height-none',
            ]"
          >
           <div style="padding-left:24px">
              <div class="z-content-table">
          <!-- table -->
          <common-table
            is-height
            ref="mainTable"
            :isMain="true"
            :ispage="false"
            :tableColumn="botTableColumn"
            :tableData="botTableData"
            :isSelection="true"
            :isSelectMore="false"
            :tableheight="250"
            :loading="loading"
            :pageParams="pageParams"
            @selePage="handleItemSelect"
            @pageChange="pageSizeChange"
          />
        </div>
           </div>
          </div>
        </div>
        <Table :visible.sync="visible"></Table>
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
import Table from "./table"
export default {
  name: "Issuetask",
  components: {
    HeaderSearch,
    commonTable,
    Table
  },
  mixins: [zhuMiXins],
  data() {
    return {
      queryForm: {}, //上面查询的条件

      tableData: [], // 表格显示的数据
      midTableData:[{}],
      botTableData:[],
      loading: true, //表格是否在加载中
      basicShow:true,//出库列表
      recommendShow:true, //推荐列表
      detailShow:true, //派车单信息
      visible:false,
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
          label: '出库任务号',
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
          label: '发货仓库',
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
          label: "出库任务单号",
          render:(h,scope) => {
            return h(
              'a',
              {
                style: {
                  color:'blue'
                },
                on: {click:()=> {}
                }
              }
            )
          }
        },{
          prop: "billNo",
          label: "发货仓库",
        },{
          prop: "billNo",
          label: "发货地区",
        },{
          prop: "billNo",
          label: "业务状态",
        },{
          prop: "billNo",
          label: "业务状态",
        },{
          prop: "billNo",
          label: "排车状态",
        },{
          prop: "billNo",
          label: "出库备注",
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
          label: "要求出库日期",
        },{
          prop: "billNo",
          label: "物料编码",
        },{
          prop: "customerOrderNo",
          label: "批次号",
        },{
          prop: "billNo",
          label: "物料名称",
        },
        {
          prop: "customerOrderNo",
          label: "物料描述",
        },{
          prop: "customerOrderNo",
          label: "计量单位",
        },{
          prop: "customerOrderNo",
          label: "重量(KG)",
        },{
          prop: "customerOrderNo",
          label: "待出库数量",
        },{
          prop: "customerOrderNo",
          label: "已出库数量",
        },{
          prop: "customerOrderNo",
          label: "司机姓名",
        },{
          prop: "customerOrderNo",
          label: "联系电话",
        },{
          prop: "customerOrderNo",
          label: "车牌号",
        },{
          prop: "customerOrderNo",
          label: "司机身份证",
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
    midTableColumn() {
      return [
        //表格显示的列
        {
          type: "index",
          label: "序号",
        },
       {
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
          label: "计量单位",
        },{
          prop: "customerOrderNo",
          label: "仓位信息",
        },{
          prop: "customerOrderNo",
          label: "批次号",
        },{
          prop: "customerOrderNo",
          label: "可用库存",
        },{
          prop: "customerOrderNo",
          label: "整包数量",
        },{
          prop: "customerOrderNo",
          label: "整包件数",
        },{
          prop: "customerOrderNo",
          label: "零包数量",
        },{
          prop: "customerOrderNo",
          label: "零包件量",
        },
        {
          prop: "billDate",
          label: "创建时间",
          width:"170"
        },{
          prop: "",
          label: "操作",
          width:90,
          align:'center',
          render: (h,scope) => {
            return h(
              'a',
              {
                style:{
                  color: 'blue',
                },
                on:{
                  click:()=>{
                    this.visible=true;
                  }
                }
              },
              '更多'

            )
          }
        },
      ];
    },
       botTableColumn() {
      return [
        //表格显示的列
        {
          type: "index",
          label: "序号",
        },
       {
          prop: "billNo",
          label: "派车单号",
        },{
          prop: "billNo",
          label: "单据状态",
        },
        {
          prop: "customerOrderNo",
          label: "运输单号",
        },{
          prop: "customerOrderNo",
          label: "运输单位",
        },{
          prop: "customerOrderNo",
          label: "车牌号",
        },{
          prop: "customerOrderNo",
          label: "司机姓名",
        },{
          prop: "customerOrderNo",
          label: "司机联系方式",
        },{
          prop: "customerOrderNo",
          label: "司机出发时间",
        },{
          prop: "customerOrderNo",
          label: "创建人",
        },{
          prop: "customerOrderNo",
          label: "创建时间",
        },{
          prop: "customerOrderNo",
          label: "备注",
        }
      ];
    },
  },

  methods: {
    isCancel(key, bool) {
      this[key] = bool;
    },
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
          text: "确认对选中的数据生成出库单吗？",
          fun: this.changePrice,
          check: this.checkOperation,
          key: "billStatus",
          value: "12345",
        },
        print: {
          text: "确认对选中的数据打印出拣货单吗？",
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
            type == 'go' ? 'delete' : type=='print' ? 'delete' : type,
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
