
export function formone(that, isEdit) {
    let formItemList = [
      {
        key: "billNo",
        type: "input",
        subtype: "text",
        label: "销售订单号",
        isEdit,
        disabled: true,
        placeholder: "保存后自动生成"
      },
      {
        key: isEdit ? "tradeTypeName" : "tradeType",
        type: isEdit ? "input" : "select",
        subtype: "text",
        label: "贸易类型",
        isEdit,
        options: [
          {
            value: "国内",
            code: "0"
          },
          {
            value: "国外",
            code: "1"
          }
        ],
        listeners: {
          change: () => {
            that.searchSaleType();
          }
        },
        optionLabel: "value",
        optionValue: "code",
        rules: {
          required: true,
          trigger: "blur"
        }
      },
      {
        key: isEdit ? "salesTypeName" : "salesType",
        type: isEdit ? "input" : "select",
        subtype: "text",
        label: "销售类型",
        isEdit,
        options: that.SaleTypeList,
        optionLabel: "typeName",
        optionValue: "typeNo",
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
        placeholder: "请选择"
      },
      {
        key: "checkItemName",
        type: "input",
        subtype: "text",
        label: "客户",
        isEdit,
        attrs: {
          readonly: true,
          suffixIcon: "el-icon-arrow-down"
        },
        listeners: {
          focus: () => that.selectLook("customer")
        },
        rules: {
          required: true,
          trigger: "blur"
        },
        placeholder: "请选择"
      },
      {
        key: "salesPersonName",
        type: "input",
        subtype: "text",
        label: "销售员",
        isEdit,
        attrs: {
          readonly: true,
          suffixIcon: "el-icon-arrow-down"
        },
        listeners: {
          focus: () => that.selectLook("saleman")
        },
        rules: {
          required: true,
          trigger: "blur"
        },
        placeholder: "请选择"
      },
      {
        key: "salesGroupName",
        type: "input",
        subtype: "text",
        label: "销售组",
        isEdit,
        attrs: {
          readonly: true,
          suffixIcon: "el-icon-arrow-down"
        },
        listeners: {
          focus: () => that.selectLook("saleGroup")
        },
        rules: {
          required: true,
          trigger: "blur"
        },
        placeholder: "请选择"
      },
      {
        key: "sourceBillTypeName",
        type: "input",
        subtype: "text",
        label: "源单类型",
        isEdit,
        disabled: true,
        placeholder: "请选择"
      },
      {
        key: "billDate",
        type: "date",
        subtype: "date",
        valueFormat: "yyyy-MM-dd",
        label: "销售日期",
        isEdit,
        placeholder: "请选择"
      },

      {
        key: "contractValidity",
        type: "date",
        subtype: "date",
        valueFormat: "yyyy-MM-dd",
        label: "合同有效期",
        attrs: {
          pickerOptions: {
            disabledDate(time) {
              return time.getTime() < Date.now() - 8.64e7;
            }
          }
        },
        isEdit
      },
      {
        key: "sampleBillNo",
        type: "input",
        subtype: "text",
        label: "打样任务单号",
        isEdit,
        attrs: {
          readonly: true,
          suffixIcon: "el-icon-arrow-down"
        },
        listeners: {
          focus: () => that.selectLook("workOrder")
        },
        placeholder: "请选择"
      },
      {
        key: "companyName",
        type: "input",
        subtype: "text",
        label: "公司主体",
        isEdit,
        disabled: true,
        placeholder: ""
      },
      {
        key: "contactsName",
        type: "input",
        subtype: "text",
        label: "业务联系人",
        isEdit,
        attrs: {
          readonly: true,
          suffixIcon: "el-icon-arrow-down"
        },
        listeners: {
          focus: () => {
            if (!that.queryForm.checkItemNo) {
              that.$message.error("请先选择客户");
              return
            } that.selectLook("business");
          }
        },
        rules: {
          required: true,
          trigger: "blur"
        },
        placeholder: "请选择"
      },
      {
        key: "contactNumber",
        type: "input",
        subtype: "text",
        label: "联系电话",
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
      placeholder: "请输入"
    },
    {
      key: isEdit ? "tradeMethodName" : "tradeMethod",
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
    },
    {
      key: "insure",
      type: "checkbox",
      subtype: "text",
      disabled:isEdit,
      label: "是否信保",
      isEdit,
      placeholder: "请输入"
    }
  ];

  return formItemList;
}

  export function formtwo(that,isEdit){
    let formItemList = [
      {
        key: isEdit ? "shipTypeName" : "shipType",
        type: isEdit ? "input" : "select",
        subtype: "text",
        label: "运输方式",
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
        key: "receiveCompanyName",
        type: "input",
        subtype: "text",
        label: "收货单位",
        isEdit,
        attrs: {
          readonly: true,
          suffixIcon: "el-icon-arrow-down"
        },
        listeners: {
          focus: () => that.selectLook("company")
        },
        placeholder: "请输入",
        rules: {
          required: true,
          trigger: "blur"
        },
        placeholder: "请选择"
      },
      {
        key: "receiver",
        type: "input",
        subtype: "text",
        label: "收货人",
        disabled: true,
        isEdit,
        placeholder: "请选择"
      },
      {
        key: "receiverContact",
        type: "input",
        subtype: "text",
        label: "联系方式",
        disabled: true,
        isEdit,
        placeholder: "请选择"
      },
      {
        key: isEdit ? "receiveProvince" : "receiveProvince",
        type: isEdit ? "input" : "select",
        subtype: "text",
        label: "收货省份",
        isEdit,
        options: that.provinceList,
        optionLabel: "name",
        optionValue: "name"
      },
      {
        key: "receiveDistrict",
        type: "input",
        subtype: "text",
        label: "地址区域",
        disabled: true,
        isEdit,
        placeholder: "请选择"
      },
      {
        key: "receiveAddress",
        type: "input",
        subtype: "text",
        label: "详细地址",
        disabled: true,
        isEdit,
        placeholder: "请选择"
      }
    ];

    return formItemList

  }
   export function formtwoPlus(that, isEdit) {
     let formItemList = [
       {
         key: isEdit ? "shipTypeName" : "shipType",
         type: isEdit ? "input" : "select",
         subtype: "text",
         label: "运输方式",
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
         key: "receiveCompanyName",
         type: "input",
         subtype: "text",
         label: "收货单位",
         isEdit,
         attrs: {
           readonly: true,
           suffixIcon: "el-icon-arrow-down"
         },
         listeners: {
           focus: () => that.selectLook("company")
         },
         placeholder: "请选择",
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
         placeholder: "请选择"
       },
       {
         key: "receiverContact",
         type: "input",
         subtype: "text",
         label: "联系方式",
         disabled: true,
         isEdit,
         placeholder: "请选择"
       },
       {
         key: "shipmentPort",
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
       },
       {
         key: "receiveAddress",
         type: "input",
         subtype: "text",
         label: "详细地址",
         disabled: true,
         isEdit,
         placeholder: "请输入"
       },
       {
         key: "shipmentLatestDate",
         type: "date",
         subtype: "date",
         valueFormat: "yyyy-MM-dd",
         label: "最晚装船日",
         isEdit
       }
     ];

     return formItemList;
   }
  export function formThree(that, isEdit) {
    let formItemList = [
      {
        key: isEdit ? "settlementMethodName" : "settlementMethod",
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
        key: isEdit ? "currencyName" : "currency",
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
        key: "totalAmount",
        type: "input",
        subtype: "text",
        label: "订单金额",
        isEdit,
        disabled: true,
        placeholder: "请输入"
      },
      {
        key: isEdit ? "statisticsFlagName" : "statisticsFlag",
        type: isEdit ? "input" : "select",
        subtype: "text",
        label: "统计标识",
        isEdit,
        options: that.unifiedIdentification,
        optionLabel: "value",
        optionValue: "code",
        rules: {
          required: true,
          trigger: "blur"
        }
      },
      {
        key: isEdit ? "paymentMethodName" : "paymentMethod",
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
        key: "exchangeRate",
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
        placeholder: "请选择"
      },
      {
        key: "frontMoneyAmount",
        type: "input",
        subtype: "text",
        label: "定金金额",
        isEdit,
        placeholder: "请输入"
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
