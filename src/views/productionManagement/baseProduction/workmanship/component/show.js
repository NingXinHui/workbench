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
      materialDescribe: "",
      materialId: 0,
      materialName: "",
      materialNo: "",
      propertyMerge: "",
      remark: "",
      unit: "",
      unitQty: 0
    };
    clearSelct(that);
    that.tableData.push(obj);
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
            suffixIcon: "el-icon-arrow-down"
          },
          listeners: {
            focus: e => {
              that.selectIndex = e.target.parentNode.parentNode.parentNode.getAttribute(
                "index"
              );
              that.selectLook("table");
            }
          },
          custormRules: {
            message: "物料编号不能为空"
          }
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
        prop: "materialDescribe",
        align: "left",
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
        label: "用量数量",
        prop: "unitQty",
        isEdit: isEdit,
        isRequired: true,
        config: {
          key: "unitQty",
          type: "number",
          min: 1,
          max: 99999999,
          precision: 2,
          custormRules: {
            message: "用量数量不能为空"
          },
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
