export function formone(that, isEdit) {
  let formItemList = [
    {
      key: "billNo",
      type: "input",
      subtype: "text",
      label: "退货单号",
      isEdit,
      disabled: true,
      placeholder: "保存后自动生成"
    },
    {
      key: "sourceBillNo",
      type: "input",
      subtype: "text",
      label: "来源单号",
      isEdit,
      disabled: true,
      placeholder: ""
    },
    {
      key: "saleOrderNo",
      type: "input",
      subtype: "text",
      label: "关联销售单号",
      isEdit,
      disabled: true,
      placeholder: ""
    },
    {
      key: "freight",
      type: "input",
      subtype: "text",
      label: "运费",
      isEdit,
      placeholder: ""
    },
    {
      key: "applicantName",
      // key: isEdit ? "applicantId" : "applicantName",
      type: "input",
      subtype: "text",
      label: "申请人",
      isEdit,
      attrs: {
        readonly: true,
        suffixIcon: "el-icon-arrow-down"
      },
      listeners: {
        focus: () => that.selectLook("applyMan")
      },
      placeholder: "请输入",
      rules: {
        required: true,
        trigger: "blur"
      }
    },
    {
      key: "sourceBillType",
      type: "input",
      subtype: "text",
      label: "源单类型",
      isEdit,
      disabled: true,
      rules: {
        required: true,
        trigger: "blur"
      },
      placeholder: "请选择"
    },

    {
      key: "applyTime",
      type: "date",
      // subtype: "date",
      // valueFormat: "yyyy-MM-dd",
      subtype: "datetime", //后端需要带具体时分秒的 需要处理下
      label: "申请时间",
      attrs: {
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        }
      },
      rules: {
        required: true,
        trigger: "blur"
      },
      isEdit
    },
    {
      key: "planReturnTime",
      type: "date",
      subtype: "date",
      valueFormat: "yyyy-MM-dd",
      label: "预计出库日期",
      attrs: {
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        }
      },
      rules: {
        required: true,
        trigger: "blur"
      },
      isEdit
    }
  ];

  return formItemList;
}

export function formTwo(that, isEdit) {
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

export function formThree(that, isEdit) {
  console.log(isEdit);
  let formItemList = [
    {

      key: isEdit ? "deliveryTypeName" : "deliveryType",
      // key :"deliveryType",

      type: isEdit ? "input" : "select",
      subtype: "text",
      label: "发货方式",
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
      key: "supplierName",
      type: "input",
      subtype: "text",
      label: "供应商",
      isEdit,
      disabled: true,
      rules: {
        required: true,
        trigger: "blur"
      },
      placeholder: ""
    },
    {
      // key:isEdit?"checkItemName" : "checkItemId",
      key: "checkItemName",
      type: "input",
      subtype: "text",
      label: "单位名称",
      isEdit,
      attrs: {
        readonly: true,
        suffixIcon: "el-icon-arrow-down"
      },
      listeners: {
        focus: () => {
          console.log(11);
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
      key: "addressArea",
      type: "input",
      subtype: "addressArea",
      label: "地址区域",
      isEdit,
      disabled: true,
      placeholder: ""
    },

    {
      key: "detailAddress",
      type: "input",
      subtype: "text",
      label: "详细地址",
      isEdit,
      disabled: true,
      placeholder: ""
    },

    {
      // key: "contactsName",
      // key: "contacts",
      key: isEdit ? "contacts" : "contactsName",
      type: "input",
      subtype: "text",
      label: "联系人名称",
      isEdit,
      rules: {
        required: true,
        trigger: "blur"
      },
      disabled: true,
      placeholder: ""
    },
    {
      key: "telephone",
      type: "input",
      subtype: "text",
      label: "联系方式",
      isEdit,
      rules: {
        required: true,
        trigger: "blur"
      },
      disabled: true,
      placeholder: ""
    }
  ];

  return formItemList;
}
