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
        <el-button @click="copyOrder">复制</el-button>
        <el-button class="delButton" @click="operationFun('delete')"
          >删除</el-button
        >
        <el-button @click="operationFun('submit')">提交</el-button>
        <el-button @click="operationFun('withdraw')">撤回</el-button>
        <el-button @click="audit('examine', '12')">审核</el-button>
        <el-button @click="audit('cancelAudit', '123')">反审核</el-button>
        <el-button @click="audit('Push', '123')">下推</el-button>
        <el-button @click="audit('Joint', '123')">联查</el-button>
        <!-- <el-button @click="operationFun('print')" style="margin-top: -2px;">打印</el-button> -->
        <el-button @click="audit('finish', 'businessStatus', '23')"
          >完成</el-button
        >
        <el-button @click="audit('cancelFinish', 'businessStatus', '013')"
          >取消完成</el-button
        >
        <el-button @click="cancelClose('close', 'businessStatus', '023')"
          >关闭</el-button
        >
        <el-button @click="audit('cancelClose', 'businessStatus', '012')"
          >取消关闭</el-button
        >
        <el-button @click="() => uploadFile()">附件</el-button>
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
            :isSelectMore="true"
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
      :selectRow="selectRow"
      :titletype="titletype"
      :ids="ids"
    ></Approval>
    <Push :pushVisible.sync="pushVisible" :pushlText="pushlText"></Push>
    <div v-if="openmodal">
      <open-modal
        :billId="billId"
        billType="PRODUCT_TASK"
        @closeModal="
          value => {
            this.openmodal = false;
          }
        "
      />
    </div>
  </div>
</template>

<script>
import HeaderSearch from "@/components/CommonHeadSearch/ZSearch";
import commonTable from "@/components/CommonTable";
import OpenModal from "@/components/commonUpload";

