<!--
@time:2021/12/1
@author:chenqian
-->
<template>
  <div class="popBox">
    <el-dialog :title="billCodeText"
               :visible="visible"
               @close="close"
               :close-on-click-modal="false">
      <div class="content">
        <div class="form">
          <form-list v-model="queryForm"
                     :formConfig="formConfig"
                     class="form form-order-box"></form-list>
        </div>
        <div v-if="isEdit"
             class="z-details-btn">
          <el-button size="mini"
                     plain
                     @click="addDetails">新增</el-button>
          <el-button size="mini"
                     plain
                     class="delButton"
                     @click="deleteDetails">删除</el-button>
        </div>
        <div class="z-content-table">
          <common-table :class="{ zTable: isEdit }"
                        ref="mainTable"
                        :isSelectMore="true"
                        :isSelection="true"
                        :tableColumn="tableColumn"
                        :tableData="tableData"
                        @selePage="handleSelectionChange"
                        :tableheight="250"
                        :isMain="true"></common-table>
        </div>
      </div>
      <div slot="footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary"
                   @click="submit">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import formList from "@/components/Form/formList";
import commonTable from "@/components/CommonTable";
import { checkFormData } from "@/lib/common";


import { addStockTypeApi, deleteStockTypeApi, searchStockTypeApi, searchStockTypeListApi, stockTypeUpdateApi } from "@/api/wareManagementApi/stockType";




