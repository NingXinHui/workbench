
export function formone(that, isEdit) {
    let formItemList = [
      {
        key: isEdit ? "checkItemCategoryName" : "checkItemCategory",
        type: isEdit ? "input" : "select",
        subtype: "text",
        label: "机构类型",
        isEdit,
        options: that.organizationType,
        optionLabel: "value",
        optionValue: "code",
        rules: {
          required: true,
          trigger: "blur"
        }
      },
      {
        key: "checkItemNo",
        type: "input",
        subtype: "text",
        label: "客商编号",
        isEdit,
        disabled: true,
        placeholder: "保存后自动生成"
      },
      {
        key: "usable",
        type: "checkbox",
        subtype: "text",
        disabled: isEdit ? true : false,
        label: "是否可用",
        isEdit
      }
    ];

    return formItemList

  }
export function formonePlus(that, isEdit) {
  let formItemList = [
    {
      key: "checkItemName",
      type: "input",
      subtype: "text",
      label: "企业名称",
      isEdit,
      // showLook: () => {
      //   that.selectLook("companyName");
      // },
      placeholder: "请输入",
      rules: {
        required: true,
        trigger: "blur"
      }
    },
    {
      key: "actualController",
      type: "input",
      subtype: "text",
      label: "实际控制人",
      isEdit,
      placeholder: "请输入",
      rules: {
        required: true,
        trigger: "blur"
      }
    },
    {
      key: isEdit ? "allAddress1" : "allAddress",
      type: "cascader",
      // subtype: "text",
      label: "办公地址",
      options: that.provinceList,
      attrs: {
        props: {
        label: "name",
        value: "code",
        children: "children",
        lazy: true,
        lazyLoad(node, resolve) {
          const { level } = node;
          if (level == 1) {
            setTimeout(() => {
              that.getCityList(node.value).then(res => {
                resolve(res);
              });
            }, 300);
          } else if (level == 2) {
            setTimeout(() => {
              that.getAreaList(node.value).then(res => {
                resolve(res);
              });
            }, 300);
          } else if (level == 3) {
            setTimeout(() => {
              that.getTownList(node.value).then(res => {
                resolve(res);
              });
            }, 300);
          } else {
            resolve();
          }
        }
      },
   },
      isEdit,
      placeholder: "请输入",
      rules: {
        required: true,
        trigger: "blur"
      }
    },
    {
      key: "officeAddress",
      type: "input",
      subtype: "text",
      label: "详细地址",
      isEdit,
      placeholder: "请输入",
      rules: {
        required: true,
        trigger: "blur"
      }
    },
    {
      key: "businessStatus",
      type: "input",
      subtype: "text",
      label: "工商状态",
      isEdit,
      placeholder: "请输入",
      rules: {
        required: true,
        trigger: "blur"
      }
    },
    {
      key: "legalPerson",
      type: "input",
      subtype: "text",
      label: "法人代表",
      isEdit,
      placeholder: "请输入",
      rules: {
        required: true,
        trigger: "blur"
      }
    },
    {
      key: "registeredAddress",
      type: "input",
      subtype: "text",
      label: "注册地址",
      isEdit,
      placeholder: "请输入",
      rules: {
        required: true,
        trigger: "blur"
      }
    },
    {
      key: "enterpriseNature",
      type: "input",
      subtype: "text",
      label: "企业性质",
      isEdit,
      placeholder: "请输入",
      rules: {
        required: true,
        trigger: "blur"
      }
    },
    {
      key: isEdit ? "countryName" : "countryNo",
      type: "select",
      subtype: "text",
      label: "国家",
      isEdit,
      options: that.countryList,
      optionLabel: "name",
      optionValue: "id",
      placeholder: "请输入",
      rules: {
        required: true,
        trigger: "blur"
      }
    },
    {
      key: isEdit
        ? "qualificationCertificateListName"
        : "qualificationCertificateList",
      type: isEdit ? "input" : "select",
      subtype: "text",
      label: "资质证书",
      isEdit,
      multiple: true,
      collapse: true,
      options: that.certificateType,
      optionLabel: "value",
      optionValue: "code",
      rules: {
        required: true,
        trigger: "blur"
      }
    },
    {
      key: "endCustomer",
      type: "input",
      subtype: "text",
      label: "终端客户",
      isEdit,
      placeholder: "请输入",
      rules: {
        required: true,
        trigger: "blur"
      }
    },
    {
      key: "registeredCapital",
      type: "input",
      subtype: "text",
      label: "注册资金",
      isEdit,
      placeholder: "请输入",
      rules: {
        required: true,
        trigger: "blur"
      }
    },
    {
      key: "fixedPhoneNumber",
      type: "input",
      subtype: "text",
      label: "固定电话",
      isEdit,
      placeholder: "请输入",
      rules: {
        required: true,
        trigger: "blur"
      }
    },
    {
      key: "fax",
      type: "input",
      subtype: "text",
      label: "传真",
      isEdit,
      placeholder: "请输入",
      rules: {
        required: true,
        trigger: "blur"
      }
    },
    {
      key: "inSinosureBlacklist",
      type: "checkbox",
      subtype: "text",
      label: "是否中信保黑名单",
      disabled: isEdit ? true : false,
      isEdit,
      placeholder: "请输入"
    }
  ];

  return formItemList;
}

  export function formtwo(that,isEdit){
    let formItemList = [
      {
        key: "ecommerceNo",
        type: "input",
        subtype: "text",
        label: "电商客商编号",
        disabled: true,
        isEdit,
        placeholder: ""
      },
      {
        key: "customerLevel",
        type: "input",
        subtype: "text",
        label: "客户等级",
        isEdit,
        placeholder: "请输入"
      },
      {
        key: "supplierLevel",
        type: "input",
        subtype: "text",
        label: "供应商等级",
        isEdit,
        placeholder: "请输入"
      },
      {
        key: "inBlackList",
        type: "checkbox",
        subtype: "text",
        label: "是否黑名单",
        disabled: isEdit ? true : false,
        isEdit,
        placeholder: "请输入"
      },
      {
        key: isEdit ? "checkItemTypeName" : "checkItemType",
        type: isEdit ? "input" : "select",
        subtype: "text",
        label: "客商类型",
        multiple: true,
        collapse: true,
        isEdit,
        options: that.supplierType,
        optionLabel: "value",
        optionValue: "code",
        rules: {
          required: true,
          trigger: "blur"
        }
      },
      {
        key: isEdit ? "businessTypeName" : "businessType",
        type: isEdit ? "input" : "select",
        subtype: "text",
        label: "企业业务类型",
        isEdit,
        multiple: true,
        collapse: true,
        options: that.enterpriseBusinessType,
        optionLabel: "value",
        optionValue: "code",
        rules: {
          required: true,
          trigger: "blur"
        }
      },
      {
        key: isEdit ? "sourceName" : "source",
        type: isEdit ? "input" : "select",
        subtype: "text",
        label: "客商来源",
        isEdit,
        multiple: true,
        collapse: true,
        options: that.supplierSource,
        optionLabel: "value",
        optionValue: "code",
        rules: {
          required: true,
          trigger: "blur"
        }
      },
      {
        key: "blackListReason",
        type: "input",
        subtype: "text",
        label: "拉黑原因",
        maxlength: 200,
        isEdit,
        placeholder: ""
      }
    ];

    return formItemList

  }

  export function formThree(that, isEdit) {
    let formItemList = [
      {
        key: "name1",
        type: "input",
        subtype: "text",
        label: "企业名称",
        isEdit,
        placeholder: "请输入",
        rules: {
          required: true,
          trigger: "blur"
        }
      },
      {
        key: "name2",
        type: "input",
        subtype: "text",
        label: "统一信用代码",
        isEdit,
        placeholder: "请输入",
        rules: {
          required: true,
          trigger: "blur"
        }
      }
    ];

    return formItemList;
  }
   export function formFour(that, isEdit) {
     let formItemList = [
       {
         key: "factoryOwnership",
         type: isEdit ? "input" : "select",
         subtype: "text",
         label: "厂房所有权",
         isEdit,
         options: [
           {
             label: "自有厂房",
             value: "自有厂房"
           },
           {
             label: "租赁厂房",
             value: "租赁厂房"
           }
         ],
         optionLabel: "label",
         optionValue: "value"
       },
       {
         key: "factoryArea",
         type: "input",
         subtype: "text",
         label: "厂房面积",
         isEdit,
         placeholder: "请输入"
       },
       {
         key: "factoryEnvironment",
         type: "input",
         subtype: "text",
         label: "厂房环境",
         isEdit,
         placeholder: "请输入"
       }
     ];

     return formItemList;
   }
    export function formFive(that, isEdit) {
      let formItemList = [
        {
          key: "productionPowerOnRate",
          type: "input",
          subtype: "text",
          label: "开机率(%)",
          isEdit,
          placeholder: "请输入"
        },
        {
          key: "productionShiftSystem",
          type: isEdit ? "input" : "select",
          subtype: "text",
          label: "倒班制度",
          isEdit,
          options: [
            {
              label: "白班",
              value: "白班"
            },
            {
              label: "两班倒",
              value: "两班倒"
            },
            {
              label: "三班倒",
              value: "三班倒"
            }
          ],
          optionLabel: "label",
          optionValue: "value"
        },
        {
          key: "productionElectricityFees",
          type: "input",
          subtype: "text",
          label: "电费水平",
          isEdit,
          placeholder: "请输入"
        },
        {
          key: "productionTotalCapacity",
          type: "input",
          subtype: "text",
          label: "总产能",
          isEdit,
          placeholder: "请输入"
        },
        {
          key: "productionEmployeeSalary",
          type: "input",
          subtype: "text",
          label: "人均工资",
          isEdit,
          placeholder: "请输入"
        },
        {
          key: "productionBrandInspection",
          type: "input",
          subtype: "text",
          label: "品牌验厂",
          isEdit,
          placeholder: "请输入"
        }
      ];

      return formItemList;
    }
    export function formSix(that, isEdit) {
      let formItemList = [
        {
          key: "labelBrochure",
          type: "checkbox",
          subtype: "text",
          disabled: isEdit ? true : false,
          label: "大耀宣传册",
          isEdit
        },
        {
          key: "labelRepairWeaveColor",
          type: "checkbox",
          subtype: "text",
          label: "对外修织/修色",
          disabled: isEdit ? true : false,
          isEdit
        },
        {
          key: "labelTextileTradingCenter",
          type: "checkbox",
          subtype: "text",
          disabled: isEdit ? true : false,
          label: "华东纺织交易中心",
          isEdit
        },
        {
          key: "labelInspectCenter",
          type: "checkbox",
          subtype: "text",
          disabled: isEdit ? true : false,
          label: "检测中心",
          isEdit
        },
        {
          key: "labelWechatAccount",
          type: "checkbox",
          disabled: isEdit ? true : false,
          subtype: "text",
          label: "微信公众号",
          isEdit
        },
        {
          key: "labelInspect",
          type: "checkbox",
          subtype: "text",
          disabled: isEdit ? true : false,
          label: "对外质检/品捡",
          isEdit
        },
        {
          key: "labelSalesmanSupervisor",
          type: "checkbox",
          subtype: "text",
          disabled: isEdit ? true : false,
          label: "注册业务员/生产主管",
          isEdit
        },
        {
          key: "labelMallApp",
          type: "checkbox",
          subtype: "text",
          disabled: isEdit ? true : false,
          label: "纱布商城APP",
          isEdit
        },
        {
          key: "labelLogistics",
          type: "checkbox",
          subtype: "text",
          disabled: isEdit ? true : false,
          label: "对外代储/物流",
          isEdit
        },
        {
          key: "labelThirdParty",
          type: "checkbox",
          subtype: "text",
          disabled: isEdit ? true : false,
          label: "第三方代销/耀商家/耀拍卖",
          isEdit
        }
      ];

      return formItemList;
    }
