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
        label: "销售订单号",
        prop: "width",
        align: "right",
        width: 110,
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
        label: "采购订单号",
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
        label: "入库单号",
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
        label: "应付货款号",
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
        label: "物料编号",
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
        label: "入库数量",
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
        label: "已开票数量",
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
        label: "税率",
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
        label: "未税单价",
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
        label: "含税单价",
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
        label: "开票数量",
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
        label: "未税金额",
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
        label: "税额",
        prop: "width",
        align: "right",
        isEdit: isEdit,
        config: {
          key: "width",
          type: "input",
          disabled: true,
          subtype: "text",
          placeholder: " "
        }
      },
      {
        label: "含税金额",
        prop: "width",
        align: "right",
        isEdit: isEdit,
        config: {
          key: "width",
          type: "input",
          disabled: true,
          subtype: "text",
          placeholder: " "
        }
      }
    ];

  }

   export function topTablecol(that, isEdit) {
     return [
       {
         label: "序号",
         type: "index"
       },
       {
         label: "应付单号",
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
             focus: () => that.deatilVisible = true
           },
           custormRules: {
             message: "应付单号不能为空"
           }
         }
       },
       {
         label: "供应商投诉单号",
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
         label: "关联采购订单",
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
         label: "可抵扣总金额",
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
         label: "剩余可低金额",
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
         label: "本次抵金额",
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
         label: "",
         prop: ""
       }
     ];
   }
