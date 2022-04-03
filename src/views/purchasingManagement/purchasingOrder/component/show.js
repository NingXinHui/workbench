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
        if (!that.tableData.length) {
           that.queryForm.sourceBillNo = "";
           that.queryForm.sourceBillType = "";
           that.queryForm.sourceBillTypeName = "";
        }
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
        type: "index",
        isShow: true
      },
      {
        label: "证书类型",
        prop: isEdit ? "certType" : "certTypeName",
        isEdit: isEdit,
        width: 180,
        isShow: true,
        config: {
          key: "certType",
          type: "select",
          subtype: "text",
          multiple: true,
          collapse: true,
          placeholder: "请选择",
          options: that.certificateType,
          optionLabel: "value",
          optionValue: "code"
        }
      },
      {
        label: "证书比例(%)",
        prop: "certProportion",
        isEdit: isEdit,
        isShow: true,
        config: {
          key: "certProportion",
          type: "input",
          subtype: "text",
          placeholder: " "
        }
      },
      {
        label: "物料编号",
        prop: "materialNo",
        align: "right",
        isShow: true,
        width: 130,
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
          custormRules: {
            message: "物料编号不能为空"
          },
          listeners: {
            focus: e => {
              that.selectTableIndex = e.target.parentNode.parentNode.parentNode.getAttribute(
                "index"
              );
              that.selectLook("materil");
            }
          }
        }
      },
      {
        label: "物料名称",
        prop: "materialName",
        align: "right",
        isEdit: isEdit,
        isShow: true,
        config: {
          key: "materialName",
          type: "input",
          subtype: "text",
          placeholder: " ",
          disabled: true
        }
      },
      {
        label: "物料描述",
        prop: "materialDescription",
        align: "right",
        isEdit: isEdit,
        isShow: true,
        config: {
          key: "materialDescription",
          type: "input",
          subtype: "text",
          placeholder: " ",
          disabled: true
        }
      },
      {
        label: "批次号",
        prop: "materialLot",
        align: "right",
        isEdit: isEdit,
        isShow: true,
        config: {
          key: "materialLot",
          type: "input",
          subtype: "text",
          placeholder: " ",
          disabled: true
        }
      },
      {
        label: "HS CODE",
        prop: "hsCode",
        align: "right",
        isShow: that.queryForm.tradeMethod == 2,
        isEdit: isEdit,
        config: {
          key: "hsCode",
          type: "input",
          subtype: "text",
          placeholder: " ",
          disabled: true
        }
      },
      {
        label: "数量",
        prop: "qty",
        align: "right",
        isEdit: isEdit,
        isShow: true,
        isRequired: true,
        config: {
          key: "qty",
          subtype: "text",
          type: "input",
          attrs: {
            onkeyup:
              "if(!/^[0-9]+(.[0-9]{0,2})?$/g.test(this.value)){this.value=''}"
          },
          custormRules: {
            message: "数量不能为空"
          },
          listeners: {
            blur: e => {
              let index = e.target.parentNode.parentNode.parentNode.getAttribute(
                "index"
              );
              if (
                that.tableData[index].taxPrice &&
                that.queryForm.tradeMethod == "1"
              ) {
                that.$set(
                  that.tableData[index],
                  "amountIncludeTax",
                  (
                    (that.tableData[index].qty || 0) *
                    (that.tableData[index].taxPrice || 0)
                  ).toFixed(2)
                );
              } else if (
                that.tableData[index].purchasePrice &&
                that.queryForm.tradeMethod == "2"
              ) {
                that.$set(
                  that.tableData[index],
                  "totalPrice",
                  (
                    (that.tableData[index].qty || 0) *
                    (that.tableData[index].purchasePrice || 0)
                  ).toFixed(2)
                );
              }
            }
          },
          placeholder: " "
        }
      },
      {
        label: "短装(%)",
        prop: "shortageRate",
        isEdit: isEdit,
        isShow: true,
        config: {
          key: "shortageRate",
          type: "number",
          min: 0,
          max: 99999999,
          precision: 2,
          subtype: "text",
          placeholder: " "
        }
      },
      {
        label: "溢装(%)",
        prop: "overflowRate",
        isEdit: isEdit,
        isShow: true,
        config: {
          key: "overflowRate",
          type: "number",
          min: 0,
          max: 99999999,
          precision: 2,
          subtype: "text",
          placeholder: " "
        }
      },
      {
        label: "计量单位",
        prop: "unit",
        isEdit: isEdit,
        isShow: true,
        config: {
          key: "unit",
          type: "input",
          disabled: true
        }
      },

      {
        label: "含税单价",
        prop: "taxPrice",
        align: "right",
        isShow: that.queryForm.tradeMethod == 1,
        isEdit,
        isRequired: true,
        config: {
          key: "taxPrice",
          type: "input",
          custormRules: {
            message: "含税单价不能为空"
          },
          attrs: {
            onkeyup:
              "if(!/^[0-9]+(.[0-9]{0,2})?$/g.test(this.value)){this.value=''}"
          },
          listeners: {
            blur: e => {
              let index = e.target.parentNode.parentNode.parentNode.getAttribute(
                "index"
              );
              if (that.tableData[index].qty) {
                that.$set(
                  that.tableData[index],
                  "amountIncludeTax",
                  (
                    (that.tableData[index].qty || 0) *
                    (that.tableData[index].taxPrice || 0)
                  ).toFixed(2)
                );
              }
            }
          },
          placeholder: " ",
          controls: false
        }
      },
      {
        label: "税率(%)",
        prop: "taxRate",
        align: "right",
        isShow: that.queryForm.tradeMethod == 1,
        isEdit,
        isRequired: true,
        config: {
          key: "taxRate",
          type: "number",
          min: 0,
          max: 1,
          precision: 2,
          custormRules: {
            message: "税率不能为空"
          },
          precision: 2,
          placeholder: " ",
        }
      },
      {
        label: "含税总价",
        prop: "amountIncludeTax",
        align: "right",
        isShow: that.queryForm.tradeMethod == 1,
        isEdit,
        config: {
          key: "amountIncludeTax",
          type: "input",
          subtype: "text",
          placeholder: " ",
          disabled: true
        }
      },
      {
        label: "采购单价",
        prop: "purchasePrice",
        align: "right",
        isRequired: true,
        isShow: that.queryForm.tradeMethod == 2,
        isEdit,
        config: {
          key: "purchasePrice",
          type: "input",
          custormRules: {
            message: "采购单价不能为空"
          },
          attrs: {
            onkeyup:
              "if(!/^[0-9]+(.[0-9]{0,2})?$/g.test(this.value)){this.value=''}"
          },
          listeners: {
            blur: e => {
              let index = e.target.parentNode.parentNode.parentNode.getAttribute(
                "index"
              );
              if (
                that.tableData[index].qty &&
                that.queryForm.tradeMethod == "2"
              ) {
                that.$set(
                  that.tableData[index],
                  "totalPrice",
                  (
                    (that.tableData[index].qty || 0) *
                    (that.tableData[index].purchasePrice || 0)
                  ).toFixed(2)
                );
              }
            }
          },
          placeholder: " ",
          controls: false
        }
      },
      {
        label: "关税(%)",
        prop: "tariff",
        align: "right",
        isShow: that.queryForm.tradeMethod == 2,
        isEdit,
        config: {
          key: "tariff",
          type: "number",
          min: 0,
          max: 999999,
          precision: 2,
          subtype: "text",
          placeholder: " ",
          controls: false
        }
      },
      {
        label: "采购总价",
        prop: "totalPrice",
        align: "right",
        isShow: that.queryForm.tradeMethod == 2,
        isEdit,
        config: {
          key: "totalPrice",
          type: "input",
          subtype: "text",
          placeholder: " ",
          disabled: true
        }
      },
      {
        label: "资金使用值",
        prop: "capitalUse",
        align: "right",
        isShow: true,
        isEdit,
        config: {
          key: "capitalUse",
          type: "input",
          subtype: "text",
          placeholder: " ",
          disabled: true
        }
      },
      {
        label: "放样费",
        prop: "settingOutFee",
        align: "right",
        isShow: true,
        isEdit,
        config: {
          key: "settingOutFee",
          type: "number",
          min: 0,
          max: 999999,
          precision: 2,
          subtype: "text",
          placeholder: " ",
          controls: false
        }
      },
      {
        label: "代理费",
        prop: "agencyFee",
        align: "right",
        isShow: that.queryForm.purchaseTypeCode == "AgentPurchasing",
        isEdit,
        config: {
          key: "agencyFee",
          type: "number",
          min: 0,
          max: 999999,
          precision: 2,
          subtype: "text",
          placeholder: " ",
          controls: false
        }
      },
      {
        label: "跟单费单价",
        prop: "followPrice",
        align: "right",
        isEdit,
        isShow:
          that.queryForm.purchaseTypeCode == "ProcessingDoubleDistribution",
        config: {
          key: "followPrice",
          type: "number",
          min: 0,
          max: 999999,
          precision: 2,
          subtype: "text",
          placeholder: " ",
          controls: false
        }
      },
      {
        label: "跟单费总价",
        prop: "followTotalPrice",
        align: "right",
        isEdit,
        isShow:
          that.queryForm.purchaseTypeCode == "ProcessingDoubleDistribution",
        config: {
          key: "followTotalPrice",
          type: "number",
          min: 0,
          max: 999999,
          precision: 2,
          subtype: "text",
          placeholder: " ",
          controls: false
        }
      },
      {
        label: "预计损耗率",
        prop: "estimatedLoss",
        align: "right",
        isShow: that.queryForm.purchaseTypeId == "ProcessingDoubleDistribution",
        isEdit,
        config: {
          key: "estimatedLoss",
          type: "number",
          min: 0,
          max: 999999,
          precision: 2,
          subtype: "text",
          placeholder: " ",
          controls: false
        }
      },
      {
        label: "申请人",
        prop: "applicantName",
        isEdit: isEdit,
        isShow: true,
        config: {
          key: "applicantName",
          type: "input",
          subtype: "text",
          placeholder: "请选择",
          attrs: {
            readonly: true,
            suffixIcon: "el-icon-arrow-down"
          },
          listeners: {
            focus: e => {
              that.selectTableIndex = e.target.parentNode.parentNode.parentNode.getAttribute(
                "index"
              );
              that.selectLook("person");
            }
          },
          custormRules: {
            message: "申请人不能为空"
          }
        }
      },
      {
        label: "备注",
        prop: "remark",
        align: "right",
        isEdit: isEdit,
        isShow: true,
        config: {
          key: "remark",
          type: "input",
          subtype: "text",
          placeholder: " "
        }
      }
    ];

  }
