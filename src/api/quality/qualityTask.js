import request from '@/utils/request'

// 获取列表
export function getDataList(data) {
    return request({
        url: '/trade-test/inspectTaskHdr/queryPage',
        method: 'get',
        params: data,
    })
}

// 删除
export function deleteData(data) {
    return request({
        url: '/trade-test/inspectTaskHdr/deleteById',
        method: 'delete',
        params: data,
    })
}

// 保存
export function saveData(data) {
    return request({
        url: '/trade-test/inspectTaskHdr/add',
        method: 'post',
        data,
    })
}

// 编辑
export function editData(data) {
    return request({
        url: '/trade-test/inspectTaskHdr/editById',
        method: 'put',
        data,
    })
}

// 获取详情
export function detailsData(data) {
    return request({
        url: '/trade-test/inspectTaskHdr/queryById',
        method: 'get',
        params: data,
    })
}

// 审核
export function auditData(data) {
    return request({
        url: '/trade-test/inspectTaskHdr/check',
        method: 'get',
        params: data,
    })
}

// 反审核
export function auditeeData(data) {
    return request({
        url: '/trade-test/inspectTaskHdr/reCheck',
        method: 'get',
        params: data,
    })
}

//核算项目下拉
export function selectWorkList(data) {
    return request({
        url: '/trade-sm/pb/pbworkshop/selectList',
        method: 'get',
        params: data,
    })
}

//导入
//销售导入
export function importSellData(data) {
    return request({
        url: '/trade-po/orderDtl/queryImport',
        method: 'get',
        params: data,
    })
}

//物料导入
export function importMaterialData(data) {
    return request({
        url: '/trade-sm/material/queryPage',
        method: 'get',
        params: data,
    })
}

//采购导入
export function importPurchaseData(data) {
    return request({
        url: '/trade-po/order/queryImport',
        method: 'get',
        params: data,
    })
}

//委外订单导入
export function importOutsourceData(data) {
    return request({
        url: '/trade-po/sd/suborderdtl/queryImport',
        method: 'get',
        params: data,
    })
}
