import request from '@/utils/request'

// 获取列表
export function getDataList(data) {
    return request({
        url: '/trade-test/test/iminspectcategory/queryPage',
        method: 'get',
        params: data,
    })
}

// 删除
export function deleteData(data) {
    return request({
        url: '/trade-test/test/iminspectcategory/deleteById',
        method: 'delete',
        data,
    })
}

// 保存
export function saveData(data) {
    return request({
        url: '/trade-test/test/iminspectcategory/add',
        method: 'post',
        data,
    })
}

// 编辑
export function editData(data) {
    return request({
        url: '/trade-test/test/iminspectcategory/editById',
        method: 'put',
        data,
    })
}

// 获取详情
export function detailsData(data) {
    return request({
        url: '/trade-test/test/iminspectcategory/queryById',
        method: 'get',
        params: data,
    })
}

//下拉框查询所有检验类型
export function queryAllData(data) {
    return request({
        url: '/trade-test/test/iminspectcategory/queryAllName',
        method: 'get',
        params: data,
    })
}

//下拉框查询默认数量单位
export function querySelectList(data) {
    return request({
        url: '/trade-sm/sysUnit/queryAll',
        method: 'get',
        params: data,
    })
}
