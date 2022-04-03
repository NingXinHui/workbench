<!--
@time:2021/12/1
@author:chenqian
-->
<template>
  <div id="zPage">
    <!-- 按钮 -->
    <div class="z-header">
      <div class="z-header-button">
        <el-button @click="operationFun('settle')">结清</el-button>
      </div>
    </div>
    <div class="z-content">
      <el-card>
        <!-- 搜索条件 -->
        <header-search :searchArr="searchArr" @sureSearch="searchMethod">
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
            :isSelectMore="true"
            :loading="loading"
            :pageParams="pageParams"
            :countColumn="countColumn"
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
import { commissionList,settleCommission } from "@/api/sale/report";
import zhuMiXins from "@/lib/orderZhu";
import { deepCopy } from "@/lib/common";
export default {
  name: "CommissionReport",
  components: {
    HeaderSearch,
    commonTable
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
        total: 0
      },
      multipleSelection: [], //表格选中的
      selectRow: {}, //选中的是哪一个
      visible: false,
      spanArr:[],
      pos:0,
      countColumn:{},
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
          label: "查询方案",
          value: "orderNo",
          optionLabel: "label",
          optionValue: "value",
          type: 2,
          selectOption: [
          ]
        },

        {
          label: "销售订单号",
          value: "billNo",
          type: 1,
          maxLength: 40
        },
        {
          label: "是否已结清",
          value: "settled",
          optionLabel: "label",
          optionValue: "value",
          type: 2,
          selectOption: [
            {
              label: "是",
              value: '1'
            },
            {
              label: "否",
              value: '0'
            },
          ]
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
          label: "序号"
        },
        {
          prop: "billNo",
          label: "销售订单号"
        },
        {
          prop: "checkItemNo",
          label: "客户编号"
        },
        {
          prop: "checkItemName",
          label: "客户名称"
        },
        {
          prop: "salesPersonName",
          label: "销售业务员"
        },
        {
          prop: "commissionTotal",
          label: "佣金总额"
        },
        {
          prop: "settled",
          label: "是否已结清",
          render: (h,scope) => {
            return h(
              'el-checkbox',
              {
                props: {
                  value:scope.row.settled,
                  disabled:true,
                }
              }
            )
          }
        },
        {
          prop: "materialNo",
          label: "物料编号"
        },
        {
          prop: "materialName",
          label: "物料名称"
        },
        {
          prop: "unitName",
          label: "计量单位"
        },
        {
          prop: "qty",
          label: "订单数量"
        },
        {
          prop: "taxIncludePrice",
          label: "销售单价"
        },
        {
          prop: "taxIncludeTotalAmount",
          label: "销售总价"
        },
        {
          prop: "commission",
          label: "佣金",
          width: "170"
        }
      ];
    }
  },

  methods: {
    /**
     * @desc 新增编辑详情
     */

    openEdit(type, params) {
      let data = {
        type,
        data: params || {}
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
      this.visible = true;
    },
    /**
     * @desc 初始form表单 请求发送的数据
     */
    initForm() {
      let params = {
        current: this.pageParams.pageNum,
        size: this.pageParams.pageSize,
        billNo: this.queryForm.billNo,
        checkItemName: this.queryForm.checkItemName,
        settled:this.queryForm.settled
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
    },

    /**
     * @desc 清除表格的选中项
     */
    clearSelcte() {
      if (this.$refs.mainTable) {
        this.$refs.mainTable.resetSelect();
      }
    },
    getSpanArr(data) {
      this.spanArr = [];
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          // 如果是第一条记录（即索引是0的时候），向数组中加入１
          this.spanArr.push(1);
          this.pos = 0;
        } else {
          if (data[i].ids === data[i - 1].ids) {
            // 如果ids相等就累加，并且push 0  这里是根据一样的ids匹配
            this.spanArr[this.pos] += 1;
            this.spanArr.push(0);
          } else {
            // 不相等push 1
            this.spanArr.push(1);
            this.pos = i;
          }
        }
      }
      this.countColumn.spanArr = this.spanArr;
      this.countColumn.countIndex = [0,1,2,3,4,5,6,7];
    },
    /**
     * @desc 获取订单的列表
     */
    getDataList() {
      this.loading = true;
      let params = this.initForm();
      this.clearSelcte();
      commissionList(params)
        .then(res => {
          this.loading = false;
          let arr = [];
          res.data.records.forEach(i => {
            i.orderDetailVOList.forEach(r => {
              let obj = {
                ids:i.id,
                id: r.id,
                billNo: i.billNo,
                checkItemName: i.checkItemName,
                checkItemNo: i.checkItemNo,
                commissionTotal: i.commissionTotal,
                salesPerson: i.salesPerson,
                salesPersonName: i.salesPersonName,
                settled: i.settled,
                commission: r.commission,
                hdrId: r.hdrId,
                materialId: r.materialId,
                materialName: r.materialName,
                materialNo: r.materialNo,
                taxIncludePrice: r.taxIncludePrice,
                taxIncludeTotalAmount: r.taxIncludeTotalAmount,
                unit: r.unit,
                unitName: r.unitName,
                qty:r.qty,
                settled: i.settled
              };
              arr.push(obj);
            });
          });
          this.tableData = arr;
          this.getSpanArr(this.tableData)
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
        free: {
          text: "确认免息选中的数据吗？",
          fun: this.freeData,
          check: this.checkOperation,
          key: "billStatus",
          value: "12345"
        },
        settle: {
          text: "确认结清选中的数据吗？",
          fun: this.settleData,
          check: this.checkOperation,
          key: "billStatus",
          value: "12345"
        },
        export: {
          text: "确认导出查询的数据？",
          fun: this.exportCommonData
        }
      };

      if (objText[type].check) {
        if (
          !objText[type].check(
            "delete",
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
    //免息
    freeData() {},
    //结清
    settleData() {
      let flag = this.multipleSelection.every(item => { return item.settled == false})
      if(!flag) {
        this.$message.error("请选择未结清的数据!!!");
        return
      }
      let idList = this.multipleSelection.map(item => { return item.ids})
      let arr = []
      settleCommission({ids: idList.toString()}).then(res => {
        if(res.code == 0) {
          this.$message.success("操作成功");
          this.getDataList();
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    //导出数据
    exportCommonData() {}
  }
};
</script>

<style lang="less" scoped></style>
