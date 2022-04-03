<template>
  <div id="zPage" class="market-order-edit">
    <div class="z-header">
      <div v-if="isEdit" class="z-header-button">
        <el-button plain @click="saveData" :disabled="loading">保存</el-button>
        <el-button plain @click="cancel">取消</el-button>
      </div>
      <div v-else class="z-header-button">
        <el-button plain @click="updateStatus" :disabled="!isCanEdit"
          >编辑</el-button
        >
        <el-button plain @click="cancel">返回</el-button>
      </div>
    </div>
    <div class="z-content" v-loading="loading">
      <el-card class="z-details-box">
        <div class="z-details-content">
          <div class="z-details-icon">
            <span @click="isCancel('basicShow', !basicShow)">
              <i
                :class="
                  basicShow ? 'el-icon-caret-bottom' : 'el-icon-caret-right'
                "
              ></i>
              基本信息
            </span>
          </div>
          <div
            :class="[
              'z-details-content-box',
              basicShow ? '' : 'details-height-none'
            ]"
          >
            <form-list
              v-model="queryForm"
              :formConfig="getFormConfig(1)"
              class="form form-order-box"
            ></form-list>
          </div>
        </div>
      </el-card>
    </div>
    <div>
      <look-up
        :isSelectMore="isSelectMore"
        :title="look.title"
        :visible.sync="popConfig.show"
        :isClearAll="true"
        @setCheckItem="popSubmit"
        :params="look.params"
        :method="look.methods"
        :table-column="look.tableColumn"
        :search-arr="look.searchArr"
      ></look-up>
    </div>
  </div>
</template>
<script>
import formList from "@/components/Form/formList";
import commonTable from "@/components/CommonTable";
import lookUp from "@/components/ZLookUp/lookUp";

