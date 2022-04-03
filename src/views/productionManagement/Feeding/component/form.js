
export function formone(that, isEdit) {
    let formItemList = [
      {
        key: "billNo",
        type: "input",
        subtype: "text",
        label: "投料申请单",
        isEdit,
        disabled: true,
        placeholder: "保存后自动生成"
      },
      {
        key: "orderNo",
        type: "input",
        subtype: "text",
        label: "销售订单号",
        isEdit,
        disabled: true,
        placeholder: ""
      },
      {
        // key: "warehouseId",
        key:isEdit ? "warehouseName": "warehouseId",
        type: isEdit ? "input" : "select",

        subtype: "text",
        label: "仓库地区",
        isEdit,
        options:that.warehouseList,
        optionLabel: "warehouseName",
        optionValue: "id",
        // disabled: true,
        rules: {
          required: true,
          trigger: "blur"
        },
        placeholder: ""
      },
      
      {
        key: "outsourceNo",
        type: "input",
        subtype: "text",
        label: "委外加工单号",
        isEdit,
        disabled: true,
        placeholder: ""
      },
      {
        key: "productionTaskNo",
        type: "input",
        subtype: "text",
        label: "生产任务书号",
        isEdit,
        disabled: true,
        placeholder: ""
      },

      {
        key: isEdit ? "feedTypeName" : "feedType",
        // key:'feedType',
        type: isEdit ? "input" : "select",
        subtype: "text",
        label: "投料类型",
        isEdit,
        options: [
          {
            label: "投料",
            value: 1
          },
          {
            label: "补料",
            value: 2
          }
        ],
        optionLabel: "label",
        optionValue: "value",
        rules: {
          required: true,
          trigger: "blur"
        }
      },
      {
        key: "feedDate",
        type: "date",
        subtype: "date",
        valueFormat: "yyyy-MM-dd",
        label: "要求投料日期",
        isEdit,
        rules: {
          required: true,
          trigger: "blur"
        }
      },
    
    ];

    return formItemList

  }

  export function formTwo(that, isEdit) {
    let formItemList = [
      
     {
      key: isEdit ? "deliveryTypeName" : "deliveryType",
      // key:"deliveryType",
      type: isEdit ? "input" : "select",
      subtype: "text",
      label: "发货方式",
      isEdit,
      options: that.deliveryType,
      optionLabel: "value",
      optionValue: "code",
      rules: {
        required: true,
        trigger: "blur"
      }
    },
      {
        key: "checkItemName",
        type: "input",
        subtype: "text",
        label: "加工商",
        isEdit,
        disabled: true,
        placeholder: ""
      },

      {
        key: "feedApplyCompanyName",
        // key:isEdit?"checkItemId" : "checkItemName",
     
        type: "input",
        subtype: "text",
        label: "单位名称",
        isEdit,
        attrs: {
          readonly: true,
          suffixIcon: "el-icon-arrow-down"
        },
        listeners: {
          
          focus: () =>{
          
            that.selectLook("checkItemName")
          } 
        },
        placeholder: "请输入",
        rules: {
          required: true,
          trigger: "blur"
        }
      },
      {
        key: "receiveDistrict",
        type: "input",
        subtype: "text",
        label: "地址区域",
        isEdit,
        disabled: true,
        placeholder: ""
      },
  
      {
        key: "receiveAddress",
        type: "input",
        subtype: "text",
        label: "详细地址",
        isEdit,
        disabled: true,
        placeholder: ""
      },
  
      {
        // key:isEdit?"contacts":"contactsName",
        key:'contact',
        type: "input",
        subtype: "text",
        label: "联系人名称",
        isEdit,
        rules: {
          required: true,
          trigger: "blur"
        },
        disabled: true,
        placeholder: ""
      },
      {
        key: "contactTel",
        type: "input",
        subtype: "text",
        label: "联系方式",
        isEdit,
        rules: {
          required: true,
          trigger: "blur"
        },
        disabled: true,
        placeholder: ""
      }
    ];

    return formItemList

  }

  export function formThree(that, isEdit) {
    let formItemList = [
     
      {
        key: "billNo6",
        type: "input",
        subtype: "textarea",
        label: "备注",
        maxlength: 200,
        isEdit,
        placeholder: ""
      }
    ];

    return formItemList

  }
