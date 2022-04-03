import request from '@/utils/request'


// 盘点单获取列表
export function mmstorecheckhdrQueryPage(parameter) {
    return request({
        url: '/store/st/mmstorecheckhdr/queryPage',
        method: 'get',
        params: parameter
    })
}

// 盘点单的选单
export function mmstorecheckhdrQueryStoreStock(parameter) {
    return request({
        url: '/store/st/mmstorecheckhdr/queryStoreStock',
        method: 'get',
        params: parameter
    })
}

// 获取下所有的仓库名称的列表
export function storeGetAll(parameter) {
    return request({
        url: '/store/store/getAll',
        method: 'get',
        params: parameter
    })
}

// 新增盘点单
export function locationGroupAdd(parameter) {
    return request({
        url: "/store/st/mmstorecheckhdr/add",
        method: 'post',
        data: {...parameter, billStatus: '0'}
    })
}

//编辑盘点单
export function mmstorecheckhdrEditById(parameter) {
    return request({
        url: '/store/st/mmstorecheckhdr/editById',
        method: 'put',
        data: parameter
    })
}

// 根据仓库id获取对应的盘点人
export function locationGroupQueryByStoreId(parameter) {
    return request({
        url: '/store/locationGroup/queryByStoreId',
        method: 'get',
        params: parameter
    })
}

// 通过id查询明细
export function mmstorecheckhdrQueryById(parameter) {
    return request({
        url: '/store/st/mmstorecheckhdr/queryById',
        method: 'get',
        params: parameter
    })
}

// 删除盘点单的
export function mmstorecheckhdrDeleteBatch(parameter) {
    return request({
        url: '/store/st/mmstorecheckhdr/deleteById',
        method: 'DELETE',
        params: parameter
    })
}


//   挑拨单的接口列表

// 获取列表
export function mmstoretransferhdrQueryPage(parameter) {
    return request({
        url: '/store/st/mmstoretransferhdr/queryPage',
        method: 'get',
        params: parameter
    })
}

// 新增
export function mmstoretransferhdrAdd(parameter) {
    return request({
        url: "/store/st/mmstoretransferhdr/add",
        method: 'post',
        data: parameter
    })
}

//  编辑
export function mmstoretransferhdrEditById(parameter) {
    return request({
        url: '/store/st/mmstoretransferhdr/editById',
        method: 'put',
        data: parameter
    })
}

//   根据仓库id获取挑拨单的数据
export function locationGroupQueryByStoreIdTwo(parameter) {
    return request({
        url: '/store/locationGroup/queryStoreManByStoreId',
        method: 'get',
        params: parameter
    })
}

//根据id获取详情
export function mmstoretransferhdrQueryById(parameter) {
    return request({
        url: '/store/st/mmstoretransferhdr/queryById',
        method: 'get',
        params: parameter
    })
}

// 编辑  名字重复
// export function mmstoretransferhdrEditById (parameter) {
//     return request({
//       url: '/store/st/mmstoretransferhdr/editById',
//       method: 'put',
//       data: parameter
//     })
//   }
// 删除
export function mmstoretransferhdrDeleteBatch(parameter) {
    return request({
        url: '/store/st/mmstoretransferhdr/deleteBatch',
        method: 'DELETE',
        params: parameter
    })
}

export function mmstoretransferhdrById(parameter) {
    return request({
        url: '/store/st/mmstoretransferhdr/queryById',
        method: 'GET',
        params: parameter
    })
}

export function mmstoretransferhdrEdit(parameter) {
    return request({
        url: '/store/st/mmstoretransferhdr/editById',
        method: 'PUT',
        data: parameter
    })
}

export function locationQuery(parameter) {
    return request({
        url: '/store/location/querySelect',
        method: 'GET',
        params: parameter
    })
}

//调拨单-审核
export function mmstoretransferhdrAudit(parameter) {
    return request({
        url: '/store/st/mmstoretransferhdr/audit',
        method: 'GET',
        params: parameter
    })
}

//调拨单-审核
export function mmstoretransferhdrAuditCancel(parameter) {
    return request({
        url: '/store/st/mmstoretransferhdr/auditCancel',
        method: 'GET',
        params: parameter
    })
}


// 盘点单的审核
export function mmstorecheckhdrCheck(parameter) {
    return request({
        url: '/store/st/mmstorecheckhdr/check',
        method: 'GET',
        params: parameter
    })
}

// 盘点单的取消审核
export function mmstorecheckhdrReCheck(parameter) {
    return request({
        url: '/store/st/mmstorecheckhdr/reCheck',
        method: 'GET',
        params: parameter
    })
}

export function authRsaParam (parameter) {
  return request({
    url: "/auth/rsaParam",
    method: 'post',
    data: parameter
  })
}

// 获取列表
export function getParameters(parameter) {
    return request({
        url: '/auth/getParameters',
        method: 'get',
        params: parameter
    })
}
// 下达PDA
export function pda(parameter) {
    return request({
        url: '/store/st/mmstorecheckhdr/issuePDA',
        method: 'post',
        params: parameter
    })
}
