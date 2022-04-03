<!--
@time:2021/12/1
@author:chenqian
-->
<template>
  <div id="zPage">
    <!-- 按钮 -->
    <div class="z-header">
      <div class="z-header-button">
        <el-button @click="openEdit('add')">新增</el-button>
        <el-button @click="openEdit('edit')">编辑</el-button>
        <el-button class="delButton" @click="operationFun('delete')"
          >删除</el-button
        >
        <el-button @click="operationFun('submit')">提交</el-button>
        <el-button @click="operationFun('withdraw')">撤回</el-button>
        <el-button @click="audit('examine', '12')">审核</el-button>
        <el-button @click="audit('cancelAudit', '123')">反审核</el-button>
        <el-button @click="audit('Push', '123')">下推</el-button>
        <el-button @click="audit('Joint', '123')">联查</el-button>
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
            <!-- <el-button @click="operationFun('print')">打印</el-button> -->
            <el-button @click="operationFun('print')" style="margin-top: -2px;"
              >打印</el-button
            >
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
      :ids=ids
    ></Approval>
    <Push :pushVisible.sync="pushVisible" :pushlText="pushlText"></Push>
  </div>
</template>

<script>
import HeaderSearch from "@/components/CommonHeadSearch/ZSearch";
import commonTable from "@/components/CommonTable";
import {downloadsome} from "@/utils/auth"

import {
  getDataList,
  getDetailList,
  deleteData,
  submitDataList,
  withdrawDataList
} from "@/api/marketOrder/arriveNotice.js";
import { deepCopy } from "@/lib/common";
import orderMixins from "@/lib/orderMixins";
import Approval from "./approval";
import Push from "./Push";
export default {
  name: "",
  components: {
    HeaderSearch,
    commonTable,
    Approval,
    Push
  },
  mixins: [orderMixins],
  data() {
    return {
      approvalVisible: false,
      pushVisible: false,
      approvalText: "审核",
      pushlText: "选择下推方向",
      titletype: "",
      selectRow: {},
      queryForm: {},
      tableColumn: [
        {
          type: "index",
          label: "序号"
        },
        {
          prop: "billNo",
          label: "到货通知单号",
          render: (h, scope) => {
            return h(
              "a",
              {
                style: "color:blue",
                on: { click: () => this.openEdit("details", scope.row) }
              },
              scope.row.billNo
            );
          }
        },
        {
          prop: "arrivalDate",
          label: "具体到货日期"
        },
        {
          prop: "warehouseName",
          label: "到货仓库"
        },
        {
          prop: "checkItemName",
          label: "加工商名称"
        },
        {
          prop: "receiveTypeName",
          label: "收货方式"
        },
        {
          prop: "billStatusName",
          label: "单据状态"
        },
        {
          prop: "remark",
          label: "业务状态"
        },
        {
          prop: "arrivalCompanyName",
          label: "单位名称"
        },
        {
          prop: "checkItemUserName",
          label: "联系人"
        },
        {
          prop: "contactTel",
          label: "联系方式"
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
      ids:[]
    };
  },
  computed: {
    searchArr() {
      return [
        {
          label: "查询方案",
          value: "orderNo",
          optionLabel: "label",
          optionValue: "value",
          type: 2,
          selectOption: [
            {
              label: "草稿",
              value: 0
            },
            {
              label: "审核中",
              value: 1
            },
            {
              label: "已审核",
              value: 2
            }
          ]
        },
        {
          label: "到货通知单号",
          value: "billNo",
          type: 1,
          maxLength: 40
        },
        {
          label: "加工商名称",
          value: "checkItemName",
          type: 1,
          maxLength: 40
        },
        
        {
          label: "创建时间",
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
          billNo: this.queryForm.billNo,
          checkItemName: this.queryForm.checkItemName,
        }
        /* objParams = {
          billNo: "orderNo",
          checkItemName: "customerName"
        };

      Object.keys(objParams).forEach(item => {
        if (
          typeof this.queryForm[objParams[item]] != "undefined" &&
          this.queryForm[objParams[item]] != ""
        ) {
          params[item] = this.queryForm[objParams[item]];
        }
      }); */

      if (Array.isArray(this.queryForm.createDate)) {
        let time = this.queryForm.createDate;

        params.createStartTime =time[0].replace(/-/g, "/") + " 00:00:00";
        params.createEndTime =  time[1].replace(/-/g, "/") + " 23:59:59";
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

          this.tableData = res.data.records;
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
          value: "123345"
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
        print: {
          text: "确认打印选中的数据吗？",
          fun: this.printCommonData
        },
        export: {
          text: "确认导出查询的数据？",
          fun: this.exportCommonData
        },
        copy: {
          text: "确认复制选中数据到新单据？",
          fun: this.copyOrder
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
    
 // 导出操作
    exportCommonData(){
      let params = this.initParams();
      downloadsome(
        '/pd/arrival-notice/export-current-page-data', params, '到货通知模块清单.xls'
      )
    },





    //审核反审核操作
      audit(type, code, val) {
        console.log(type,code,val);
      if (
        !this.checkOperation(
          "examine",
          this.multipleSelection,
          code || "billStatus",
          val
        )
      ) {
        return;
      }
      this.ids = this.multipleSelection
        .map(item => {
          return item.id;
        })
        ;
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
            : type == "finish"
            ? "请填写完成原因"
            : type == "cancelFinish"
            ? "请填写取消完成原因"
            : type == "cancelClose"
            ? "请填写取消关闭原因"
            : "请填写关闭原因";
        this.approvalVisible = true;
      } else {
        this.pushlText = type == "Push" ? "选择下推方向" : "联查";
        this.pushVisible = true;
      }
    },
    //复制订单
    copyOrder() {},
    /**
     * @desc 删除选中数据
     */
    delData() {
      this.loading = true;

      let ids = this.multipleSelection.map(item => {
        return item.id;
      });
      console.log(ids);

      deleteData({
        // idList:ids.toString()
        idList: ids
      })
        .then(res => {
          if (res.code == 0) {
            this.loading = false;
            this.$message.success("删除成功!");
            if (
              this.tableData.length === this.multipleSelection.length &&
              this.pageParams.pageNum !== 1
            ) {
              this.pageParams.pageNum--;
            }
            this.getDataList();
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(error => {
          this.loading = false;
        });
    },
    /**
     * @desc 提交选中数据
     */
    submitData() {
      this.loading = true;
      let ids = this.multipleSelection.map(item => {
        return item.id;
      });

      submitDataList({
        idList: ids
      })
        .then(res => {
          if (res.code == 0) {
            this.loading = false;
            this.$message.success("操作成功!");
            this.getDataList();
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(error => {
          console.group(error);
          this.loading = false;
        });
    },
    /**
     * @desc 提交选中数据
     */
   withdrawData() {
      this.loading = true;
      let ids = this.multipleSelection.map(item => {
        return item.id;
      });
      console.log("12333");
      withdrawDataList({
        idList: ids
      })
        .then(res => {
          if (res.code == 0) {
            this.loading = false;
            this.$message.success("操作成功!");
            this.getDataList();
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(error => {
          console.group(error);
          this.loading = false;
        });
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
