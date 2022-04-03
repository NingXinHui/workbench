import request from '@/utils/request'

//自动出入库
// 列表
export function getDataList(data) {
    return request({
        url: '/trade-sm/pp/pbautostoreconfig/queryPage',
        method: 'get',
        params: data,
    })
}

//编辑数据
export function editData(data) {
    return request({
        url: '/trade-sm/pp/pbautostoreconfig/editById',
        method: 'put',
        data,
    })
}

//获取出库数据
export function getInOutType(data) {
    return request({
        url: '/store/inOutType/queryAllName',
        method: 'get',
        params: data,
    })
}

//获取目标仓库
export function getWarouseList(data) {
    return request({
        url: '/store/store/queryDropdownBox',
        method: 'get',
        params: data,
    })
}

//获取仓库分组
export function getWarouseTypeList(data) {
    return request({
        url: '/store/storeGroup/all',
        method: 'get',
        params: data,
    })
}

//获取详情数据
export function getDetailsData(data) {
    return request({
        url: '/trade-sm/pp/pbautostoreconfig/queryById',
        method: 'get',
        params: data,
    })
}
