<template>
  <div id="zPage">
    <!-- 单据编码规则 -->
     <!-- <div class="z-header">
      <div class="z-header-button">
        <el-button @click="openEdit('area')">导出</el-button>
        、
      </div>
    </div> -->
    <div class="z-content">
      <el-card>
        <header-search :searchArr="searchArr" @sureSearch="searchMethod">
            <slot>
                <el-button  style="margin-top: 1px;">导出</el-button>
            </slot>

        </header-search>
        <div class="z-content-table">
          <common-table
            is-height
            ref="mainTable"
            :isMain="true"
            :tableColumn="tableColumn"
            :tableData="tableData"
            :loading="pageParams.loading"
            :pageParams="pageParams"
            @pageChange="pageChange"
          />
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
import HeaderSearch from "@/components/CommonHeadSearch/ZSearch";
import commonTable from '@/components/CommonTable/secondTable'
import add from "@/components/AddUpdate";
import { pbBillFormulahdr } from "@/api/xsApi/api";

export default {
  components: { HeaderSearch, commonTable, add },
  name: "index",
  data() {
    return {
      searchArr: [
        //  {
        //   type: 2,
        //   label: '报表选择',
        //   value: 'dictCategotyId',
        //   selectOption: this.dictTypeList,
        //   optionLabel: 'label',
        //   optionValue: 'value',
        // },
       
        //  {
        //   type: 2,
        //   label: '统计维度',
        //   value: 'dictCategotyId',
        //   selectOption: this.dictTypeList,
        //   optionLabel: 'label',
        //   optionValue: 'value',
        // },
         {
          label: "物料编号",
          value: "defName",
          type: 1,
        },
         {
          type: 2,
          label: '仓库名称',
          value: 'dictCategotyId',
          selectOption: this.dictTypeList,
          optionLabel: 'label',
          optionValue: 'value',
        },

        {
          label: "时间筛选",
          value: "key",
          type: 4,
          //   maxLength: "20",
          rangedesc: "至",
          pickerType: "datetimerange", //选择器类型
        },
      ],
        tableColumn: [
        {
          label: '物料',
          align: 'center',
          primary: [

            {
              type: 'index',
              label: '序号',
              width: 80
            },
            {
              prop: 'materialNo',
              label: '物料编号'
            }, {
              prop: 'materialName',
              label: '物料名称'
            }, {
              prop: 'unit',
              label: '单位'
            }, {
              prop: 'grade',
              label: '等级'
            }, {
              prop: 'colorName',
              label: '颜色'
            }, {
              prop: 'materialLot',
              label: '物料批次'
            }, {
              prop: 'storeName',
              label: '仓库名称'
            }
          ]
        }, {
          label: '期初',
          align: 'center',
          primary: [
            {
              prop: 'openQty',
              label: '期初数量'
            }, {
              prop: 'openPkgQty',
              label: '包装数量'
            }
          ]
        }, {
          label: '本期',
          align: 'center',
          primary: [
            {
              prop: 'currentInQty',
              label: '入库数量'
            }, {
              prop: 'currentInPkgQty',
              label: '包装数量'
            },
            {
              prop: 'currentOutQty',
              label: '出库数量'
            }, {
              prop: 'currentOutPkgQty',
              label: '包装数量'
            }
          ]
        }, {
          label: '期末',
          align: 'center',
          primary: [
            {
              prop: 'closeQty',
              label: '期末数量'
            }, {
              prop: 'closePkgQty',
              label: '包装数量'
            }
          ]
        }

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
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      this.pageParams.loading = true;
      pbBillFormulahdr(this.pageParams).then((res) => {
        if (res.success) {
          this.pageParams.total = res.data.total;
          this.tableData = res.data.records;
          this.pageParams.loading = false;
        }
      });
    },

    searchMethod(value) {
      this.pageParams = { ...this.pageParams, ...value, pageNo: 1 };
      this.getList();
    },

    //翻页、跳页事件
    pageChange(e) {
      this.pageParams.pageNo = e.page;
      this.pageParams.pageSize = e.limit;
      this.getList();
    },
  },
};
</script>
<style lang="less" scoped>
#zPage /deep/ .el-card__body {
  height: calc(100vh - 114px);

  /deep/ .z-content {
    height: calc(100vh - 95px);
  }
}






</style>


