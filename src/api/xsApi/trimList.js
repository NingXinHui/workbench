import request from '@/utils/request'

// 删除
export function deleteData(data){
    return request({
        url: '/trade-store/st/mmstoreadjusthdr/deleteById',
        method: 'delete',
        params: data,
    })
}

// 提交
export function submitData(data){
    return request({
        url: '/trade-store/st/mmstoreadjusthdr/operate',
        method: 'post',
        params: data,
    })
}

// 撤回
export function withdrawData(data){
    return request({
        url: '/trade-store/st/mmstoreadjusthdr/operate',
        method: 'post',
        params: data,
    })
}


// 保存
export function saveData(data){
    return request({
        url: '/trade-store/st/mmstoreadjusthdr/add',
        method: 'post',
        data,
    })
}

// 编辑
export function editData(data){
    return request({
        url: '/trade-store/st/mmstoreadjusthdr/editById',
        method: 'put',
        data,
    })
}

// 获取详情
export function detailsData(data){
    return request({
        url: '/trade-store/st/mmstoreadjusthdr/queryById',
        method: 'get',
        params: data,
    })
}

//获取库存明细数据
export function getAdjustList(data){
    return request({
        url: '/trade-store/st/mmstorecheckhdr/queryStoreStock',
        method: 'get',
        params: data,
    })
}

//获取仓库名称下拉数据
export function storeAll(data){
    return request({
        url: '/trade-store/store/getAll',
        method: 'get',
        params: data,
    })
}

//销售下拉订单
export function orderLookUp(data){
    return request({
        url:'/trade-po/orderDtl/lookUp',
        method:'get',
        params: data,
    })
}

//调整后价位
export function queryLocation(data){
    return request({
        url:'/trade-store/location/querySelect',
        method:'get',
        params: data,
    })
}

//调整单-del
export function mmstoreadjusthdr (query) {
    return request({
      url: '/trade-store/st/mmstoreadjusthdr/queryPage',
      method: 'get',
      params: query
    })
}
//仓库下拉
// export function storeAll (query) {
//     return request({
//         url: '/st/store/all',
//         method: 'get',
//         params: query
//     })
// }
//仓库管理员
export function locationGroup (query) {
    return request({
        url: '/trade-store/locationGroup/listConditions',
        method: 'get',
        params: query
    })
}