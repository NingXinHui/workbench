
export function formone(that, isEdit) {
    let formItemList = [
      {
        key: "hdrId",
        type: "input",
        subtype: "text",
        label: "到货通知单号",
        isEdit,
        disabled: true,
        placeholder: "保存后自动生成"
      },
     
      {
        key:"warehouseName",
        type: isEdit ? "input" : "select",
        subtype: "text",
        label: "到货仓库",
        isEdit,
        options: that.orderTypeList,
        optionLabel: "orderTypeName",
        optionValue: "orderTypeNo"
      },
      {
        key: "checkItemName",
        type: "input",
        subtype: "text",
        label: "加工商名称",
        isEdit,
        disabled: true,
      
        placeholder: "请输入",
        rules: {
          required: true,
          trigger: "blur"
        }
      },
      {
        key: "stock",
        type: isEdit ? "input" : "checkbox",
        subtype: "text",
        label: "是否电商库存",
        isEdit,
      },
      {
        key: "arrivalDate",
        type: "date",
        subtype: "date",
        valueFormat: "yyyy-MM-dd",
        label: "预计到货日期",
        rules: {
          required: true,
          trigger: "blur"
        },
        isEdit
      },
      {
        key: "inspectionFree",
        type: isEdit ? "input" : "checkbox",
        subtype: "text",
        label: "是否免检",
        isEdit,
      }
    ];

    return formItemList

  }

  export function formtwo(that,isEdit){
    let formItemList = [
      {
        key: "arrivalCompanyName",
        type: "input",
        subtype: "text",
        label: "单位名称",
        isEdit,
        attrs: {
          readonly: true,
          suffixIcon: "el-icon-arrow-down"
        },
        listeners: {
          focus: () => that.selectLook("checkItemName")
        },
        placeholder: "请输入",
        rules: {
          required: true,
          trigger: "blur"
        }
      },
      {
        key: "contact",
        type: "input",
        subtype: "text",
        label: "联系人",
        disabled: true,
        isEdit,
        placeholder: "请输入"
      },
      {
        key: "contactTel",
        type: "input",
        subtype: "text",
        label: "联系人方式",
        disabled: true,
        isEdit,
        placeholder: "请输入"
      },
      {
        key: "receiveDistrict",
        type: "input",
        subtype: "text",
        label: "收货省市区",
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
      },
      {
        key: isEdit ? "receiveTypeName" : "receiveType",
    
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
    ];

    return formItemList

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
