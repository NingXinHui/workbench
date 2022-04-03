<!--
@time:2021/12/1
@author:chenqian
-->
<template>
  <div id="zPage">
    <!-- 按钮 -->
    <div class="z-header">
      <div class="z-header-button">
      <el-button>改价</el-button>
        <!-- <el-button @click="openEdit('add')">改价</el-button> -->
        <el-button @click="openEdit('edit')">编辑</el-button>
        <el-button class="delButton" @click="operationFun('delete')"
          >删除</el-button
        >
        <el-button @click="operationFun('submit')">提交</el-button>
        <el-button @click="operationFun('withdraw')">撤回</el-button>
        <el-button @click="audit('examine', '12')">审核</el-button>
        <el-button @click="pushVisible = true">导入</el-button>
      </div>
    </div>
    <div class="z-content">
      <el-card>
        <!-- 搜索条件 -->
        <header-search
          :searchArr="searchArr"
          @sureSearch="searchMethod"
          :isPrint="true"
          printtype="order_no"
          :selectRow="selectRow"
        >
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
            :isSelectMore="false"
            :loading="loading"
            :pageParams="pageParams"
            @selePage="handleItemSelect"
            @pageChange="pageSizeChange"
          />
        </div>
      </el-card>
    </div>
    <Approval
      :approvalVisible.sync="approvalVisible"
      :approvalText="approvalText"
      :titletype="titletype"
    ></Approval>
    <Import :pushVisible.sync="pushVisible"></Import>
  </div>
</template>

<script>
import HeaderSearch from "@/components/CommonHeadSearch/ZSearch";
import commonTable from "@/components/CommonTable";

