export function formone(that, isEdit) {
  let formItemList = [
    {
      key: "billNo",
      type: "input",
      subtype: "text",
      label: "委外加工单号",
      isEdit,
      disabled: true,
      placeholder: "保存后自动生成"
      /*  rules: {
        required: true,
        trigger: "blur"
      } */
    },
    {
      // key: isEdit?"processType":"processTypeName",
      key: "processType",
      type: isEdit ? "input" : "select",
      subtype: "text",
      label: "加工类型",
      isEdit,
      options: that.processTypeList,
      optionLabel: "value",
      optionValue: "code",
      rules: {
        required: true,
        trigger: "blur"
      }
    },

    {
      key: "sourceNo",
      type: "input",
      subtype: "text",
      label: "来源单号",
      isEdit,
      disabled: true,
      placeholder: ""
      /*  rules: {
        required: true,
        trigger: "blur"
      } */
    },
    {
      key: "sourceType",
      type: "input",
      subtype: "text",
      label: "源单类型",
      isEdit,
      disabled: true,
      placeholder: ""
      /*  rules: {
        required: true,
        trigger: "blur"
      } */
    },
    {
      key: "orderNo",
      type: "input",
      subtype: "text",
      label: "关联销售单号",
      isEdit,
      disabled: true,
      placeholder: ""
      /* rules: {
        required: true,
        trigger: "blur"
      } */
    },

    {
      key: "salesman",
      type: "input",
      subtype: "text",
      label: "生产业务员",
      isEdit,
      disabled: true,
      placeholder: ""
      /*  rules: {
        required: true,
        trigger: "blur"
      } */
    },
    {
      key: "department",
      type: "input",
      subtype: "text",
      label: "生产部门",
      isEdit,
      disabled: true,
      placeholder: ""
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
      isEdit,
      disabled: true,
      placeholder: ""
      /*  rules: {
        required: true,
        trigger: "blur"
      } */
    },
    {
      key: "checkItemName",
      // type: "input",
      type: "selectLook",

      subtype: "text",
      label: "加工商名称",
      isEdit,
      listeners: {
        focus: () => {
          that.selectLook("checkItemName");
        }
      },
      // disabled: true,
      rules: {
        required: true,
        trigger: "blur"
      },
      placeholder: ""
    },
    {
      key: "checkItemUserName",
      // type: "input",
      type: "selectLook",

      subtype: "text",
      label: "加工商联系人",
      isEdit,
      listeners: {
        focus: () => {
          that.selectLook("checkUserName");
        }
      },
      // disabled: true,
      rules: {
        required: true,
        trigger: "blur"
      },
      placeholder: ""
    },

    {
      key: "deliveryDate",
      type: "input",
      subtype: "text",
      label: "生产交期",
      isEdit,
      disabled: true,
      placeholder: ""
      /* rules: {
        required: true,
        trigger: "blur"
      } */
    },
    {
      key: "telephone",
      type: "input",
      subtype: "text",
      label: "联系电话",
      isEdit,
      disabled: true,
      placeholder: ""
      /*  rules: {
        required: true,
        trigger: "blur"
      } */
    },
    /*   {
      key: "businessStatus",
      type: "input",
      subtype: "text",
      label: "业务状态",
      isEdit,
      disabled: true,
      placeholder: "",
      rules: {
        required: true,
        trigger: "blur"
      }
    }, */
    {
      key: isEdit ? "applicantName" : "applicant",
      type: "input",
      subtype: "text",
      label: "申请人",
      isEdit,
      disabled: true,
      placeholder: ""
      /* rules: {
        required: true,
        trigger: "blur"
      } */
    },
    {
      // key:isEdit? "businessTypeName":"businessType",
      key: "businessType",
      type: isEdit ? "input" : "radio",
      subtype: "text",
      label: "生产业务",
      /*  rules: {
        required: true,
        trigger: "blur"
      }, */
      isEdit,
      options: [
        {
          label: "大货",
          value: "1"
        },
        {
          label: "打烊",
          value: "2"
        }
      ]
    }
  ];

  return formItemList;
}

