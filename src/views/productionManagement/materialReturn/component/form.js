export function formone(that, isEdit) {
  let formItemList = [
    {
      key: "outsourceNo",
      type: "input",
      subtype: "text",
      label: "退料申请单",
      isEdit,
      disabled: true,
      placeholder: "保存后自动生成"
    },
    {
      key: "applicantIdFullName",
      type: "input",
      subtype: "text",
      label: "退货申请人",
      isEdit,
      attrs: {
        readonly: true,
        suffixIcon: "el-icon-arrow-down"
      },
      listeners: {
        focus: () => that.selectLook("returnMan")
      },
      placeholder: "请输入",
      rules: {
        required: true,
        trigger: "blur"
      }
    },
    {
      key: "liableFullName",
      type: "input",
      subtype: "text",
      label: "责任人",
      isEdit,
      attrs: {
        readonly: true,
        suffixIcon: "el-icon-arrow-down"
      },
      listeners: {
        focus: () => that.selectLook("abilityPerson")
      },
      placeholder: "请输入",
      rules: {
        required: true,
        trigger: "blur"
      }
    },
    {
      // key: isEdit ? "liableDepartmentFullName" : "liableDepartment",
      key: "liableDepartmentFullName",
      type: "input",

      subtype: "text",
      label: "责任部门",
      isEdit,
      attrs: {
        readonly: true,
        suffixIcon: "el-icon-arrow-down"
      },
      listeners: {
        focus: () => that.selectLook("departMent1")
      },
      rules: {
        required: true,
        trigger: "blur"
      }
    },

    {
      key: "returnReason",
      type: "input",
      subtype: "text",
      label: "退料原因",
      isEdit,
      placeholder: "请输入",
      rules: {
        required: true,
        trigger: "blur"
      }
    },
    {
      key: "returnWarehouseId",
      type: "input",
      subtype: "text",
      label: "到货仓库",
      isEdit,
      placeholder: "请输入",
      rules: {
        required: true,
        trigger: "blur"
      }
    },
    {
      key: "arrivalDate",
      type: "date",
      subtype: "date",
      valueFormat: "yyyy-MM-dd",
      label: "预计到货日期",
      isEdit
    }
  ];

  return formItemList;
}

export function formtwo(that, isEdit) {
  let formItemList = [
    {
      key: isEdit ? "receiveTypeName" : "receiveType",
      // key:'receiveType',
      type: isEdit ? "input" : "select",
      subtype: "text",
      label: "收货方式",
      isEdit,
      options: that.receiveType,
      optionLabel: "value",
      optionValue: "code",
      rules: {
        required: true,
        trigger: "blur"
      }
    },
    {
      key: "receiverCompanyName",
      type: "input",
      subtype: "text",
      label: "收货单位",
      isEdit,
      attrs: {
        readonly: true,
        suffixIcon: "el-icon-arrow-down"
      },
      listeners: {
        focus: () => {
          that.selectLook("checkItemName");
        }
      },
      placeholder: "请输入",
      rules: {
        required: true,
        trigger: "blur"
      }
    },
    {
      key: "receiver",
      type: "input",
      subtype: "text",
      label: "收货人",
      disabled: true,
      isEdit,
      placeholder: "请输入"
    },
    {
      key: "telephone",
      type: "input",
      subtype: "text",
      label: "联系方式",
      disabled: true,
      isEdit,
      placeholder: "请输入"
    },
    {
      key: "checkItemName",
      type: "input",
      subtype: "text",
      disabled: true,
      label: "加工商名称",
      isEdit,

      /* listeners: {
          focus: () => that.selectLook("company")
        }, */
      placeholder: "请输入",
      rules: {
        required: true,
        trigger: "blur"
      }
    },
    {
      key: "receiveDistrict",
      type: "input",
      subtype: "text",
      label: "地址区域",
      disabled: true,
      isEdit,
      placeholder: "请输入"
    },
    {
      key: "receiveAddress",
      type: "input",
      subtype: "text",
      label: "详细地址",
      disabled: true,
      isEdit,
      placeholder: "请输入"
    }
  ];

  return formItemList;
}

export function formThree(that, isEdit) {
  let formItemList = [
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
