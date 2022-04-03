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
          /* if (item.id) {
            that.deletedIdList.push(item.id);
          } */
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
        label: "物料编号",
        prop: "materialNo",
        isEdit: isEdit,
        isRequired: true,
        config: {
        disabled: true,

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
        disabled: true,

          key: "materialName",
          type: "input",
          subtype: "text",
          placeholder: " "
        }
      },
      {
        label: "物料描述",
        prop: "materialDescribe",
        align: "right",
        isEdit: isEdit,
        config: {
        disabled: true,

          key: "materialDescribe",
          type: "input",
          subtype: "text",
          placeholder: " "
        }
      },
      {
        label: "批次号",
        prop: "materialLot",
        isEdit: isEdit,
        config: {
        disabled: true,

          key: "materialLot",
          type: "input",
          subtype: "text",
          custormRules: {
            message: "批次号不能为空"
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
   
      {
        label: "本次投料数量",
        disabled: true,
        prop: "feedQty",
        align: "right",
        isEdit: isEdit,
        isRequired: true,
        config: {
          key: "feedQty",
          subtype: "text",
          type: "number",
          min: 1,
          max: 99999999,
          precision: 2,
          placeholder: " ",
          custormRules: {
            message: "本次投料数量不能为空"
          }
        }
      },
      {
        label: "扣折幅数量",
        prop: "discountQty",
        align: "right",
        isEdit: isEdit,
        config: {
          key: "discountQty",
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
