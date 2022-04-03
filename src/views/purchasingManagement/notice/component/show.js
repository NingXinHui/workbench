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
        type: "index"
      },
      {
        label: "关联销售订单号",
        prop: "saleOrderNO",
        align: "left",
        width: 130,
        isEdit: isEdit,
        config: {
          key: "saleOrderNO",
          type: "input",
          subtype: "text",
          disabled: true,
          placeholder: " "
        }
      },
      {
        label: "来源单号",
        prop: "sourceBillNo",
        align: "left",
        isEdit: isEdit,
        config: {
          key: "sourceBillNo",
          type: "input",
          subtype: "text",
          disabled: true,
          placeholder: " "
        }
      },
      {
        label: "源单类型",
        prop: "sourceBillType",
        align: "left",
        isEdit: isEdit,
        config: {
          key: "sourceBillType",
          type: "input",
          subtype: "text",
          disabled: true,
          placeholder: " "
        }
      },
      {
        label: "物料编号",
        prop: "materialNo",
        align: "left",
        isEdit: isEdit,
        config: {
          key: "materialNo",
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
        prop: "materialDescription",
        align: "left",
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
        label: "订单数量",
        prop: "orderQty",
        align: "left",
        isEdit: isEdit,
        config: {
          key: "orderQty",
          type: "input",
          subtype: "text",
          disabled: true,
          placeholder: " "
        }
      },
      {
        label: "计量单位",
        prop: "unit",
        align: "left",
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
        label: "含税单价",
        prop: "taxPrice",
        align: "left",
        isEdit: isEdit,
        config: {
          key: "taxPrice",
          type: "input",
          subtype: "text",
          disabled: true,
          placeholder: " "
        }
      },
      {
        label: "本次到货数量",
        prop: "arrivalQty",
        align: "left",
        isEdit: isEdit,
        config: {
          key: "arrivalQty",
          type: "input",
          subtype: "text",
          disabled: true,
          placeholder: " "
        }
      },
      {
        label: "整包件数",
        prop: "onePackageQty",
        align: "left",
        isEdit: isEdit,
        isRequired: true,
        config: {
          key: "onePackageQty",
          subtype: "text",
          subtype: "text",
          type: "input",
          attrs: {
            onkeyup:
              "if(!/^[0-9]+(.[0-9]{0,2})?$/g.test(this.value)){this.value=''}"
          },
          listeners: {
            blur: e => {
              let index = e.target.parentNode.parentNode.parentNode.getAttribute(
                "index"
              );
              if (that.tableData[index].onePackageQty) {
                that.$set(
                  that.tableData[index],
                  "arrivalQty",
                  (
                    Number(
                      (that.tableData[index].onePackageQty || 0) *
                        (that.tableData[index].packageQty || 0)
                    ) + Number(that.tableData[index].zeroPackageQty || 0)
                  ).toFixed(2)
                );
              }
            }
          },
          placeholder: " ",
          custormRules: {
            message: "整包件数不能为空"
          }
        }
      },
      {
        label: "零包件数",
        prop: "zeroQty",
        align: "left",
        isRequired: true,
        isEdit: isEdit,
        config: {
          key: "zeroQty",
          subtype: "text",
          type: "input",
          attrs: {
            onkeyup:
              "if(!/^[0-9]+(.[0-9]{0,2})?$/g.test(this.value)){this.value=''}"
          },
          placeholder: " ",
          custormRules: {
            message: "零包件数不能为空"
          }
        }
      },
      {
        label: "包装数量",
        prop: "packageQty",
        align: "left",
        isRequired: true,
        isEdit: isEdit,
        config: {
          key: "packageQty",
          subtype: "text",
          type: "input",
          attrs: {
            onkeyup:
              "if(!/^[0-9]+(.[0-9]{0,2})?$/g.test(this.value)){this.value=''}"
          },
          listeners: {
            blur: e => {
              let index = e.target.parentNode.parentNode.parentNode.getAttribute(
                "index"
              );
              if (that.tableData[index].packageQty) {
                that.$set(
                  that.tableData[index],
                  "arrivalQty",
                  (
                    Number(
                      (that.tableData[index].onePackageQty || 0) *
                        (that.tableData[index].packageQty || 0)
                    ) + Number(that.tableData[index].zeroPackageQty || 0)
                  ).toFixed(2)
                );
              }
            }
          },
          placeholder: " ",
          custormRules: {
            message: "包装数量不能为空"
          }
        }
      },
      {
        label: "零包数量",
        prop: "zeroPackageQty",
        align: "left",
        isEdit: isEdit,
        isRequired: true,
        config: {
          key: "zeroPackageQty",
          subtype: "text",
          type: "input",
          attrs: {
            onkeyup:
              "if(!/^[0-9]+(.[0-9]{0,2})?$/g.test(this.value)){this.value=''}"
          },
          listeners: {
            blur: e => {
              let index = e.target.parentNode.parentNode.parentNode.getAttribute(
                "index"
              );
              if (that.tableData[index].zeroPackageQty) {
                that.$set(
                  that.tableData[index],
                  "arrivalQty",
                  (
                    Number(
                      (that.tableData[index].onePackageQty || 0) *
                        (that.tableData[index].packageQty || 0)
                    ) + Number(that.tableData[index].zeroPackageQty || 0)
                  ).toFixed(2)
                );
              }
            }
          },
          placeholder: " ",
          custormRules: {
            message: "零包数量不能为空"
          }
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
          disabled: true,
          placeholder: " "
        }
      },
      {
        label: "厂家批次",
        prop: "companyLot",
        isEdit: isEdit,
        config: {
          key: "companyLot",
          type: "input",
          subtype: "text",
          placeholder: " "
        }
      },
      {
        label: "运费",
        prop: "freight",
        align: "left",
        isEdit: isEdit,
        config: {
          key: "freight",
          subtype: "text",
          type: "number",
          min: 1,
          max: 99999999,
          precision: 2,
          placeholder: " "
        }
      },
      {
        label: "申请人",
        prop: "applicantName",
        align: "left",
        isEdit: isEdit,
        config: {
          key: "applicantName",
          type: "input",
          subtype: "text",
          disabled: true,
          placeholder: " "
        }
      },
      {
        label: "集装箱号",
        prop: "containerNumber",
        align: "left",
        isEdit: isEdit,
        config: {
          key: "containerNumber",
          type: "input",
          subtype: "text",
          placeholder: " "
        }
      },
      {
        label: "货运代理费",
        prop: "freightForwardingFee",
        align: "left",
        isEdit: isEdit,
        config: {
          key: "freightForwardingFee",
          type: "input",
          subtype: "text",
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
          placeholder: " "
        }
      }
    ];

  }
