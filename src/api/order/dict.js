/**

 @author:zhupeikang
 @fileName:dict.js
 @createTime:2021/10/21

 **/

import request from "@/utils/request";
//获取结算方式
export function dict(type){
    return request({
        url:'/trade-sm/sysDictData/type/getDictByTypeList',
        method:'get',
        params:{dictTypes:type}
    })
}

//获取客户lookUp

export function look_up_customer(query){
    return request({
        url:'/trade-sm/checkItem/lookup',
        method:'get',
        params:query
    })
}
//获取业务员lookup

export function look_up_sale(query){
    return request({
        url:'/trade-sm/pc/pbsales/lookup',
        method:'get',
        params:query
    })
}
//获取物料编号lookup
export function look_up_material_no(query){
    return request({
        url:'/trade-sm/material/lookup',
        method:'get',
        params:query
    })
}
//获取物料类型lookup
export function look_up_material_type(query){
    return request({
        url:'/trade-sm/material/lookup',
        method:'get',
        params:query
    })
}
//销售订单类型下拉框
export function select_order_type(query){
    return request({
        url:'/trade-sm/sdordertype/queryAll',
        method:'get',
        params:query
    })
}
//币种下拉框（租户）
export function select_currency(query){
    return request({
        url:'/trade-sm/pc/pbcurrency/queryAll',
        method:'get',
        params:query
    })
}
