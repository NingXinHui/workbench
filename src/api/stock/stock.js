import request from '@/utils/request'

//出入库。库存查询
export function storeList(url, query) {
    return request({
        url: url,
        method: 'get',
        params: query
    })
}

//库存查询-查看详情
export function stockLogList(query) {
    return request({
        url: '/store/stockLog/list',
        method: 'get',
        params: query
    })
}

//出入库类型下拉框查询
export function querySubInOutType(query) {
    return request({
        url: '/store/inOutType/querySubInOutType',
        method: 'get',
        params: query
    })
}

// 查询所有仓库

export function storeAll(query = {}) {
    return request({
        url: '/store/store/all',
        method: 'get',
        params: query
    })
}// 查询所有仓库

export function storeGetAll(query = {}) {
    return request({
        url: '/store/store/getAll',
        method: 'get',
        params: query
    })
}


// 库存预警列表

export function storeWarnList(query) {
    return request({
        url: '/store/stock/warn',
        method: 'get',
        params: query
    })
}

// 货龄分析列表

export function storeAnalysisList(query) {
    return request({
        url: '/store/stock/analysis',
        method: 'get',
        params: query
    })
}

// 货龄分析列表-下拉货表

export function storeAgeList(query) {
    return request({
        url: '/store/storeAge/list',
        method: 'get',
        params: query
    })
}
//检验类型
export function storeTestList(query) {
    return request({
        url: '/store/store/getInspectStore',
        method: 'get',
        params: query
    })
}

// 查询所有仓库

