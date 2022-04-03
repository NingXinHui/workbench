/**
 * @desc  清除表格的选中项
 */
const clearSelct = that => {
  if (that.$refs.mainTable) {
    that.$refs.mainTable.resetSelect();
  }
};
/**
 * @desc 重置表格每一行的唯一值  新增 复制 删除 导入的时候使用
 */
const resetIndexInTable = that => {
  that.tableData = that.tableData.map((item, index) => {
    return {
      ...item,
      isIndex: index + 1
    };
  });
};
/**
 * @desc 新增
 */
export function addone(that) {
  let obj = {
    documentaryFee: '',
    followMan: "",
    lossRate: '',
    materialId:'',
    overflowRate: '',
    processRequirement: "",
    qty: '',
    salesPrice: '',
    shortageRate: '',
    unit: ""
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
    // that.$message.error("请选择操作项");
    that.$message.error("请选择操作项");
    return;
  }
  let array = [];
  that.multipleSelection.forEach(item => {
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
  that
    .$confirm("确认删除选中的数据吗？", "", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning"
    })
    .then(() => {
      let array = that.tableData;
      that.idList = [];

      that.multipleSelection.forEach(item => {
        // if (item.id) {
        //   that.deletedIdList.push(item.id);
        // }
        let index = array.findIndex(value => {
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
import { getPersonList } from "@/api/purchase/base";

export function tablecol(that, isEdit) {
  return [
    {
      label: "产品编码",
      prop: "materialNo",
      align: "right",
      isEdit: isEdit,
      isRequired: true,
      config: {
        key: "materialNo",
        type: "input",
        subtype: "text",
        placeholder: " ",
        attrs: {
          readonly: true,
          suffixIcon: "el-icon-arrow-down"
        },
        listeners: {
          focus: e => that.selectLook("productDetail", e)
        },

        custormRules: {
          message: "产品编码不能为空"
        }
      }
    },
    {
      label: "物料名称",
      prop: "materialName",
      isEdit: isEdit,
      isRequired: true,
      config: {
        disabled: true,
        key: "materialName",
        type: "input",
        subtype: "text",
        placeholder: " ",

        custormRules: {
          message: "物料名称不能为空"
        }
      }
    },
    {
      label: "物料描述",
      prop: "materialDescription",
      align: "right",
      isRequired: true,
      isEdit: isEdit,
      config: {
        disabled: true,
        key: "materialDescription",
        type: "input",
        subtype: "text",
        placeholder: " "
      }
    },
    {
      label: "数量",
      isRequired: true,
      prop: "qty",
      align: "right",
      isEdit: isEdit,
      config: {
        key: "qty",
        subtype: "text",
        type: "input",
        min: 1,
        max: 9999999,
        precision: 2,
        attrs: {
          onkeyup:
            "if(!/^[0-9]+(.[0-9]{0,2})?$/g.test(this.value)){this.value=''}"
        },
        custormRules: {
          message: "数量不能为空"
        },
        placeholder: " "
      }
    },
    {
      label: "计量单位",
      prop: "unit",
      isRequired: true,
      align: "right",
      isEdit: isEdit,
      config: {
        disabled: true,
        key: "unit",
        type: "input",
        subtype: "text",
        placeholder: " "
      }
    },
    {
      label: "跟单员",
      // isRequired: true,
      prop: isEdit ? "followMan" : "followManName",
      // prop: "followMan",
      align: "right",
      isEdit: isEdit,
      width: 180,
      config: {
        // key: isEdit ? "followMan" : "followManName",
        key: "followMan",
        type: "selectLook",
        // subtype: "text",
        // lookup
        showLook: e => {
          console.log(e);
          that.theIndex = e.target.parentNode.parentNode.parentNode.parentNode.getAttribute(
            "index"
          );
          console.log(that.theIndex);
          that.isSelectMore = true;
          that.selectLook("merchandiserName", e);
        },

        multiple: true,
        collapse: true,
        listeners: {
          focus: e => {
            that.theIndex = Number(
              e.target.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute(
                "index"
              )
            );
          }
          /*   change: e => {
            console.log(that.theIndex);
            that.tableData[that.theIndex].followMan = [];

            that.productionList.forEach(item => {
              if (
                that.tableData[that.theIndex].followManName.indexOf(item.fullName !== -1)
              ) {
                let theIndexId = that.tableData[that.theIndex].followManName.indexOf(
                  item.fullName
                );
               
                if (theIndexId !== -1) {
                  that.tableData[that.theIndex].followMan.push(
                    that.productionList[theIndexId].id
                  );
                }
              }
            });
            console.log(that.tableData[that.theIndex].followMan);
          } */
        },

        options: that.productionList,
        optionLabel: "fullName",
        optionValue: "id",

        placeholder: " "
      }
    },
    {
      label: "短装(%)",
      prop: "shortageRate",
      align: "right",
      isEdit: isEdit,
      config: {
        key: "shortageRate",
        subtype: "text",
        type: "number",
        min: 1,
        max: 99999999,
        precision: 2,
        placeholder: " "
      }
    },
    {
      label: "溢装(%)",
      prop: "overflowRate",
      align: "right",
      isEdit: isEdit,
      config: {
        key: "overflowRate",
        subtype: "text",
        type: "number",
        min: 1,
        max: 99999999,
        precision: 2,
        placeholder: " "
      }
    },
    {
      label: "加工损耗率(%)",
      prop: "lossRate",
      isEdit: isEdit,
      config: {
        key: "lossRate",
        type: "number",
        min: 1,
        max: 99999999,
        precision: 2,

        subtype: "text",
        placeholder: " "
      }
    },
    {
      label: "加工要求",
      prop: "processRequirement",
      align: "right",
      isEdit: isEdit,
      config: {
        key: "processRequirement	",
        type: "input",
        subtype: "text",
        placeholder: " "
      }
    },
    {
      label: "销售单价",
      prop: "salesPrice",
      // isRequired: true,
      isEdit: isEdit,

      config: {
        disabled: true,
        key: "salesPrice",
        // type: "number",
        type: "input",
        min: 1,
        max: 99999999,
        precision: 2,
        /*  custormRules: {
          message: "销售单价不能为空"
        }, */
        subtype: "text",
        placeholder: " "
      }
    },
    {
      label: "跟单费",
      prop: "documentaryFee",
      isEdit: isEdit,
      config: {
        key: "documentaryFee",
        type: "number",
        min: 1,
        max: 99999999,
        precision: 2,
        /*   custormRules: {
          message: "跟单费不能为空"
        }, */
        subtype: "text",
        placeholder: " "
      }
    }
  ];
}
export function botTablecol(that, isEdit) {
  return [
    /*   {
        label: "序号",
        type: "index"
      }, */
    {
      label: "物料编号",
      // prop: "materialId",
      prop:'materialNo',//只是显示
      isEdit: isEdit,
      config: {
        // key: "materialId",
        key:'materialNo',
        type: "input",
        subtype: "text",
        placeholder: "请选择",
        attrs: {
          readonly: true,
          suffixIcon: "el-icon-arrow-down"
        },
        listeners: {
          focus: e => that.selectLook("materil", e)
        },
        custormRules: {
          message: "物料编号不能为空"
        }
      }
    },
    {
      label: "批次号",
      prop: "materialLot",
      align: "right",
      isEdit: isEdit,
      config: {
        disabled: true,

        key: "materialLot",
        type: "input",
        subtype: "text",
        placeholder: " "
      }
    },
    {
      label: "物料名称",
      prop: "materialName",
      align: "right",
      isEdit: isEdit,
      config: {
        disabled: true,

        key: "materialName",
        type: "input",
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
        disabled: true,

        key: "materialDescription",
        type: "input",
        subtype: "text",
        placeholder: " "
      }
    },
    {
      label: "数量",
      prop: "qty",
      align: "right",
      isEdit: isEdit,
      config: {
        key: "qty",
        subtype: "text",
        type: "number",
        min: 1,
        max: 99999999,
        precision: 2,
        custormRules: {
          message: "数量不能为空"
        },
        placeholder: " "
      }
    },

    {
      label: "计量单位",
      prop: "unit",
      align: "right",
      isEdit: isEdit,
      config: {
        disabled: true,

        key: "unit",
        type: "input",
        subtype: "text",
        placeholder: " "
      }
    },

   /*  {
      label: "短装(%)",
      prop: "gmwt",
      align: "right",
      isEdit: isEdit,
      config: {
        key: "gmwt",
        subtype: "text",
        type: "number",
        min: 1,
        max: 99999999,
        precision: 2,
        placeholder: " "
      }
    },
    {
      label: "溢装(%)",
      prop: "gmwt",
      align: "right",
      isEdit: isEdit,
      config: {
        key: "gmwt",
        subtype: "text",
        type: "number",
        min: 1,
        max: 99999999,
        precision: 2,
        placeholder: " "
      }
    } */
  ];
}