import {
  getDataList,
  deleteProduct,
  withdrawData,
  submitData,
  getProduceList,
  getProduceId,
  autoSubmit,
  autoRecover
} from "@/api/marketOrder";
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
    Push,
    OpenModal
  },
  props: {
    currentData: {
      type: Object,
      default: {}
    }
  },
  mixins: [orderMixins],
  data() {
    return {
      billId: "",
      openmodal: false,
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
          label: "生产任务书号",
          width: 160,
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
          prop: "sourceBillNo",
          label: "来源单号"
        },
        {
          prop: "sourceBillType",
          label: "源单类型"
        },
        {
          prop: "productionTypeName",
          label: "生产类型"
        },
        {
          prop: "productionCategoryName",
          label: "生产业务"
        },

        {
          prop: "productionManName",
          label: "生产业务员"
        },
        {
          prop: "productionDepartmentName",
          label: "生产部门"
        },
        {
          prop: "salesManName",
          label: "业务员"
        },
        {
          prop: "salesManDepartmentName",
          label: "业务员部门"
        },
        {
          prop: "companyName",
          label: "公司主体"
        },
        {
          prop: "documentaryFlow",
          label: "跟单流程"
        },
        {
          prop: "businessStatusName",
          label: "业务状态"
        },
        {
          prop: "billStatusName",
          label: "单据状态"
        },
        {
          prop: "deliveryDate",
          label: "生产交期"
        },
        /*   {
          prop: "billStatusName1", //没找到
          label: "附件"
        }, */
        {
          prop: "remark",
          label: "备注"
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
      ids: ""
    };
  },
  computed: {
    searchArr() {
      return [
        {
          label: "查询方案",
          value: "billStatus",
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
          label: "生产任务书号",
          value: "billNo",
          type: 1,
          maxLength: 40
        },
        {
          label: "生产交期",
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
    uploadFile() {
      if (this.multipleSelection.length != 1) {
        this.$message.error("请选择一条操作项");
        return;
      }
      this.billId = this.multipleSelection[0].id;
      this.openmodal = true;
    },

    /**
     * @desc 条件数据获取
     */
    searchMethod(data) {
      console.log(data);
      this.queryForm = data;
      // console.log(this.queryForm.billStatus.value);
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
        billStatus: this.queryForm.billStatus
      };
      /*  objParams = {
        billNo: 'orderNo',
        checkItemName: 'customerName',
      }

      Object.keys(objParams).forEach(item => {
        if(typeof this.queryForm[objParams[item]] != 'undefined' && this.queryForm[objParams[item]] != '') {
          params[item] = this.queryForm[objParams[item]]
        }
      }) */

      if (Array.isArray(this.queryForm.createDate)) {
        let time = this.queryForm.createDate;

        // params.createStartTime = time[0] + " 00:00:00";
        params.createStartTime = time[0];
        params.createEndTime = time[1];
        // params.createEndTime = time[1] + " 23:59:59";
      }

      return params;
    },
    /**
     * @desc 获取数据列表
     */
    getDataList() {
      this.loading = true;
      let params = this.initParams();
      console.log(params);

      this.clearSelct();
      getProduceList(params)
        .then(res => {
          this.loading = false;

          this.tableData = res.data.records;
          console.log(res.data.records);
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
      console.log(val);
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
          text: "确认删除选中的数据？",
          fun: this.delData,
          check: this.checkOperation,
          key: "billStatus",
          value: "123345"
        },
        submit: {
          text: "确认提交选中的数据？",
          fun: this.submitData,
          check: this.checkOperation,
          key: "billStatus",
          value: "12345"
        },
        withdraw: {
          text: "确认撤回选中的数据？",
          fun: this.withdrawData,
          check: this.checkOperation,
          key: "billStatus",
          value: "0"
        },
        print: {
          text: "确认打印选中的数据？",
          check: this.checkOperation,

          fun: this.printCommonData
        },
        export: {
          text: "确认导出查询的数据？",
          check: this.checkOperation,

          fun: this.exportCommonData
        },
        copy: {
          text: "确认复制选中的数据？",
           
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
    //审核反审核操作
    audit(type, code, val) {
    /*   console.log(this.checkOperation);
      console.log(type, code, val); */
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
        .toString();
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

    // 取消关闭
    cancelClose() {
      if (!this.multipleSelection.length) {
        this.$message.error("请选择操作项");
        return;
      }
      let flag = this.multipleSelection.every(item => {
        return item.businessStatus != 2 && item.businessStatus != 3;
      });
      console.log(flag);
      if (flag) {
        this.ids = this.multipleSelection
          .map(item => {
            return item.id;
          })
          .toString();
        this.approvalText = "提示";
        this.titletype = "请填写关闭原因";
        this.approvalVisible = true;
      } else {
        this.$message.error("当前操作项不能操作");
      }
    },
   
   //复制订单
    copyOrder() {
      if(this.multipleSelection.length&&this.multipleSelection.length==1) {
          this.$confirm("确认复制选中数据到新单据？", "", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
      .then(() => {
        console.log(this.multipleSelection);
        
        this.$emit('submit', {
          type:"copy",
          data:this.multipleSelection[0]
        })
      })
      .catch(() => {
      });
      } else {
        this.$message.error("请勾选一条操作项")
      }
    },
    /**
     * @desc 删除选中数据
     */
    delData() {
      this.loading = true;
      /* let ids = [];

      this.multipleSelection.forEach(item => {
        ids += item.id + ",";
        // ids.push(item.id)
      });

      if (ids.length > 0) {
        ids = ids.slice(0, -1);
      }
      console.log(ids); */
      let ids = this.multipleSelection.map(item => {
        return item.id;
      });
      /* let params = {
        ids
      }; */

      deleteProduct({ ids: ids.toString() })
        .then(res => {
          this.loading = false;
          this.$message.success("删除成功!");

          if (
            this.tableData.length === this.multipleSelection.length &&
            this.pageParams.pageNum !== 1
          ) {
            this.pageParams.pageNum--;
          }

          this.getDataList();
        })
        .catch(error => {
          console.group(error);
          this.loading = false;
        });
    },
    /**
     * @desc 提交选中数据
     */
    submitData() {
      this.loading = true;
      let id = [];

      this.multipleSelection.forEach(item => {
        id += item.id + ",";
      });

      if (id.length > 0) {
        id = id.slice(0, -1);
      }
      let params = {
        ids: this.multipleSelection
          .map(item => {
            return item.id;
          })
          .toString()
      };

      autoSubmit(params)
        .then(res => {
          this.loading = false;
          this.$message.success("操作成功!");

          this.getDataList();
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
      let id = [];

      this.multipleSelection.forEach(item => {
        id += item.id + ",";
      });

      if (id.length > 0) {
        id = id.slice(0, -1);
      }
      let params = {
        ids: this.multipleSelection
          .map(item => {
            return item.id;
          })
          .toString()
      };

      autoRecover(params)
        .then(res => {
          this.loading = false;
          this.$message.success("操作成功!");

          this.getDataList();
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
      if (type === "edit" && this.multipleSelection.length != 1) {
        this.$message.error("请勾选一条数据进行编辑");
        return;
      }
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
  mounted() {
    console.log(this.currentData);
  }
};
</script>

<style scoped></style>
