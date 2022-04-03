/**
 * @desc 表格显示的列
 */
export function tablecol(that, isEdit) {
  return [
    {
      label: "供应商名称",
      prop: "supplierName"
    },
    {
      label: "物料编号",
      prop: "materialNo"
    },
    {
      label: "物料名称",
      prop: "materialName"
    },
    {
      label: "物料分类", //无
      prop: "materialNo"
    },
    {
      label: "物料批次",
      prop: "materialLot"
    },
    {
      label: "修改时剩余数量",
      prop: "remainingQty",
      width: 130
    },
    {
      label: "当前价格",
      prop: "beforeEditPrice"
    },
    {
      label: "修改后价格",
      prop: "afterEditPrice",
      align: "right",
      width: 130,
      isEdit: isEdit,
      config: {
        key: "afterEditPrice",
        subtype: "text",
        type: "number",
        min: 1,
        max: 99999999,
        precision: 2,
        custormRules: {
          message: "修改后价格不能为空"
        },
        placeholder: " "
      }
    },
    {
      label: "资金使用值",
      prop: "useAmount",
      isEdit: isEdit,
      config: {
        key: "materialLot",
        type: "input",
        subtype: "text",
        custormRules: {
          message: "资金使用值不能为空"
        },
        placeholder: " "
      }
    },
    {
      label: "生效日期",
      prop: "effectiveDate",
      isEdit: isEdit,
      width: 160,
      config: {
        key: "effectiveDate",
        type: "date",
        subtype: "date",
        valueFormat: "yyyy-MM-dd"
      }
    },
    {
      label: "失效日期",
      prop: "expirationDate",
      isEdit: isEdit,
      width: 160,
      config: {
        key: "effectiveDate",
        type: "date",
        subtype: "date",
        valueFormat: "yyyy-MM-dd"
      }
    },
    {
      label: "物料描述",
      prop: "materialDescription"
    },
    {
      label: "采购订单号",
      prop: "purchaseNo"
    },
    {
      label: "采购员",
      prop: "buyerName"
    },
    {
      label: "采购组", //无字段
      prop: "departmentName"
    },
    {
      label: "备注",
      prop: "remark"
    }
  ];
}
