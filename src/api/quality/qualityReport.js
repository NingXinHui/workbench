import request from '@/utils/request'

// 获取列表
export function getDataList(data) {
    return request({
        url: '/trade-test/inspectTaskHdr/queryReport',
        method: 'get',
        params: data,
    })
}


//查询明细

export function getDetailsData(data) {
    return request({
        url: '/trade-test/inspectTaskHdr/queryReportDtl',
        method: 'get',
        params: data,
    })
}

//查询总结
export function querySummary(data) {
    return request({
        url: '/trade-test/inspectTaskHdr/querySummary',
        method: 'get',
        params: data,
    })
}

//保存综合描述
export function comReview(data) {
    return request({
        url: '/trade-test/inspectTaskHdr/comReview',
        method: 'get',
        params: data,
    })
}
