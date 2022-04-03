
export function formone(that, isEdit) {
  let formItemList = [
    {
      key: "billNo",
      type: "input",
      subtype: "text",
      label: "派车单号",
      isEdit,
      disabled: true,
      placeholder: "保存后自动生成",
      rules: {
        required: true,
        trigger: "blur"
      }
    },
    {
      key: isEdit ? "receiveTypeName" : "receiveType",
      type: isEdit ? "input" : "select",
      subtype: "text",
      label: "运输单位",
      isEdit,
      options: that.receiveType,
      optionLabel: "value",
      optionValue: "code",
    },
    {
      key: "billNo",
      type: "input",
      subtype: "text",
      label: "运单号码",
      isEdit,
      disabled: true,
      placeholder: "请输入"
    },
    {
      key: "billNo",
      type: "input",
      subtype: "text",
      label: "总重量(kg)",
      isEdit,
      disabled: true,
      placeholder: "请输入"
    },
    {
      key: "billNo",
      type: "input",
      subtype: "text",
      label: "车牌号",
      isEdit,
      disabled: true,
      placeholder: "请输入"
    },
    {
      key: "billNo",
      type: "input",
      subtype: "text",
      label: "司机姓名",
      isEdit,
      disabled: true,
      placeholder: "请输入"
    },
    {
      key: "billNo",
      type: "input",
      subtype: "text",
      label: "司机联系方式",
      isEdit,
      disabled: true,
      placeholder: "请输入"
    },
    {
      key: "billNo",
      type: "input",
      subtype: "text",
      label: "实际开发时间 ",
      isEdit,
      disabled: true,
      placeholder: "请输入"
    },
    {
      key: "billNo",
      type: "input",
      subtype: "text",
      label: "运输类型",
      isEdit,
      disabled: true,
      placeholder: "请输入"
    },
    {
      key: "billNo",
      type: "input",
      subtype: "text",
      label: "备注",
      isEdit,
      disabled: true,
      placeholder: "请输入"
    },


    // {
    //   key: "billNo",
    //   type: "input",
    //   subtype: "text",
    //   label: "到2货通知单号",
    //   isEdit,
    //   disabled: true,
    //   placeholder: "保存后自动生成"
    // },
    // {
    //   key: isEdit ? "receiveTypeName" : "receiveType",
    //   type: isEdit ? "input" : "select",
    //   subtype: "text",
    //   label: "收货方式",
    //   isEdit,
    //   options: that.receiveType,
    //   optionLabel: "value",
    //   optionValue: "code",
    //   rules: {
    //     required: true,
    //     trigger: "blur"
    //   }
    // },
    // {
    //   key: isEdit ? "warehouseName" : "warehouseId",
    //   type: isEdit ? "input" : "select",
    //   subtype: "text",
    //   label: "到货仓库",
    //   isEdit,
    //   options: [],
    //   optionLabel: "orderTypeName",
    //   optionValue: "orderTypeNo"
    // },
    // {
    //   key: "isStock",
    //   type: "checkbox",
    //   subtype: "text",
    //   disabled: isEdit ? true : false,
    //   label: "是否电商库存",
    //   isEdit
    // },
    // {
    //   key: "supplierCode",
    //   type: "input",
    //   subtype: "text",
    //   label: "供应商编号",
    //   isEdit,
    //   attrs: {
    //     readonly: true,
    //     suffixIcon: "el-icon-arrow-down"
    //   },
    //   listeners: {
    //     focus: () => that.selectLook("supplier")
    //   },
    //   placeholder: "请输入",
    //   rules: {
    //     required: true,
    //     trigger: "blur"
    //   }
    // },
    // {
    //   key: "supplierName",
    //   type: "input",
    //   subtype: "text",
    //   label: "供应商名称",
    //   isEdit,
    //   disabled: true,
    //   rules: {
    //     required: true,
    //     trigger: "blur"
    //   },
    //   placeholder: "请选择"
    // },
    // {
    //   key: "arrivalDate",
    //   type: "date",
    //   subtype: "date",
    //   valueFormat: "yyyy-MM-dd",
    //   label: "预计到货日期",
    //   rules: {
    //     required: true,
    //     trigger: "blur"
    //   },
    //   isEdit
    // },
    // {
    //   key: "freight",
    //   type: "input",
    //   subtype: "text",
    //   label: "运费金额",
    //   isEdit,
    //   disabled: true,
    //   placeholder: ""
    // },
    // {
    //   key: "buyerName",
    //   type: "input",
    //   subtype: "text",
    //   label: "采购员",
    //   isEdit,
    //   disabled: true,
    //   rules: {
    //     required: true,
    //     trigger: "blur"
    //   },
    //   placeholder: ""
    // },
    // {
    //   key: "departmentName",
    //   type: "input",
    //   subtype: "text",
    //   label: "采购组",
    //   isEdit,
    //   rules: {
    //     required: true,
    //     trigger: "blur"
    //   },
    //   disabled: true,
    //   placeholder: ""
    // },
    // {
    //   key: "exchangeRate",
    //   type: "input",
    //   subtype: "text",
    //   label: "汇率",
    //   isEdit,
    //   disabled: true,
    //   placeholder: ""
    // },
    // {
    //   key: "transportName",
    //   type: "input",
    //   subtype: "text",
    //   label: "运输单位",
    //   isEdit,
    //   attrs: {
    //     readonly: true,
    //     suffixIcon: "el-icon-arrow-down"
    //   },
    //   listeners: {
    //     focus: () => that.selectLook("company")
    //   },
    //   placeholder: "请输入"
    // }
  ];

  return formItemList

}