import {
  getDataList,
  deleteChangePrice,
  cancelChangePrice,
  submitChangePrice
} from "@/api/marketOrder/purchasePrice.js";
import { deepCopy } from "@/lib/common";
import orderMixins from "@/lib/orderMixins";
import Approval from "./approval";
import Import from "./Import";
export default {
  name: "",
  components: {
    HeaderSearch,
    commonTable,
    Approval,
    Import
  },
  mixins: [orderMixins],
  data() {
    return {
      approvalVisible: false,
      pushVisible: false,
      approvalText: "审核",
      titletype: "",
      selectRow: {},
      queryForm: {},
      tableColumn: [
        {
          prop: "supplierName",
          label: "供应商名称"
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
          prop: "materialLot",
          label: "物料批次"
        },
        {
          prop: "beforeEditPrice",
          label: "修改前价格"
        },
        {
          prop: "useAmount",
          label: "资金使用值"
        },
        {
          prop: "remainingQty",
          label: "修改时剩余量"
        },
        {
          prop: "billStatus",
          label: "状态",
          render: (h,scope) => {
            return h(
              'span',
              {},
              scope.row.billStatus == 0 ? '草稿' : scope.row.billStatus == 1 ? '审核中' :
               scope.row.billStatus == 2 ? '已审核' : ""
            )
          }
        },
        {
          prop: "usable",
          label: "是否生效",
          align:"center",
          render: (h,scope) => {
            return h(
              'el-checkbox',
              {
                props: {
                  value:scope.row.usable,
                  disabled:true
                }
              }
              )
          }
        },
        {
          prop: "effectiveDate",
          label: "生效日期",

        },
        {
          prop: "expirationDate",
          label: "失效日期"
        },
        {
          prop: "purchaseNo",
          label: "采购订单号"
        },
        {
          prop: "buyerName",
          label: "采购员"
        },
        {
          prop: "departmentName",
          label: "采购组"
        },
        {
          prop: "remark",
          label: "备注"
        },
        {
          prop: "updateUserName",
          label: "修改人"
        },
        {
          prop: "updateTime",
          label: "修改时间"
        },
        {
          prop: "createUserName",
          label: "创建人"
        },
        {
          prop: "createTime",
          label: "创建时间"
        }
      ],
      tableData: [],
      loading: false,
      pageParams: {
        pageNum: 1,
        pageSize: 30,
        total: 0
      },
      multipleSelection: [],
      billStatus: 0
    };
  },
  computed: {
    searchArr() {
      return [
        {
          label: "物料编号",
          value: "materialNo",
          type: 1,
          maxLength: 40
        },
        {
          label: "物料名称",
          value: "materialName",
          type: 1,
          maxLength: 40
        },
        {
          label: "物料批次",
          value: "materialLot",
          type: 1,
          maxLength: 40
        },
        {
          label: "状态",
          value: "billStatus",
          optionLabel: "label",
          optionValue: "value",
          type: 2,
          selectOption: [
            {
              label: "草稿",
              value: '0'
            },
            {
              label: "审核中",
              value: '1'
            },
            {
              label: "已审核",
              value: '2'
            }
          ]
        },
        {
          label: "修改日期",
          value: "createDate",
          type: 4,
          rangedesc: "至",
          pickerType: "daterange",
          valueFormat: "yyyy-MM-dd"
        }
      ];
    }
  },
  created() {
    this.pageChange(1);
  },
  methods: {
    /**
     * @desc 条件数据获取
     */
    searchMethod(data) {
      this.queryForm = data;
      this.pageChange(1);
    },
    /**
     * @desc 初始化数据列表接口参数
     */
    initParams() {
      let params = {
          current: this.pageParams.pageNum,
          size: this.pageParams.pageSize,
          billStatus: this.queryForm.billStatus,
          materialNo: this.queryForm.materialNo,
          materialName: this.queryForm.materialName,
          materialLot: this.queryForm.materialLot,
        };
      if (Array.isArray(this.queryForm.createDate)) {
        let time = this.queryForm.createDate;

        params.startDate = time[0];
        params.endDate = time[1];
      }

      return params;
    },
    /**
     * @desc 获取数据列表
     */
    getDataList() {
      this.loading = true;
      let params = this.initParams();
      this.clearSelct();
      getDataList(params)
        .then(res => {
          this.loading = false;

          this.tableData = res.data.records.map(item => {
            return {...item, billStatus:item.billStatus == '草稿' ? '0':item.billStatus == '审核中' ? '1':
            item.billStatus == '已审核' ? '2' : ""}
          });
          this.pageParams.total = res.data.total;
        })
        .catch(error => {
          console.group(error);
          this.tableData = [];
          this.loading = false;
          this.pageParams.total = 0;
        });
    },
    /**
     * @desc 选择复选
     */
    handleItemSelect(val) {
      this.multipleSelection = val;
      this.selectRow = val[0];
    },
    /**
     * @desc 页数发生变化
     */
    pageChange(page) {
      this.pageParams.pageNum = page;
      this.getDataList();
    },
    /**
     * @desc 页面页码页面数字改变
     */
    pageSizeChange(data) {
      this.pageParams.pageNum = data.page;
      this.pageParams.pageSize = data.limit;

      this.getDataList();
    },
    /**
     * @desc 删除选中数据
     */
    operationFun(type) {
      let objText = {
        delete: {
          text: "确认删除选中的数据吗？",
          fun: this.delData,
          check: this.checkOperation,
          key: "billStatus",
          value: "123"
        },
        submit: {
          text: "确认提交选中的数据吗？",
          fun: this.submitData,
          check: this.checkOperation,
          key: "billStatus",
          value: "12345"
        },
        withdraw: {
          text: "确认撤回选中的数据吗？",
          fun: this.withdrawData,
          check: this.checkOperation,
          key: "billStatus",
          value: "0"
        },
        export: {
          text: "确认导出查询的数据？",
          fun: this.exportCommonData
        }
      };

      if (objText[type].check) {
        if (
          !objText[type].check(
            type,
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
    //审核反审核操作
    audit(type, val) {
      if (
        !this.checkOperation(
          "examine",
          this.multipleSelection,
          "billStatus",
          val
        )
      ) {
        return;
      }
      if (
        type == "examine" ||
        type == "cancelAudit" ||
        type == "cancelFinish" ||
        type == "finish" ||
        type == "cancelClose" ||
        type == "close"
      ) {
        this.approvalText =
          type == "examine"
            ? "审核"
            : type == "cancelAudit"
            ? "反审核"
            : "提示";
        this.titletype =
          type == "examine"
            ? "审核原因"
            : type == "cancelAudit"
            ? "审核原因"
            : "";
        this.approvalVisible = true;
      }
    },
    /**
     * @desc 删除选中数据
     */
    delData() {
      this.loading = true;
        deleteChangePrice({
        id:this.multipleSelection[0].id
      }).then(res => {
        if(res.code == 0) {
          this.loading = false
        this.$message.success('删除成功!')
        if (this.tableData.length === this.multipleSelection.length && this.pageParams.pageNum !== 1) {
          this.pageParams.pageNum--
        }
        this.getDataList()
        } else {
          this.$message.error(res.msg);
        }
      })
      .catch((error) => {
        this.loading = false
      })
    },
    /**
     * @desc 提交选中数据
     */
    submitData() {
      this.loading = true;
       submitChangePrice({
       id:this.multipleSelection[0].id
      }).then(res => {
        if(res.code == 0) {
          this.loading = false
          this.$message.success('操作成功!')
         this.getDataList()
        } else {
          this.$message.error(res.msg);
        }
      })
      .catch((error) => {
        console.group(error)
        this.loading = false
      })
    },
    /**
     * @desc 提交选中数据
     */
    withdrawData() {
      this.loading = true;
       cancelChangePrice({
       id:this.multipleSelection[0].id
      }).then(res => {
        if(res.code == 0) {
          this.loading = false
          this.$message.success('操作成功!')
         this.getDataList()
        } else {
          this.$message.error(res.msg);
        }
      })
      .catch((error) => {
        console.group(error)
        this.loading = false
      })
    },
    /**
     * @desc 清空选中数据
     */
    clearSelct() {
      if (this.$refs.mainTable) {
        this.$refs.mainTable.resetSelect();
      }
    },
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
          data.data = deepCopy(this.multipleSelection[0]);
        }
      }
      this.$emit("submit", data);
    }
  },
  mounted() {}
};
</script>

<style scoped></style>
