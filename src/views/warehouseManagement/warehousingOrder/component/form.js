
export function formone (that, isEdit) {
  let formItemList = [
    {
      key: "billNo",
      type: "input",
      subtype: "text",
      label: "入库单编号",
      isEdit,
      disabled: true,
      placeholder: "保存后自动生成"
    },
    {
      key: isEdit ? "inType" : "inType",
      type: isEdit ? "input" : "select",
      subtype: "text",
      label: "入库类型",
      isEdit,
      options: [{
        label: '0',
        value: 0
      }, {
        label: '1',
        value: 1
      }, {
        label: '2',
        value: 2
      }],
      optionLabel: 'label',
      optionValue: 'value',
      rules: {
        required: true,
        trigger: "blur"
      }
    },
    {
      key: "bookKeeper",
      type: "input",
      subtype: "text",
      label: "记账人",
      isEdit,
      disabled: false,
      placeholder: ""
    },
    {
      key: "owner",
      type: "input",
      subtype: "text",
      label: "货主",
      isEdit,
      disabled: false,
      placeholder: ""
    },
    {
      key: "orderNo",
      type: "input",
      subtype: "text",
      label: "关联销售单号",
      isEdit,
      disabled: false,
      placeholder: ""
    },
    {
      key: isEdit ? "warehouseId" : "warehouseId",
      type: isEdit ? "input" : "select",
      subtype: "text",
      label: "仓库地区",
      isEdit,
      options: [{
        label: '杭州',
        value: 0
      }, {
        label: '北京',
        value: 1
      }, {
        label: '上海',
        value: 2
      }],
      optionLabel: 'label',
      optionValue: 'value',
      rules: {
        required: true,
        trigger: "blur"
      }
    },
    {
      key: isEdit ? "shipPerson" : "shipPerson",
      type: isEdit ? "input" : "select",
      subtype: "text",
      label: "装运人员",
      isEdit,
      options: that.usersList,
      optionLabel: 'fullName',
      optionValue: 'id',
      rules: {
        required: true,
        trigger: "blur"
      }
    },
    {
      key: "inventoryNature",
      type: "input",
      subtype: "text",
      label: "库存性质",
      isEdit,
      disabled: false,
      placeholder: ""
    },
    {
      key: "sourceNo",
      type: "input",
      subtype: "text",
      label: "来源单号",
      isEdit,
      disabled: false,
      placeholder: "请选择"
    },
    {
      key: "inTime",
      type: "date",
      subtype: "date",
      valueFormat: "yyyy-MM-dd",
      label: "入库时间",
      isEdit
    },
    {
      key: "unloadWages",
      type: "input",
      subtype: "text",
      label: "卸车工资",
      isEdit,
      placeholder: ""
    },
    {
      key: "isInspectionFree",
      type: "checkbox",
      subtype: "text",
      label: "是否免检",
      isEdit,
      placeholder: ""
    },
    {
      key: "sourceType",
      type: "input",
      subtype: "text",
      label: "源单类型",
      isEdit,
      disabled: false,
      placeholder: "请选择"
    },
    {
      key: "weight",
      type: "input",
      subtype: "text",
      label: "重量(KG)",
      isEdit,
      disabled: false,
      placeholder: "请选择"
    },
    {
      key: "businessDate",
      type: "date",
      subtype: "date",
      valueFormat: "yyyy-MM-dd",
      label: "业务日期",
      isEdit
    },
    {
      key: "companyId",
      type: "input",
      subtype: "input",
      label: "公司主体",
      maxlength: 200,
      isEdit,
      placeholder: "请输入"
    },
    {
      key: "supplierName",
      type: "input",
      subtype: "input",
      label: "供应商",
      maxlength: 200,
      isEdit,
      placeholder: "请输入"
    },

    {
      key: "remark",
      type: "input",
      subtype: "textarea",
      label: "备注",
      maxlength: 200,
      isEdit,
      placeholder: "请输入"
    }
  ];

  return formItemList

}
