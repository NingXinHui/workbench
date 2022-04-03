
export function formone(that, isEdit) {
    let formItemList = [
      {
        key: "billNo",
        type: "input",
        subtype: "text",
        label: "BOM编号",
        isEdit,
        disabled: true,
        placeholder: "保存后自动生成"
      },
      {
        key: "materialNo",
        type: "input",
        subtype: "text",
        label: "物料编号",
        isEdit,
        attrs: {
          readonly: true,
          suffixIcon: "el-icon-arrow-down"
        },
        listeners: {
          focus: () => that.selectLook("material")
        },
        placeholder: "请选择",
        rules: {
          required: true,
          trigger: "blur"
        }
      },
      {
        key: "materialDescribe",
        type: "input",
        subtype: "text",
        label: "物料描述",
        isEdit,
        disabled: true,
        placeholder: "请选择"
      },
      {
        key: "usable",
        type: "checkbox",
        subtype: "text",
        label: "是否可用",
        disabled: isEdit,
        isEdit,
        placeholder: "请输入"
      },
      {
        key: "billName",
        type: "input",
        subtype: "text",
        label: "BOM名称",
        isEdit,
        placeholder: "请输入",
        rules: {
          required: true,
          trigger: "blur"
        }
      },
      {
        key: "materialName",
        type: "input",
        subtype: "text",
        label: "物料名称",
        isEdit,
        disabled: true,
        placeholder: "请选择"
      },
      {
        key: "unit",
        type: "input",
        subtype: "text",
        label: "计量单位",
        isEdit,
        disabled: true,
        placeholder: "请选择"
      },
      {
        key: isEdit ? "orderTypeName5" : "orderTypeNo5",
        type: isEdit ? "input" : "upload",
        subtype: "text",
        label: "附件",
        isEdit
      },
      {
        key: "remark",
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