export function formtwo(that, isEdit) {
  let formItemList = [
    {
      key: "gramWeight",
      type: "input",
      subtype: "text",
      label: "克重",
      disabled: true,
      isEdit,
      placeholder: "请输入",
     /*  rules: {
        required: true,
        trigger: "blur"
      } */
    },
    {
      key: "widthCloth",
      type: "input",
      subtype: "text",
      label: "幅宽",
      disabled: true,
      isEdit,
      placeholder: "请输入",
      /* rules: {
        required: true,
        trigger: "blur"
      } */
    },
    {
      key: "forceful",
      type: "input",
      subtype: "text",
      label: "强力",
      disabled: true,
      isEdit,
      placeholder: "请输入",
      /* rules: {
        required: true,
        trigger: "blur"
      } */
    },
    {
      key: "frosting",
      type: "input",
      subtype: "text",
      label: "磨毛",
      disabled: true,
      isEdit,
      placeholder: "请输入",
      /* rules: {
        required: true,
        trigger: "blur"
      } */
    },
    {
      key: "color",
      type: "input",
      subtype: "text",
      label: "颜色",
      disabled: true,
      isEdit,
      placeholder: "请输入",
      /* rules: {
        required: true,
        trigger: "blur"
      } */
    },
    {
      key: "printType",
      type: "input",
      subtype: "text",
      label: "印花类型",
      disabled: true,
      isEdit,
      placeholder: "请输入",
     /*  rules: {
        required: true,
        trigger: "blur"
      } */
    },
    {
      key: "purpose",
      type: "input",
      subtype: "text",
      label: "用途",
      disabled: true,
      isEdit,
      placeholder: "请输入",
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
      key: "checkBillName",
      type: "input",
      subtype: "text",
      label: "跟单流程",
      disabled: true,
      isEdit,
      placeholder: "请输入",
      rules: {
        required: true,
        trigger: "blur"
      }
    },


    {
      key: "repair",
      // type: "input",
      type: isEdit ? "input" : "radio",
      subtype: "textarea",
      label: "是否回修",

      isEdit,

      options: [
        {
          label: "可用",
          value: true
        },
        {
          label: "不可用",
          value: false
        }
      ]
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

export function formFour(that, isEdit) {
  let formItemList = [
    {
      key: "settlementType",
      type: isEdit ? "input" : "select",

      subtype: "text",
      label: "结算方式",
      isEdit,
      placeholder: "请输入",
      options: that.settleTypeList,
      optionLabel: "value",
      optionValue: "code",
      rules: {
        required: true,
        trigger: "blur"
      }
    },
    {
      key: "currency",
      // type: "input",
      type: isEdit ? "input" : "select",
      clearable: true,
      isEdit,
      subtype: "text",
      label: "币种",
      options: [
        {
          label: "人名币",
          value: 0
        },
        {
          label: "港元",
          value: 1
        }
      ],
      optionLabel: "value",
      optionValue: "code",
      placeholder: "请输入",
      rules: {
        required: true,
        trigger: "blur"
      }
    },
    {
      key: "orderAmount",
      type: "input",
      subtype: "text",
      label: "订单金额",
      disabled: true,
      isEdit,
      placeholder: "请输入"
      /*  rules: {
        required: true,
        trigger: "blur"
      } */
    },
    {
      key: "statisticalIdentification",
      // type: "input",
      type: isEdit ? "input" : "select",

      subtype: "text",
      label: "统计标识",
      options: that.unitIdentyList,
      optionLabel: "value",
      optionValue: "code",
      isEdit,
      placeholder: "请输入"
      /*  rules: {
        required: true,
        trigger: "blur"
      } */
    },
    {
      key: "paymentType",
      type: isEdit ? "input" : "select",

      subtype: "text",
      label: "支付方式",

      isEdit,
      placeholder: "请输入",
      options: that.paymentTypeList,
      optionLabel: "value",
      optionValue: "code",
      rules: {
        required: true,
        trigger: "blur"
      }
    },
    {
      key: "amoebaRule",
      type: "input",
      subtype: "text",
      label: "阿米巴规则",

      isEdit,
      placeholder: "请输入",
      rules: {
        required: true,
        trigger: "blur"
      }
    },
    {
      key: "depositAmount",
      type: "input",
      subtype: "text",
      label: "定金金额",

      isEdit,
      placeholder: "请输入"
      /*  rules: {
        required: true,
        trigger: "blur"
      } */
    },
    {
      key: "contractArchiving",
      type: isEdit ? "input" : "radio",
      subtype: "text",
      label: "合同是否归档",
      isEdit,
      options: [
        {
          label: "是",
          value: true
        },
        {
          label: "否",
          value: false
        }
      ]
    }
  ];
  return formItemList;
}