//融资信息表格
   export function topTablecol(that, isEdit) {
     return [
       {
         label: "序号",
         type: "index"
       },
       {
         label: "融资单位付款日",
         prop: "financingPayDate",
         align: "right",
         isEdit,
         width: 120,
         config: {
           key: "financingPayDate",
           type: "date",
           subtype: "date",
           valueFormat: "yyyy-MM-dd",
           custormRules: {
             message: "融资单位付款日不能为空"
           }
         }
       },
       {
         label: "融资单位付款全额",
         prop: "financingPayAmount",
         isEdit: isEdit,
         config: {
           key: "financingPayAmount",
           type: "input",
           subtype: "text",
         }
       },
       {
         label: "结息日",
         prop: "interestSettlementDate",
         align: "right",
         isEdit,
         width: 120,
         config: {
           key: "interestSettlementDate",
           type: "date",
           subtype: "date",
           valueFormat: "yyyy-MM-dd",
           custormRules: {
             message: "结息日不能为空"
           }
         }
       },
       {
         label: "实际付款金额",
         prop: "factPayAmount",
         align: "right",
         isEdit: isEdit,
         config: {
           key: "factPayAmount",
           type: "input",
           subtype: "text",
           placeholder: " "
         }
       },
       {
         label: "计息天数",
         prop: "interestDays",
         align: "right",
         isEdit: isEdit,
         config: {
           key: "interestDays",
           type: "input",
           subtype: "text",
           placeholder: " "
         }
       },
       {
         label: "利息",
         prop: "interest",
         align: "right",
         isEdit: isEdit,
         config: {
           key: "interest",
           type: "input",
           subtype: "text",
           placeholder: " "
         }
       },
       {
         label: "",
         prop: "",
         align: "right"
       }
     ];
   }
