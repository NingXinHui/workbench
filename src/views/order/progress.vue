<!--
@time:2021/10/25
@author:zhupeikang
订单进度查询
-->
<template>
  <div id="zPage">
    <div class="z-content">
      <el-card>
         <div class="z-content-search">
          <header-search :searchArr="searchArr" @sureSearch="sureSearch" @getMore="getMore">

          </header-search>
         </div>
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
      </el-card>
    </div>
  </div>
</template>

<script>
import HeaderSearch from '@/components/CommonHeadSearch/ZmoreSearch'
import commonTable from '@/components/CommonTable/secondTable'
// import {
// orderDtlQueryProcess
// }from "@/api/xsApi/api";

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
        // {
        //   label: "进度状态",
        //   value: "billStatus",
        //   optionLabel: 'label',
        //   optionValue: 'value',
        //   type: 2,
        //   selectOption: [{
        //     label: '草稿',
        //     value: 0
        //   }, {
        //     label: '审核中',
        //     value: 1
        //   }, {
        //     label: '已审核',
        //     value: 2
        //   }]
        // }
        // ,
        {
          label: '客户名称',
          value: 'customerName',
          type: 1,
        },{

          label: '销售组',
          value: 'salesGroupName',
          type: 1,
        },{

          label: '销售员',
          value: 'salesName',
          type: 1,
        },{
          pickerType:'daterange',
          label: '下单日期',
          value: 'billDate',
          type: 4,
          maxLength: '20'
        }
        // {
        //   label: '客户',
        //   value: 'customerName',
        //   type: 1,
        //   maxLength: '20'
        // },
        // {
        //   label: '客户',
        //   value: 'customerName',
        //   type: 1,
        //   maxLength: '20'
        // },
      ],
      tableColumn:[
        {
          label:'订单信息',
          align:'center',
          primary:[
            {
              type: 'index',
              label: '序号',
              align: 'left'
            },{
              prop: 'billNo',
              label: '订单编号',
              align: 'left'
            }
            // ,{
            //   prop: '',
            //   label: '进度状态',
            //   align: 'left'
            // }
            ,{
              prop: 'orderType',
              label: '订单类型',
              align: 'left'
            },{
              prop: 'customerName',
              label: '客户名称',
              align: 'left'
            },{
              prop: 'salesName',
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
              prop: 'materialNo',
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
              prop: '',
              label: '整理方式',
              align: 'left'
            },{
              prop: 'qty',
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
          ]
        },{
          label:'生产信息',
          align:'center',
          primary:[
            {
              prop: 'arrangeQty',
              label: '已排单数量',
              align: 'left'
            },{
              prop: 'cardNumber',
              label: '开卡数',
              align: 'left'
            },{
              prop: 'cardLength',
              label: '开卡长度',
              align: 'left'
            },{
              prop: 'inMachineCardNumber',
              label: '在机卡数',
              align: 'left'
            },{
              prop: 'notInMachineCardNumber',
              label: '未上机卡数',
              align: 'left'
            },{
              prop: 'completeCardNumber',
              label: '已了机卡数',
              align: 'left'
            },{
              prop: 'beamNumber',
              label: '落轴数',
              align: 'left'
            },{
              prop: 'beamLength',
              label: '落轴总长度',
              align: 'left'
            },{
              prop: 'qmLength',
              label: '验布长度',
              align: 'left'
            },{
              prop: 'qmVolumes',
              label: '验布卷数',
              align: 'left'
            }
          ]
        },{
          label:'仓库信息',
          align:'center',
          primary:[
            {
              prop: 'storeInQty',
              label: '已入库数量',
              align: 'left'
            },{
              prop: 'storeInExtQty',
              label: '已入库卷数',
              align: 'left'
            },{
              prop: 'storeOutQty	',
              label: '已出库数量',
              align: 'left'
            },{
              prop: 'storeOutExtQty',
              label: '已出库卷数',
              align: 'left'
            }
          ]
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
    getList(){
      this.pageParams.loading = true
      // orderDtlQueryProcess(this.pageParams).then((res) => {
      //     if (res.success) {
      //     this.pageParams.total = res.data.total
      //     this.tableData = res.data.records
      //     this.pageParams.loading = false
      //     }
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

</style>
