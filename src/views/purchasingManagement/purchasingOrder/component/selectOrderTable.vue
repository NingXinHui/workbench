
<!--
@time:2021/12/2
@author:chenqian
-->
<template>
  <div class="popBox">
    <el-dialog
      title="查询选择(选单)"
      :visible="orderVisible"
      @close="close"
      :close-on-click-modal="false"
    >
      <div class="content">
       <header-search ref="search" :model="detail" :isAdd="true" :searchArr="searchArr" @sureSearch="searchMethod" >
            <slot>
              <el-button @click="reset" style="margin-top: -2px;">重置</el-button>
            </slot>
          </header-search>
            <div class="z-content-table">
          <span>订单信息</span>
           <common-table
              is-height
              ref="mainTable"
              :isMain="true"
              :tableColumn="tabletopColumn"
              :tableData="tabletopData"
              :isSelection="false"
              :isSelectMore="true"
              :isPage="false"
              :tableheight="200"
              :isRowClick="true"
              @selePage="handletopItemSelect"
            />
            <span>已选订单</span>
             <common-table
              is-height
              ref="mainTable"
              :isMain="true"
              :tableColumn="tabletopColumn"
              :tableData="tableData"
              :isSelection="false"
              :isSelectMore="true"
              :isPage="false"
              :isRowClick="true"
              :tableheight="200"
              @selePage="handleItemSelect"
            />
            </div>
      </div>
      <div slot="footer" >
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="submit">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import HeaderSearch from '@/components/CommonHeadSearch/ZSearch'
import commonTable from '@/components/CommonTable'
import { checkFormData } from "@/lib/common";
import { getOrderList } from "@/api/sale/invoice"
export default {
  name: "add",
  components: { HeaderSearch,commonTable },

  mixins: [],

  props: {
    orderVisible: {
      type: Boolean,
      default: false
    },
  },

  data() {
    return {
      queryForm: {},
      isEdit: true,
      tabletopData: [],
      tableData: [],
      detail:{
        name:"0"
      }
    };
  },
  mounted() {
    this.getOrderList();
  },
  methods: {
    //获取选单数据
    getOrderList(data={}) {
      getOrderList({
        current:1,
        size:50,
        ...data
      }).then(res => {
        if(res.code == 0) {
          this.tabletopData = res.data;
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    //点击保存
    submit() {
     if(!this.tableData.length) {
       this.$message.error("请选择数据");
       return
     }
     this.$emit("selectTable",this.tableData);
     this.$emit("update:orderVisible", false);
    },
    handletopItemSelect(val,flag) {
      if(flag) {
        this.tableData.push(val);
       this.tableData = this.tableData.map((item,i) => {
          return {...item,isIndex:i}
        })
      }
    },
    handleItemSelect(val,flag) {
      if(flag) {
        const index = this.tableData.findIndex(item =>{
          return  item.isIndex == val.isIndex
        }
       )
        this.tableData.splice(index,1);
       this.tableData = this.tableData.map((item,i) => {
          return {...item,isIndex:i}
        })
      }
    },
    searchMethod(data){
       this.detail = {...this.detail,...data}
      this.getOrderList(data);
    },
     //重置
    reset() {
      this.detail = {
        name: "0"
      },
      this.getOrderList({});
    },
    //关闭弹窗
    close() {
      this.$emit("update:orderVisible", false);
    },
  },
  computed: {
     searchArr() {
      return [
         {
          label: '上游单据',
          value: 'name',
          optionLabel: 'label',
          optionValue: 'value',
          type: 2,
          clearable:false,
          selectOption: [{
            label: '销售订单',
            value: '0'
          }]
        },
         {
          label: '来源单号',
          value: 'billNo',
          type: 1,
          maxLength: 40,
        },
         {
          label: '客商名称',
          value: 'checkItemName',
          type: 1,
          maxLength: 40,
        },{
          label: '物料',
          value: 'materialName',
          type: 1,
          maxLength: 40,
        },

      ]
    },
    tabletopColumn() {
      return [
         {
          type: 'index',
          label: '序号',
        },
        {
          prop: 'saleTypeName',
          label: '源单类型',
        },
        {
          prop: 'billNo',
          label: '来源单号',
        },
        {
          prop: 'checkItemName',
          label: '客商名称',
        },
        {
          prop: 'salesPersonName',
          label: '业务员',
        },
         {
          prop: 'salesGroupName',
          label: '业务组',
        },
        {
          prop: 'companyName',
          label: '公司主体',
        },
        {
          prop: 'orderQty',
          label: '订单数量',
        },
        {
          prop: 'createTime',
          label: '创建时间',
        },
        {
          prop: 'materialNo',
          label: '物料编号',
        },
        {
          prop: 'materialName',
          label: '物料名称',
        },
        {
          prop: 'materialDescription',
          label: '物料描述',
        },
        {
          prop: 'unitName',
          label: '计量单位',
        },
        {
          prop: 'qty',
          label: '数量',
        },
        {
          prop: 'remainingOptionalQty',
          label: '剩余可选数量',
        }
      ]
    }
  },

  watch: {},

  created() {},

  beforeMount() {},
};
</script>

<style lang="scss" scoped>
.popBox {
  ::v-deep .el-dialog {
    overflow-y: auto;
    width: 1150px !important;
    min-height: 100px !important;
    .el-dialog__body {
      padding: 0 !important;
      min-height: 100px !important;
      .content {
        min-height: 100px !important;
        overflow-x: auto;
      }
    }
  }
}
</style>
