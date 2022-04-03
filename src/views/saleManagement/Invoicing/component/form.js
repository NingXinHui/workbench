
export function formone(that, isEdit) {
    let formItemList = [
      {
        key: "billNo",
        type: "input",
        subtype: "text",
        label: "开票申请单号",
        isEdit,
        disabled: true,
        placeholder: "保存后自动生成"
      },
      {
        key: "billN",
        type: "input",
        subtype: "text",
        label: "开票总金额",
        isEdit,
        disabled: true,
        placeholder: "请选择"
      },
      {
        key: isEdit ? "orderTypeName3" : "orderTypeNo3",
        type: isEdit ? "input" : "select",
        subtype: "text",
        label: "发票类型",
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
        key: isEdit ? "orderTypeName5" : "orderTypeNo5",
        type: isEdit ? "input" : "upload",
        subtype: "text",
        label: "附件",
        isEdit
      },
      {
        key: "salesName",
        type: "input",
        subtype: "textarea",
        label: "备注",
        maxlength: 200,
        isEdit,
        placeholder: "请输入"
      }
    ];

    return formItemList

  }
