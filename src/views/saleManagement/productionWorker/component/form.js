export function formone(that, isEdit) {
  let formItemList = [
    {
      key: "billNo",
      type: "input",
      subtype: "text",
      label: "生产任务书号",
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
      placeholder: "请选择"
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
      key: "deliveryDate",
      type: "date",
      subtype: "date",
      valueFormat: "yyyy-MM-dd",
      label: "生产交期",
      isEdit
    },
    {
      key: isEdit ? "productionTypeName" : "productionType",
      // key: "productionType",
      type: isEdit ? "input" : "select",
      subtype: "text",
      label: "生产类型",
      isEdit,
      options: that.productTypeList,
      optionLabel: "value",
      optionValue: "code",
      rules: {
        required: true,
        trigger: "blur"
      }
    },
    {
      // key: "productionCategory",
      key: isEdit ? "productionCategoryName" : "productionCategory",

      type: isEdit ? "input" : "radio",
      subtype: "text",
      label: "生产业务",
      isEdit,
      options: [
        {
          label: "大货",
          value: 0
        },
        {
          label: "打样",
          value: 1
        }
      ]
    },
    {
      // key: isEdit ? "orderTypeName3" : "productionManName",
      key: "productionManName",
      // type: isEdit ? "input" : "select",
      type: "selectLook",
      subtype: "text",
      label: "生产业务员",
      isEdit,
      attrs: {
        readonly: true,
        suffixIcon: "el-icon-arrow-down"
      },
      listeners: {
        focus: () => {
          that.selectLook("saleMan1");
        }
      },
      rules: {
        required: true,
        trigger: "blur"
      }

    },
    {
      // key: isEdit ? "orderTypeName3" : "productionDepartmentName",
      key: "productionDepartmentName",
      // type: isEdit ? "input" : "select",
      type: "selectLook",

      subtype: "text",
      label: "生产部门",
      isEdit,
      /*  options: that.orderTypeList,
        optionLabel: "orderTypeName",
        optionValue: "orderTypeNo", */
      listeners: {
        focus: () => that.selectLook("departMent")
      },
      rules: {
        required: true,
        trigger: "blur"
      }
    },
    {
      key: isEdit ? "productionTaskTypeName" : "productionTaskType",
      // key:'productionTaskType',
      type: isEdit ? "input" : "select",
      subtype: "text",
      label: "任务书类型",
      clearable: true,
      isEdit,
      options: [
        {
          label: "定织",
          // value: "定织"
          value: 0
        },
        {
          label: "定染",
          // value: "定染"
          value: 1
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

export function formtwo(that, isEdit) {
  let formItemList = [
    {
      key: "salesManName",
      type: "selectLook",
      subtype: "text",
      label: "业务员",
      isEdit,
      attrs: {
        readonly: true,
        suffixIcon: "el-icon-arrow-down"
      },
      listeners: {
        focus: () => that.selectLook("saleMan")
      },
      placeholder: "请输入",
     /*  rules: {
        required: true,
        trigger: "blur"
      } */
    },
    {
      // key: isEdit ? "salesManDepartmentName" : "salesManDepartmentId",
      key: "salesManDepartmentName",
      type: "selectLook",
      subtype: "text",
      label: "业务员部门",
      isEdit,
      listeners: {
        focus: () => that.selectLook("departMent1")
      },
     /*  rules: {
        required: true,
        trigger: "blur"
      } */
    }
  ];

  return formItemList;
}

export function formThree(that, isEdit) {
  let formItemList = [
    {
      key: "gramWeight",
      type: "input",
      subtype: "text",
      label: "克重",
      maxlength: 40,
      isEdit,
      placeholder: "",
      attrs: {
        onkeyup:
          "if(!/(^$)|(^[\u4E00-\u9FA5a-zA-Z0-9,]{1,250}$)/.test(this.value)){this.value=''}"
      },
    },
    {
      key: "width",
      type: "input",
      subtype: "text",
      label: "幅宽",
      maxlength: 40,
      isEdit,
      placeholder: "",
      attrs: {
        onkeyup:
          "if(!/(^$)|(^[\u4E00-\u9FA5a-zA-Z0-9,]{1,250}$)/.test(this.value)){this.value=''}"
      },
    },
    {
      key: "strength",
      type: "input",
      subtype: "text",
      label: "强力",
      maxlength: 40,
      isEdit,
      placeholder: "",
      attrs: {
        onkeyup:
          "if(!/(^$)|(^[\u4E00-\u9FA5a-zA-Z0-9,]{1,250}$)/.test(this.value)){this.value=''}"
      },
    },
    {
      key: "brushed",
      type: "input",
      subtype: "text",
      label: "磨毛",
      maxlength: 40,
      isEdit,
      placeholder: "",
      attrs: {
        onkeyup:
          "if(!/(^$)|(^[\u4E00-\u9FA5a-zA-Z0-9,]{1,250}$)/.test(this.value)){this.value=''}"
      },
    },
    {
      key: "color",
      type: "input",
      subtype: "text",
      label: "颜色",
      maxlength: 40,
      isEdit,
      placeholder: "",
      attrs: {
        onkeyup:
          "if(!/(^$)|(^[\u4E00-\u9FA5a-zA-Z0-9,]{1,250}$)/.test(this.value)){this.value=''}"
      },
    },
    {
      key: "dyeingType",
      type: "input",
      subtype: "text",
      label: "印花类型",
      maxlength: 40,
      isEdit,
      placeholder: "",
      attrs: {
        onkeyup:
          "if(!/(^$)|(^[\u4E00-\u9FA5a-zA-Z0-9,]{1,250}$)/.test(this.value)){this.value=''}"
      },
    },
    {
      key: "purpose",
      type: "input",
      subtype: "text",
      label: "用途",
      maxlength: 40,
      isEdit,
      placeholder: "",
      attrs: {
        onkeyup:
          "if(!/(^$)|(^[\u4E00-\u9FA5a-zA-Z0-9,]{1,250}$)/.test(this.value)){this.value=''}"
      },
    }
  ];

  return formItemList;
}
export function formThreePlus(that, isEdit) {
  let formItemList = [
    {
      key: "gramWeight",
      type: "input",
      subtype: "text",
      label: "克重",
      maxlength: 40,
      isEdit,
      placeholder: "",
      attrs: {
        onkeyup:
          "if(!/(^$)|(^[\u4E00-\u9FA5a-zA-Z0-9,]{1,250}$)/.test(this.value)){this.value=''}"
      },
    },
    {
      key: "width",
      type: "input",
      subtype: "text",
      label: "幅宽",
      maxlength: 40,
      isEdit,
      placeholder: "",
      attrs: {
        onkeyup:
          "if(!/(^$)|(^[\u4E00-\u9FA5a-zA-Z0-9,]{1,250}$)/.test(this.value)){this.value=''}"
      },
    },
    {
      key: "strength",
      type: "input",
      subtype: "text",
      label: "强力",
      maxlength: 40,
      isEdit,
      placeholder: "",
      attrs: {
        onkeyup:
          "if(!/(^$)|(^[\u4E00-\u9FA5a-zA-Z0-9,]{1,250}$)/.test(this.value)){this.value=''}"
      },
    },
    {
      key: "pullOblique",
      type: "input",
      subtype: "text",
      label: "拉斜",
      maxlength: 40,
      isEdit,
      placeholder: "",
      attrs: {
        onkeyup:
          "if(!/(^$)|(^[\u4E00-\u9FA5a-zA-Z0-9,]{1,250}$)/.test(this.value)){this.value=''}"
      },
    },
    {
      key: "otherIndex",
      type: "input",
      subtype: "text",
      label: "其他指标",
      maxlength: 40,
      isEdit,
      placeholder: "",
      attrs: {
        onkeyup:
          "if(!/(^$)|(^[\u4E00-\u9FA5a-zA-Z0-9,]{1,250}$)/.test(this.value)){this.value=''}"
      },
    }
  ];

  return formItemList;
}
export function formFour(that, isEdit) {
  let formItemList = [
    {
      key: isEdit ? "documentaryFlowName" : "documentaryFlow",
      // key: "documentaryFlow",
      type: isEdit ? "input" : "select",
      subtype: "text",
      label: "跟单流程",
      isEdit,
      options: that.trackList,
      optionLabel: "billName",
      optionValue: "id",
     /*  rules: {
        required: true,
        trigger: "blur"
      } */
    },
    {
      key: "companyName",
      type: "input",
      subtype: "text",
      label: "公司主体",
      maxlength: 200,
      disabled: true,
      isEdit,
      placeholder: "",
      rules: {
        required: true,
        trigger: "blur"
      }
    },
    {
      key: "remark",
      type: "input",
      subtype: "textarea",
      label: "备注",
      maxlength: 500,
      isEdit,
      placeholder: "请输入不超过500字备注"
    }
  ];

  return formItemList;
}