export default {
  name: "add",
  components: { formList, commonTable },

  mixins: [],

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    billCodeText: {
      type: String,
      default: ""
    },
    detail: {
      type: Object,
      default: {}
    }
  },

  data () {
    return {
      subDetails: [], //新增子表明细
      multipleSelection: [], //当前选中数据
      queryForm: {},
      isEdit: true,
      salesmanListList: [],
      basic: {
        orderTypeNo3: '入库',
        billNo: "",
      },
      tableData: [],
      selectList: [],
      customerType: [
        {
          label: "客户",
          value: "1"
        },
        {
          label: "供应商",
          value: "2"
        },
        {
          label: "货代公司",
          value: "3"
        },
        {
          label: "运输单位",
          value: "4"
        },
        {
          label: "融资单位",
          value: "5"
        },
        {
          label: "财务客商",
          value: "6"
        },
        {
          label: "快递公司",
          value: "7"
        }
      ],
    };
  },
  methods: {
    //表格勾选事件
    handleSelectionChange (val) {
      console.log('我是val', val)
      this.selectList = val;
    },
    //新增一条表格数据
    addDetails () {
      let obj = {};
      this.tableData.push(obj);
    },
    //复制一条表格数据
    copyDetails () {
      if (!this.selectList.length) {
        this.$message.error("请勾选操作数据");
        return;
      }
      this.tableData = [...this.tableData, ...this.selectList];
      this.$refs.mainTable.$refs.multipleTable.clearSelection();
    },
    //删除一条表格数据
    deleteDetails () {
      console.log('我是', this.selectList)
      // 删除校验,是否选择一行
      if (this.selectList.length < 1) {
        this.$message.error("请选择操作项");
        return;
      }
      // 进行删除
      // this.tableData.splice(0,1)
      // this.selectList

    },
    //点击保存
    submit () {
      // if (!checkFormData(this.formConfig.formItemList, this.queryForm)) {
      //   return;
      // }
      if (this.billCodeText == "编辑类型") {
        this.tableData = this.tableData.map((item) => {
          return Object.assign(item, {
            usable: !!item.usable ? 1 : 0
          })
        })
        this.queryForm.subDetails = this.tableData
        let params = {
          id: 0,
          billNo: this.queryForm.billNo,
          checkItemType: this.queryForm.checkItemType, //客商类型 传的是1 2 3 4
          inOutType: this.queryForm.inOutType, //出入库参数 1出2入
          inOutTypeDetailList: this.queryForm.subDetails, // 子表明细
          name: this.queryForm.name,
          remark: this.queryForm.remark,
          updateUser: 7,
          usable: 1,
          updateTime: "2020-01-12 10:23:32",
          createUser: '11',
          createTime: "2020-01-12 11:23:32"
        }
        stockTypeUpdateApi(params).then((res) => {
          if (res.success) {
            this.$message.success('修改成功!')
            this.close()
          }
        }).catch(() => {

        })
      } else if (this.billCodeText == "新增类型") {
        this.tableData = this.tableData.map((item) => {
          return Object.assign(item, {
            usable: !!item.usable ? 1 : 0
          })
        })
        this.queryForm.subDetails = this.tableData
        let params = {
          billNo: this.queryForm.billNo,
          checkItemType: this.queryForm.checkItemType, //客商类型 传的是1 2 3 4
          inOutType: this.queryForm.inOutType, //出入库参数 1出2入
          inOutTypeDetailList: this.queryForm.subDetails, // 子表明细
          name: this.queryForm.name,
          remark: this.queryForm.remark,
          updateUser: 7,
          usable: 1,
          updateTime: "2020-01-12 10:23:32",
          createUser: '11',
          createTime: "2020-01-12 11:23:32"
        }
        addStockTypeApi(params).then((res) => {
          if (res.success) {
            this.$message.success('添加成功!')
            this.close()
          }
        }).catch(() => {

        })
      }




    },
    //关闭弹窗
    close () {
      this.$emit("update:visible", false);
    },
    //初始化页面参数
    initQueryForm (data = {}) {
      let basic = this.basic;
      this.queryForm = {
        ...basic,
        ...data
      };
    }
  },
  computed: {
    formConfig () {
      let isEdit = !this.isEdit;
      let formItemList = [
        {
          key: "billNo",
          type: "input",
          subtype: "text",
          label: "类型编码",
          isEdit,
          placeholder: "请输入",
          rules: {
            required: true,
            trigger: "change"
          }
        },
        {
          key: isEdit ? "inOutType" : "inOutType",
          type: isEdit ? "input" : "select",
          subtype: "text",
          label: "出/入",
          isEdit,
          options: [{
            label: "出库",
            value: "1"
          }, {
            label: "入库",
            value: "2"
          }],
          optionLabel: "label",
          optionValue: "value",
          rules: {
            required: true,
            trigger: "blur"
          }
        },
        {
          key: "name",
          type: "input",
          subtype: "text",
          label: "类型名称",
          isEdit,
          placeholder: "请输入",
          maxlength: 200,
          rules: {
            required: true,
            trigger: "change"
          }
        },
        {
          key: isEdit ? "checkItemType" : "checkItemType",
          type: isEdit ? "input" : "select",
          subtype: "text",
          label: "客商名称",
          isEdit,
          options: this.customerType, //后端说暂时写死
          optionLabel: "label",
          optionValue: "value",
          rules: {
            required: true,
            trigger: "blur"
          }
        }, {
          key: "remark",
          type: "input",
          subtype: "textarea",
          label: "备注",
          isEdit,
          placeholder: "请输入",
          maxlength: 200,
        },
      ];

      return {
        inline: true,
        size: "mini",
        labelWidth: "70px !important",
        formItemList: formItemList
      };
    },
    tableColumn () {
      let isEdit = this.isEdit;
      if (this.queryForm.orderTypeNo3 == "入库") {
        return [
          {
            label: "序号",
            type: "index",
            align: "center"
          },
          {
            label: "小类名称",
            prop: "subTypeName",
            isEdit: isEdit,
            config: {
              key: "subTypeName",
              type: "input",
              subtype: "text",
              placeholder: "请输入"
            }
          },
          {
            label: "小类编码",
            prop: "subTypeNo",
            align: "right",
            isEdit: isEdit,
            width: 70,
            config: {
              key: "width",
              type: "input",
              subtype: "text",
              placeholder: " "
            }
          },
          {
            label: "编号前缀",
            prop: "prefixNo",
            align: "right",
            isEdit: isEdit,
            config: {
              key: "width",
              type: "input",
              subtype: "text",
              placeholder: " "
            }
          }, {
            label: "库存性质",
            prop: "width",
            align: "right",
            isEdit: isEdit,
            config: {
              key: isEdit ? "orderTypeName4" : "orderTypeNo4",
              type: isEdit ? "select" : "input",
              subtype: "text",
              options: [],
              optionLabel: "label",
              optionValue: "value",
            }
          },
          {
            label: "备注",
            prop: "remark",
            width: 70,
            align: "right",
            isEdit: isEdit,
            config: {
              key: "width",
              type: "input",
              subtype: "text",
              placeholder: " "
            }
          },
          {
            label: "是否可用",
            prop: "usable",
            align: "center",
            width: 70,
            isEdit: isEdit,
            config: {
              key: "usable",
              type: "checkbox",
              subtype: "text",
              placeholder: " "
            }
          }
        ];
      } else {
        return [
          {
            label: "序号",
            type: "index",
            align: "center"
          },
          {
            label: "小类名称",
            prop: "subTypeName",
            isEdit: isEdit,
            config: {
              key: "subTypeName",
              type: "input",
              subtype: "text",
              placeholder: "请输入"
            }
          },
          {
            label: "小类编码",
            prop: "subTypeNo",
            align: "right",
            isEdit: isEdit,
            width: 70,
            config: {
              key: "subTypeNo",
              type: "input",
              subtype: "text",
              placeholder: " "
            }
          },
          {
            label: "编号前缀",
            prop: "prefixNo",
            align: "right",
            isEdit: isEdit,
            config: {
              key: "prefixNo",
              type: "input",
              subtype: "text",
              placeholder: " "
            }
          },
          {
            label: "备注",
            prop: "remark",
            width: 70,
            align: "right",
            isEdit: isEdit,
            config: {
              key: "remark",
              type: "input",
              subtype: "text",
              placeholder: " "
            }
          },
          {
            label: "是否可用",
            prop: "usable",
            align: "center",
            width: 70,
            isEdit: isEdit,
            config: {
              key: "usable",
              type: "checkbox",
              subtype: "text",
              placeholder: " "
            }
          }
        ]
      }

    }
  },

  watch: {},

  created () { },

  beforeMount () { },

  mounted () {
    console.log('我是编辑', this.detail)
    if (this.billCodeText == "查看类型") {
      this.isEdit = false;
    }
    if (this.billCodeText == "编辑类型") {
      this.initQueryForm(this.detail);

      let items = this.detail.inOutTypeDetailList.map((item, v) => {
        items = {


        }
        this.tableData.push(items)
      })

    }
  }
};
</script>

<style lang="scss" scoped>
.popBox {
  ::v-deep .el-dialog {
    overflow-y: auto;
    width: 565px !important;
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
