
export function formone(that, isEdit) {
    let formItemList = [
      {
        key: "billNo",
        type: "input",
        subtype: "text",
        label: "进项发票单号",
        isEdit,
        disabled: true,
        placeholder: "保存后自动生成"
      },
      {
        key: isEdit ? "orderTypeName3" : "orderTypeNo3",
        type: isEdit ? "input" : "select",
        subtype: "text",
        label: "发票类别",
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
        key: isEdit ? "orderTypeName3" : "orderTypeNo3",
        type: isEdit ? "input" : "select",
        subtype: "text",
        label: "发票类型",
        isEdit,
        options: that.orderTypeList,
        optionLabel: "orderTypeName",
        optionValue: "orderTypeNo"
      }
    ];

    return formItemList

  }

  export function formtwo(that,isEdit){
    let formItemList = [
      {
        key: "billNo6",
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
        placeholder: "请输入",
        rules: {
          required: true,
          trigger: "blur"
        }
      },
      {
        key: "billN",
        type: "input",
        subtype: "text",
        label: "发票方",
        isEdit,
        rules: {
          required: true,
          trigger: "blur"
        },
        placeholder: ""
      },
      {
        key: "billN",
        type: "input",
        subtype: "text",
        label: "发票金额",
        isEdit,
        rules: {
          required: true,
          trigger: "blur"
        },
        placeholder: "请选择"
      },
      {
        key: "billDate",
        type: "date",
        subtype: "date",
        valueFormat: "yyyy-MM-dd",
        label: "开票日期",
        rules: {
          required: true,
          trigger: "blur"
        },
        isEdit
      },
      {
        key: "billNo6",
        type: "input",
        subtype: "text",
        label: "开票方",
        isEdit,
        attrs: {
          readonly: true,
          suffixIcon: "el-icon-arrow-down"
        },
        listeners: {
          focus: () => that.selectLook("company")
        },
        placeholder: "请输入"
      },
      {
        key: isEdit ? "orderTypeName3" : "orderTypeNo3",
        type: isEdit ? "input" : "select",
        subtype: "text",
        label: "币种",
        isEdit,
        options: that.orderTypeList,
        optionLabel: "orderTypeName",
        optionValue: "orderTypeNo"
      },
      {
        key: "billNo1",
        type: "input",
        subtype: "text",
        label: "付款汇率",
        isEdit,
        placeholder: ""
      },
      {
        key: "billDate",
        type: "date",
        subtype: "date",
        valueFormat: "yyyy-MM-dd",
        label: "业务日期",
        rules: {
          required: true,
          trigger: "blur"
        },
        isEdit
      },
      {
        key: "billNo1",
        type: "input",
        subtype: "text",
        label: "发票税额",
        isEdit,
        placeholder: ""
      },
      {
        key: "billNo1",
        type: "input",
        subtype: "textarea",
        label: "收票类容",
        maxlength: 200,
        isEdit,
        placeholder: ""
      }
    ];

    return formItemList

  }

  export function formThree(that, isEdit) {
    let formItemList = [
      {
        key: isEdit ? "orderTypeName5" : "orderTypeNo5",
        type: isEdit ? "input" : "upload",
        subtype: "text",
        label: "附件",
        isEdit
      },
      {
        key: "billNo6",
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
