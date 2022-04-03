//部门信息表格
   export function TableOnecol(that, isEdit) {
     return [
       {
         label: "序号",
         type: "index"
       },
       {
         label: "部门名称",
         prop: "departmentName",
         isEdit: isEdit,
         width: 120,
         config: {
           key: "departmentName",
           type: "input",
           subtype: "text",
           isIndexOrDisabled: 0,
           placeholder: "请选择",
           custormRules: {
             message: "部门名称不能为空"
           }
         }
       },
       {
         label: "采购-结算方式",
         prop: isEdit
           ? "settlementMethodPurchase"
           : "settlementMethodPurchaseName",
         align: "center",
         isEdit,
         width: 180,
         config: {
           key: "settlementMethodPurchase",
           type: "select",
           //  key: "settlementMethodPurchase",
           //  type: "select",
           subtype: "text",
           isIndexOrDisabled: 0,
           options: that.settlementType,
           optionLabel: "value",
           optionValue: "code"
         }
       },
       {
         label: "销售结算方式",
         prop: isEdit ? "settlementMethodSale" : "settlementMethodSaleName",
         align: "center",
         isEdit: isEdit,
         width: 180,
         config: {
           key: "settlementMethodSale",
           type: "select",
           subtype: "date",
           isIndexOrDisabled: 0,
           options: that.settlementType,
           optionLabel: "value",
           optionValue: "code"
         }
       },
       {
         label: "是否启用",
         prop: "usable",
         align: "center",
         isEdit: isEdit,
         width: 90,
         render:!isEdit? (h, scope) => {
           return h("el-checkbox", {
             props: {
               value: scope.row.usable,
               disabled:true
             }
           });
         } : '',
         config: {
           key: "usable",
           type: "checkbox",
           isIndexOrDisabled: 0,
           subtype: "text",
           placeholder: " "
         }
       },
       {
         label: "",
         prop: "",
         align: "center"
       }
     ];
   }
//联系人表格
 export function Tabletwocol(that, isEdit) {
          return [
            {
              label: "序号",
              type: "index"
            },
            {
              label: "联系人类型",
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
                custormRules: {
                  message: "联系人类型不能为空"
                }
              }
            },
            {
              label: "单位名称",
              prop: "companyName",
              isEdit: isEdit,
              width: 120,
              config: {
                key: "companyName",
                type: "input",
                subtype: "text",
                custormRules: {
                  message: "单位名称不能为空"
                }
              }
            },
            {
              label: "部门名称",
              prop: "departmentName",
              align: "center",
              isEdit: isEdit,
              width: 180,
              config: {
                key: "departmentName",
                type: "select",
                subtype: "text",
                options: that.queryForm.departmentList.map(item => {
                  return {
                    label: item.departmentName,
                    value: item.departmentName
                  };
                }),
                optionLabel: "label",
                optionValue: "value"
              }
            },
            {
              label: "单位地址",
              prop: "address",
              align: "center",
              isEdit: isEdit,
              width: 180,
              config: {
                key: "address",
                type: "input",
                subtype: "text",
                options: that.provinceList
              }
            },
            {
              label: "详细地址",
              prop: "addressDtl",
              isEdit: isEdit,
              width: 120,
              config: {
                key: "addressDtl",
                type: "input",
                subtype: "text",
                custormRules: {
                  message: "详细地址不能为空"
                }
              }
            },
            {
              label: "姓名",
              prop: "contactName",
              isEdit: isEdit,
              width: 120,
              config: {
                key: "contactName",
                type: "input",
                subtype: "text",
                custormRules: {
                  message: "姓名不能为空"
                }
              }
            },
            {
              label: "性别",
              prop: "contactSex",
              align: "center",
              isEdit: isEdit,
              width: 180,
              config: {
                key: "contactSex",
                type: "select",
                subtype: "date",
                options: [
                  {
                    label: "男",
                    value: "男"
                  },
                  {
                    label: "女",
                    value: "女"
                  }
                ],
                optionLabel: "label",
                optionValue: "value"
              }
            },
            {
              label: "职务",
              prop: "contactPost",
              isEdit: isEdit,
              width: 120,
              config: {
                key: "contactPost",
                type: "input",
                subtype: "text",
                custormRules: {
                  message: "职务不能为空"
                }
              }
            },
            {
              label: "身份证号码",
              prop: "contactIdNumber",
              isEdit: isEdit,
              width: 120,
              config: {
                key: "contactIdNumber",
                type: "input",
                subtype: "text"
              }
            },
            {
              label: "联系方式",
              prop: "contactPhoneNumber",
              isEdit: isEdit,
              width: 120,
              config: {
                key: "contactPhoneNumber",
                type: "input",
                subtype: "text"
              }
            },
            {
              label: "邮箱",
              prop: "contactEmail",
              isEdit: isEdit,
              width: 120,
              config: {
                key: "contactEmail",
                type: "input",
                subtype: "text"
              }
            },
            {
              label: "是否启用",
              prop: "usable",
              align: "center",
              isEdit: isEdit,
              width: 90,
              render: !isEdit
                ? (h, scope) => {
                    return h("el-checkbox", {
                      props: {
                        value: scope.row.usable,
                        disabled: true
                      }
                    });
                  }
                : "",
              config: {
                key: "usable",
                type: "checkbox",
                subtype: "text",
                placeholder: " "
              }
            },
            {
              label: "业务对接人",
              prop: "counterpartName",
              align: "",
              isEdit: isEdit,
              config: {
                key: "counterpartName",
                type: "input",
                subtype: "text",
                placeholder: " ",
                attrs: {
                  readonly: true,
                  suffixIcon: "el-icon-arrow-down"
                },
                listeners: {
                  focus: e => that.selectLook("person", e)
                }
              }
            }
          ];
 }
