import request from '@/utils/request'

// 获取列表
export function getDataList(data) {
    return request({
        url: '/trade-test/gradeStandardHdr/queryPage',
        method: 'get',
        params: data,
    })
}

// 删除
export function deleteData(data) {
    return request({
        url: '/trade-test/gradeStandardHdr/deleteById',
        method: 'delete',
        params: data,
    })
}

// 复制功能无暂未调试
export function copyData(data) {
    return request({
        url: '/system/dict/data/type/getDictByTypeList',
        method: 'get',
        params: data,
    })
}

// 保存
export function saveData(data) {
    return request({
        url: '/trade-test/gradeStandardHdr/add',
        method: 'post',
        data,
    })
}

// 编辑
export function editData(data) {
    return request({
        url: '/trade-test/gradeStandardHdr/editById',
        method: 'put',
        data,
    })
}

// 获取详情
export function detailsData(data) {
    return request({
        url: '/trade-test/gradeStandardHdr/queryById',
        method: 'get',
        params: data,
    })
}

//下拉框查询所有
export function queryAllData(data) {
    return request({
        url: '/trade-test/gradeStandardHdr/queryAllName',
        method: 'get',
        params: data,
    })
}

