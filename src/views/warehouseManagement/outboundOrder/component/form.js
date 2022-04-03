
export function formone (that, isEdit) {
  let formItemList = [
    {
      key: "billNo",
      type: "input",
      subtype: "text",
      label: "出库单编号",
      isEdit,
      disabled: true,
      placeholder: "保存后自动生成"
    },
    {
      key: isEdit ? "outType" : "outType",
      type: isEdit ? "input" : "select",
      subtype: "text",
      label: "出库类型",
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
      key: isEdit ? "bookKeeper" : "bookKeeper",
      type: isEdit ? "input" : "select",
      subtype: "text",
      label: "记账人",
      isEdit,
      options: [{
        label: '小白',
        value: 0
      }, {
        label: '小黑',
        value: 1
      }, {
        label: '小黄',
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
      key: isEdit ? "expressCompanyId" : "expressCompanyId",
      type: isEdit ? "input" : "select",
      subtype: "text",
      label: "快递公司",
      isEdit,
      options: [{
        label: '中通',
        value: 0
      }, {
        label: '圆通',
        value: 1
      }, {
        label: '韵达',
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
      key: "orderNo",
      type: "input",
      subtype: "text",
      label: "关联销售单号",
      isEdit,
      disabled: false,
      placeholder: ""
    },
    {
      key: isEdit ? "districtId" : "districtId",
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
      key: "expressNo",
      type: "input",
      subtype: "text",
      label: "快递单号",
      isEdit,
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
      key: "outTime",
      type: "date",
      subtype: "date",
      valueFormat: "yyyy-MM-dd",
      label: "出库时间",
      isEdit
    },
    {
      key: "unloadWages",
      type: "input",
      subtype: "text",
      label: "装车工资",
      isEdit,
      placeholder: ""
    },

    {
      key: isEdit ? "transportFeeUnit" : "transportFeeUnit",
      type: isEdit ? "input" : "select",
      subtype: "text",
      label: "运费承担方",
      isEdit,
      options: [{
        label: '甲方',
        value: 0
      }, {
        label: '乙方',
        value: 1
      }, {
        label: '丙方',
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
      key: "remark",
      type: "input",
      subtype: "text",
      label: "备注",
      disabled: false,
      isEdit,
      placeholder: "请选择"
    },
    {
      key: "companyName",
      type: "input",
      subtype: "text",
      label: "公司主体",
      disabled: false,
      isEdit,
      placeholder: "请选择"
    },
    {
      key: "deliveryType",
      type: "input",
      subtype: "text",
      label: "发货方式",
      disabled: false,
      isEdit,
      placeholder: "请选择"
    },
    {
      key: "checkItemName",
      type: "input",
      subtype: "text",
      label: "客商名称",
      disabled: false,
      isEdit,
      placeholder: "请选择"
    },
    {
      key: "checkItemUserName",
      type: "input",
      subtype: "text",
      label: "单位名称",
      disabled: false,
      isEdit,
      placeholder: "请选择"
    },
    {
      key: "receiveTelephone",
      type: "input",
      subtype: "text",
      label: "收货人联系方式",
      disabled: false,
      isEdit,
      placeholder: "请选择"
    },
    {
      key: "receiveMan",
      type: "input",
      subtype: "text",
      label: "收货人",
      disabled: false,
      isEdit,
      placeholder: "请选择"
    },
    {
      key: "addrDistrict",
      type: "input",
      subtype: "text",
      label: "地址区域",
      disabled: false,
      isEdit,
      placeholder: "请选择"
    },
    {
      key: "addrDetail",
      type: "input",
      subtype: "text",
      label: "详细地址",
      disabled: false,
      isEdit,
      placeholder: "请选择"
    }

  ];

  return formItemList

}
