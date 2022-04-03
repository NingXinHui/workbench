/**

 @author:zhupeikang
 @fileName:index.js
 @createTime:2021/10/21

 **/
import request from "@/utils/request";
//获取订单分页列表
export function orderList(query){
    return request({
        method:'get',
        url:'/trade-po/order/queryPage',
        params:query
    })
}

//查询获取订单分页列表
export function queryOrderList(query){
    return request({
        method:'get',
        url:'/trade-po/orderDtl/queryPage',
        params:query
    })
}
//获取订单详情
export function order_detail(query){
    return request({
        method:'get',
        url:'/trade-po/order/queryById',
        params:query
    })
}



//编辑
export function order_edit(query){
    return request({
        method:'put',
        url:'/trade-po/order/editById',
        data:query
    })
}
//新增
export function order_add(query){
    return request({
        method:'post',
        url:'/trade-po//order/add',
        data:query
    })
}
//提交
export function order_submit(query){
    return request({
        method:'put',
        url:'/trade-po/order/submit',
        params:query
    })
}
//驳回
export function order_reject(query){
    return request({
        method:'put',
        url:'/trade-po/order/reject',
        data:query
    })
}
//审核
export function order_audit(query){
    return request({
        method:'put',
        url:'/trade-po/order/audit',
        data:query
    })
}
//反审核
export function order_audit_cancel(query){
    return request({
        method:'put',
        url:'/trade-po/order/auditCancel',
        params:query
    })
}
//删除
export function order_delete(query){
    return request({
        method:'delete',
        url:'/trade-po/order/deleteById',
        params:query
    })
}
//通过单据代码获取单号
export function generatorByPageRoute(){
    return request({
        url: '/trade-sm/pc/pbBillFormulahdr/generatorByPageRoute',
        method: 'get',
    })
}