export function formtwo(that, isEdit) {
  let formItemList = [
    {
      key: "contact",
      type: "input",
      subtype: "text",
      label: "服务费用",
      disabled: true,
      isEdit,
      placeholder: "请输入"
    },
    {
      key: "contact",
      type: "input",
      subtype: "text",
      label: "支出",
      disabled: true,
      isEdit,
      placeholder: "请输入"
    },
    {
      key: "contact",
      type: "input",
      subtype: "text",
      label: "利润",
      disabled: true,
      isEdit,
      placeholder: "请输入"
    },
    // {
    //   key: "companyName",
    //   type: "input",
    //   subtype: "text",
    //   label: "单位名称",
    //   isEdit,
    //   attrs: {
    //     readonly: true,
    //     suffixIcon: "el-icon-arrow-down"
    //   },
    //   listeners: {
    //     focus: () => that.selectLook("companyName")
    //   },
    //   placeholder: "请输入",
    //   rules: {
    //     required: true,
    //     trigger: "blur"
    //   }
    // },
    // {
    //   key: "contact",
    //   type: "input",
    //   subtype: "text",
    //   label: "联系人",
    //   disabled: true,
    //   isEdit,
    //   placeholder: "请输入"
    // },
    // {
    //   key: "contactTel",
    //   type: "input",
    //   subtype: "text",
    //   label: "联系人方式",
    //   disabled: true,
    //   isEdit,
    //   placeholder: "请输入"
    // },
    // {
    //   key: "receiveDistrict",
    //   type: "input",
    //   subtype: "text",
    //   label: "收货省市区",
    //   disabled: true,
    //   isEdit,
    //   placeholder: "请输入"
    // },
    // {
    //   key: "receiveAddress",
    //   type: "input",
    //   subtype: "textarea",
    //   label: "详细地址",
    //   disabled: true,
    //   isEdit,
    //   placeholder: "请输入"
    // }
  ];

  return formItemList

}

export function formThree(that, isEdit) {
  let formItemList = [
    {
      key: "inspectionFree",
      type: "checkbox",
      subtype: "text",
      disabled: isEdit ? true : false,
      label: "是否免检",
      isEdit,
    },
    {
      key: isEdit ? "orderTypeName5" : "orderTypeNo5",
      type: isEdit ? "input" : "upload",
      subtype: "text",
      label: "附件",
      isEdit
    },
    {
      key: "remark",
      type: "input",
      subtype: "textarea",
      label: "备注",
      maxlength: 200,
      isEdit,
      placeholder: ""
    }
  ];

  return formItemList;
}
