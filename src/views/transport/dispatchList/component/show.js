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
export function addone(that) {
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
export function copyone(that) {
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
export function deleteone(that) {
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
 * @desc 表格显示的列[派车明细]
 */
export function tablecol(that, isEdit) {
  return [
    {
      label: "序号",
      type: "index"
    },
    {
      label: "待排车任务号",
      prop: "scheduledTaskId",
      align: "left",
      width: 130,
      isEdit: isEdit,
      config: {
        key: "scheduledTaskId",
        type: "input",
        subtype: "text",
        disabled: true,
        placeholder: " "
      }
    },
    {
      label: "来源单号",
      prop: "sourceNumber",
      align: "left",
      isEdit: isEdit,
      config: {
        key: "sourceNumber",
        type: "input",
        subtype: "text",
        disabled: true,
        placeholder: " "
      }
    },
    {
      label: "源单类型",
      prop: "sourceType",
      align: "left",
      isEdit: isEdit,
      config: {
        key: "sourceType",
        type: "input",
        subtype: "text",
        disabled: true,
        placeholder: " "
      }
    },
    {
      label: "物料编号",
      prop: "materialNumber",
      align: "left",
      isEdit: isEdit,
      config: {
        key: "materialNumber",
        type: "input",
        subtype: "text",
        disabled: true,
        placeholder: " "
      }
    },
    {
      label: "物料名称",
      prop: "materialName",
      align: "left",
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
      prop: "materialDesc",
      align: "left",
      isEdit: isEdit,
      config: {
        key: "materialDesc",
        type: "input",
        subtype: "text",
        disabled: true,
        placeholder: " "
      }
    },
    {
      label: "计量单位",
      prop: "unitMeasure",
      align: "left",
      isEdit: isEdit,
      config: {
        key: "unitMeasure",
        type: "input",
        subtype: "text",
        disabled: true,
        placeholder: " "
      }
    },
    {
      label: "订单数量",
      prop: "orderQuantity",
      align: "left",
      isEdit: isEdit,
      config: {
        key: "orderQuantity",
        type: "input",
        subtype: "text",
        disabled: true,
        placeholder: " "
      }
    }, {
      label: "重量",
      prop: "weight",
      align: "left",
      isEdit: isEdit,
      config: {
        key: "weight",
        type: "input",
        subtype: "text",
        disabled: true,
        placeholder: " "
      }
    }, {
      label: "待运输数量",
      prop: "quantityTransported",
      align: "left",
      isEdit: isEdit,
      config: {
        key: "quantityTransported",
        type: "input",
        subtype: "text",
        disabled: true,
        placeholder: " "
      }
    },
    {
      label: "本次派车数量",
      prop: "dispatchedNumber",
      align: "left",
      isEdit: isEdit,
      config: {
        key: "dispatchedNumber",
        type: "input",
        subtype: "text",
        disabled: true,
        placeholder: " "
      }
    },
    {
      label: "采购申请人",
      prop: "purchaseApplicant",
      align: "left",
      isEdit: isEdit,
      config: {
        key: "purchaseApplicant",
        type: "input",
        subtype: "text",
        disabled: true,
        placeholder: " "
      }
    },
    {
      label: "件数",
      prop: "thingNumber",
      align: "left",
      isEdit: isEdit,
      config: {
        key: "thingNumber",
        type: "input",
        subtype: "text",
        disabled: true,
        placeholder: " "
      }
    },
    {
      label: "地址",
      prop: "address",
      align: "left",
      isEdit: isEdit,
      config: {
        key: "address",
        type: "input",
        subtype: "text",
        disabled: true,
        placeholder: " "
      }
    },
    {
      label: "备注",
      prop: "remark",
      align: "left",
      isEdit: isEdit,
      config: {
        key: "remark",
        type: "input",
        subtype: "text",
        disabled: true,
        placeholder: " "
      }
    }
  ];

}