//业务员表格
 export function Tablethreecol(that, isEdit) {
   return [
     {
       label: "序号",
       type: "index"
     },
     {
       label: "姓名",
       prop: "userName",
       width: 120,
       config: {
         disabled: isEdit ? true : false,
         key: "userName",
         type: "input",
         subtype: "text"
       }
     },
     {
       label: "业务员手机号",
       prop: "phone",
       width: 120,
       config: {
         disabled: isEdit ? true : false,
         key: "phone",
         type: "input",
         subtype: "text"
       }
     },
     {
       label: "业务员类型",
       prop: isEdit ? "businessPersonType" : "businessPersonTypeName",
       align: "center",
       isEdit: isEdit,
       width: 180,
       config: {
         key: "businessPersonType",
         type: "select",
         subtype: "date",
         options: that.salesmanType,
         optionLabel: "value",
         optionValue: "code"
       }
     },
     {
       label: "",
       prop: "",
       align: ""
     }
   ];
 }
 //开票信息表格
 export function Tablefourcol(that, isEdit) {
          return [
            {
              label: "序号",
              type: "index"
            },
            {
              label: "开户类型",
              prop: "accountType",
              isEdit: isEdit,
              width: 120,
              config: {
                key: "accountType",
                type: "select",
                options: [
                  {
                    label: "基本户",
                    value: "基本户"
                  },
                  {
                    label: "一般户",
                    value: "一般户"
                  }
                ],
                optionLabel: "label",
                optionValue: "value",
                subtype: "text",
                custormRules: {
                  message: "开户类型不能为空"
                }
              }
            },
            {
              label: "开户银行",
              prop: "bank",
              isEdit: isEdit,
              width: 120,
              config: {
                key: "bank",
                type: "input",
                subtype: "text",
                custormRules: {
                  message: "开户银行不能为空"
                }
              }
            },
            {
              label: "银行账号",
              prop: "bankAccount",
              isEdit: isEdit,
              width: 120,
              config: {
                key: "bankAccount",
                type: "input",
                subtype: "text",
                custormRules: {
                  message: "银行账号不能为空"
                }
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
              label: "产品类型",
              prop: "productType",
              isEdit: isEdit,
              width: 120,
              config: {
                key: "productType",
                type: "input",
                subtype: "text",
                custormRules: {
                  message: "产品类型不能为空"
                }
              }
            },
            {
              label: "规格描述",
              prop: "productSpec",
              isEdit: isEdit,
              width: 120,
              config: {
                key: "productSpec",
                type: "input",
                subtype: "text",
                custormRules: {
                  message: "规格描述不能为空"
                }
              }
            },
            {
              label: "特殊说明",
              prop: "productDescription",
              isEdit: isEdit,
              width: 120,
              config: {
                key: "productDescription",
                type: "input",
                subtype: "text",
                custormRules: {
                  message: "特殊说明不能为空"
                }
              }
            },
            {
              label: "",
              prop: "",
              align: ""
            }
          ];
 }
// 设备情况表格
export function Tablesixcol(that, isEdit) {
         return [
           {
             label: "序号",
             type: "index"
           },
           {
             label: "设备类型",
             prop:  isEdit
           ? "type"
           : "typeName",
             align: "center",
             isEdit,
             width: 180,
             config: {
               key: "type",
               type: "select",
               subtype: "text",
               options: that.supplierEquipmentType,
               optionLabel: "value",
               optionValue: "code"
             }
           },
           {
             label: "设备数量",
             prop: "count",
             isEdit: isEdit,
             width: 120,
             config: {
               key: "count",
               type: "input",
               subtype: "text"
             }
           },
           {
             label: "设备品牌",
             prop: "brand",
             isEdit: isEdit,
             width: 120,
             config: {
               key: "brand",
               type: "input",
               subtype: "text"
             }
           },
           {
             label: "设备产地",
             prop: "origin",
             isEdit: isEdit,
             width: 120,
             config: {
               key: "origin",
               type: "input",
               subtype: "text"
             }
           },
           {
             label: "设备年份",
             prop: "year",
             isEdit: isEdit,
             width: 120,
             config: {
               key: "year",
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
//国外工厂
export function Tablesevencol(that, isEdit) {
         return [
           {
             label: "序号",
             type: "index"
           },
           {
             label: "工厂名称",
             prop: "name",
             isEdit: isEdit,
             width: 120,
             config: {
               key: "name",
               type: "input",
               subtype: "text"
             }
           },
           {
             label: "所在国家",
             prop: "country",
             isEdit: isEdit,
             width: 120,
             config: {
               key: "country",
               type: "input",
               subtype: "text"
             }
           },
           {
             label: "工厂地址",
             prop: "address",
             isEdit: isEdit,
             width: 120,
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
//关联企业
export function Tableeightcol(that, isEdit) {
         return [
           {
             label: "序号",
             type: "index"
           },
           {
             label: "企业名称",
             prop:"checkItemName",
             align: "center",
             isEdit,
             width: 180,

             config: {
               key: "checkItemName",
               type: "input",
               subtype: "text",
               attrs: {
                 readonly: true,
                 suffixIcon: "el-icon-arrow-down"
               },
               listeners: {
                 focus: e => that.selectLook("company", e)
               }
               //  options: that.companyList,
               //  optionLabel: "checkItemName",
               //  optionValue: "id",
               //  input: (e, a) => {
               //    let index = that.companyList.findIndex(i => {
               //      return i.id == e;
               //    });
               //    that.$set(
               //      that.queryForm.relevanceList[a],
               //      "checkItemNo",
               //      that.companyList[index].checkItemNo
               //    );
               //    that.$set(
               //      that.queryForm.relevanceList[a],
               //      "checkItemTypeName",
               //      that.companyList[index].checkItemTypeName
               //    );
               //  }
             }
           },
           {
             label: "客商编号",
             prop: "checkItemNo",
             isEdit: isEdit,
             width: 120,
             config: {
               key: "checkItemNo",
               type: "input",
               subtype: "text"
             }
           },
           {
             label: "客商类型",
             prop: "checkItemTypeName",
             isEdit: isEdit,
             width: 120,
             config: {
               key: "checkItemTypeName",
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
