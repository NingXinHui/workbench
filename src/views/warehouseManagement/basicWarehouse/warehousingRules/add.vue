<!--
@time:2021/12/1
@author:chenqian
-->
<template>
  <div class="popBox">
    <el-dialog
      :title="billCodeText"
      :visible="visible"
      @close="close"
      :close-on-click-modal="false"
      :modal="lookvisible ? false : true"
    >
      <div class="content">
        <div class="form">
          <form-list
            v-model="queryForm"
            :formConfig="formConfig"
            class="form form-order-box"
          >
            <div v-if="queryForm.ruleType == '1'">
              <el-form-item label="装车费" class="item">
                <el-input
                  v-if="isEdit"
                  v-model="queryForm.loadFeeKg"
                  placeholder=""
                  onkeyup="if(!/^[0-9]+(\.[0-9]{0,2})?$/g.test(this.value)){this.value=''}"
                ></el-input>
                <span v-else>{{ queryForm.loadFeeKg }}</span>
                <span>元/千克</span>
              </el-form-item>
              <el-form-item label="卸车费" class="item">
                <el-input
                  v-if="isEdit"
                  v-model="queryForm.unloadFeeKg"
                  placeholder=""
                  onkeyup="if(!/^[0-9]+(\.[0-9]{0,2})?$/g.test(this.value)){this.value=''}"
                ></el-input>
                <span v-else>{{ queryForm.unloadFeeKg }}</span>
                <span>元/千克</span>
              </el-form-item>
            </div>
            <div v-else>
              <el-form-item label="装车费" class="item">
                <el-input
                  v-if="isEdit"
                  v-model="queryForm.loadFeeM"
                  placeholder="请输入"
                  onkeyup="if(!/^[0-9]+(\.[0-9]{0,2})?$/g.test(this.value)){this.value=''}"
                ></el-input>
                <span v-else>{{ queryForm.loadFeeM }}</span>
                <span>元/米</span>
                <el-input
                  v-if="isEdit"
                  v-model="queryForm.loadFeeKg"
                  placeholder="请输入"
                  onkeyup="if(!/^[0-9]+(\.[0-9]{0,2})?$/g.test(this.value)){this.value=''}"
                ></el-input>
                <span v-else>{{ queryForm.loadFeeKg }}</span>
                <span>元/千克</span>
              </el-form-item>
              <el-form-item label="卸车费" class="item">
                <el-input
                  v-if="isEdit"
                  v-model="queryForm.unloadFeeM"
                  placeholder="请输入"
                  onkeyup="if(!/^[0-9]+(\.[0-9]{0,2})?$/g.test(this.value)){this.value=''}"
                ></el-input>
                <span v-else>{{ queryForm.unloadFeeM }}</span>
                <span>元/米</span>
                <el-input
                  v-if="isEdit"
                  v-model="queryForm.unloadFeeKg"
                  placeholder="请输入"
                  onkeyup="if(!/^[0-9]+(\.[0-9]{0,2})?$/g.test(this.value)){this.value=''}"
                ></el-input>
                <span v-else>{{ queryForm.unloadFeeKg }}</span>
                <span>元/千克</span>
              </el-form-item>
            </div>
          </form-list>
        </div>
        <div v-if="isEdit" class="z-details-btn">
          <span>仓储费</span>
          <el-button size="mini" plain @click="addleftDetails">新增</el-button>
          <el-button size="mini" plain class="delButton" @click="delleftDetails"
            >删除</el-button
          >
        </div>
        <div class="z-content-table">
          <common-table
            :class="{ zTable: isEdit }"
            ref="mainTable"
            :isSelectMore="true"
            :isSelection="true"
            :tableColumn="tableColumn"
            :tableData="leftTableData"
            @selePage="handleSelectionChange"
            :tableheight="250"
            :isMain="true"
          ></common-table>
        </div>
      </div>
      <div slot="footer" v-if="billCodeText != '查看规则'">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="submit">确认</el-button>
      </div>
      <div slot="footer" v-if="billCodeText == '查看规则'">
        <el-button type="primary" @click="edit">编辑</el-button>
        <el-button @click="close">关闭</el-button>
      </div>
    </el-dialog>
    <look-up
      ref="lookup"
      v-if="lookvisible"
      :title="look.title"
      :isSelectMore="false"
      :visible.sync="lookvisible"
      @setCheckItem="setCheckItem"
      :method="look.method"
      :table-column="look.tableColumn"
      :search-arr="look.searchArr"
      :params="look.params"
    ></look-up>
  </div>
</template>

