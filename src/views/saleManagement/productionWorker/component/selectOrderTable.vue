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
        <header-search ref="suixin" :searchArr="searchArr" @sureSearch="searchMethod">
          <slot>
            <el-button @click="operationFun('export')" style="margin-top: -2px;"
              >重置</el-button
            >
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
            :pageParams="pageParams"
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
            :pageParams="pageParams"
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
      <div slot="footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="submit">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import HeaderSearch from "@/components/CommonHeadSearch/ZSearch";
import commonTable from "@/components/CommonTable";
import { checkFormData } from "@/lib/common";
import { getProductMenu } from "@/api/marketOrder";

export default {
  name: "add",
  components: { HeaderSearch, commonTable },

  mixins: [],

  props: {
    orderVisible: {
      type: Boolean,
      default: false
    },
    handleItem: {
      type: Function
    }
  },

  data() {
    return {
      queryForm: {},
      isEdit: true,
      tabletopData: [],
      tableData: [],
      loading: "",
      selectItem: "",
      pageParams: {
        pageNum: 1,
        pageSize: 30,
        total: 0
      }
    };
  },
  methods: {
    //点击保存
    submit() {
      /*   if (!checkFormData(this.formConfig.formItemList, this.queryForm)) {
        return;
      } */
      if (!this.tableData.length) {
        this.$message.error("请选择数据");
        return;
      }
      this.$emit("selectTable", this.tableData);
      this.$emit("update:orderVisible", false);

      //
      // this.$emit("handleItem", this.tableData);
      this.close();
    },
    getProductlist() {
      let data = {
        current: 1,
        size: 30,
        // id: "",
        sourceBillNo: this.queryForm.sourceBillNo,
        checkItemName: this.queryForm.checkItemName,
        materialName: this.queryForm.materialName
      };

      getProductMenu(data)
        .then(res => {
          console.log(res);
          this.tabletopData = res.data;
          this.tabletopData = this.tabletopData.map((item, index) => {
            return {
              ...item,
              detailId: item.id,
              id: index
            };
          });
          // console.log(this.tabletopData);
        })
        .catch(err => {});
    },
    // 重置
    operationFun(e) {
  

      let data = {
        current: 1,
        size: 10,
      
        sourceBillNo:'',
        checkItemName: '',
        materialName: ''
      };

         this.$refs.suixin.resetForm({billNo1:undefined,sourceBillNo:undefined,checkItemName:undefined,materialName:undefined})
      
      
      getProductMenu(data)
        .then(res => {
          console.log(res);
          this.tabletopData = res.data;
          this.tabletopData = this.tabletopData.map((item, index) => {
            return {
              ...item,
              detailId: item.id,
              id: index
            };
          });
          console.log(this.tabletopData);
        })
        .catch(err => {});


        
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
    searchMethod(data) {
      this.queryForm = data;
      this.pageChange(1);
    },
    pageChange(page) {
      this.pageParams.pageNum = page;
      this.getProductlist();
    },

    //关闭弹窗
    close() {
      this.$emit("update:orderVisible", false);
    },
    //初始化页面参数
    initQueryForm(data = {}) {
      this.queryForm = {
        remark: "",
       
        ...data
      };
    }
  },
  computed: {
    searchArr() {
      return [
        {
          label: "上游单据",
          value: "billNo1",
          optionLabel: "label",
          optionValue: "value",
          type: 2,
          selectOption: [
            {
              label: "1",
              value: 0
            },
            {
              label: "2",
              value: 1
            },
            {
              label: "3",
              value: 2
            }
          ]
        },
        {
          label: "来源单号",
          value: "sourceBillNo",
          type: 1,
          maxLength: 50
        },
        {
          label: "客商名称",
          value: "checkItemName",
          type: 1,
          maxLength: 50
        },
        {
          label: "物料名称",
          value: "materialName",
          type: 1,
          maxLength: 40
        }
      ];
    },
    tabletopColumn() {
      return [
        /*  {
          type: "index",
          label: "序号"
        }, */
        {
          prop: "sourceBillNo",
          label: "来源单号"
        },
        {
          prop: "sourceBillType",
          label: "源单类型"
        },

        {
          prop: "salesPersonName",
          label: "业务员"
        },
        {
          prop: "salesGroupName",
          label: "业务组"
        },
        {
          prop: "companyName",
          label: "公司主体"
        },
        {
          prop: "checkItemName",
          label: "客商名称"
        },
        {
          prop: "qty",
          label: "订单数量"
        },
        {
          prop: "createTime",
          label: "创建时间"
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
          prop: "materialDescription",
          label: "物料描述"
        },
        {
          prop: "unit",
          label: "计量单位"
        },
        {
          prop: "qty",
          label: "数量"
        },
        {
          prop: "",
          label: "剩余可选数量"
        }
      ];
    }
  },

  watch: {},

  created() {},

  beforeMount() {},

  mounted() {
    this.initQueryForm();

    this.getProductlist();
  }
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
