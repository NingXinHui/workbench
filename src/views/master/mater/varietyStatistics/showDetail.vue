<template>
  <div id="zPage">
    <div class="z-header">
      <div class="z-header-button">
        <el-button @click="reset()">返回</el-button>
        <el-button @click="submit()">提交</el-button>
      </div>
    </div>

    <div>
      <div class="z-content"
           v-loading="loading">
        <el-card class="z-details-box">
          <div class="z-details-content">
            <div class="z-details-icon">
              <span @click="isCancel('basicShow', !basicShow)">
                <i :class="
                    basicShow ? 'el-icon-caret-bottom' : 'el-icon-caret-right'
                  "></i>
                基本信息
              </span>
            </div>
            <div :class="[
                'setmorelabel',
                'z-details-content-box',
                basicShow ? '' : 'details-height-none',
              ]">
              <div style="padding-left: 24px">
                <form-list v-model="queryForm"
                           :formConfig="formMain"
                           class="form form-order-box"></form-list>
                <div v-if="downLoadUrl">
                  <span>附件：</span>
                  <span>
                    <a @click="() => uploadFileShow()">文件名称</a>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="z-details-content">
            <div class="z-details-icon">
              <span @click="isCancel('detailsShow', !detailsShow)">
                <i :class="
                    detailsShow ? 'el-icon-caret-bottom' : 'el-icon-caret-right'
                  "></i>
                明细信息
              </span>
            </div>
            <div :class="[
                'z-details-content-box',
                detailsShow ? '' : 'details-height-none',
              ]">
              <div class="z-content-table">
                <common-table ref="mainTable"
                              :isMain="true"
                              :tableColumn="tableColumn"
                              :tableData="tableData" />
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>
<script>
import commonTable from "@/components/CommonTable";

import formList from "@/components/Form/formList";

import { listAllHdrWithDtl, updateBillStatusWhenVerify } from "@/api/apizhu";

export default {
  components: { commonTable, formList },
  name: "index",
  props: {
    seleItemDetail: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },

  computed: {
    formMain () {
      let isEdit = true;
      let formItemList = [
        {
          key: "billNo",
          type: "input",
          subtype: "text",
          label: "调价单号",
          isEdit,
        },
        {
          key: "applicantName",
          type: "input",
          subtype: "text",
          label: "申请人",
          isEdit,
        },
        {
          key: "departmentName",
          type: "input",
          subtype: "text",
          label: "申请部门",
          isEdit,
        },
        {
          key: "effectiveDate",
          type: "input",
          subtype: "text",
          label: "生效日期",
          isEdit,
        },
        {
          key: "expirationDate",
          type: "input",
          subtype: "text",
          label: "失效日期",
          isEdit,
        },
        {
          key: "billStatusShow",
          type: "input",
          subtype: "text",
          label: "单据状态",
          isEdit,
        },
        {
          key: "changePersonPrice",
          type: "input",
          subtype: "text",
          label: "批量调价规则",
          isEdit,
        },

        {
          key: "reason",
          type: "input",
          subtype: "textarea",
          label: "申请原因",
          isEdit,
          attrs: {
            rows: 2,
          },
        },
      ];
      if (!this.queryForm.changePriceMethod) {
        formItemList.splice(6, 1);
      }
      return {
        inline: true,
        labelWidth: "auto",
        size: "mini",
        formItemList,
      };
    },
    tableColumn () {
      let isEdit = false;

      return [
        {
          label: "序号",
          type: "index",
        },

        {
          label: "物料编号",
          prop: "materialNo",
          width: 120,
        },
        {
          label: "物料名称",
          prop: "materialName",
          width: 160,
        },
        {
          label: "物料描述",
          prop: "materialDescription",
          width: 240,
        },
        {
          label: "计量单位",
          prop: "unitName",
          align: "center",
          width: 120,
        },
        {
          label: "产品形态",
          prop: "productForm",
          align: "center",
          width: 120,
          render: (h, scope) => {
            let obj = {
              1: "大货",

              2: "样卡",
            };
            return h("span", {}, obj[scope.row.productForm]);
          },
        },
        // {
        //   label: "规格",
        //   prop: "specification",
        //   align: "right",
        //   width: 120,
        // },
        {
          label: "币种",
          prop: "currency",
          align: "right",
          width: 120,
        },
        {
          label: "当前价格",
          prop: "currentPrice",
          width: 120,
        },
        {
          label: "新价格",
          prop: "newPrice",
          width: 120,
        },
        {
          label: "",
          prop: "",
        },
      ];
    },
  },

  data () {
    return {
      basicShow: true,
      detailsShow: true,
      loading: true,
      downLoadUrl: "", //下载链接
      queryForm: {},
      tableData: [],

      billStatus: 0,
    };
  },
  mounted () {
    this.loading = false;
    console.log(this.seleItemDetail);
    this.billStatus = this.seleItemDetail.billStatus;
    console.log('看到你')
    listAllHdrWithDtl({ hdrId: this.seleItemDetail.id }).then((res) => {
      this.tableData = res.data.records;

      let obj = {
        0: "草稿",
        1: "审核中",
        2: "已审核",
      };
      let objprice = {
        1: "百分比",
        2: "加减数",
        3: "新价格",
      };

      let {
        billNo = "",
        applicantName = "",
        departmentName = "",
        effectiveDate = "",
        expirationDate,
        reason = "暂未填写",
        billStatus,
        changePriceMethod,
        changePriceValue,
        fileUrl,
      } = res.data.records[0];

      this.queryForm = {
        billNo,
        applicantName,
        departmentName,
        effectiveDate: effectiveDate.split(' ')[0],
        expirationDate: expirationDate.split(' ')[0],
        reason,
        billStatusShow: obj[billStatus],
        changePersonPrice: `按${
          objprice[changePriceMethod]
          }调价，调价${changePriceValue} ${changePriceMethod == "1" ? "%" : ""} `,
        changePriceMethod,
      };
      this.downLoadUrl = fileUrl; //下载的连接
    });
  },
  methods: {


    // 点击提交的按钮
    submit () {
      if (this.billStatus != 0) {
        return this.$message.error('只有草稿状态的可以提交')
      }
      updateBillStatusWhenVerify({ id: this.seleItemDetail.id, billStatus: 1, remark: '提交' }).then(res => {
        if (res.success) {
          this.$message.success('提交成功');
          this.billStatus = 1
        }
      })

    },


    uploadFileShow () {
      var a = document.createElement("a");
      a.href = this.downLoadUrl; // 文件流生成的url
      //   a.download = filename; // 文件名
      document.body.appendChild(a);
      a.click();
      a.remove();
    },
    reset () {
      this.$emit("resetParent");
    },
    isCancel (key, bool) {
      this[key] = bool;
    },
  },
};
</script>
<style lang="less" scoped>
.setmorelabel {
  /deep/ .form-label-box {
    white-space: nowrap !important;

    text-overflow: ellipsis !important;
    overflow: hidden !important;
  }
}
</style>


