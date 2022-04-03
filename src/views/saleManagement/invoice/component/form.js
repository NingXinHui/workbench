export function formone(that, isEdit) {
  let formItemList = [
    {
      key: "billNo",
      type: "input",
      subtype: "text",
      label: "发货通知单号",
      isEdit,
      disabled: true,
      placeholder: "保存后自动生成"
    },
    {
      key: "planDate",
      type: "date",
      subtype: "date",
      valueFormat: "yyyy-MM-dd",
      label: "要求发货日期",
      isEdit,
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
      }
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
      key: "sourceBillType",
      type: "input",
      subtype: "text",
      label: "源单类型",
      isEdit,
      disabled: true,
      placeholder: ""
    },
    {
      key: isEdit ? "storeArea" : "storeArea",
      type: isEdit ? "input" : "select",
      subtype: "text",
      label: "仓库地区",
      isEdit,
      options: [
        {
          label: "测试仓库1",
          value: "123"
        }
      ],
      optionLabel: "label",
      optionValue: "value",
      rules: {
        required: true,
        trigger: "blur"
      }
    }
  ];

  return formItemList;
}
export function formonePlus(that, isEdit) {
  let formItemList = [
    {
      key: "driverName",
      type: "input",
      subtype: "text",
      label: "司机姓名",
      isEdit,
      placeholder: "请输入"
    },
    {
      key: "driverContract",
      type: "input",
      subtype: "text",
      label: "联系电话",
      listeners: {
        blur: () => {
          const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
          if (!reg.test(that.queryForm.driverContract)) {
            that.$message.error("请输入正确的联系电话");
            that.queryForm.driverContract = "";
          }
        }
      },
      isEdit,
      placeholder: "请输入"
    },
    {
      key: "licensePlate",
      type: "input",
      subtype: "text",
      label: "车牌号",
      isEdit,
      placeholder: "请输入"
    },
    {
      key: "driverIds",
      type: "input",
      subtype: "text",
      label: "司机身份证",
      listeners: {
        blur: () => {
          const a = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
          if (!a.test(that.queryForm.driverIds)) {
            that.$message.error("请输入正确的身份证号");
            that.queryForm.driverIds = "";
          }
        }
      },
      isEdit,
      placeholder: "请输入"
    }
  ];

  return formItemList;
}

export function formtwo(that, isEdit) {
  let formItemList = [
    {
      key: "receiveCompanyName",
      type: "input",
      subtype: "text",
      label: "单位名称",
      isEdit,
      attrs: {
        readonly: true,
        suffixIcon: "el-icon-arrow-down"
      },
      listeners: {
        focus: () => that.selectLook("companyName")
      },
      placeholder: "请输入",
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
      disabled: true,
      isEdit,
      placeholder: "请输入"
    },
    {
      key: isEdit ? "shipmentMethodName" : "shipmentMethod",
      type: isEdit ? "input" : "select",
      subtype: "text",
      label: "发货方式",
      isEdit,
      options: that.deliveryType,
      optionLabel: "value",
      optionValue: "code",
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
      key: "receiverContact",
      type: "input",
      subtype: "text",
      label: "收货人联系方式",
      disabled: true,
      isEdit,
      placeholder: "请输入"
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
      subtype: "textarea",
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
