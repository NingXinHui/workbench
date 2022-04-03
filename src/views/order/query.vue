<!--
@time:2021/9/29
@author:zhupeikang
车间档案维护
-->
<template>
  <div id="zPage">
    <div class="z-content">
      <el-card>
        <header-search :searchArr="searchArr" @sureSearch="searchMethod">
          <template>
<!--            <el-form-item>-->
<!--              <el-button class="search" type="primary">高级查询</el-button>-->
<!--            </el-form-item>-->
<!--            <el-form-item>-->
<!--              <el-button>打印</el-button>-->
<!--            </el-form-item>-->
<!--            <el-form-item>-->
<!--              <el-button>导出</el-button>-->
<!--            </el-form-item>-->
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
          />
        </div>
      </el-card>
    </div>
    <div>
      <add :visible.sync="visible" :model="selectRow" :is-add="isAdd" :form-column="formColumn" @submit="getForm"></add>
    </div>
  </div>
</template>

<script>
import HeaderSearch from '@/components/CommonHeadSearch/ZmoreSearch'
import commonTable from '@/components/CommonTable'
import dialogControl from "@/lib/dialogControl";
import add from '@/components/AddUpdate'
import ZForm from '@/components/ZForm/ZForm'

import {queryOrderList} from "@/api/order";

export default {
  name: "index",

  components: {HeaderSearch, commonTable, add, ZForm},

  mixins: [dialogControl],

  props: {},

  data() {
    return {
      selectRow: {},
      isAdd: true,
      pageParams: {
        loading: false,
        pageNo: 1,
        pageSize: 30,
        total: 0
      },
      tableColumn: [
        {
          type: 'index',
          label: '序号',
          width: 80,
          align: 'right'
        },
        {
          prop: 'billNo',
          label: '订单编号',
        },
        {
          prop: 'orderType',
          label: '订单类型'
        },
        {
          prop: 'billStatusName',
          label: '审核状态'
        },

        // {
        //   prop: '',
        //   label: '是否可用',
        //   render: (h, scope) => {
        //     return h("el-checkbox", {
        //       props: {
        //         value: scope.row.usable,
        //         disabled: true
        //       }
        //     });
        //   },
        // },
        {
          prop: 'customerName',
          label: '客户'
        },
        {
          prop: 'billDate',
          label: '订单日期'
        },
        {
          prop: 'salesName',
          label: '业务员'
        },
        {
          prop: 'materialNo',
          label: '物料编号'
        },
        {
          prop: 'materialName',
          label: '物料名称'
        },
        {
          prop: 'pieceCount',
          label: '匹数'
        },

        {
          prop: 'pieceLength',
          label: '匹长'
        },
        {
          prop: 'qty',
          label: '数量'
        }, {
          prop: 'unit',
          label: '单位'
        }, {
          prop: 'deliveryDate',
          label: '交货日期'
        },
        {
          prop: 'price',
          label: '单价'
        },
        {
          prop: 'amount',
          label: '金额'
        },

      ],
      tableData: [
       ],
      searchArr: [{
        label: '订单编号',
        value: 'billNo',
        type: 1,
        maxLength: '20'
      },
        {
          label: '物料编号',
          value: 'materialNo',
          type: 1,
        },
        {
          label: '物料名称',
          value: 'materialName',
          type: 1,
        },
        {
          label: '花型号',
          value: 'colorLamp',
          type: 1,
        },
        {
          label: '客户名称',
          value: 'customerName',
          type: 1,
        },
        {
          label: "销售组",
          value: "salesGroupName",
          type: 1,
        },
        {
          label: "salesName",
          value: "",
          type: 1,
        },
        {
          label: "下单日期",
          value: "",
          type: 4,
        },
        {
          label: '交货日期',
          value: "deliveryDate",
          type: 4,
        },
        // {
        //   label: "审核状态",
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
      ],

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
    //获取编辑的表单信息
    getForm(e) {
      console.log(e)
    },
    //获取数据
    getList() {
      queryOrderList(this.pageParams).then((res) => {
        if (res.success) {
          this.pageParams.loading=false
          this.pageParams.total = res.data.total
          this.tableData = res.data.records
        }
      })
    },
    //点击新增按钮
    add() {
      this.isAdd = true
      this.openDialog()
    },
    //点击编辑按钮
    edit(e) {
      if (this.multipleSelection.length > 1) {
        this.$message({
          message: '此操作不允许多条同时编辑',
          type: "error",
          showClose: true
        })
        return
      }
      if (this.multipleSelection.length < 1) {
        this.$message({
          message: '请选择数据后进行操作',
          type: "error",
          showClose: true
        })
        return
      }
      this.isAdd = false
      this.visible = true
    },
    //点击删除按钮
    del() {
      this.$confirm('确认删除所选的数据吗？', '', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
      });
    },
    //点击查询的操作
    searchMethod(e) {
      this.pageParams.pageNo=1
      this.pageParams.loading=true
      Object.assign(this.pageParams,e)
      this.getList()
    },
    //选择事件
    handleItemSelect(val) {
      this.multipleSelection = val;
      this.selectRow = val[0];
    },
    //翻页事件
    pageChange(e) {
      this.pageParams.pageNo = e.page
      this.pageParams.pageSize = e.limit
      this.getList()
    }
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


<style scoped>

</style>
