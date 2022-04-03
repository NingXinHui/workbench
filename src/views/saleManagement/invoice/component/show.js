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
        type: "index"
      },
      {
        label: "物料编号",
        prop: "materialNo",
        isEdit: false,
        config: {
          key: "materialNo",
          type: "input",
          subtype: "text",
          placeholder: "请选择"
          // attrs: {
          //   readonly: true,
          //   suffixIcon: "el-icon-arrow-down"
          // },
          // listeners: {
          //   focus: () => that.selectLook("materil")
          // },
          // custormRules: {
          //   message: "物料编号不能为空"
          // }
        }
      },
      {
        label: "批次号",
        prop: "materialLot",
        isEdit: isEdit,
        config: {
          key: "materialLot",
          type: "input",
          subtype: "text",
          custormRules: {
            message: "物料批次不能为空"
          },
          placeholder: " "
        }
      },
      // {
      //   label: "仓库",
      //   prop: "storeId",
      //   align: "right",
      //   isEdit: isEdit,
      //   config: {
      //     key: "storeId",
      //     type: "select",
      //     subtype: "text",
      //     options: [
      //       {
      //         label: "测试仓库1",
      //         value: "1"
      //       }
      //     ],
      //     optionLabel: "label",
      //     optionValue: "value",
      //     placeholder: " "
      //   }
      // },
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
          type: "input",
          subtype: "text",
          disabled: true,
          placeholder: " "
        }
      },
      {
        label: "销售数量",
        prop: "salesQty",
        align: "right",
        isEdit: isEdit,
        config: {
          key: "salesQty",
          type: "input",
          subtype: "text",
          disabled: true,
          placeholder: " "
        }
      },
      {
        label: "本次发货数量",
        prop: "shipmentQty",
        align: "right",
        isEdit: isEdit,
        config: {
          key: "shipmentQty",
          subtype: "text",
          type: "input",
          attrs: {
            onkeyup:
              "if(!/^[0-9]{0,10}$/g.test(this.value)){this.value=''}"
          },
          custormRules: {
            message: "数量不能为空"
          },
          listeners: {
             blur: e => {
               let index = e.target.parentNode.parentNode.parentNode.getAttribute(
                 "index"
               );
               if (that.tableData[index].shipmentQty) {
                 that.tableData[index].remainOptionalQty = (
                   (that.tableData[index].salesQty || 0) -
                   (that.tableData[index].shipmentQty || 0)
                 ).toFixed(2);
               }
             }
           },
          placeholder: " "
        }
      },
      {
        label: "剩余待发数量",
        prop: "remainOptionalQty",
        align: "right",
        isEdit: isEdit,
        config: {
          key: "remainOptionalQty",
          type: "input",
          disabled: true,
          subtype: "text",
          placeholder: " "
        }
      },
      {
        label: "短装(%)",
        prop: "shortageRate",
        isEdit: isEdit,
        config: {
          key: "shortageRate",
          type: "number",
          min: 1,
          max: 99999999,
          disabled: true,
          precision: 2,
          custormRules: {
            message: "短装不能为空"
          },
          subtype: "text",
          placeholder: " "
        }
      },
      {
        label: "溢装(%)",
        prop: "overflowRate",
        isEdit: isEdit,
        config: {
          key: "overflowRate",
          type: "number",
          min: 1,
          max: 99999999,
          disabled: true,
          precision: 2,
          custormRules: {
            message: "溢装不能为空"
          },
          subtype: "text",
          placeholder: " "
        }
      }
    ];

  }
