
export function formone(that, isEdit) {
    let formItemList = [
      {
        key: "billNo1",
        type: "input",
        subtype: "text",
        label: "物料查询",
        isEdit,
        placeholder: ""
      },
      {
        key: "billNo",
        type: "input",
        subtype: "text",
        label: "物料分类",
        isEdit,
        placeholder: ""
      },
      {
        key: "billNo",
        type: "input",
        subtype: "text",
        label: "订单号",
        isEdit,
        placeholder: ""
      },
      {
        key: "billNo",
        type: "input",
        subtype: "text",
        label: "供应商",
        isEdit,
        placeholder: ""
      },
      {
        key: "typeName",
        type: isEdit ? "input" : "select",
        subtype: "text",
        label: "采购员",
        isEdit,
        options: [
          {
            label: "物流",
            value: "物流"
          },
          {
            label: "直送",
            value: "直送"
          },
          {
            label: "自提",
            value: "自提"
          }
        ],
        optionLabel: "label",
        optionValue: "value",
        rules: {
          required: true,
          trigger: "blur"
        }
      },
      {
        key: isEdit ? "orderTypeName3" : "orderTypeNo3",
        type: isEdit ? "input" : "select",
        subtype: "text",
        label: "采购员组",
        isEdit,
        options: that.orderTypeList,
        optionLabel: "orderTypeName",
        optionValue: "orderTypeNo",
        rules: {
          required: true,
          trigger: "blur"
        }
      }
    ];

    return formItemList

  }
