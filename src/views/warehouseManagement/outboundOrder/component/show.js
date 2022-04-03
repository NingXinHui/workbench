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
        disabled: true,
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
        disabled: true,
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
      label: "需出库数量",
      prop: "needOutQty",
      align: "right",
      isEdit: isEdit,
      config: {
        key: "needOutQty",
        type: "input",
        subtype: "text",
        disabled: false,
        placeholder: " "
      }
    },
    {
      label: "批次号",
      prop: "materialLot",
      align: "right",
      isEdit: isEdit,
      config: {
        key: "materialLot",
        type: "input",
        subtype: "text",
        disabled: false,
        placeholder: " "
      }
    },
    {
      label: "库存性质",
      prop: "inventoryNature",
      align: "right",
      isEdit: isEdit,
      config: {
        key: "inventoryNature",
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
      label: "货主",
      prop: "owner",
      align: "right",
      isEdit: isEdit,
      config: {
        key: "owner",
        type: "input",
        subtype: "text",
        disabled: false,
        placeholder: " "
      }
    },
    {
      label: "已拣货数量",
      prop: "pickQty",
      align: "right",
      isEdit: isEdit,
      config: {
        key: "pickQty",
        type: "input",
        subtype: "text",
        disabled: false,
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
      label: "拣配员",
      prop: "pickMan",
      align: "right",
      isEdit: isEdit,
      config: {
        key: "pickMan",
        type: "input",
        subtype: "text",
        disabled: false,
        placeholder: " "
      }
    },
    {
      label: "条码明细",
      prop: "detailCode",
      align: "right",
      isEdit: isEdit,
      config: {
        key: "detailCode",
        type: "input",
        subtype: "text",
        disabled: false,
        placeholder: " "
      }
    },
    {
      label: "仓位",
      prop: "warehouseName",
      align: "right",
      isEdit: isEdit,
      config: {
        key: "warehouseName",
        type: "input",
        subtype: "text",
        disabled: false,
        placeholder: " "
      }
    },
    {
      label: "入库单号",
      prop: "inStoreNo",
      align: "right",
      isEdit: isEdit,
      config: {
        key: "inStoreNo",
        type: "input",
        subtype: "text",
        disabled: false,
        placeholder: " "
      }
    },
    {
      label: "入库类型",
      prop: "inStoreType",
      align: "right",
      isEdit: isEdit,
      config: {
        key: "inStoreType",
        type: "input",
        subtype: "text",
        disabled: false,
        placeholder: " "
      }
    }
  ];

}
