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
        label: "关联销售订单号",
        prop: "saleOrderNo",
        align: "right",
        width: 130,
        isEdit: isEdit,
        config: {
          key: "saleOrderNo",
          type: "input",
          subtype: "text",
          disabled: true,
          placeholder: " "
        }
      },
      {
        label: "来源单号",
        prop: "sourceNo",
        align: "right",
        isEdit: isEdit,
        config: {
          key: "sourceNo",
          type: "input",
          subtype: "text",
          disabled: true,
          placeholder: " "
        }
      },
      {
        label: "源单类型",
        prop: "sourceType",
        align: "right",
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
        label: "跟单员",
        prop: "followMan",
        align: "right",
        isEdit: isEdit,
        config: {
          key: "followMan",
          type: "input",
          subtype: "text",
          disabled: true,
          placeholder: " "
        }
      },
      {
        label: "销售员",
        prop: "salesMan",
        align: "right",
        isEdit: isEdit,
        config: {
          key: "salesMan",
          type: "input",
          subtype: "text",
          disabled: true,
          placeholder: " "
        }
      },
      {
        label: "物料编号",
        prop: "materialNo",
        align: "right",
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
        prop: "materialDescribe",
        align: "right",
        isEdit: isEdit,
        config: {
          key: "materialDescribe",
          type: "input",
          subtype: "text",
          disabled: true,
          placeholder: " "
        }
      },
      {
        label: "厂家批次",
        prop: "materialLot",
        align: "right",
        isEdit: isEdit,
        config: {
          key: "materialLot",
          type: "input",
          subtype: "text",
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
          placeholder: " "
        }
      },
      {
        label: "数量",
        prop: "qty",
        align: "right",
        isEdit: isEdit,
        isRequired:true,
        config: {
          key: "qty",
          type: "input",
          subtype: "text",
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
        label: "成品等级",
        prop: "level",
        align: "right",
        isEdit: isEdit,
        isRequired:true,
        config: {
          key: "level",
          type: "select",
          subtype: "text",
          placeholder: " ",
          options: that.productGradeList,
          optionLabel: "value",
          optionValue: "id",
        },
       
      },

     
      {
        label: "包数",
        prop: "packageQty",
        align: "right",
        isEdit: isEdit,
        isRequired:true,
        config: {
          key: "packageQty",
          subtype: "text",
          type: "number",
          min: 1,
          max: 99999999,
          precision: 2,
          placeholder: " "
        }
      },
      {
        label: "加工单价",
        prop: "price",
        align: "right",
        isRequired:true,
        isEdit: isEdit,
        config: {
          key: "price",
          subtype: "text",
          type: "number",
          min: 1,
          max: 99999999,
          precision: 2,
          placeholder: " "
        }
      },
      {
        label: "实际损耗率",
        prop: "processLossRate",
        align: "right",
        isEdit: isEdit,
        config: {
          key: "processLossRate",
          subtype: "text",
          type: "number",
          min: 1,
          max: 99999999,
          precision: 2,
          placeholder: " "
        }
      },
      {
        label: "加工损耗率",
        prop: "factLossRate",
        align: "right",
        isEdit: isEdit,
        config: {
          key: "factLossRate",
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
        prop: "remark",
        align: "right",
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

  //原料使用量表格
   export function botTablecol(that, isEdit) {
     return [
       {
         label: "序号",
         type: "index"
       },
       {
         label: "关联物料编号",
         prop: "materialNum",
         align: "right",
         width: 130,
         isEdit: isEdit,
         config: {
           key: "materialNum",
           type: "input",
           subtype: "text",
           disabled: true,
           placeholder: " "
         }
       },
       {
         label: "物料编号",
         prop: "materialNo",
         align: "right",
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
         prop: "materialDescribe",
         align: "right",
         isEdit: isEdit,
         config: {
           key: "materialDescribe",
           type: "input",
           subtype: "text",
           disabled: true,
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
         label: "投料数量",
         prop: "feedQty",
         align: "right",
         isEdit: isEdit,
         config: {
           key: "feedQty",
           subtype: "text",
           type: "number",
           min: 1,
           max: 99999999,
           precision: 2,
           placeholder: " "
         }
       },
       {
         label: "本次使用数量",
         prop: "usedQty",
         align: "right",
         isEdit: isEdit,
         config: {
           key: "usedQty",
           subtype: "text",
           type: "number",
           min: 1,
           max: 99999999,
           precision: 2,
           placeholder: " "
         }
       },
       {
         label: "剩余投料数量",
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
     ];
   }