<script>
import formList from "@/components/Form/formList";
import commonTable from "@/components/CommonTable";
import { checkFormData } from "@/lib/common";
import lookUp from "@/components/ZLookUp/lookUpImport"; //lookup统一弹窗
import { searchCustomer } from "@/api/sale/order";
import { storeWarehouseApi } from "@/api/wareManagementApi/permissionMaintenance";
import {
  addStoreFeeRule,
  updateStoreFeeRule,
  getStoreFeeRuleDetail
} from "@/api/wareManagementApi/warehousingRules";
export default {
  name: "add",
  components: { formList, commonTable, lookUp },

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

  data() {
    return {
      lookvisible: false,
      look: {
        method: searchCustomer,
        title: "查询选择(客商)",
        params: {
          // checkItemType: "1"
        },
        searchArr: [
          {
            label: "客商编号",
            field: "checkItemNo",
            type: 1,
            maxLength: "60"
          },
          {
            label: "客商名称",
            field: "checkItemName",
            type: 1,
            maxLength: "60"
          }
        ],
        tableColumn: [
          {
            label: "序号",
            type: "index",
            maxLength: "20"
          },
          {
            label: "客商编号",
            prop: "checkItemNo"
          },
          {
            label: "客商名称",
            prop: "checkItemName"
          },
          {
            label: "客商类型",
            prop: "checkItemTypeName"
          },
          {
            label: "业务员",
            prop: "userName"
          },
          {
            label: "业务组",
            prop: "departmentName"
          }
        ]
      },
      queryForm: {},
      activeName: "first",
      isEdit: true,
      salesmanListList: [],
      leftTableData: [],
      selectList: [],
      warhouseList: []
    };
  },
  methods: {
    //编辑事件
    edit() {
      this.$parent.billCodeText = "编辑规则";
      this.isEdit = !this.isEdit;
    },
    //获取详情
    init() {
      getStoreFeeRuleDetail({
        id: this.detail.id
      }).then(res => {
        if (res.code == 0) {
          res.data.inventoryNature = String(res.data.inventoryNature);
          res.data.ruleType = String(res.data.ruleType);
          this.initQueryForm(res.data);
          this.leftTableData = res.data.list;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //查询所有的仓库
    storeWarehouseApi() {
      storeWarehouseApi({
        current: 1,
        size: 50
      }).then(res => {
        if (res.code == 0) {
          this.warhouseList = res.data.records;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //lookup勾选事件
    setCheckItem(val) {
      if (!val) {
        return;
      }
      if (Array.isArray(val)) {
        this.queryForm.checkItemId = val[0].id;
        this.queryForm.checkItemName = val[0].checkItemName;
      } else {
        this.queryForm.checkItemId = val.id;
        this.queryForm.checkItemName = val.checkItemName;
      }
    },
    //表格勾选事件
    handleSelectionChange(val) {
      this.selectList = val;
    },
    //新增一条表格数据
    addleftDetails() {
      let obj = {
        amountInterest: "",
        endDay: "",
        startDay: "",
        unitKg: "",
        unitM: "",
        isIndex: this.leftTableData.length
      };
      this.leftTableData.push(obj);
    },
    //删除一条表格数据
    delleftDetails() {
      if (!this.selectList.length) {
        this.$message.error("请勾选数据");
        return;
      }
      this.selectList.forEach(item => {
        const index = this.leftTableData.findIndex(i => {
          return i.isIndex == item.isIndex;
        });
        if (index > -1) {
          this.leftTableData.splice(index, 1);
        }
      });
    },
    //点击保存
    submit() {
      if (!checkFormData(this.formConfig.formItemList, this.queryForm)) {
        return;
      }
      if (!this.leftTableData.length) {
        this.$message.error("请添加仓储费明细");
        return;
      }
      if (this.billCodeText == "新增规则") {
        addStoreFeeRule({
          ...this.queryForm,
          list: this.leftTableData.map((item, i) => {
            return { ...item, orderNumber: i };
          })
        }).then(res => {
          if (res.success) {
            this.$message.success("新增成功");
            this.$emit("update:visible", false);
            this.$parent.getDataList();
          } else {
            this.$$message.error(res.msg);
          }
        });
      } else {
        updateStoreFeeRule({
          ...this.queryForm,
          list: this.leftTableData.map((item, i) => {
            return { ...item, orderNumber: i };
          })
        }).then(res => {
          if (res.success) {
            this.$message.success("修改成功");
            this.$emit("update:visible", false);
            this.$parent.getDataList();
          } else {
            this.$$message.error(res.msg);
          }
        });
      }
    },
    //关闭弹窗
    close() {
      this.$emit("update:visible", false);
    },
    //初始化页面参数
    initQueryForm(data = {}) {
      this.queryForm = {
        checkItemId: "",
        checkItemName: "",
        inventoryNature: "",
        list: [],
        loadFeeKg: "",
        loadFeeM: "",
        remark: "",
        ruleName: "",
        ruleType: "1",
        unloadFeeKg: "",
        unloadFeeM: "",
        usable: true,
        warehouseId: "",
        ...data
      };
    }
  },
  computed: {
    formConfig() {
      let isEdit = !this.isEdit;
      let formItemList = [
        {
          key: "ruleName",
          type: "input",
          subtype: "text",
          label: "规则名称",
          show: true,
          isEdit,
          placeholder: "请输入",
          maxlength: 40,
          rules: {
            required: true,
            trigger: "blur"
          }
        },
        {
          key: isEdit ? "ruleTypeName" : "ruleType",
          type: isEdit ? "input" : "select",
          subtype: "text",
          label: "规则类型",
          show: true,
          isEdit,
          options: [
            {
              label: "内部仓储费规则",
              value: "1"
            },
            {
              label: "外部仓储费规则",
              value: "2"
            }
          ],
          optionLabel: "label",
          optionValue: "value",
          rules: {
            required: true,
            trigger: "blur"
          }
        },
        {
          key: isEdit ? "inventoryNatureName" : "inventoryNature",
          type: isEdit ? "input" : "select",
          subtype: "text",
          label: "库存性质",
          isEdit,
          show: this.queryForm.ruleType == "1",
          options: [
            {
              label: "代储",
              value: "6"
            },
            {
              label: "代销",
              value: "2"
            },
            {
              label: "自有",
              value: "1"
            }
          ],
          optionLabel: "label",
          optionValue: "value",
          rules: {
            required: true,
            trigger: "blur"
          }
        },
        {
          key: isEdit ? "warehouseName" : "warehouseId",
          type: isEdit ? "input" : "select",
          subtype: "text",
          label: "仓库名称",
          isEdit,
          options: this.warhouseList,
          show: this.queryForm.ruleType == "2",
          optionLabel: "warehouseName",
          optionValue: "id",
          rules: {
            required: true,
            trigger: "blur"
          }
        },
        {
          key: "checkItemName",
          type: "input",
          subtype: "text",
          label: "客商名称",
          isEdit,
          show: true,
          placeholder: "请选择",
          maxlength: 40,
          attrs: {
            readonly: true,
            suffixIcon: "el-icon-arrow-down"
          },
          listeners: {
            focus: () => (this.lookvisible = true)
          },
          rules: {
            required: true,
            trigger: "blur"
          }
        },
        {
          key: "usable",
          type: "checkbox",
          subtype: "text",
          show: true,
          label: "是否可用",
          disabled: isEdit,
          isEdit,
          placeholder: ""
        },
        {
          key: "remark",
          type: "input",
          subtype: "textarea",
          label: "描述",
          show: true,
          isEdit,
          placeholder: "请输入",
          maxlength: 200
        }
      ];
      let arr = [];
      formItemList.forEach(item => {
        if (item.show) {
          arr.push(item);
        }
      });
      return {
        inline: true,
        size: "mini",
        labelWidth: "70px !important",
        formItemList: arr
      };
    },
    tableColumn() {
      let isEdit = this.isEdit;
      if (this.queryForm.ruleType == "1") {
        return [
          {
            label: "序号",
            type: "index",
            align: "left"
          },
          {
            label: "天数起",
            prop: "startDay",
            isEdit: isEdit,
            config: {
              key: "startDay",
              type: "input",
              subtype: "text",
              attrs: {
                onkeyup:
                  "if(!/^[0-9]+(.[0-9]{0,2})?$/g.test(this.value)){this.value=''}"
              },
              listeners: {
                blur: e => {
                 const index = e.target.parentNode.parentNode.parentNode.getAttribute("index")
                  if(this.leftTableData[index].endDay&&Number(this.leftTableData[index].startDay)> Number(this.leftTableData[index].endDay)) {
                    this.$message.error("天数止不能小于天数起");
                    this.leftTableData[index].startDay = Number(this.leftTableData[index].endDay) - 1;
                  }
                }
              },
              subtype: "text",
              placeholder: "请输入"
            }
          },
          {
            label: "天数止",
            prop: "endDay",
            align: "right",
            isEdit: isEdit,
            config: {
              key: "endDay",
              type: "input",
              subtype: "text",
              attrs: {
                onkeyup:
                  "if(!/^[0-9]+(.[0-9]{0,2})?$/g.test(this.value)){this.value=''}"
              },
              listeners: {
                blur: e => {
                  const index = e.target.parentNode.parentNode.parentNode.getAttribute("index")
                  if(this.leftTableData[index].startDay&&Number(this.leftTableData[index].startDay)> Number(this.leftTableData[index].endDay)) {
                    this.$message.error("天数止不能小于天数起");
                    this.leftTableData[index].endDay = Number(this.leftTableData[index].startDay) + 1;
                  }
                }
              },
              placeholder: " "
            }
          },
          {
            label: "元/千克/天",
            prop: "unitKg",
            align: "right",
            isEdit: isEdit,
            config: {
              key: "unitKg",
              type: "number",
              min: 1,
              max: 99999,
              precision: 2,
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
            label: "天数起",
            prop: "startDay",
            isEdit: isEdit,
            config: {
              key: "startDay",
              type: "input",
              subtype: "text",
              attrs: {
                onkeyup:
                  "if(!/^[0-9]+(.[0-9]{0,2})?$/g.test(this.value)){this.value=''}"
              },
              listeners: {
                blur: e => {
                   const index = e.target.parentNode.parentNode.parentNode.getAttribute("index")
                  if(this.leftTableData[index].endDay&&Number(this.leftTableData[index].startDay)> Number(this.leftTableData[index].endDay)) {
                    this.$message.error("天数止不能小于天数起");
                    this.leftTableData[index].startDay = Number(this.leftTableData[index].endDay) - 1;
                  }
                }
              },
              placeholder: "请输入"
            }
          },
          {
            label: "天数止",
            prop: "endDay",
            align: "right",
            isEdit: isEdit,
            config: {
              key: "endDay",
              type: "input",
              attrs: {
                onkeyup:
                  "if(!/^[0-9]+(.[0-9]{0,2})?$/g.test(this.value)){this.value=''}"
              },
              listeners: {
                blur: e => {
                   const index = e.target.parentNode.parentNode.parentNode.getAttribute("index")
                  if(this.leftTableData[index].startDay&&Number(this.leftTableData[index].startDay)> Number(this.leftTableData[index].endDay)) {
                    this.$message.error("天数止不能小于天数起");
                    this.leftTableData[index].endDay = Number(this.leftTableData[index].startDay) + 1;
                  }
                }
              },
              subtype: "text",
              placeholder: " "
            }
          },
          {
            label: "元/米/天",
            prop: "unitM",
            align: "right",
            isEdit: isEdit,
            config: {
              key: "unitM",
              type: "number",
              min: 1,
              max: 99999,
              precision: 2,
              subtype: "text",
              placeholder: " "
            }
          },
          {
            label: "元/千克/天",
            prop: "unitKg",
            align: "right",
            isEdit: isEdit,
            config: {
              key: "unitKg",
              type: "number",
              min: 1,
              max: 99999,
              precision: 2,
              subtype: "text",
              placeholder: " "
            }
          },
          {
            label: "资金使用利息(%)",
            prop: "amountInterest",
            width: 100,
            align: "right",
            isEdit: isEdit,
            config: {
              key: "amountInterest",
              type: "number",
              min: 1,
              max: 99999,
              precision: 2,
              subtype: "text",
              placeholder: " "
            }
          }
        ];
      }
    }
  },

  watch: {},

  created() {},

  beforeMount() {},

  mounted() {
    this.initQueryForm();
    this.storeWarehouseApi();
    if (this.billCodeText == "查看规则") {
      this.isEdit = !this.isEdit;
    }
    if (this.billCodeText == "编辑规则" || this.billCodeText == "查看规则") {
      this.detail.inventoryNature = String(this.detail.inventoryNature);
      this.detail.ruleTypeName =
        this.detail.ruleType == "1" ? "仓储费规则" : "外部仓储费规则";
      this.detail.ruleType = String(this.detail.ruleType);
      this.initQueryForm(this.detail);
      this.leftTableData = this.detail.list.map((item,i) => {
        return {...item, isIndex:i}
      });
      // this.init();
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
    max-height: 700px !important;
    .el-dialog__body {
      padding: 0 !important;
      min-height: 100px !important;
      .content {
        min-height: 100px !important;
        overflow-x: auto;
        .item {
          flex-basis: 100% !important;
          .el-form-item__content {
            width: 400px !important;
            span {
              font-size: 12px;
              margin: 0 5px;
            }
            .el-input {
              width: 96px;
              .el-input__inner {
                width: 96px;
              }
            }
          }
        }
      }
    }
  }
}
.z-details-btn {
  background: #f7f9fd;
  border: 1px solid rgba(222, 230, 242, 1);
  height: 36px;
  line-height: 36px;
  span {
    font-size: 12px;
    margin: 0 5px;
  }
}
.z-content-table {
  margin-top: 0 !important;
}
</style>