import {
  saveData,
  editData,
  detailsData,
  select_order_type,
  select_clause_type,
  queryContactById
} from "@/api/marketOrder";
import {
  select_currency,
  look_up_customer,
  look_up_sale,
  look_up_material_no
} from "@/api/order/dict";
import { querySelectList } from "@/api/xsApi/api";
import {
  getMathIndex,
  checkFormData,
  checkExistData,
  deepCopy,
  bigIntCalculate
} from "@/lib/common";
import { interestRulesList } from "@/api/sale/base";
import { parseTime } from "@/utils/ruoyi";
export default {
  name: "",
  components: {
    formList,
    commonTable,
    lookUp
  },
  props: {
    operateType: {
      type: String,
      default: "add"
    },
    currentData: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      isEdit: false,
      queryForm: {},
      tableData: [],
      multipleSelection: [],
      deletedIdList: [],
      loading: false,
      basicShow: true,
      detailsShow: true,
      orderShow: true,
      isCanEdit: true,
      //销售类型
      orderTypeList: [],
      //客户联系人下拉
      checkItemContactList: [],
      //币种列表
      currencyList: [],
      //条数名称
      clauseNameList: [],
      //单位列表
      unitList: [],
      ceshiList: [],
      isSelectMore: false,
      //基础数据
      basicData: {
        billNo: "",
        orderTypeName: "",
        orderTypeNo: "",
        customerOrderNo: "",
        billDate: parseTime(new Date(), "{y}-{m}-{d}"),
        checkItemName: "",
        checkItemId: "",
        checkItemContactName: "",
        checkItemContactId: "",
        checkCode: "",
        salesGroupName: "",
        salesGroupId: "",
        salesName: "",
        salesNo: "",
        salesId: "",
        currency: "",
        exchangeRate: "",
        taxRate: 13,
        remark: "",
        clauseName: "",
        clauseContent: ""
      },
      //lookup显隐
      popConfig: {
        show: false
      },
      //lookup选择的分类
      materialCategoryNo: "",
      //原料信息
      materialCategoryIndex: 0
    };
  },
  computed: {
    formConfig() {
      let isEdit = !this.isEdit;
      let formItemList = [
        {
          key: isEdit ? "salesManList1" : "salesManList1",
          type: isEdit ? "input" : "selectLook",
          subtype: "text",
          label: "下拉lookup",
          isEdit,
          options: this.ceshiList,
          optionLabel: "label",
          optionValue: "value",
          placeholder: "请选择",
          showLook: () => {
            this.isSelectMore = false;
            this.selectCheckItemName();
          },
          rules: {
            required: true,
            message: "关联业务员不能为空"
          }
        },
        {
          key: isEdit ? "salesManList2" : "salesManList2",
          type: isEdit ? "input" : "selectLook",
          subtype: "text",
          label: "多选下拉1",
          isEdit,
          multiple: true,
          showLook: () => {
            this.isSelectMore = true;
            this.selectCheckItemName();
          },
          options: this.ceshiList,
          optionLabel: "orderTypeName",
          optionValue: "orderTypeNo",
          placeholder: "请选择",
          rules: {
            required: true,
            message: "关联业务员不能为空"
          }
        },
        {
          key: isEdit ? "salesManList3" : "salesManList3",
          type: isEdit ? "input" : "selectLook",
          subtype: "text",
          label: "多选下拉2",
          isEdit,
          collapse: true,
          multiple: true,
          showLook: () => {
            this.isSelectMore = true;
            this.selectCheckItemName();
          },
          options: this.ceshiList,
          optionLabel: "orderTypeName",
          optionValue: "orderTypeNo",
          placeholder: "请选择",
          rules: {
            required: true,
            message: "关联业务员不能为空"
          }
        },

        {
          key: isEdit ? "clauseName" : "clauseName",
          type: isEdit ? "input" : "select",
          subtype: "text",
          label: "条款名称",
          isEdit,
          options: this.clauseNameList,
          optionLabel: "clauseName",
          optionValue: "clauseName",
          listeners: {
            change: this.clauseNameChange
          }
        },
        {
          key: "clauseContent",
          type: "input",
          subtype: "textarea",
          label: "条款内容",
          isEdit,
          maxlength: 99999,
          attrs: {
            showWordLimit: true,
            class: "clause-content-box"
          }
        }
      ];

      return formItemList;
    },
    tableColumn() {
      let isEdit = this.isEdit;

      return [
        {
          label: "序号",
          type: "index"
        },
        {
          label: "物料编号",
          prop: "materialNo",
          isEdit: isEdit,
          config: {
            key: "materialNo",
            type: "input",
            subtype: "text",
            placeholder: "请选择",
            attrs: {
              readonly: true,
              suffixIcon: "el-icon-arrow-down"
            },
            listeners: {
              focus: this.selectMaterial
            },
            custormRules: {
              message: "物料编号不能为空"
            }
          }
        },
        {
          label: "物料名称",
          prop: "materialName",
          isEdit: isEdit,
          config: {
            key: "materialName",
            type: "input",
            subtype: "text",
            disabled: true,
            custormRules: {
              message: "物料名称不能为空"
            },
            placeholder: " "
          }
        },
        {
          label: "规格",
          prop: "specification",
          align: "right",
          isEdit: isEdit,
          config: {
            key: "specification",
            type: "input",
            subtype: "text",
            placeholder: " "
          }
        },
        {
          label: "门幅",
          prop: "fullWidth",
          align: "right",
          isEdit: isEdit,
          config: {
            key: "fullWidth",
            type: "input",
            subtype: "text",
            placeholder: " "
          }
        },
        {
          label: "有效门幅",
          prop: "width",
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
          label: "克重",
          prop: "gmwt",
          align: "right",
          isEdit: isEdit,
          config: {
            key: "gmwt",
            type: "input",
            subtype: "text",
            placeholder: " "
          }
        },
        {
          label: "客户品名",
          prop: "customerMaterialNo",
          isEdit: isEdit,
          config: {
            key: "customerMaterialNo",
            type: "input",
            subtype: "text",
            placeholder: " "
          }
        },
        {
          label: "颜色",
          prop: "colorName",
          isEdit: isEdit,
          config: {
            key: "colorName",
            type: "input",
            subtype: "text",
            placeholder: " "
          }
        },
        {
          label: "客户颜色",
          prop: "customerColorNo",
          isEdit: isEdit,
          config: {
            key: "customerColorNo",
            type: "input",
            subtype: "text",
            placeholder: " "
          }
        },
        {
          label: "花型号",
          prop: "patternNo",
          isEdit: isEdit,
          config: {
            key: "patternNo",
            type: "input",
            subtype: "text",
            placeholder: " "
          }
        },
        {
          label: "数量",
          prop: "qty",
          align: "right",
          isEdit,
          config: {
            key: "qty",
            type: "number",
            min: 1,
            max: 99999999,
            precision: 2,
            custormRules: {
              message: "数量不能为空"
            },
            listeners: {
              blur: this.priceChange
            },
            placeholder: " ",
            controls: false
          }
        },
        {
          label: "短装(%)",
          prop: "shortPercent",
          align: "right",
          isEdit,
          config: {
            key: "shortPercent",
            type: "number",
            min: 0,
            max: 999999999,
            precision: 0,
            placeholder: " ",
            controls: false
          }
        },
        {
          label: "溢装(%)",
          prop: "overPercent",
          align: "right",
          isEdit,
          config: {
            key: "overPercent",
            type: "number",
            min: 0,
            max: 999999999,
            precision: 0,
            placeholder: " ",
            controls: false
          }
        },
        {
          label: "单位",
          prop: "unit",
          isEdit: isEdit,
          config: {
            key: "unit",
            type: "select",
            options: this.unitList,
            optionLabel: "unitName",
            optionValue: "unitName",
            custormRules: {
              message: "单位不能为空"
            }
          }
        },
        {
          label: "单价",
          prop: "price",
          align: "right",
          isEdit,
          config: {
            key: "price",
            type: "number",
            min: 0,
            max: 999999,
            precision: 2,
            custormRules: {
              message: "单价不能为空"
            },
            listeners: {
              blur: this.priceChange
            },
            placeholder: " ",
            controls: false
          }
        },
        {
          label: "金额",
          prop: "amount",
          align: "right",
          isEdit,
          config: {
            key: "amount",
            type: "input",
            subtype: "text",
            disabled: true,
            min: 0,
            // max: 999999999,
            precision: 2,
            custormRules: {
              message: "金额不能为空"
            },
            placeholder: " ",
            controls: false
          }
        },
        {
          label: "附加费",
          prop: "addAmount",
          align: "right",
          isEdit,
          config: {
            key: "addAmount",
            type: "number",
            min: 0,
            max: 999999999,
            precision: 2,
            placeholder: " ",
            controls: false
          }
        },
        {
          label: "销售交期",
          prop: "deliveryDate",
          align: "right",
          isEdit,
          width: 120,
          config: {
            key: "deliveryDate",
            type: "date",
            subtype: "date",
            valueFormat: "yyyy-MM-dd",
            custormRules: {
              message: "销售交期不能为空"
            }
          }
        }
      ];
    },
    look() {
      let obj = {
        custorm: {
          title: "查询选择(客户)",
          params: {
            typeCode: "customer"
          },
          searchArr: [
            {
              label: "客户编号",
              field: "checkCode",
              type: 1
            },
            {
              label: "客户名称",
              field: "checkName",
              type: 1
            }
          ],
          methods: interestRulesList,
          tableColumn: [
            {
              label: "客户编号",
              prop: "ruleName"
            },
            {
              label: "客户简称",
              prop: "ruleName"
            },
            {
              label: "客户全称",
              prop: "ruleName"
            }
          ],
          changeFiled: {
            checkItemName: "shortName",
            checkItemId: "id",
            checkCode: "checkCode"
          }
        },
        material: {
          title: "查询选择(物料)",
          params: {},
          searchArr: [
            {
              label: "物料编号",
              field: "materialNo",
              type: 1
            },
            {
              label: "物料名称",
              field: "materialName",
              type: 1
            }
          ],
          methods: look_up_material_no,
          tableColumn: [
            {
              label: "物料名称",
              prop: "materialName"
            },
            {
              label: "物料编号",
              prop: "materialNo"
            },
            {
              label: "物料描述",
              prop: "description"
            },
            {
              label: "成品规格",
              prop: "specification"
            },
            {
              label: "成品组织",
              prop: "construction"
            },
            {
              label: "成品门幅",
              prop: "width"
            },
            {
              label: "成品克重",
              prop: "gmwt"
            },
            {
              label: "单位",
              prop: "unitName"
            }
          ],
          changeFiled: {
            materialId: "id",
            materialNo: "materialNo",
            materialName: "materialName",
            specification: "specification",
            fullWidth: "fullWidth",
            width: "width",
            gmwt: "gmwt",
            unit: "unitName"
          }
        }
      };
      return obj[this.materialCategoryNo] || { tableColumn: [], searchArr: [] };
    }
  },
  mounted() {
    for (let i = 0; i < 20; i++) {
      let obj = {
        label: "测试测试测试测试测试测试" + i,
        value: i
      };
      this.ceshiList.push(obj);
    }
  },
  methods: {
    /**
     * @desc 单位下拉
     */
    queryUnitSelectList() {
      querySelectList({}).then(res => {
        this.unitList = res.data;
      });
    },
    /**
     * @desc 币种下拉框
     */
    select_currency() {
      select_currency().then(res => {
        this.currencyList = res.data;

        if (this.operateType === "add") {
          //新增时给默认值
          let index = this.currencyList.findIndex(item => {
            return item.currencyName === "人民币";
          });

          if (index != -1) {
            this.queryForm.currency = this.currencyList[index].currencyNo;
            this.queryForm.exchangeRate = this.currencyList[index].exchangeRate;
          }
        }
      });
    },
    /**
     * @desc 获取销售订单类型下拉
     */
    select_order_type() {
      select_order_type().then(res => {
        this.orderTypeList = res.data;
      });
    },
    /**
     * @desc 获取条款下拉
     */
    select_clause_type() {
      select_clause_type().then(res => {
        let array = [],
          obj = {};

        res.data.forEach(item => {
          if (item.usable) {
            array.push(item);

            if (item.isDefault) {
              obj = item;
            }
          }
        });
        this.clauseNameList = array;

        if (this.operateType == "add") {
          //新增时给默认值
          this.queryForm.clauseName = obj.clauseName;
          this.queryForm.clauseContent = obj.content;
        }
      });
    },
    /**
     * @desc 客户联系人下拉
     */
    queryContactById() {
      let params = {
        id: this.queryForm.checkItemId
      };

      if (!params.id) {
        return;
      }
      queryContactById(params)
        .then(res => {
          this.checkItemContactList = res.data;

          let data = checkExistData(
            this.checkItemContactList,
            this.queryForm.checkItemContactId,
            "id"
          );

          if (!data.isExist) {
            this.queryForm.checkItemContactName = "";
            this.queryForm.checkItemContactId = "";
          }

          let defaultData = checkExistData(
            this.checkItemContactList,
            true,
            "isDefault"
          );

          if (defaultData.isExist) {
            this.queryForm.checkItemContactName = defaultData.data.name;
            this.queryForm.checkItemContactId = defaultData.data.id;
          }
        })
        .catch(() => {
          this.checkItemContactList = [];
          this.queryForm.checkItemContactName = "";
          this.queryForm.checkItemContactId = "";
        });
    },
    /**
     * @desc 条款名称更改内容同步
     */
    clauseNameChange(val) {
      let data = checkExistData(this.clauseNameList, val, "clauseName");

      if (data.isExist) {
        this.queryForm.clauseContent = data.data.content || "";
      }
    },
    /**
     * @desc 数量单价变化更新金额
     */
    priceChange(e) {
      let index = Number(e.target.parentNode.parentNode.getAttribute("index"));

      if (isNaN(index)) {
        index = 0;
      }

      this.materialCategoryIndex = index;

      let data = this.tableData[index] || {},
        qty = Number(data.qty),
        price = Number(data.price);

      if (isNaN(qty) || isNaN(price)) {
        data.amount = undefined;
      } else {
        let amount = Number(qty) * Number(price);
        data.amount = amount.toFixed(2);
      }

      this.$set(this.tableData, index, data);
    },
    /**
     * @desc 币种更改汇率同步
     */
    currencyChange(val) {
      let data = checkExistData(this.currencyList, val, "currencyNo");

      if (data.isExist) {
        this.queryForm.exchangeRate = data.data.exchangeRate || "";
      }
    },
    /**
     * @desc 选取物料lookup弹出
     */
    selectMaterial(e) {
      let index = Number(e.target.getAttribute("index"));

      if (isNaN(index)) {
        index = 0;
      }

      this.materialCategoryIndex = index;
      this.materialCategoryNo = "material";
      this.popConfig.show = true;
    },
    /**
     * @desc 选择客户名称lookup弹出
     */
    selectCheckItemName() {
      this.materialCategoryNo = "custorm";
      this.popConfig.show = true;
    },
    /**
     * @desc 选择销售员名称lookup弹出
     */
    selectSalesGroupName() {
      if (!this.queryForm.checkItemId) {
        this.$message.error("请先选择客户");
        return;
      }
      this.materialCategoryNo = "sale";
      this.popConfig.show = true;
    },
    /**
     * @desc 获取对应的form配置
     */
    getFormConfig(type) {
      let arr = [];

      if (type == 1) {
        arr = this.formConfig.slice(0, -2);
      } else if (type == 2) {
        arr = this.formConfig.slice(-2);
      }

      return {
        inline: true,
        size: "mini",
        labelWidth: "auto",
        formItemList: arr
      };
    },
    /**
     * @desc 对应组件显示隐藏
     */
    isCancel(key, bool) {
      this[key] = bool;
    },
    /**
     * @desc 初始化数据
     */
    initData() {
      if (this.operateType === "details") {
        this.isEdit = false;

        if (this.currentData.billStatus == 0) {
          this.isCanEdit = true;
        } else {
          this.isCanEdit = false;
        }
      } else {
        this.isEdit = true;
      }
      if (this.operateType === "add") {
        this.initQueryForm();
      } else {
        this.detailsData();
      }
    },
    /**
     * @desc 获取详情
     */
    detailsData() {
      this.loading = true;
      let params = {
        id: this.currentData.id
      };

      detailsData(params)
        .then(res => {
          this.loading = false;
          this.initQueryForm(res.data);
        })
        .catch(error => {
          this.loading = false;
          this.initQueryForm();
        });
    },
    /**
     * @desc 初始化页面参数
     */
    initQueryForm(data = {}) {
      let basic = this.basicData;

      this.queryForm = {
        ...basic,
        ...data
      };

      if (data.orderDtlVOList) {
        this.tableColumn.forEach(item => {
          if (item.config && item.config.type == "number") {
            data.orderDtlVOList.forEach(value => {
              if (!value[item.config.key] && value[item.config.key] !== 0) {
                value[item.config.key] = undefined;
              }
            });
          }
        });
        this.tableData = data.orderDtlVOList;
      }

      // this.queryContactById()
      // this.select_currency()
    },
    /**
     * @desc 点击取消货返回
     */
    cancel() {
      if (this.isEdit) {
        this.$confirm("内容还未保存，确认返回吗？", "", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$emit("submit");
          })
          .catch(() => {});
      } else {
        this.$emit("submit");
      }
    },
    /**
     * @desc 编辑或添加取对应值
     */
    getEditParams(type = "add") {
      let params = {
          orderDtlList: this.tableData
        },
        objParams = {
          ...this.basicData,
          id: ""
        };

      Object.keys(objParams).forEach(item => {
        let value = this.queryForm[item];

        if (typeof value != "undefined" || value === 0) {
          params[item] = value;
        }
      });

      if (type === "edit") {
        params.deleteDetailIdList = this.deletedIdList;
      }
      return params;
    },
    /**
     * @desc 点击添加或编辑
     */
    saveData() {
      let objFun = {
          add: saveData,
          edit: editData
        },
        type = this.operateType === "details" ? "edit" : this.operateType;

      if (objFun[type]) {
        if (this.tableData.length < 1) {
          this.$message.error("明细信息未添加");
          return;
        }
        if (!checkFormData(this.formConfig, this.queryForm)) {
          return;
        }

        let bool = true,
          title = "";

        this.tableColumn.forEach(item => {
          if (item.config && item.config.custormRules) {
            this.tableData.forEach((value, key) => {
              value.orderNumber = key + 1;
              if (!value[item.config.key] && value[item.config.key] !== 0) {
                bool = false;
                title =
                  "第" + (key + 1) + "行" + item.config.custormRules.message;
              } else if (item.config.key === "deliveryDate") {
                if (
                  new Date(value[item.config.key]).getTime() <
                  new Date(this.queryForm.billDate).getTime()
                ) {
                  bool = false;
                  title = "第" + (key + 1) + "行销售交期不能小于订单日期";
                }
              }
            });
          }
        });

        if (!bool) {
          this.$message.error(title);
          return;
        }
        let params = this.getEditParams(type);

        if (params) {
          this.loading = true;
          objFun[type](params)
            .then(res => {
              this.$message.success("操作成功");
              this.loading = false;
              this.$emit("submit");
            })
            .catch(() => {
              this.loading = false;
            });
        }
      }
    },
    /**
     * @desc 更换当前状态
     */
    updateStatus() {
      this.isEdit = true;
    },
    /**
     * @desc 新增明细
     */
    addDetails() {
      let obj = {
        shortPercent: 0,
        overPercent: 0,
        isIndex: getMathIndex(this.tableData, "isIndex")
      };

      this.clearSelct();
      this.tableData.push(obj);
    },
    /**
     * @desc 复制明细
     */
    copyDetails() {
      if (this.multipleSelection.length < 1) {
        this.$message.error("请选择操作项");
        return;
      }
      let array = [];
      this.multipleSelection.forEach(item => {
        let obj = deepCopy(item);

        if (item.id) {
          delete obj.id;
        }

        (obj.isIndex = getMathIndex([...this.tableData, ...array], "isIndex")),
          array.push(obj);
      });
      this.tableData.push(...array);
      this.clearSelct();
    },
    /**
     * @desc 删除明细
     */
    deleteDetails() {
      if (this.multipleSelection.length < 1) {
        this.$message.error("请选择操作项");
        return;
      }
      this.$confirm("确认删除选中的数据吗？", "", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let array = this.tableData;

          this.multipleSelection.forEach(item => {
            if (item.id) {
              this.deletedIdList.push(item.id);
            }

            let index = array.findIndex(value => {
              if (item.id) {
                return item.id == value.id;
              } else {
                return item.isIndex == value.isIndex;
              }
            });

            if (index != -1) {
              array.splice(index, 1);
            }
          });
          this.tableData = array;
          this.clearSelct();
        })
        .catch(() => {});
    },
    /**
     * @desc 勾选复选框
     */
    handleSelectionChange(data) {
      this.multipleSelection = data;
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
     * @desc lookup隐藏
     */
    popSubmit(data) {
      console.log(data);
      let obj = {
        label: "测试测试测试测试测试测试" + 1,
        value: 1
      };

      this.ceshiList.unshift(obj);
      var a = {};
      this.ceshiList = this.ceshiList.reduce((item, next) => {
       a[next.value] ? '' : a[next.value] = true && item.push(next);
      return item;
      }, []) ;
      // console.log(this.ceshiList);
      this.queryForm.salesManList3.push(obj.value);
      let params = {};

      // Object.keys(this.look.changeFiled).forEach(item => {
      //     params[item] = data[this.look.changeFiled[item]]
      // })

      // if(this.materialCategoryNo == 'custorm' || this.materialCategoryNo == 'sale') {
      //     if(this.materialCategoryNo == 'custorm') {
      //         params = {
      //             ...params,
      //             salesGroupId: '',
      //             salesId: '',
      //             salesName: '',
      //             salesGroupName: '',
      //             salesNo: '',
      //         }
      //     }

      //     this.queryForm = {
      //         ...this.queryForm,
      //         ...params,
      //     }

      //     if(this.materialCategoryNo == 'custorm') {
      //         this.$nextTick(() => {
      //             this.queryContactById()
      //         })
      //     }
      // } else if(this.materialCategoryNo == 'material') {
      //     let objValue = {...this.tableData[this.materialCategoryIndex], ...params,}

      //     this.$set(this.tableData, this.materialCategoryIndex, objValue)
      // }
    }
  },
  created() {
    this.initData();
    // this.select_order_type()
    // this.select_clause_type()
    // this.queryUnitSelectList()
  }
};
</script>
<style lang="less">
.market-order-edit {
  .form-order-box {
    width: 1360px;

    .form-item-textarea .el-form-item__content {
      width: 88% !important;

      .clause-content-box {
        height: 120px;

        .el-textarea__inner {
          height: 100%;
        }
      }
    }
  }
}
</style>
