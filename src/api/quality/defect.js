import request from '@/utils/request'

// 获取列表
export function getDataList(data) {
    return request({
        url: '/trade-test/defect/queryPage',
        method: 'get',
        params: data,
    })
}

// 删除
export function deleteData(data) {
    return request({
        url: '/trade-test/defect/deleteById',
        method: 'delete',
        params: data,
    })
}

// 保存
export function saveData(data) {
    return request({
        url: '/trade-test/defect/add',
        method: 'post',
        data,
    })
}

// 编辑
export function editData(data) {
    return request({
        url: '/trade-test/defect/editById',
        method: 'put',
        data,
    })
}

// 获取详情
export function detailsData(data) {
    return request({
        url: '/trade-test/defect/queryById',
        method: 'get',
        params: data,
    })
}


//获取疵点分类数据
export function queryDefeAllData(data) {
    return request({
        url: '/trade-test/defectType/queryAllName',
        method: 'get',
        params: data,
    })
}
