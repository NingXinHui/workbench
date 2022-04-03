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
      // {
      //   label: "物料编号",
      //   prop: "materialNo",
      //   isEdit: isEdit,
      //   config: {
      //     key: "materialNo",
      //     type: "input",
      //     subtype: "text",
      //     placeholder: "请选择",
      //     attrs: {
      //       readonly: true,
      //       suffixIcon: "el-icon-arrow-down"
      //     },
      //     listeners: {
      //       focus: () => that.selectLook("materil")
      //     },
      //     custormRules: {
      //       message: "物料编号不能为空"
      //     }
      //   }
      // },
      {
        label: "销售订单号",
        prop: "width",
        align: "right",
        isEdit: isEdit,
        config: {
          key: "width",
          type: "input",
          subtype: "text",
          placeholder: " "
        }
      },
      {
        label: "支付方式",
        prop: "width",
        align: "right",
        isEdit: isEdit,
        config: {
          key: "width",
          type: "input",
          subtype: "text",
          placeholder: " "
        }
      },
      {
        label: "客户名称",
        prop: "width",
        align: "right",
        isEdit: isEdit,
        config: {
          key: "width",
          type: "input",
          subtype: "text",
          placeholder: " "
        }
      },
      {
        label: "来源单号",
        prop: "width",
        align: "right",
        isEdit: isEdit,
        config: {
          key: "width",
          type: "input",
          subtype: "text",
          placeholder: " "
        }
      },
      {
        label: "源单类型",
        prop: "width",
        align: "right",
        isEdit: isEdit,
        config: {
          key: "width",
          type: "input",
          subtype: "text",
          placeholder: " "
        }
      },
      {
        label: "发票抬头",
        prop: "width",
        align: "right",
        isEdit: isEdit,
        config: {
          key: "width",
          type: "input",
          subtype: "text",
          placeholder: " "
        }
      },
      {
        label: "物料编号",
        prop: "width",
        align: "right",
        isEdit: isEdit,
        config: {
          key: "width",
          type: "input",
          subtype: "text",
          placeholder: " "
        }
      },
      {
        label: "物料名称",
        prop: "width",
        align: "right",
        isEdit: isEdit,
        config: {
          key: "width",
          type: "input",
          subtype: "text",
          disabled: true,
          placeholder: " "
        }
      },
      {
        label: "物料描述",
        prop: "width",
        align: "right",
        isEdit: isEdit,
        config: {
          key: "width",
          type: "input",
          subtype: "text",
          disabled: true,
          placeholder: " "
        }
      },
      {
        label: "计量单位",
        prop: "width",
        align: "right",
        isEdit: isEdit,
        config: {
          key: "width",
          type: "input",
          subtype: "text",
          disabled: true,
          placeholder: " "
        }
      },
      {
        label: "销售数量",
        prop: "width",
        align: "right",
        isEdit: isEdit,
        config: {
          key: "width",
          type: "input",
          subtype: "text",
          disabled: true,
          placeholder: " "
        }
      },
      {
        label: "销售含税单价",
        prop: "width",
        align: "right",
        isEdit: isEdit,
        config: {
          key: "width",
          type: "input",
          subtype: "text",
          disabled: true,
          placeholder: " "
        }
      },
      {
        label: "申请开票数量",
        prop: "customerMaterialNo",
        isEdit: isEdit,
        config: {
          key: "customerMaterialNo",
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
        label: "已申请数量",
        prop: "width",
        align: "right",
        isEdit: isEdit,
        config: {
          key: "width",
          type: "input",
          subtype: "text",
          disabled: true,
          placeholder: " "
        }
      },

      {
        label: "是否单独开票",
        prop: "colorName",
        isEdit: isEdit,
        config: {
          key: "colorName",
          type: "checkbox",
          subtype: "text",
          placeholder: " "
        }
      },
      {
        label: "是否合并开票",
        prop: "colorName",
        isEdit: isEdit,
        config: {
          key: "colorName",
          type: "checkbox",
          subtype: "text",
          placeholder: " "
        }
      },
      {
        label: "备注",
        prop: "width",
        align: "right",
        isEdit: isEdit,
        config: {
          key: "width",
          type: "input",
          subtype: "text",
          placeholder: " "
        }
      },
      {
        label: "税收分类编码",
        prop: "width",
        align: "right",
        isEdit: isEdit,
        config: {
          key: "width",
          type: "input",
          subtype: "text",
          placeholder: " "
        }
      },
      {
        label: "税收分类名称",
        prop: "width",
        align: "right",
        isEdit: isEdit,
        config: {
          key: "width",
          type: "input",
          subtype: "text",
          placeholder: " "
        }
      },
      {
        label: "开票商品名称",
        prop: "width",
        align: "right",
        isEdit: isEdit,
        config: {
          key: "width",
          type: "input",
          subtype: "text",
          placeholder: " "
        }
      },
      {
        label: "税率",
        prop: "width",
        align: "right",
        isEdit: isEdit,
        config: {
          key: "width",
          type: "input",
          subtype: "text",
          placeholder: " "
        }
      },
      {
        label: "含税总价",
        prop: "width",
        align: "right",
        isEdit: isEdit,
        config: {
          key: "width",
          type: "input",
          subtype: "text",
          disabled: true,
          placeholder: " "
        }
      },
      {
        label: "已申请含税总金额",
        prop: "width",
        align: "right",
        width: 160,
        isEdit: isEdit,
        config: {
          key: "width",
          type: "input",
          subtype: "text",
          disabled: true,
          placeholder: " "
        }
      }
    ];

  }
