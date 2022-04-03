import request from '@/utils/request'

//单位类型
// 单位维护-单位类型
export function getDataList(data) {
    return request({
        url: '/trade-sm/sysUnitType/queryPage',
        method: 'get',
        params: data,
    })
}

//单位维护-查询所有单位类型
export function queryDataAll(data) {
    return request({
        url: '/trade-sm/sysUnitType/queryAll',
        method: 'get',
        params: data,
    })
}

//删除数据
export function deleteData(data) {
    return request({
        url: '/trade-sm/sysUnitType/deleteById',
        method: 'get',
        params: data,
    })
}

//新增
export function addData(data) {
    return request({
        url: '/trade-sm/sysUnitType/add',
        method: 'post',
        data,
    })
}

//编辑
export function editData(data) {
    return request({
        url: '/trade-sm/sysUnitType/editById',
        method: 'put',
        data,
    })
}

//单位维护
// 列表
export function getUnitList(data) {
    return request({
        url: '/trade-sm/sysUnit/queryPage',
        method: 'get',
        params: data,
    })
}

//新增
export function addUnitData(data) {
    return request({
        url: '/trade-sm/sysUnit/add',
        method: 'post',
        data,
    })
}

//编辑
export function editUnitData(data) {
    return request({
        url: '/trade-sm/sysUnit/editById',
        method: 'put',
        data,
    })
}

//查询所有单位
export function queryUnitAllData(data) {
    return request({
        url: '/trade-sm/sysUnit/queryAll',
        method: 'get',
        params: data,
    })
}
