import request from '@/utils/request'

// 获取验布疵点列表
export function getDefectDataList(data) {
    return request({
        url: '/im/inspectDefect/queryInspectDefect',
        method: 'get',
        params: data,
    })
}


// 获取验布产量列表
export function getOutputDataList(data) {
    return request({
        url: '/im/inspectDtl/queryInspectOutPutDetail',
        method: 'get',
        params: data,
    })
}


// 获取挡车工列表
export function getMachinistDataList(data) {
    return request({
        url: '/im/inspectOutPut/queryWeaveOutPut',
        method: 'get',
        params: data,
    })
}
