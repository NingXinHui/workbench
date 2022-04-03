export function formone(that,isEdit){
    let formItemList = [
        {
            key: 'billNo',
            type: 'input',
            subtype: 'text',
            label: '销售订单号',
            isEdit,
            disabled: true,
            placeholder: '保存后自动生成',
        },
        {
            key: isEdit ? 'orderTypeName' : 'orderTypeNo',
            type: isEdit ? 'input' : 'select',
            subtype: 'text',
            label: '销售类型',
            isEdit,
            options: that.orderTypeList,
            optionLabel: 'orderTypeName',
            optionValue: 'orderTypeNo',
            rules: {   
                required: true, trigger: 'blur',
                validator: (rule, value, callback) => {
                    if (value) {
                        callback()
                    } else {
                        that.$message.error('销售类型不能为空')
                    }
                },
            },
        },
        {
            key: 'customerOrderNo',
            type: 'input',
            subtype: 'text',
            label: '客户订单号',
            isEdit,
            maxlength: 40,
        },
        {
            key: 'billDate',
            type: 'date',
            subtype: 'date',
            valueFormat: 'yyyy-MM-dd',
            label: '订单日期',
            isEdit,
            rules: {   
                required: true, trigger: 'blur',
                validator: (rule, value, callback) => {
                    if (value) {
                        callback()
                    } else {
                        that.$message.error('订单日期不能为空')
                    }
                },
            },
        },
        {
            key: 'checkItemName',
            type: 'input',
            subtype: 'text',
            label: '客户名称',
            isEdit,
            placeholder: '请选择',
            attrs: {
                readonly: true,
                suffixIcon: 'el-icon-arrow-down',
            },
            listeners: {
                focus: that.selectCheckItemName,
            },
            rules: {   
                required: true, trigger: 'change',
                validator: (rule, value, callback) => {
                    if (value) {
                        callback()
                    } else {
                        that.$message.error('客户名称不能为空')
                    }
                },
            },
        },
        {
            key: isEdit ? 'checkItemContactName' : 'checkItemContactId',
            type: isEdit ? 'input' : 'select',
            subtype: 'text',
            label: '客户联系人',
            isEdit,
            optionLabel: 'name',
            optionValue: 'id',
            options: that.checkItemContactList,
        },
        {
            key: 'salesName',
            type: 'input',
            subtype: 'text',
            label: '销售员',
            isEdit,
            placeholder: '请选择',
            attrs: {
                readonly: true,
                suffixIcon: 'el-icon-arrow-down',
            },
            listeners: {
                focus: that.selectSalesGroupName,
            },
            rules: {   
                required: true, trigger: 'change',
                validator: (rule, value, callback) => {
                    if (value) {
                        callback()
                    } else {
                        that.$message.error('销售员不能为空')
                    }
                },
            },
        },
        {
            key: 'salesGroupName',
            type: 'input',
            subtype: 'text',
            label: '销售组',
            isEdit,
            placeholder: ' ',
            disabled: true,
            rules: {   
                required: true, trigger: 'blur',
                validator: (rule, value, callback) => {
                    if (value) {
                        callback()
                    } else {
                        that.$message.error('销售组不能为空')
                    }
                },
            },
        },
        {
            key: isEdit ? 'currencyName' : 'currency',
            type: isEdit ? 'input' : 'select',
            subtype: 'text',
            label: '币种',
            isEdit,
            options: that.currencyList,
            optionLabel: 'currencyName',
            optionValue: 'currencyNo',
            listeners: {
                change: that.currencyChange
            },
            rules: {   
                required: true, trigger: 'change',
                validator: (rule, value, callback) => {
                    if (value) {
                        callback()
                    } else {
                        that.$message.error('币种不能为空')
                    }
                },
            },
        },
        {
            key: 'exchangeRate',
            type: 'input',
            subtype: 'text',
            label: '汇率',
            isEdit,
            disabled: true,
            placeholder: ' ',
            rules: {   
                required: true, trigger: 'blur',
                validator: (rule, value, callback) => {
                    if (value) {
                        callback()
                    } else {
                        that.$message.error('汇率不能为空')
                    }
                },
            },
        },
        {
            key: 'taxRate',
            type: 'number',
            label: '税率(%)',
            isEdit,
            min: 1,
            max: 999999999,
            precision: 0,
            rules: {   
                required: true, trigger: 'blur',
                validator: (rule, value, callback) => {
                    if (value) {
                        callback()
                    } else {
                        that.$message.error('税率不能为空')
                    }
                },
            },
        },
        {
            key: 'remark',
            type: 'input',
            subtype: 'textarea',
            label: '备注',
            isEdit,
            attrs: {
                showWordLimit: true,
            },
            maxlength: 200,
        },
        {
            key: isEdit ? 'clauseName' : 'clauseName',
            type: isEdit ? 'input' : 'select',
            subtype: 'text',
            label: '条款名称',
            isEdit,
            options: that.clauseNameList,
            optionLabel: 'clauseName',
            optionValue: 'clauseName',
            listeners: {
                change: that.clauseNameChange
            },
        },
        {
            key: 'clauseContent',
            type: 'input',
            subtype: 'textarea',
            label: '条款内容',
            isEdit,
            maxlength:99999,
            attrs: {
                showWordLimit: true,
                class: 'clause-content-box'
            },
        },
    ]

    return formItemList

  }


  export function formtwo(that,isEdit){
    let formItemList = [
      
        {
            key: 'checkItemName',
            type: 'input',
            subtype: 'text',
            label: '客户名称',
            isEdit,
            placeholder: '请选择',
            attrs: {
                readonly: true,
                suffixIcon: 'el-icon-arrow-down',
            },
            listeners: {
                focus: that.selectCheckItemName,
            },
            rules: {   
                required: true, trigger: 'change',
                validator: (rule, value, callback) => {
                    if (value) {
                        callback()
                    } else {
                        that.$message.error('客户名称不能为空')
                    }
                },
            },
        },
        {
            key: isEdit ? 'checkItemContactName' : 'checkItemContactId',
            type: isEdit ? 'input' : 'select',
            subtype: 'text',
            label: '客户联系人',
            isEdit,
            optionLabel: 'name',
            optionValue: 'id',
            options: that.checkItemContactList,
        },
        {
            key: 'salesName',
            type: 'input',
            subtype: 'text',
            label: '销售员',
            isEdit,
            placeholder: '请选择',
            attrs: {
                readonly: true,
                suffixIcon: 'el-icon-arrow-down',
            },
            listeners: {
                focus: that.selectSalesGroupName,
            },
            rules: {   
                required: true, trigger: 'change',
                validator: (rule, value, callback) => {
                    if (value) {
                        callback()
                    } else {
                        that.$message.error('销售员不能为空')
                    }
                },
            },
        },
        {
            key: 'salesGroupName',
            type: 'input',
            subtype: 'text',
            label: '销售组',
            isEdit,
            placeholder: ' ',
            disabled: true,
            rules: {   
                required: true, trigger: 'blur',
                validator: (rule, value, callback) => {
                    if (value) {
                        callback()
                    } else {
                        that.$message.error('销售组不能为空')
                    }
                },
            },
        },
        
        {
            key: isEdit ? 'clauseName' : 'clauseName',
            type: isEdit ? 'input' : 'select',
            subtype: 'text',
            label: '条款名称',
            isEdit,
            options: that.clauseNameList,
            optionLabel: 'clauseName',
            optionValue: 'clauseName',
            listeners: {
                change: that.clauseNameChange
            },
        },
        {
            key: 'clauseContent',
            type: 'input',
            subtype: 'textarea',
            label: '条款内容',
            isEdit,
            maxlength:99999,
            attrs: {
                showWordLimit: true,
                class: 'clause-content-box'
            },
        },
    ]

    return formItemList

  }
