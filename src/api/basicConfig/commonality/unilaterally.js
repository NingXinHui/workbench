import request from '@/utils/request'

//单据类型
// 列表
export function getDataList(data) {
    return request({
        url: '/trade-sm/sysBillType/queryPage',
        method: 'get',
        params: data,
    })
}

//查询所有
export function queryAllData(data) {
    return request({
        url: '/trade-sm/sysBillType/queryAll',
        method: 'get',
        params: data,
    })
}

//分页查询单据与单位关系
export function getUnilList(data) {
    return request({
        url: '/trade-sm/pbBillTypeUnit/queryPage',
        method: 'get',
        params: data,
    })
}

//新增
export function addUnilData(data) {
    return request({
        url: '/trade-sm/pbBillTypeUnit/add',
        method: 'post',
        data,
    })
}

//编辑未调用未调试
export function editUnilData(data) {
    return request({
        url: '/trade-sm/pbBillTypeUnit/editById',
        method: 'put',
        data,
    })
}

//删除
export function deleteUnilData(data) {
    return request({
        url: '/trade-sm/pbBillTypeUnit/deleteByIds',
        method: 'get',
        params: data,
    })
}

//查询某个单据下的所有关系
export function queryAllPbBill(data) {
    return request({
        url: '/trade-sm/pbBillTypeUnit/queryAllByBillTypeId',
        method: 'get',
        params: data,
    })
}
