
export function formone(that, isEdit) {
    let formItemList = [
      {
        key: "billNo",
        type: "input",
        subtype: "text",
        label: "销售退货单",
        isEdit,
        disabled: true,
        placeholder: "保存后自动生成"
      },
      {
        key: "orderNo",
        type: "input",
        subtype: "text",
        label: "关联销售订单号",
        isEdit,
        disabled: true,
        placeholder: "请选择"
      },
      {
        key: "sourceBillNo",
        type: "input",
        subtype: "text",
        label: "来源单号",
        isEdit,
        disabled: true,
        placeholder: ""
      },
      {
        key: "sourceBillTypeName",
        type: "input",
        subtype: "text",
        label: "源单类型",
        isEdit,
        disabled: true,
        placeholder: ""
      },
      {
        key: "planReturnDate",
        type: "date",
        subtype: "date",
        valueFormat: "yyyy-MM-dd",
        label: "预计退货日期",
        isEdit,
        attrs: {
          pickerOptions: {
            disabledDate(time) {
              return Date.now()-8.64e7 >= time.getTime() ;
            }
          }
        },
        rules: {
          required: true,
          trigger: "blur"
        }
      },
      {
        key: "personLiableName",
        type: "input",
        subtype: "text",
        label: "责任人",
        disabled: true,
        isEdit,
        /*  attrs: {
          readonly: true,
          suffixIcon: "el-icon-arrow-down"
        }, */
        /*  listeners: {
          focus: () => that.selectLook("chargeMan")
        }, */
        placeholder: "请输入",
        rules: {
          required: true,
          trigger: "blur"
        }
      },
      {
        // key: isEdit ? "orderTypeName3" : "orderTypeNo3",
        key: "responsibleDepartmentName",
        // type: isEdit ? "input" : "selectLook",
        type: "input",
        // type:"select",

        /*   listeners: {
          focus: () => that.selectLook("chargeMan")
        }, */

        subtype: "text",
        label: "责任部门",
        disabled: true,
        isEdit,
        options: that.orderTypeList,
        optionLabel: "orderTypeName",
        optionValue: "orderTypeNo",
        rules: {
          required: true,
          trigger: "blur"
        }
      }
    ];

    return formItemList

  }

  export function formtwo(that,isEdit){
    let formItemList = [
      {
        key: "returneeName",
        type: "input",
        subtype: "text",
        label: "退货申请人",
        disabled: true,
        isEdit,
       /*  attrs: {
          readonly: true,
          suffixIcon: "el-icon-arrow-down"
        }, */
       /*  listeners: {
          focus: () => that.selectLook("returnMan")
        }, */
        // placeholder: "请输入",
        rules: {
          required: true,
          trigger: "blur"
        }
      },
      {
        // key: isEdit ? "orderTypeName3" : "orderTypeNo3",
        key:'receiveMethodName',
        type: isEdit ? "input" : "select",
        subtype: "text",
        label: "收货方式",
        isEdit,
        options: that.orderTypeList,
        optionLabel: "value",
        optionValue: "id",
        rules: {
          required: true,
          trigger: "blur"
        }
      },
      {
        key: "customerName",
        type: "input",
        subtype: "text",
        label: "客户名称",
        disabled: true,
        isEdit,
        placeholder: "请输入"
      },
      {
        key: "companyName",
        type: "input",
        // type: isEdit ? "input" : "select",

        subtype: "text",
        label: "收货单位",
        isEdit,
        attrs: {
          readonly: true,
          suffixIcon: "el-icon-arrow-down"
        },
        listeners: {
          focus:e => {
            console.log(e);
            that.selectLook("company")
          }
        },
        options: that.receiveUnitList,
        optionLabel: "companyName",
        optionValue: "id",
        placeholder: "请输入",
        // rules: {
        //   required: true,
        //   trigger: "blur"
        // }
      },
      {
        key: "contactName",
        type: "input",
        subtype: "text",
        label: "收货人",

        disabled: true,
        isEdit,
        placeholder: "请输入"
      },
      {
        key: "contactPhoneNumber",
        type: "input",
        subtype: "text",
        label: "收货人联系方式",
        disabled: true,
        isEdit,
        placeholder: "请输入"
      },
     /*  {
        key: "salesName",
        type: "input",
        subtype: "text",
        label: "客户方式",
        disabled: true,
        isEdit,
        placeholder: "请输入"
      }, */
      {
        key: "address",
        type: "input",
        subtype: "text",
        label: "地址区域",
        disabled: true,
        isEdit,
        placeholder: "请输入"
      },
      {
        key: "addressDtl",
        type: "input",
        subtype: "text",
        label: "详细地址",
        disabled: true,
        isEdit,
        placeholder: "请输入"
      },
      {
        key: "returnReason",
        type: "input",
        subtype: "textarea",
        label: "退货原因",
        maxlength: 200,
        isEdit,
        placeholder: "请输入"
      }
    ];

    return formItemList

  }

  export function formThree(that, isEdit) {
    let formItemList = [
      {
        key: "remark",
        type: "input",
        subtype: "textarea",
        label: "备注",
        maxlength: 200,
        isEdit,
        placeholder: ""
      }
    ];

    return formItemList;
  }
