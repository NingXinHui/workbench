
export function formone(that, isEdit) {
    let formItemList = [
      {
        key: "billNo",
        type: "input",
        subtype: "text",
        label: "采购订单号",
        isEdit,
        disabled: true,
        placeholder: "保存后自动生成"
      },
      {
        key: isEdit ? "tradeMethodName" : "tradeMethod",
        type: isEdit ? "input" : "select",
        subtype: "text",
        label: "贸易类型",
        isEdit,
        options: [
          {
            label: "国内",
            value: "1"
          },
          {
            label: "国外",
            value: "2"
          }
        ],
        listeners: {
          change: () => {
            that.selectPurchaseType();
          }
        },
        optionLabel: "label",
        optionValue: "value",
        rules: {
          required: true,
          trigger: "blur"
        }
      },
      {
        key: isEdit ? "purchaseTypeName" : "purchaseTypeId",
        type: isEdit ? "input" : "select",
        subtype: "text",
        label: "采购类型",
        isEdit,
        options: that.PurchaseType,
        optionLabel: "typeName",
        optionValue: "id",
        listeners: {
          change: val => {
            let index = that.PurchaseType.findIndex(item => {
              return item.id == val;
            });
            that.queryForm.purchaseTypeCode = that.PurchaseType[index].typeNo;
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
        key: "supplierName",
        type: "input",
        subtype: "text",
        label: "供应商",
        isEdit,
        attrs: {
          readonly: true,
          suffixIcon: "el-icon-arrow-down"
        },
        listeners: {
          focus: () => that.selectLook("supplier")
        },
        rules: {
          required: true,
          trigger: "blur"
        }
      },
      {
        key: "purchaserName",
        type: "input",
        subtype: "text",
        label: "采购员",
        isEdit,
        attrs: {
          readonly: true,
          suffixIcon: "el-icon-arrow-down"
        },
        listeners: {
          focus: () => that.selectLook("purchase")
        },
        rules: {
          required: true,
          trigger: "blur"
        }
      },
      {
        key: "purchaseGroupName",
        type: "input",
        subtype: "text",
        label: "采购组",
        isEdit,
        attrs: {
          readonly: true,
          suffixIcon: "el-icon-arrow-down"
        },
        listeners: {
          focus: () => that.selectLook("purchaseGroup")
        },
        rules: {
          required: true,
          trigger: "blur"
        }
      },
      {
        key: "sourceBillTypeName",
        type: "input",
        subtype: "text",
        label: "源单类型",
        isEdit,
        disabled: true,
        placeholder: ""
      },
      {
        key: "purchaseDate",
        type: "date",
        subtype: "date",
        valueFormat: "yyyy-MM-dd",
        label: "采购日期",
        isEdit,
        rules: {
          required: true,
          trigger: "blur"
        }
      },

      {
        key: "contractValidity",
        type: "date",
        subtype: "date",
        valueFormat: "yyyy-MM-dd",
        label: "合同有效期",
        isEdit,
        attrs: {
          pickerOptions: {
            disabledDate(time) {
              return (
                time.getTime() < new Date(that.queryForm.purchaseDate) - 8.64e7
              );
            }
          }
        },
        rules: {
          required: true,
          trigger: "blur"
        }
      },
      {
        key: "businessEntityName",
        type: "input",
        subtype: "text",
        label: "公司主体",
        isEdit,
        disabled: true,
        placeholder: ""
      }
    ];

    return formItemList

  }
export function formonePlus(that, isEdit) {
  let formItemList = [
    {
      key: "pi",
      type: "input",
      subtype: "text",
      label: "外方PI",
      isEdit,
      placeholder: "请选择"
    },
    {
      key: isEdit ? "tradeTypeName" : "tradeType",
      type: isEdit ? "input" : "select",
      subtype: "text",
      label: "贸易方式",
      isEdit,
      options: that.tradeType,
      optionLabel: "value",
      optionValue: "code"
    },
    {
      key: "tradeCountry",
      type: "input",
      subtype: "text",
      label: "贸易国别",
      isEdit,
      disabled: true,
      placeholder: ""
    }
  ];

  return formItemList;
}

  export function formtwo(that,isEdit){
    let formItemList = [
      {
        key: isEdit ? "deliveryTypeName" : "deliveryType",
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
        key: "supplierContactsName",
        type: "input",
        subtype: "text",
        label: "业务联系人",
        isEdit,
        attrs: {
          readonly: true,
          suffixIcon: "el-icon-arrow-down"
        },
        listeners: {
          focus: () => that.selectLook("salesMan")
        },
        placeholder: "请输入",
        rules: {
          required: true,
          trigger: "blur"
        }
      },
      {
        key: "supplierPhone",
        type: "input",
        subtype: "text",
        label: "联系人电话",
        disabled:true,
        isEdit,
        placeholder: "请输入"
      }
    ];

    return formItemList

  }
   export function formtwoPlus(that, isEdit) {
     let formItemList = [
       {
         key: "latestShipmentDate",
         type: "date",
         subtype: "date",
         valueFormat: "yyyy-MM-dd",
         label: "最晚装船日",
         isEdit
       },
       {
         key: "loadingPort",
         type: "input",
         subtype: "text",
         label: "装运港",
         isEdit,
         placeholder: "请输入"
       },
       {
         key: "destinationPort",
         type: "input",
         subtype: "text",
         label: "目的港",
         isEdit,
         placeholder: "请输入"
       }
     ];

     return formItemList;
   }
  export function formThree(that, isEdit) {
    let formItemList = [
      {
        key: isEdit ? "settlementTypeName" : "settlementType",
        type: isEdit ? "input" : "select",
        subtype: "text",
        label: "结算方式",
        isEdit,
        options: that.settlementType,
        optionLabel: "value",
        optionValue: "code",
        rules: {
          required: true,
          trigger: "blur"
        }
      },
      {
        key: isEdit ? "currency" : "currency",
        type: isEdit ? "input" : "select",
        subtype: "text",
        label: "币种",
        isEdit,
        options: that.orderTypeList,
        optionLabel: "orderTypeName",
        optionValue: "orderTypeNo",
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
        isEdit,
        disabled: true,
        placeholder: "请输入"
      },
      {
        key: isEdit
          ? "statisticalIdentificationName"
          : "statisticalIdentification",
        type: isEdit ? "input" : "select",
        subtype: "text",
        label: "统计标识",
        isEdit,
        options: that.unifiedIdentification,
        optionLabel: "value",
        optionValue: "code"
      },
      {
        key: isEdit ? "paymentTypeName" : "paymentType",
        type: isEdit ? "input" : "select",
        subtype: "text",
        label: "支付方式",
        isEdit,
        options: that.paymentType,
        optionLabel: "value",
        optionValue: "code",
        rules: {
          required: true,
          trigger: "blur"
        }
      },
      {
        key: "contractExchangeRate",
        type: "input",
        subtype: "text",
        label: "合同汇率",
        isEdit,
        disabled: true,
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
      },
      {
        key: "contractArchiving",
        type: "checkbox",
        subtype: "text",
        disabled:isEdit,
        label: "合同是否归档",
        isEdit,
        placeholder: "请输入"
      },
      {
        key: "amoebaRule",
        type: "input",
        subtype: "text",
        label: "阿米巴规则",
        isEdit,
        attrs: {
          readonly: true,
          suffixIcon: "el-icon-arrow-down"
        },
        listeners: {
          focus: () => that.selectLook("rules")
        },
        placeholder: "请输入"
      }
    ];

    return formItemList;
  }
  export function formfive(that, isEdit) {
    let formItemList = [
      {
        key: "financingUnitName",
        type: "input",
        subtype: "text",
        label: "融资单位",
        isEdit,
        attrs: {
          readonly: true,
          suffixIcon: "el-icon-arrow-down"
        },
        listeners: {
          focus: () => that.selectLook("company")
        }
      },
      {
        key: "interestRate",
        type: "input",
        subtype: "text",
        label: "利率(%)",
        isEdit,
        placeholder: ""
      }
    ];

    return formItemList;
  }

    export function formsix(that, isEdit) {
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
