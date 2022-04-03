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
      commission: "",
      discountRate: "",
      hscode: "",
      materialId: "",
      materialLot: "",
      overflowRate: "",
      price: "",
      purchaser: "",
      pushQty: "",
      qty: "",
      saleAmount: "1",
      salePrice: "",
      salesCertificateRate: "",
      salesCertificateType: "",
      salesGuidancePrice: "",
      serviceFee: "",
      shortageRate: "",
      source: "",
      taxAmount: "",
      taxIncludePrice: "",
      taxIncludeTotalAmount: "1",
      taxRate: "",
      totalAmount: "",
      unit: ""
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
            focus: e => that.selectLook("materil", e)
          },
          custormRules: {
            message: "物料编号不能为空"
          }
        }
      },
      {
        label: "物料名称",
        prop: "materialName",
        isEdit: isEdit,
        config: {
          key: "materialName",
          type: "input",
          subtype: "text",
          disabled: true,
          custormRules: {
            message: "物料名称不能为空"
          },
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
          placeholder: " ",
          custormRules: {
            message: "批次号不能为空"
          }
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
          placeholder: " ",
          disabled: true
        }
      },

      {
        label: "数量",
        prop: "qty",
        align: "right",
        width: 120,
        isEdit: isEdit,
        config: {
          key: "qty",
          subtype: "text",
          type: "input",
          min: 1,
          max: 99999999,
          precision: 2,
          custormRules: {
            message: "数量不能为空"
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
              if (that.tableData[index].taxIncludePrice) {
                that.tableData[index].taxIncludeTotalAmount = (
                  (that.tableData[index].qty || 0) *
                  (that.tableData[index].taxIncludePrice || 0)
                ).toFixed(2);
              }
            }
          },
          placeholder: " "
        }
      },
      {
        label: "计量单位",
        prop: "unitName",
        align: "right",
        isEdit: isEdit,
        config: {
          key: "unitName",
          type: "input",
          disabled: true,
          subtype: "text",
          placeholder: " "
        }
      },
      {
        label: "销售指导价",
        prop: "salesGuidancePrice",
        align: "right",
        isEdit: isEdit,
        config: {
          key: "salesGuidancePrice",
          type: "input",
          subtype: "text",
          disabled: true,
          placeholder: " "
        }
      },
      {
        label: "税率(%)",
        prop: "taxRate",
        align: "center",
        isEdit: isEdit,
        align: "110",
        config: {
          key: "taxRate",
          type: "number",
          min: 0,
          max: 1,
          precision: 2,
          subtype: "text",
          placeholder: "",
          custormRules: {
            message: "税率不能为空"
          }
        }
      },
      {
        label: "含税单价",
        prop: "taxIncludePrice",
        align: "right",
        width: 120,
        isEdit: isEdit,
        config: {
          key: "taxIncludePrice",
          type: "input",
          min: 1,
          max: 99999999,
          precision: 2,
          subtype: "text",
          placeholder: " ",
          attrs: {
            onkeyup:
              "if(!/^[0-9]+(.[0-9]{0,2})?$/g.test(this.value)){this.value=''}"
          },
          custormRules: {
            message: "含税单价不能为空"
          },
          listeners: {
            blur: e => {
              let index = e.target.parentNode.parentNode.parentNode.getAttribute(
                "index"
              );
              if (that.tableData[index].qty) {
                that.tableData[index].taxIncludeTotalAmount = (
                  (that.tableData[index].qty || 0) *
                  (that.tableData[index].taxIncludePrice || 0)
                ).toFixed(2);
              }
            }
          }
        }
      },
      {
        label: "含税总价",
        prop: "taxIncludeTotalAmount",
        align: "right",
        isEdit: isEdit,
        config: {
          key: "taxIncludeTotalAmount",
          type: "input",
          subtype: "text",
          disabled: true,
          placeholder: " "
        }
      },
      {
        label: "服务费",
        prop: "serviceFee",
        align: "right",
        width: 120,
        isEdit: isEdit,
        config: {
          key: "serviceFee",
          type: "number",
          min: 1,
          max: 99999999,
          precision: 2,
          subtype: "text",
          placeholder: " "
        }
      },
      {
        label: "证书类型",
        prop: isEdit ? "salesCertificateType" : "salesCertificateTypeName",
        align: "right",
        isEdit: isEdit,
        width: 180,
        config: {
          key: "salesCertificateType",
          type: "select",
          multiple: true,
          collapse: true,
          options: that.certificateType,
          optionLabel: "value",
          optionValue: "code",
          subtype: "text",
          placeholder: " ",
          custormRules: {
            message: "证书类型不能为空"
          }
        }
      },
      {
        label: "证书比例(%)",
        prop: "salesCertificateRate",
        align: "right",
        isEdit: isEdit,
        width: 120,
        config: {
          key: "salesCertificateRate",
          type: "input",
          subtype: "text",
          placeholder: " ",
          custormRules: {
            message: "证书比例不能为空"
          }
        }
      },
      {
        label: "折扣%",
        prop: "discountRate",
        align: "right",
        width: 120,
        isEdit: isEdit,
        config: {
          key: "discountRate",
          type: "number",
          min: 1,
          max: 99999999,
          precision: 2,
          subtype: "text",
          placeholder: " ",
          custormRules: {
            message: "折扣不能为空"
          }
        }
      },
      {
        label: "短装(%)",
        prop: "shortageRate",
        isEdit: isEdit,
        width: 120,
        config: {
          key: "shortageRate",
          type: "number",
          min: 0,
          max: 99999999,
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
        width: 120,
        isEdit: isEdit,
        config: {
          key: "overflowRate",
          type: "number",
          min: 0,
          max: 99999999,
          precision: 2,
          custormRules: {
            message: "溢装不能为空"
          },
          subtype: "text",
          placeholder: " "
        }
      },

      {
        label: "佣金",
        prop: "commission",
        isEdit: isEdit,
        width: 120,
        config: {
          key: "commission",
          type: "number",
          min: 1,
          max: 99999999,
          precision: 2,
          subtype: "text",
          placeholder: "请选择",
          custormRules: {
            message: "佣金不能为空"
          }
        }
      },
      {
        label: "采购业务员",
        prop: "purchaser",
        align: "right",
        isEdit: isEdit,
        config: {
          key: "purchaser",
          type: "input",
          subtype: "text",
          disabled: true,
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
             focus: e => that.selectLook("materil", e)
           },
           custormRules: {
             message: "物料编号不能为空"
           }
         }
       },
       {
         label: "物料名称",
         prop: "materialName",
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
           placeholder: " ",
           disabled: true
         }
       },
       {
         label: "HS CODE",
         prop: "hscode",
         align: "right",
         isEdit: isEdit,
         config: {
           key: "hscode",
           type: "input",
           subtype: "text",
           custormRules: {
             message: "HS CODE不能为空"
           },
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
           custormRules: {
             message: "批次号不能为空"
           },
           placeholder: " "
         }
       },
       {
         label: "数量",
         prop: "qty",
         align: "right",
         width: 120,
         isEdit: isEdit,
         config: {
           key: "qty",
           subtype: "text",
           type: "input",
           min: 1,
           max: 99999999,
           precision: 2,
           custormRules: {
             message: "数量不能为空"
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
               if (that.tableData[index].salePrice) {
                 that.tableData[index].saleAmount = (
                   (that.tableData[index].qty || 0) *
                   (that.tableData[index].salePrice || 0)
                 ).toFixed(2);
               }
             }
           },
           placeholder: " "
         }
       },
       {
         label: "计量单位",
         prop: "unitName",
         align: "right",
         isEdit: isEdit,
         config: {
           key: "unitName",
           type: "input",
           disabled: true,
           subtype: "text",
           placeholder: " "
         }
       },
       {
         label: "销售指导价",
         prop: "salesGuidancePrice",
         align: "right",
         isEdit: isEdit,
         config: {
           key: "salesGuidancePrice",
           type: "input",
           subtype: "text",
           disabled: true,
           placeholder: " "
         }
       },
       {
         label: "税率(%)",
         prop: "taxRate",
         align: "center",
         isEdit: isEdit,
         align: "110",
         config: {
           key: "taxRate",
           type: "number",
           min: 0,
           max: 1,
           precision: 2,
           subtype: "text",
           placeholder: " ",
           custormRules: {
             message: "税率不能为空"
           }
         }
       },
       {
         label: "销售单价",
         prop: "salePrice",
         align: "right",
         width: 120,
         isEdit: isEdit,
         config: {
           key: "salePrice",
           type: "input",
           min: 1,
           max: 99999999,
           precision: 2,
           subtype: "text",
           placeholder: " ",
           custormRules: {
             message: "销售单价不能为空"
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
                 that.tableData[index].saleAmount = (
                   (that.tableData[index].qty || 0) *
                   (that.tableData[index].salePrice || 0)
                 ).toFixed(2);
               }
             }
           }
         }
       },
       {
         label: "销售总价",
         prop: "saleAmount",
         align: "right",
         isEdit: isEdit,
         config: {
           key: "saleAmount",
           type: "input",
           subtype: "text",
           disabled: true,
           placeholder: " "
         }
       },
       {
         label: "服务费",
         prop: "serviceFee",
         align: "right",
         width: 120,
         isEdit: isEdit,
         config: {
           key: "serviceFee",
           type: "number",
           min: 1,
           max: 99999999,
           precision: 2,
           subtype: "text",
           placeholder: " ",
           custormRules: {
             message: "服务费不能为空"
           }
         }
       },
       {
         label: "证书类型",
         prop: isEdit ? "salesCertificateType" : "salesCertificateTypeName",
         align: "right",
         isEdit: isEdit,
         width: 180,
         config: {
           key: "salesCertificateType",
           type: "select",
           options: that.certificateType,
           optionLabel: "value",
           optionValue: "code",
           multiple: true,
           collapse: true,
           subtype: "text",
           placeholder: " ",
           custormRules: {
             message: "证书类型不能为空"
           }
         }
       },
       {
         label: "证书比例(%)",
         prop: "salesCertificateRate",
         align: "right",
         isEdit: isEdit,
         width: 120,
         config: {
           key: "salesCertificateRate",
           type: "input",
           subtype: "text",
           placeholder: " ",
           custormRules: {
             message: "证书比例不能为空"
           }
         }
       },
       {
         label: "折扣%",
         prop: "discountRate",
         align: "right",
         width: 120,
         isEdit: isEdit,
         config: {
           key: "discountRate",
           type: "number",
           min: 1,
           max: 99999999,
           precision: 2,
           subtype: "text",
           placeholder: " ",
           custormRules: {
             message: "折扣不能为空"
           }
         }
       },
       {
         label: "短装(%)",
         prop: "shortageRate",
         isEdit: isEdit,
         width: 120,
         config: {
           key: "shortageRate",
           type: "number",
           min: 0,
           max: 99999999,
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
         width: 120,
         isEdit: isEdit,
         config: {
           key: "overflowRate",
           type: "number",
           min: 0,
           max: 99999999,
           precision: 2,
           custormRules: {
             message: "溢装不能为空"
           },
           subtype: "text",
           placeholder: " "
         }
       },

       {
         label: "佣金",
         prop: "commission",
         isEdit: isEdit,
         width: 120,
         config: {
           key: "commission",
           type: "number",
           min: 1,
           max: 99999999,
           precision: 2,
           subtype: "text",
           placeholder: "请选择",
           custormRules: {
             message: "佣金不能为空"
           }
         }
       },
       {
         label: "采购业务员",
         prop: "purchaser",
         align: "right",
         isEdit: isEdit,
         config: {
           key: "purchaser",
           type: "input",
           subtype: "text",
           disabled: true,
           placeholder: " "
         }
       }
     ];
   }
