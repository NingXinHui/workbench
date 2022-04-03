import request from '@/utils/request'

//数据字典分组
// 列表
export function getDataList(data) {
    return request({
        url: '/trade-sm/sysDictCategory/queryPage',
        method: 'get',
        params: data,
    })
}

//删除数据
export function deleteData(data) {
    return request({
        url: '/trade-sm/sysDictCategory/deleteById',
        method: 'delete',
        params: data,
    })
}

//新增
export function addData(data) {
    return request({
        url: '/trade-sm/sysDictCategory/add',
        method: 'post',
        data,
    })
}

//编辑
export function editData(data) {
    return request({
        url: '/trade-sm/sysDictCategory/editById',
        method: 'put',
        data,
    })
}

//详情
export function getDetailsData(data) {
    return request({
        url: '/trade-sm/sysDictCategory/queryById',
        method: 'get',
        params: data,
    })
}

//查询所有
export function queryAllData(data) {
    return request({
        url: '/trade-sm/sysDictCategory/queryAll',
        method: 'get',
        params: data,
    })
}

//数据字典维护

// 列表
export function getDictDataList(data) {
    return request({
        url: '/trade-sm/sysDictType/queryPage',
        method: 'get',
        params: data,
    })
}

//删除数据
export function deleteDictData(data) {
    return request({
        url: '/trade-sm/sysDictType/deleteById',
        method: 'delete',
        params: data,
    })
}

//新增
export function addDictData(data) {
    return request({
        url: '/trade-sm/sysDictType/add',
        method: 'post',
        data,
    })
}

//编辑
export function editDictData(data) {
    return request({
        url: '/trade-sm/sysDictType/editById',
        method: 'put',
        data,
    })
}

//详情
export function getDictDetailsData(data) {
    return request({
        url: '/trade-sm/sysDictType/queryById',
        method: 'get',
        params: data,
    })
}

//查询所有
export function queryDictAll(data) {
    return request({
        url: '/trade-sm/sysDictType/queryAll',
        method: 'get',
        params: data,
    })
}


//字典配置
//新增
export function addDictConfig(data) {
    return request({
        url: '/trade-sm/sysDictData/editByTypeId',
        method: 'post',
        data,
    })
}

//根据字典类型查询所有字典配置
export function queryDictConfig(data) {
    return request({
        url: '/trade-sm/sysDictData/queryAllByTypeId',
        method: 'get',
        params: data,
    })
}
