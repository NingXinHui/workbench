
export function formone(that, isEdit) {
    let formItemList = [
      {
        key: "name",
        type: "input",
        subtype: "text",
        label: "公司名称",
        isEdit,
        placeholder: "请输入",
        rules: {
          required: true,
          trigger: "blur"
        },
        listeners: {
          blur: () => {
            if (that.queryForm.name.indexOf(" ") != -1) {
              that.queryForm.name = "";
            }
          }
        }
      },
      {
        key: "shortName",
        type: "input",
        subtype: "text",
        label: "公司简称",
        isEdit,
        placeholder: "请输入",
        listeners: {
          blur: () => {
            if (that.queryForm.shortName.indexOf(" ") != -1) {
              that.queryForm.shortName = "";
            }
          }
        },
        rules: {
          required: true,
          trigger: "blur"
        }
      },
      {
        key: isEdit ? "typeName" : "type",
        type: isEdit ? "input" : "select",
        subtype: "text",
        label: "公司类型",
        isEdit,
        disabled: true,
        options: [
          {
            label: "总公司",
            value: "0"
          },
          {
            label: "分公司",
            value: "1"
          }
        ],
        optionLabel: "label",
        optionValue: "value"
      },
      {
        key: "enterpriseNature",
        type: "input",
        subtype: "text",
        label: "企业性质",
        isEdit,
        placeholder: "请输入"
      },
      {
        key: "telephone",
        type: "input",
        subtype: "text",
        label: "固定电话",
        listeners: {
          blur: () => {
            if (that.queryForm.telephone) {
              let reg = /^(0[0-9]{2,3}-)([2-9][0-9]{6,7})+(-[0-9]{1,4})?$/g;
              if (!reg.test(that.queryForm.telephone)) {
                that.$message.error("固定电话格式不正确");
                that.queryForm.telephone = "";
              }
            }
          }
        },
        isEdit,
        placeholder: "请输入"
      },
      {
        key: "fax",
        type: "input",
        subtype: "text",
        label: "传真",
        isEdit,
        placeholder: "请输入"
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
                  console.log(node);
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
          }
        },
        isEdit,
        placeholder: "请选择"
      },
      {
        key: "address",
        type: "input",
        subtype: "text",
        label: "详细地址",
        isEdit,
        placeholder: "请输入"
      },
      {
        key: "usable",
        type: "checkbox",
        subtype: "text",
        label: "是否可用",
        isEdit,
        placeholder: "",
        disabled: isEdit || that.queryForm.type == '0'
      },
      {
        key: "remark",
        type: "input",
        subtype: "textarea",
        label: "备注",
        maxlength: 200,
        isEdit,
        placeholder: "请输入"
      }
    ];

    return formItemList

  }
export function formtwo(that, isEdit) {
  let formItemList = [
    {
      key: "businessStatus",
      type: "input",
      subtype: "text",
      label: "工商状态",
      isEdit,
      placeholder: "请输入"
    },
    {
      key: "legalPerson",
      type: "input",
      subtype: "text",
      label: "法人代表",
      isEdit,
      placeholder: "请输入"
    },
    {
      key: "actualController",
      type: "input",
      subtype: "text",
      label: "实际控制人",
      isEdit,
      placeholder: "请输入"
    },
    {
      key: "unifiedCreditCode",
      type: "input",
      subtype: "text",
      label: "统一信用代码",
      attrs: {
        onkeyup: "if(!/^[0-9]{0,40}$/g.test(this.value)){this.value=''}"
      },
      isEdit,
      placeholder: "请输入"
    },
    {
      key: "regCapital",
      type: "input",
      subtype: "text",
      label: "注册资金",
      attrs: {
        onkeyup: "if(!/^[0-9]{0,40}$/g.test(this.value)){this.value=''}"
      },
      isEdit,
      placeholder: "请输入"
    },
    {
      key: "regAddress",
      type: "input",
      subtype: "text",
      label: "注册地址",
      isEdit,
      placeholder: "请输入"
    },
    {
      key: "depositBank",
      type: "input",
      subtype: "text",
      label: "开户银行",
      isEdit,
      placeholder: "请输入"
    },
    {
      key: "bankAccount",
      type: "input",
      subtype: "text",
      label: "银行账号",
      listeners: {
        blur: () => {
          const reg = /^[0-9]{4}[ ]{1}[0-9]{4}[ ]{1}[0-9]{4}[ ]{1}[0-9]{4}[ ]{1}[0-9]{3}$/;
          if (!reg.test(that.queryForm.bankAccount)) {
            that.$message.error("银行账号格式不正确,请输入19位银行卡号，每四位一个空格")
            that.queryForm.bankAccount = "";
          }
        }
      },
      // attrs: {
      //   onkeyup: "if(!/^[0-9]{0,20}$/g.test(this.value)){this.value=''}"
      // },
      isEdit,
      placeholder: "请输入"
    }
  ];

  return formItemList;
}
