<!--
@time:2021/10/25
@author:zhupeikang
订单查询
-->
<template>
  <div class="zPage">
    <div class="z-content">
      <el-card>
        <div class="z-content-search">
          <header-search :searchArr="searchArr" @sureSearch="sureSearch"  @getMore="getMore">
            <template>
            </template>
          </header-search>
          <div class="z-content-table">
            <common-table
                is-height
                ref="mainTable"
                :isMain="true"
                :tableColumn="tableColumn"
                :tableData="tableData"
                :isSelection="true"
                :loading="pageParams.loading"
                :pageParams="pageParams"
                @selePage="handleItemSelect"
                @pageChange="pageChange"
                :propTableHeight='isMore?174:175'
            />
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import HeaderSearch from '@/components/CommonHeadSearch/ZmoreSearch'
import commonTable from '@/components/CommonTable/secondTable'
// import {orderDtl} from "@/api/xsApi/api";
export default {
  name: "progress",
  components: {HeaderSearch,commonTable},
  mixins: [],
  props: {},
  data() {
    return {
      isMore:false,
      searchArr: [
        {
          label: '订单编号',
          value: 'billNo',
          type: 1,
        },
        {
          label: '物料编号',
          value: 'materialNo',
          type: 1,
          maxLength: '20'
        },
        {
          label: "物料名称",
          value: "materialName",
          type: 1,
        },
        {
          label: "花型号",
          value: "pattenNo",
          type: 1,
        },
        {
          label: "客户名称",
          value: "customerName",
          type: 1,
          
        }
        ,{
          label: '销售组',
          value: 'salesGroupName',
          type: 1,
        },{
          pickerType:'daterange',
          label: '销售员',
          value: '',
          type: 1,
        },{
          pickerType:'daterange',
          label: '下单日期',
          value: 'billDate',
          type: 4,
          maxLength: '20'
        },{
          pickerType:'daterange',
          label: '交货日期',
          value: 'deliveryDate',
          type: 4,
          maxLength: '20'
        }
        // {
        //   label: '客户',
        //   value: 'customerName',
        //   type: 1,
        //   maxLength: '20'
        // },
      ],
      tableColumn:[
        {
          type: 'index',
          label: '序号',
          align: 'left'
        },{
          prop: 'billNo',
          label: '订单编号',
          align: 'left'
        },{
          prop: 'orderType',
          label: '订单类型',
          align: 'left'
        },{
          prop: 'customerName',
          label: '客户名称',
          align: 'left'
        },{
          prop: '',
          label: '销售员',
          align: 'left'
        },{
          prop: 'salesGroupName',
          label: '销售组',
          align: 'left'
        },{
          prop: 'billDate',
          label: '下单日期',
          align: 'left'
        },{
          prop: 'materialNo	',
          label: '物料编号',
          align: 'left'
        },{
          prop: 'materialName',
          label: '物料名称',
          align: 'left'
        },{
          prop: 'colorName',
          label: '颜色',
          align: 'left'
        },{
          prop: 'specification',
          label: '规格',
          align: 'left'
        },{
          prop: 'colorLamp',
          label: '对色光源',
          align: 'left'
        },{
          prop: 'pattenNo',
          label: '花型号',
          align: 'left'
        },{
          prop: 'width',
          label: '幅宽',
          align: 'left'
        },{
          prop: 'pieceCount',
          label: '匹数',
          align: 'left'
        },{
          prop: 'pieceLength',
          label: '匹长',
          align: 'left'
        },{
          prop: 'price',
          label: '单价',
          align: 'left'
        },{
          prop: 'amount',
          label: '金额',
          align: 'left'
        },{
          prop: '',
          label: '币种',
          align: 'left'
        },{
          prop: '',
          label: '整理方式',
          align: 'left'
        },{
          prop: '',
          label: '订单数量',
          align: 'left'
        },{
          prop: 'unit',
          label: '单位',
          align: 'left'
        },{
          prop: 'productionQty',
          label: '生产数量(米)',
          align: 'left'
        },{
          prop: 'deliveryDate',
          label: '交货日期',
          align: 'left'
        },
      ],
      pageParams: {
        loading: false,
        pageNo: 1,
        pageSize: 30,
        total: 1
      },
      tableData:[]

    }
  },
  computed: {},

  watch: {},

  beforeCreat() {

  },

  created() {

  },

  beforeMount() {
  },

  mounted() {
    this.getList()
  },
  methods: {
    getMore(value){
          this.isMore=value
      },
    //获取数据
    getList() {
      // orderDtl(this.pageParams).then((res) => {
      //   if (res.success) {
      //     this.pageParams.loading=false
      //     this.pageParams.total = res.data.total
      //     this.tableData = res.data.records
      //   }
      // })
    },
    sureSearch(value){
     this.pageParams={...this.pageParams,...value,pageNum:1};
      this.getList();
    },
    //选择事件
    handleItemSelect(val) {
      this.multipleSelection = val;
      this.selectRow = val[0];
    },
    //翻页、跳页事件
    pageChange(e) {
      this.pageParams.pageNo = e.page
      this.pageParams.pageSize = e.limit
      this.getList()
    },
  },
  beforeUpdate() {

  },

  updated() {

  },

  activated() {

  },

  deactivated() {

  },

  beforeDestroy() {

  },

  destroyed() {
  }


}
</script>

<style lang='less' scoped>
/deep/ .el-card__body {
    padding: 8px 12px;
    height: calc(100vh - 104px) !important;
    overflow: auto;
}
/deep/.el-pagination .el-select .el-input {
    width: 100px!important;
    margin: 0 5px;
}
/deep/.el-pagination__editor.el-input{
  width: 50px!important;
}
</style>
