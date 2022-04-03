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
        label: "沟通记录",
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
        label: "沟通结果",
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
        label: "处理人",
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
        label: "处理日期",
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
        label: "附件",
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
    ];

  }
//外部费用明细表格
 export function Tabletwocol(that, isEdit) {
          return [
            {
              label: "序号",
              type: "index"
            },
            {
              label: "费用项目",
              prop: "companyName",
              isEdit: isEdit,
              width: 120,
              config: {
                key: "companyName",
                type: "input",
                subtype: "text",
              }
            },
            {
              label: "付款单位",
              prop: isEdit ? "contactType" : "contactTypeName",
              align: "center",
              isEdit,
              width: 180,
              config: {
                key: "contactType",
                type: "select",
                subtype: "date",
                options: that.contactType,
                optionLabel: "value",
                optionValue: "code",
              }
            },
            {
              label: "付款金额",
              prop: "address",
              align: "center",
              isEdit: isEdit,
              width: 180,
              config: {
                key: "address",
                type: "input",
                subtype: "text",
              }
            },

            {
              label: "",
              prop: "",
              align: "",
            }
          ];
 }
//判定结果
 export function Tablethreecol(that, isEdit) {
   return [
     {
       label: "序号",
       type: "index"
     },
     {
       label: "判定结果",
       prop: isEdit ? "contactType" : "contactTypeName",
       align: "center",
       isEdit,
       width: 180,
       config: {
         key: "contactType",
         type: "select",
         subtype: "date",
         options: that.contactType,
         optionLabel: "value",
         optionValue: "code"
       }
     },
     {
       label: "实际赔付数量",
       prop: "address",
       align: "center",
       isEdit: isEdit,
       width: 180,
       config: {
         key: "address",
         type: "input",
         subtype: "text"
       }
     },
     {
       label: "实际赔付金额",
       prop: "address",
       align: "center",
       isEdit: isEdit,
       width: 180,
       config: {
         key: "address",
         type: "input",
         subtype: "text"
       }
     },

     {
       label: "",
       prop: "",
       align: ""
     }
   ];
 }
 //考核承担
 export function Tablefourcol(that, isEdit) {
          return [
            {
              label: "序号",
              type: "index"
            },
            {
              label: "承担方",
              prop: "companyName",
              isEdit: isEdit,
              width: 120,
              config: {
                key: "companyName",
                type: "input",
                subtype: "text"
              }
            },
            {
              label: "承担方类型",
              prop: isEdit ? "contactType" : "contactTypeName",
              align: "center",
              isEdit,
              width: 180,
              config: {
                key: "contactType",
                type: "select",
                subtype: "date",
                options: that.contactType,
                optionLabel: "value",
                optionValue: "code"
              }
            },
            {
              label: "承担方金额",
              prop: "address",
              align: "center",
              isEdit: isEdit,
              width: 180,
              config: {
                key: "address",
                type: "input",
                subtype: "text"
              }
            },

            {
              label: "",
              prop: "",
              align: ""
            }
          ];
 }
         //主营产品表格
 export function Tablefivecol(that, isEdit) {
          return [
            {
              label: "序号",
              type: "index"
            },
            {
              label: "考核方",
              prop: "companyName",
              isEdit: isEdit,
              width: 120,
              config: {
                key: "companyName",
                type: "input",
                subtype: "text"
              }
            },
            {
              label: "考核方类型",
              prop: isEdit ? "contactType" : "contactTypeName",
              align: "center",
              isEdit,
              width: 180,
              config: {
                key: "contactType",
                type: "select",
                subtype: "date",
                options: that.contactType,
                optionLabel: "value",
                optionValue: "code"
              }
            },
            {
              label: "考核方金额",
              prop: "address",
              align: "center",
              isEdit: isEdit,
              width: 180,
              config: {
                key: "address",
                type: "input",
                subtype: "text"
              }
            },
            {
              label: "服务费",
              prop: "address",
              align: "center",
              isEdit: isEdit,
              width: 180,
              config: {
                key: "address",
                type: "input",
                subtype: "text"
              }
            },

            {
              label: "",
              prop: "",
              align: ""
            }
          ];
 }
