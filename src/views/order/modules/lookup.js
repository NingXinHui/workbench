import {look_up_customer,look_up_sale,look_up_material_no} from "@/api/order/dict";

/**

 @author:zhupeikang
 @fileName:lookup.js
 @createTime:2021/10/22

 **/


//客户lookUp配置
export const look_up_customer_config = {
    method: look_up_customer,
    field:'customerId',
    value:'id',
    showField:'checkName',
    formField:'customerName',
    params: {typeCode:'customer'},
    visible: false,
    searchArr: [
        {
            label: '客户名称',
            field: 'checkName',
            type: 1,
        },
        {
            label: '客户分类',
            field: 'dtlTypeCode',
            type:2,
            optionList:[]
        }
    ],
    tableColumn: [
        {
            label: '序号',
            type: 'index',
            maxLength: '20'
        },
        {
            label: '客户编号',
            prop: 'checkCode',
        },
        {
            label: '客户名称',
            prop: 'checkName',
        },
        {
            label: '客户简称',
            prop: 'checkAbbName',
        },
        {
            label: '客户分类',
            prop: 'dtlTypeName',
        }
    ]
}
//业务员lookUp配置
export const look_up_sale_config = {
    tableColumn: [
        {
            label: '序号',
            type: 'index',
            maxLength: '20'
        },
        {
            label: '客户姓名',
            prop: 'salesName',
        }
    ],

    method: look_up_sale,
    field:'salesId',
    value:'id',
    showField:'salesName',
    formField:'salesName',
    params: {},
    visible: false,
    searchArr: [{
        label: '业务员名称',
        field: 'salesName',
        type: 1,
        maxLength: '20'
    }],
}
//物料编号lookUp配置
export const look_up_material_no_config = {
    method:look_up_material_no,
    tableColumn: [
        {
            label: '序号',
            type: 'index',
            maxLength: '20'
        },
        {
            label: '物料编号',
            prop: 'materialNo',
        },{
            label: '物料名称',
            prop: 'materialName',
        },{
            label: '单位',
            prop: 'unit',
        },{
            label: '规格',
            prop: 'specification',
        }
    ],
    field:'materialId',
    value:'id',
    showField:'materialNo',
    formField:'materialId',
    params: {},
    visible: false,
    searchArr: [{
        label: '物料编号',
        field: 'materialNo',
        type: 1,
        maxLength: '20'
    }, {
        label: '物料名称 ',
        field: 'materialName',
        type: 1,
        maxLength: '20'
    }],
}
//物料类型lookUp配置
export const look_up_material_type_config = {
    params: {},
    visible: false,
    searchArr: [{
        label: '工人编号',
        field: 'workerNo',
        type: 1,
        maxLength: '20'
    }, {
        label: '工人名称 ',
        field: 'workerName',
        type: 1,
        maxLength: '20'
    }],
}

