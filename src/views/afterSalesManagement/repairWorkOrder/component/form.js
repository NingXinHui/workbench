
export function formone(that, isEdit) {
    let formItemList = [
      {
        key: "billNo",
        type: "input",
        subtype: "text",
        label: "售后服务单号",
        isEdit,
        disabled: true,
        placeholder: "保存后自动生成"
      },
      {
        key: "billN",
        type: "input",
        subtype: "text",
        label: "来源单号",
        isEdit,
        attrs: {
          readonly: true,
          suffixIcon: "el-icon-arrow-down"
        },
        listeners: {
          focus: () => (that.orderVisible = true)
        },
        placeholder: "请选择"
      },
      {
        key: "billNo",
        type: "input",
        subtype: "text",
        label: "源单类型",
        isEdit,
        disabled: true,
        placeholder: ""
      },
      {
        key: "billNo",
        type: "input",
        subtype: "text",
        label: "客户名称",
        isEdit,
        disabled: true,
        placeholder: ""
      },
      {
        key: "billNo",
        type: "input",
        subtype: "text",
        label: "公司地址",
        isEdit,
        placeholder: ""
      },
      {
        key: "billNo",
        type: "input",
        subtype: "text",
        label: "详细地址",
        isEdit,
        placeholder: ""
      },
      {
        key: "billNo",
        type: "input",
        subtype: "text",
        label: "联系人",
        isEdit,
        placeholder: ""
      },
      {
        key: "billNo",
        type: "input",
        subtype: "text",
        label: "联系电话",
        isEdit,
        placeholder: ""
      },
      {
        key: "billNo",
        type: "input",
        subtype: "text",
        label: "产品类别",
        isEdit,
        placeholder: ""
      },
      {
        key: "billNo",
        type: "input",
        subtype: "text",
        label: "规格描述",
        isEdit,
        placeholder: ""
      },
      {
        key: "billNo",
        type: "number",
        min: 1,
        max: 99999999,
        precision: 2,
        label: "数量",
        isEdit,
        placeholder: ""
      },
      {
        key: isEdit ? "orderTypeName3" : "orderTypeNo3",
        type: isEdit ? "input" : "select",
        subtype: "text",
        label: "计量单位",
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
        key: "billN",
        type: "input",
        subtype: "text",
        label: "责任人",
        isEdit,
        attrs: {
          readonly: true,
          suffixIcon: "el-icon-arrow-down"
        },
        listeners: {
          focus: () => that.selectLook("responsibility")
        },
        placeholder: "请选择"
      },
      {
        key: isEdit ? "orderTypeName3" : "orderTypeNo3",
        type: isEdit ? "input" : "select",
        subtype: "text",
        label: "服务类型",
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
        key: "billNo",
        type: "input",
        subtype: "text",
        label: "服务地址",
        isEdit,
        placeholder: ""
      },
      {
        key: "billN",
        type: "input",
        subtype: "text",
        label: "业务员",
        isEdit,
        attrs: {
          readonly: true,
          suffixIcon: "el-icon-arrow-down"
        },
        listeners: {
          focus: () => that.selectLook("saleman")
        },
        placeholder: "请选择"
      },
      {
        key: "billNo",
        type: "input",
        subtype: "text",
        label: "公司主体",
        isEdit,
        disabled: true,
        placeholder: ""
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
        label: "问题描述",
        maxlength: 200,
        isEdit,
        placeholder: "请输入"
      },
      {
        key: "salesName",
        type: "input",
        subtype: "textarea",
        label: "期望结果",
        maxlength: 200,
        isEdit,
        placeholder: "请输入"
      }
    ];

    return formItemList

  }
export function formTwo(that, isEdit) {
  let formItemList = [
    {
      key: "billNo",
      type: "input",
      subtype: "text",
      label: "预防措施",
      isEdit,
      placeholder: ""
    },
    {
      key: "billNo",
      type: "input",
      subtype: "text",
      label: "备注",
      isEdit,
      placeholder: ""
    },
    {
      key: "billNo",
      type: "input",
      subtype: "text",
      label: "分析描述",
      isEdit,
      placeholder: ""
    }
  ];

  return formItemList;
}
  export function formthree(that, isEdit) {
    let formItemList = [
      {
        key: "upLoadList",
        type: "upload",
        subtype: "text",
        uploadLabel: "label",
        del: i => {
          that.queryForm.upLoadList.splice(i, 1);
        },
        upload: file => {
          that.queryForm.upLoadList = [
            {
              label: file.file.name,
              file: file.file
            }
          ];
        },
        label: "附件",
        isEdit
      },
      {
        key: isEdit ? "orderTypeName3" : "orderTypeNo3",
        type: isEdit ? "input" : "select",
        subtype: "text",
        label: "客户满意程度",
        isEdit,
        options: that.orderTypeList,
        optionLabel: "orderTypeName",
        optionValue: "orderTypeNo",
      },
      {
        key: "remark",
        type: "input",
        subtype: "textarea",
        label: "客户评价",
        maxlength: 200,
        isEdit,
        placeholder: ""
      }
    ];

    return formItemList;
  }
