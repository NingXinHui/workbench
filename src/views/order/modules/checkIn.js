let _this = {}
export default {
    setVue: (e) => {
        _this = e
    }
}
export const searchArr = [
    {
        label: '收款单号',
        placeholder: '请输入收款单号',
        value: 'moneyNo',
        field: 'moneyNo',
        type: 1,
        maxLength: '20'
    },
    {
        label: '核算项目',
        value: 'checkItemId',
        field: 'checkItemId',
        type: 6,
        optionLabel: 'checkName',
        optionValue: 'id',
        selectOption: [],
        optionList: [],
    },
    {
        label: '收款类别',
        value: 'moneyType',
        field: 'moneyType',
        type: 2,
        optionLabel: 'typeName',
        optionValue: 'typeName',
        selectOption: [],
        optionList: []
    },
]

export const detailColumn = [

    {
        required: true,
        type: 1,
        label: '订单编号',
        field: 'billNo',
        read: true,
        disabled: true,
        rules: [{
            required: true
        }]
    }
    , {
        type: 2,
        label: '订单类型',
        field: 'orderType',
        optionList: [],
        optionLabel: 'label',
        optionValue: 'value',
        rules: [{
            required: true
        }]
    }
    , {
        type: 10,
        label: '客户',
        field: 'customerName',
        read: true,
        rules: [{
            required: true
        }],
        focus: () => {
            _this.openLookUp(1)
        }
    }
    , {
        type: 3,
        label: '订单日期',
        field: 'billDate',
        rules: [{
            required: true
        }]
    }, {
        type: 10,
        label: '业务员',
        field: 'salesName',
        rules: [{
            required: true
        }],
        focus: () => {
            _this.openLookUp(2)
        }


    }

    , {
        required: true,
        type: 2,
        label: '币种',
        field: 'currency',
        optionList: [],
        optionLabel: 'currencyName',
        optionValue: 'currency',
        rules: {
            required: true,
        }

    }
    , {
        type: 1,
        label: '汇率',
        field: 'exchangeRate',
        disabled: true

    }
    , {
        type: 1,
        label: '税率(%)',
        field: 'taxRate',
        inputType: 'number'
    }
    , {
        type: 2,
        label: '结算方式',
        field: 'tradeType',
        optionList: [
            {
                label: '财务部',
                value: '1'
            }, {
                label: '总经办',
                value: '2'
            }, {
                label: '销售部',
                value: '3'
            }, {
                label: '采购部',
                value: '4'
            }
        ],
        optionLabel: 'label',
        optionValue: 'value',
        rules: {
            required: true
        }
    }

    , {
        type: 1,
        label: '制单人',
        field: 'createUser',
        disabled: true
    }
    , {
        type: 3,
        label: '制单时间',
        field: 'createTime',
        // disabled: true


    }
    // , {
    //     required: true,
    //     type: 6,
    //     label: '核算项目',
    //     field: 'checkItemId',
    //     optionList: [],
    //     optionLabel: 'checkName',
    //     optionValue: 'id',
    // }
    , {
        type: 1,
        label: '参考订单编号',
        field: 'refOrderNo',
    }
    , {
        type: 1,
        label: '客户订单编号',
        field: 'refCustomerOrderNo',
    }
    , {
        type: 1,
        label: '质量要求',
        field: 'qualityRequest',

    }
    , {
        type: 4,
        label: '收货地址',
        field: 'address',
    }
    , {
        type: 4,
        label: '备注',
        field: 'remark',
    }


]

