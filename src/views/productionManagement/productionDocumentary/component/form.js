
export function formone(that, isEdit) {
    let formItemList = [
      {
        key: "billNo",
        type: "input",
        subtype: "text",
        label: "跟单任务号",
        isEdit,
        disabled: true,
        placeholder: "保存后自动生成"
      },
      {
        key: "materialNo",
        type: "input",
        subtype: "text",
        label: "物料编号",
        disabled: true,
        isEdit,
        placeholder: "请输入"
      },
      {
        key: "materialName",
        type: "input",
        subtype: "text",
        label: "物料名称",
        disabled: true,
        isEdit,
        placeholder: "请输入"
      },
      {
        key: "materialDescribe",
        type: "input",
        subtype: "text",
        label: "物料描述",
        disabled: true,
        isEdit,
        placeholder: "请输入"
      },
      {
        key: "outsourceNo",
        type: "input",
        subtype: "text",
        label: "委外加工单号",
        disabled: true,
        isEdit,
        placeholder: "请输入"
      },
      {
        key: "color",
        type: "input",
        subtype: "text",
        label: "颜色",
        disabled: true,
        isEdit,
        placeholder: "请输入"
      },
      {
        key: "qty",
        type: "input",
        subtype: "text",
        label: "数量",
        disabled: true,
        isEdit,
        placeholder: "请输入"
      },
      {
        key: "productionTaskNo",
        type: "input",
        subtype: "text",
        label: "生产任务书号",
        disabled: true,
        isEdit,
        placeholder: "请输入"
      },
      {
        key: "followProcess",
        type: "input",
        subtype: "text",
        label: "跟单流程",
        disabled: true,
        isEdit,
        placeholder: "请输入"
      },
      {
        key: isEdit ? "followName" : "followMan",
        type: isEdit ? "input" : "selectLook",
        subtype: "text",
        label: "跟单员",
        isEdit,
        multiple: true,
        collapse: true,
        multipleLimit: 10,
        showLook: () => {
          that.isSelectMore = true;
          that.selectLook("applyMan");
        },
        options: that.personList,
        optionLabel: "fullName",
        optionValue: "id",
        rules: {
          required: true,
          trigger: "blur"
        }
      }
    ];

    return formItemList

  }


  export function formtwo(that, isEdit) {
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
