
<!--
@time:2021/12/2
@author:chenqian
-->
<template>
  <div class="popBox">
    <el-dialog
      title="选单主表"
      :visible="orderVisible"
      @close="close" width="900px !important"
      :close-on-click-modal="false"
    >
      <div class="content">
       <header-search :searchArr="searchArr" @sureSearch="searchMethod" >
            <slot>
              <el-button @click="operationFun('export')" style="margin-top: -2px;">重置</el-button>
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
              :isSelection="true"
              :isSelectMore="true"
              :loading="loading"
              :isPage="false"
              :tableheight="200"
              @selePage="handletopItemSelect"
            />
            <span>已选订单</span>
             <common-table
              is-height
              ref="mainTable"
              :isMain="true"
              :tableColumn="tabletopColumn"
              :tableData="tableData"
              :isSelection="true"
              :isSelectMore="true"
              :isPage="false"
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
    };
  },
  methods: {
    //点击保存
    submit() {
      if (!checkFormData(this.formConfig.formItemList, this.queryForm)) {
        return;
      }
    },
    handletopItemSelect(val) {},
    handleItemSelect(val) {},
    searchMethod(){

    },
    //关闭弹窗
    close() {
      this.$emit("update:orderVisible", false);
    },
    //初始化页面参数
    initQueryForm(data = {}) {
      this.queryForm = {
        remark: "",
      };
    }
  },
  computed: {
     searchArr() {
      return [
         {
          label: '上游单据',
          value: 'orderNo',
          optionLabel: 'label',
          optionValue: 'value',
          type: 2,
          selectOption: [{
            label: '1',
            value: 0
          }, {
            label: '2',
            value: 1
          }, {
            label: '3',
            value: 2
          }]
        },
         {
          label: '来源单号',
          value: 'customerName',
          type: 1,
          maxLength: 40,
        },
         {
          label: '客商名称',
          value: 'customerName',
          type: 1,
          maxLength: 40,
        }
      ]
    },
    tabletopColumn() {
      return [
         {
          type: 'index',
          label: '序号',
        },
        {
          prop: 'billDate',
          label: '来源单号',
        },
        {
          prop: 'customerOrderNo',
          label: '源单类型',
        },

        {
          prop: 'checkItemName',
          label: '业务员',
        },
         {
          prop: 'checkItemName',
          label: '业务组',
        },
        {
          prop: 'checkItemContactName',
          label: '公司主体',
        },{
          prop: 'customerOrderNo',
          label: '客商名称',
        },
        {
          prop: 'billDate',
          label: '订单数量',
        },
        {
          prop: 'checkItemName',
          label: '创建时间',
        },
        {
          prop: '',
          label: '',
        }
      ]
    }
  },

  watch: {},

  created() {},

  beforeMount() {},

  mounted() {
    this.initQueryForm();
  }
};
</script>

<style lang="scss" scoped>
.popBox {
  ::v-deep .el-dialog {
    width: 900px !important;
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
