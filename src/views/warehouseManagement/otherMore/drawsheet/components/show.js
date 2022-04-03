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
const resetIndexInTable=(that)=>{
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
    .catch(() => {});
}


/**
 * @desc 表格显示的列
 */
export function tablecol(that,isEdit){
  return [
      {
        label: "序号",
        type: "index",
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
            suffixIcon: "el-icon-arrow-down",
          },
          listeners: {
            focus: that.selectMaterial,
          },
          custormRules: {
            message: "物料编号不能为空",
          },
        },
      },
      {
        label: "物料名称",
        prop: "materialName",
        isEdit: isEdit,
        config: {
          key: "materialName",
          type: "input",
          subtype: "text",
          disabled: true,
          custormRules: {
            message: "物料名称不能为空",
          },
          placeholder: " ",
        },
      },
      {
        label: "规格",
        prop: "specification",
        align: "right",
        isEdit: isEdit,
        config: {
          key: "specification",
          type: "input",
          subtype: "text",
          placeholder: " ",
        },
      },
      {
        label: "门幅",
        prop: "fullWidth",
        align: "right",
        isEdit: isEdit,
        config: {
          key: "fullWidth",
          type: "input",
          subtype: "text",
          placeholder: " ",
        },
      },
      {
        label: "有效门幅",
        prop: "width",
        align: "right",
        isEdit: isEdit,
        config: {
          key: "width",
          type: "input",
          subtype: "text",
          placeholder: " ",
        },
      },
      {
        label: "克重",
        prop: "gmwt",
        align: "right",
        isEdit: isEdit,
        config: {
          key: "gmwt",
          type: "input",
          subtype: "text",
          placeholder: " ",
        },
      },
      {
        label: "客户品名",
        prop: "customerMaterialNo",
        isEdit: isEdit,
        config: {
          key: "customerMaterialNo",
          type: "input",
          subtype: "text",
          placeholder: " ",
        },
      },
      {
        label: "颜色",
        prop: "colorName",
        isEdit: isEdit,
        config: {
          key: "colorName",
          type: "input",
          subtype: "text",
          placeholder: " ",
        },
      },
      {
        label: "客户颜色",
        prop: "customerColorNo",
        isEdit: isEdit,
        config: {
          key: "customerColorNo",
          type: "input",
          subtype: "text",
          placeholder: " ",
        },
      },
      {
        label: "花型号",
        prop: "patternNo",
        isEdit: isEdit,
        config: {
          key: "patternNo",
          type: "input",
          subtype: "text",
          placeholder: " ",
        },
      },
      {
        label: "数量",
        prop: "qty",
        align: "right",
        isEdit,
        config: {
          key: "qty",
          type: "number",
          min: 1,
          max: 99999999,
          precision: 2,
          custormRules: {
            message: "数量不能为空",
          },
          listeners: {
            // blur: that.priceChange,
          },
          placeholder: " ",
          controls: false,
        },
      },
      {
        label: "短装(%)",
        prop: "shortPercent",
        align: "right",
        isEdit,
        config: {
          key: "shortPercent",
          type: "number",
          min: 0,
          max: 999999999,
          precision: 0,
          placeholder: " ",
          controls: false,
        },
      },
      {
        label: "溢装(%)",
        prop: "overPercent",
        align: "right",
        isEdit,
        config: {
          key: "overPercent",
          type: "number",
          min: 0,
          max: 999999999,
          precision: 0,
          placeholder: " ",
          controls: false,
        },
      },
      {
        label: "单位",
        prop: "unit",
        isEdit: isEdit,
        config: {
          key: "unit",
          type: "select",
          options: that.unitList,
          optionLabel: "unitName",
          optionValue: "unitName",
          custormRules: {
            message: "单位不能为空",
          },
        },
      },
      {
        label: "单价",
        prop: "price",
        align: "right",
        isEdit,
        config: {
          key: "price",
          type: "number",
          min: 0,
          max: 999999,
          precision: 2,
          custormRules: {
            message: "单价不能为空",
          },
          listeners: {
            // blur: that.priceChange,
          },
          placeholder: " ",
          controls: false,
        },
      },
      {
        label: "金额",
        prop: "amount",
        align: "right",
        isEdit,
        config: {
          key: "amount",
          type: "input",
          subtype: "text",
          disabled: true,
          min: 0,
          // max: 999999999,
          precision: 2,
          custormRules: {
            message: "金额不能为空",
          },
          placeholder: " ",
          controls: false,
        },
      },
      {
        label: "附加费",
        prop: "addAmount",
        align: "right",
        isEdit,
        config: {
          key: "addAmount",
          type: "number",
          min: 0,
          max: 999999999,
          precision: 2,
          placeholder: " ",
          controls: false,
        },
      },
      {
        label: "销售交期",
        prop: "deliveryDate",
        align: "right",
        isEdit,
        width: 120,
        config: {
          key: "deliveryDate",
          type: "date",
          subtype: "date",
          valueFormat: "yyyy-MM-dd",
          custormRules: {
            message: "销售交期不能为空",
          },
        },
      },
    ];

}
