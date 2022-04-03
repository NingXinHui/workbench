/**
 * @desc  清除表格的选中项
 */
const clearSelct = (that) => {
  if (that.$refs.mainTable) {
    that.$refs.mainTable.resetSelect();
  }
}
/**
 * @desc 重置表格每一行的唯一值  新增 复制 删除 导入的时候使用
 */
const resetIndexInTable = (that) => {
  that.tableData = that.tableData.map((item, index) => {
    return {
      ...item,
      isIndex: index + 1,
    };
  });
}
/**
 * @desc 新增
 */
export function addone (that) {
  let obj = {
    shortPercent: 0,
    overPercent: 0,
  };
  clearSelct(that);
  that.tableData.push(obj);
  resetIndexInTable(that);
}

/**
 * @desc 复制
 */
export function copyone (that) {
  if (that.multipleSelection.length < 1) {
    that.$message.error("请选择操作项");
    return;
  }
  let array = [];
  that.multipleSelection.forEach((item) => {
    let { id, ...obj } = item;
    array.push(obj);
  });
  that.tableData.push(...array);
  clearSelct(that);
  resetIndexInTable(that);
}

/**
 * @desc 删除
 */
export function deleteone (that) {
  if (that.multipleSelection.length < 1) {
    that.$message.error("请选择操作项");
    return;
  }
  that.$confirm("确认删除选中的数据吗？", "", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      let array = that.tableData;

      that.multipleSelection.forEach((item) => {
        if (item.id) {
          that.deletedIdList.push(item.id);
        }
        let index = array.findIndex((value) => {
          return item.isIndex == value.isIndex;
        });

        if (index != -1) {
          array.splice(index, 1);
        }
      });
      that.tableData = array;
      clearSelct(that);
      resetIndexInTable(that);
    })
    .catch(() => { });
}
/**
 * @desc 表格显示的列
 */
export function tablecol (that, isEdit) {
  return [
    {
      label: "序号",
      type: "index"
    },
    {
      label: "物料Id",
      field: "id",
      type: 1,
      maxLength: "60"
    },
    {
      label: "物料编号",
      prop: "materialNo",
      isEdit: isEdit,
      config: {
        key: "materialNo",
        type: "input",
        subtype: "text",
        placeholder: "请选择",
        attrs: {
          readonly: true,
          suffixIcon: "el-icon-arrow-down"
        },
        listeners: {
          focus: () => that.selectLook("materil")
        },
        custormRules: {
          message: "物料编号不能为空"
        }
      }
    },
    {
      label: "物料名称",
      prop: "materialName",
      align: "right",
      isEdit: isEdit,
      config: {
        key: "materialName",
        type: "input",
        subtype: "text",
        disabled: false,
        placeholder: " "
      }
    },
    {
      label: "物料描述",
      prop: "materialDescription",
      align: "right",
      isEdit: isEdit,
      config: {
        key: "materialDescription",
        type: "input",
        subtype: "text",
        disabled: false,
        placeholder: " "
      }
    },
    {
      label: "厂家批号",
      prop: "factoryLot",
      align: "right",
      isEdit: isEdit,
      config: {
        key: "factoryLot",
        type: "input",
        subtype: "text",
        disabled: false,
        placeholder: " "
      }
    },
    {
      label: "缸号",
      prop: "cardNo",
      align: "right",
      isEdit: isEdit,
      config: {
        key: "cardNo",
        type: "input",
        subtype: "text",
        disabled: false,
        placeholder: " "
      }
    },
    {
      label: "批次号",
      prop: "width",
      align: "right",
      isEdit: isEdit,
      config: {
        key: "width",
        type: "input",
        subtype: "text",
        disabled: false,
        placeholder: " "
      }
    },
    {
      label: "产品形态",
      prop: "productType",
      align: "right",
      isEdit: isEdit,
      config: {
        key: "productType",
        type: "select",
        options: that.productTypes,
        optionLabel: "value",
        optionValue: "id",
        subtype: "text",
        placeholder: " "
      }
    },
    {
      label: "成品等级",
      prop: "productGrade",
      align: "right",
      isEdit: isEdit,
      config: {
        key: "productGrade",
        type: "input",
        subtype: "text",
        disabled: false,
        placeholder: " "
      }
    },
    {
      label: "计量单位",
      prop: "unit",
      align: "right",
      isEdit: isEdit,
      config: {
        key: "unit",
        type: "select",
        options: that.unitListAll,
        optionLabel: "unitName",
        optionValue: "unitCode",
        subtype: "text",
        placeholder: " "
      }
    },
    {
      label: "入库数量",
      prop: "inStoreQty",
      align: "right",
      isEdit: isEdit,
      config: {
        key: "inStoreQty",
        type: "input",
        subtype: "text",
        placeholder: " "
      }
    },
    {
      label: "重量(KG)",
      prop: "weight",
      align: "right",
      isEdit: isEdit,
      config: {
        key: "weight",
        type: "input",
        subtype: "text",
        disabled: false,
        placeholder: " "
      }
    },
    {
      label: "仓位",
      prop: "width",
      align: "right",
      isEdit: isEdit,
      config: {
        key: "width",
        type: "select",
        options: that.unitListAll,
        optionLabel: "unitName",
        optionValue: "unitCode",
        subtype: "text",
        placeholder: " "
      }
    },
    {
      label: "集装箱号",
      prop: "containerNo",
      align: "right",
      isEdit: isEdit,
      config: {
        key: "containerNo",
        type: "input",
        subtype: "text",
        disabled: false,
        placeholder: " "
      }
    },
    {
      label: "拣配员",
      prop: "picker",
      align: "right",
      isEdit: isEdit,
      config: {
        key: "picker",
        type: "input",
        subtype: "text",
        disabled: false,
        placeholder: " "
      }
    },
    {
      label: "条码明细",
      prop: "detailCode",
      isEdit: isEdit,
      config: {
        key: "detailCode",
        type: "number",
        min: 1,
        max: 99999999,
        precision: 2,
        custormRules: {
          message: "退货数量不能为空"
        },
        subtype: "text",
        placeholder: " "
      }
    },
    {
      label: "运费",
      prop: "transportFee",
      align: "right",
      isEdit: isEdit,
      config: {
        key: "transportFee",
        type: "input",
        subtype: "text",
        placeholder: " "
      }
    },
    {
      label: "统计标识",
      prop: "statisticalIdentification",
      align: "right",
      isEdit: isEdit,
      config: {
        key: "statisticalIdentification",
        type: "input",
        subtype: "text",
        placeholder: " "
      }
    },
    {
      label: "货运代理费",
      prop: "width",
      align: "right",
      isEdit: isEdit,
      config: {
        key: "width",
        type: "input",
        subtype: "text",
        disabled: false,
        placeholder: " "
      }
    },
  ];

}
