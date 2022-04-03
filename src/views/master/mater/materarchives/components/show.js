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
  console.log(' that.tableData ', that.tableData)
}
/**
 * @desc 新增
 */
export function addone (that) {
  //渲染计量单位的初始值
  // that.initUnit()

  let obj = {
    usable: true,
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
    let { id, materialNo, ...obj } = item;
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
  let newArr = [];

  that.MaterList.map(item => {
    if (item.propertyDataType == 'TEXT') {
      newArr.push({

        label: item.propertyName,
        prop: item.id,
        isEdit: isEdit,

        config: {
          key: item.id,
          type: 'input',
          subtype: 'text',
          placeholder: '  ',
          custormRules: item.required ? {
            message: `${item.propertyName}不能为空`,
          } : undefined
        },
      })
    }
    if (item.propertyDataType == 'ENUM') {
      newArr.push({

        label: item.propertyName,
        // prop: isEdit? item.id+'x': item.id,
        prop: !isEdit ? `${item.id}x` : item.id,
        isEdit: isEdit,

        config: {
          key: item.id,
          type: !isEdit ? 'input' : 'select',
          subtype: 'text',
          options: that.allIdList[item.id],
          optionLabel: 'itemName',
          optionValue: 'itemNo',
          multiple: item.multiselect,//是否多选
          attrs: {
            'collapse-tags': true
          },
          custormRules: item.required ? {
            message: `${item.propertyName}不能为空`,
          } : undefined
        },

      })
    }
  })


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
        disabled: true,
        placeholder: " "
        // attrs: {
        //   readonly: true,
        //   suffixIcon: "el-icon-arrow-down",
        // },
        // listeners: {
        //   focus: that.selectMaterial,
        // },
        // custormRules: {
        //   message: "物料编号不能为空",
        // },
      }
    },
    {
      label: "物料名称",
      prop: "materialName",
      isEdit: isEdit,
      config: {
        key: "materialName",
        type: "input",
        subtype: "text",

        custormRules: {
          message: "物料名称不能为空"
        },
        placeholder: " "
      }
    },
    {
      label: "物料分类",
      prop: "specification",
      align: "right",
      isEdit: isEdit,
      config: {
        key: "specification",
        type: "input",
        disabled: true,
        subtype: "text",
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
        disabled: true,
        subtype: "text",
        placeholder: " "
      }
    },
    {
      prop: "salesGuidancePrice",
      label: "销售指导价",
      align: "right",
      isEdit: isEdit,
      config: {
        key: "salesGuidancePrice",
        type: "input",
        subtype: "text",
        placeholder: " "
      }
    },
    // {
    //   prop: "unit",
    //   label: "计量单位",
    //   align: "right",
    //   isEdit: isEdit,
    //   config: {
    //     key: "unit",
    //     type: "input",
    //     subtype: "text",
    //     placeholder: " ",
    //   },
    // },
    {
      label: "计量单位",
      prop: isEdit ? "unitName" : "unitName",
      align: "right",
      isEdit,
      config: {
        key: "unitName",
        type: "input",
        subtype: "text",
        placeholder: "请选择",
        attrs: {
          readonly: true,
          suffixIcon: "el-icon-arrow-down"
        },
        listeners: {
          focus: e => {
            that.selectIndex = e.target.parentNode.parentNode.parentNode.getAttribute(
              "index"
            );
            that.visible = true;
          }
        }
      }
    },
    {
      prop: "currency",
      label: "币种",
      align: "right",
      isEdit: isEdit,
      config: {
        key: "currency",
        type: "input",
        subtype: "text",
        placeholder: " "
      }
    },
    {
      prop: "usable",
      label: "是否可用",
      width: 100,
      align: "center",
      isEdit: true,
      config: {
        key: "usable",
        type: "checkbox",
        placeholder: " "
      }
    },
    {
      prop: "taxRate",
      label: "税率(%)",
      align: "right",
      isEdit: isEdit,
      config: {
        key: "taxRate",
        type: "number",
        min: 0,
        max: 1,
        precision: 2,
        subtype: "text",
        placeholder: " "
      }
    },
    {
      prop: "inventoryTopLimit",
      label: "库存上限",
      isEdit: isEdit,
      config: {
        key: "inventoryTopLimit",
        type: "input",
        subtype: "text",
        placeholder: " "
      }
    },
    {
      prop: "inventoryLowerLimit",
      label: "库存下限",
      isEdit: isEdit,
      config: {
        key: "inventoryLowerLimit",
        type: "input",
        subtype: "text",
        placeholder: " "
      }
    },
    {
      prop: "billStatus",
      label: "审核状态",
      isEdit: isEdit,
      config: {
        key: "billStatus",
        type: "input",
        subtype: "text",
        placeholder: " "
      }
    },

    {
      prop: "remark",
      label: "备注",
      isEdit: isEdit,
      config: {
        key: "remark",
        type: "input",
        subtype: "text",
        placeholder: " "
      }
    },
    ...newArr
  ];

}
