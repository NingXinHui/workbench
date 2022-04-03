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
  if (that.multipleSelection.length == 1) {
    const Index = that.tableData.findIndex(item => {
      return item.isIndex == that.multipleSelection[0].isIndex
    })
    let obj = {
      id: "",
      workProcedureNo: "",
      workProcedureName: ""
    };
    that.tableData.splice(Number(Index) + 1, 0, obj);
  } else {
      let obj = {
        id: "",
        workProcedureNo: "",
        workProcedureName: ""
      };
      clearSelct(that);
      that.tableData.push(obj);
      resetIndexInTable(that);
  }
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
            that.delDetailIdList.push(item.id);
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
        label: "工序编号",
        prop: "workProcedureNo",
        align: "left",
        width: 130,
        isEdit: isEdit,
        config: {
          key: "workProcedureNo",
          type: "input",
          subtype: "text",
          attrs: {
            readonly: true,
            suffixIcon: "el-icon-arrow-down"
          },
          custormRules: {
            message: "工序编号不能为空"
          },
          listeners: {
            focus: e => {
              that.isSelectMore = false;
              that.selectTableIndex = e.target.parentNode.parentNode.parentNode.getAttribute(
                "index"
              );
              that.selectLook("procedure");
            }
          },
          placeholder: " "
        }
      },
      {
        label: "工序名称",
        prop: "workProcedureName",
        align: "left",
        isEdit: isEdit,
        config: {
          key: "workProcedureName",
          type: "input",
          subtype: "text",
          disabled: true,
          placeholder: " "
        }
      },
      {
        label: "打卡状态",
        prop: "clockInStatus",
        align: "left",
        isEdit: isEdit,
        config: {
          key: "clockInStatus",
          type: "input",
          subtype: "text",
          disabled: true,
          placeholder: " "
        }
      },
      {
        label: "打卡时间",
        prop: "clockInTime",
        align: "left",
        isEdit: isEdit,
        config: {
          key: "clockInTime",
          type: "input",
          subtype: "text",
          disabled: true,
          placeholder: " "
        }
      },
      {
        label: "跟单人员",
        prop: "followerName",
        align: "left",
        isEdit: isEdit,
        config: {
          key: "followerName",
          type: "input",
          subtype: "text",
          disabled: true,
          placeholder: " "
        }
      },
      {
        label: "跟单附件",
        prop: "width",
        align: "left",
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
        label: "打卡地",
        prop: "clockInPlace",
        align: "left",
        isEdit: isEdit,
        config: {
          key: "clockInPlace",
          type: "input",
          subtype: "text",
          disabled: true,
          placeholder: " "
        }
      },
      {
        label: "完成日期",
        prop: "complateDate",
        align: "left",
        isEdit: isEdit,
        config: {
          key: "complateDate",
          type: "input",
          subtype: "text",
          disabled: true,
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
          disabled: true,
          subtype: "text",
          placeholder: " "
        }
      }
    ];

  }
