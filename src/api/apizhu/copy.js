
import request from '@/utils/request'

// 上传方法
export function uploadUrl(file) {
    return request({
        url: '/trade-sm/sys/oss/uploadFile',
        method: 'post',
        data: file
    })
}
// 行政区划懒加载
export function areas(query) {
    return request({
        url: '/trade-sm/sm/frameworkregion/select',
        method: 'get',
        params: query
    })
}

// 
export function categoryUpdate(query) {
    return request({
        method: 'put',
        url: '/sm/config-category/update',
        data: query
    })
}
// 查询所有的通用分类
export function categoryListAll(query) {
    return request({
        url: '/sm/config-category/list/all',
        method: 'get',
        params: query
    })
}

// 
export function configCategoryGet(query) {
    return request({
        url: `/sm/config-category/get/${query}`,
        method: 'get'
    })
}


// 查询所有的  
export function dictTypeListAll(query) {
    return request({
        url: '/sm/dict-type/list/all',
        method: 'get',
        params: query
    })
}
export function dictDataList(query) {
    // 根据编码获取值 /sm/dict-data/list/{typeCode}
    return request({
        url: `/sm/dict-data/list/${query}`,
        method: 'get'
    })
}


// 修改默认的数据 
export function dictTypeUpdate(query) {
    return request({
        method: 'put',
        url: '/sm/dict-type/update',
        data: query
    })
}

//删除左侧的数据 /sm/dict-type/{id}
export function dictTypeDelete(queryId) {
    return request({
        method: 'delete',
        url: `/sm/dict-type/delete/${queryId}`,
    })
}
// 右侧的新增 
export function dictDataAdd(query) {
    return request({
        method: 'post',
        url: '/sm/dict-data/add',
        data: query
    })
}
// 右侧的修改 
export function dictDataUpdate(query) {
    return request({
        method: 'put',
        url: '/sm/dict-data/update',
        data: query
    })
}
// 右侧的删除 
export function dictDataDelete(queryId) {
    return request({
        method: 'delete',
        url: `/sm/dict-data/delete/${queryId}`,
    })
}

// 根据图片id获取图片的链接地址 /sm/file/get/{id}
export function fileGet(query) {
    return request({
        url: `/sm/file/get/${query}`,
        method: 'get'
    })
}

// 用户的列表信息 

export function userListAll(query) {
    return request({
        url: '/uc/user/list',
        method: 'get',
        params: query
    })
}

// 新增用户 
export function userAddOne(query) {
    return request({
        method: 'post',
        url: '/uc/user/add',
        data: query
    })
}

// 根据用户id获取用户的详情 /uc/user/get/{id}
export function userGetDetail(query) {
    return request({
        url: `/uc/user/get/${query}`,
        method: 'get'
    })
}
// 所属公司的下拉 /uc/company/list/select
export function companyListSelect() {
    return request({
        url: `/uc/company/list/select`,
        method: 'get'
    })
}


// 主数据的一些接口 

// 物料类别  

// 


export function materialTypeList(query) {
    return request({
        url: '/mdm/material-type/list',
        method: 'get',
        params: query
    })
}


// 获取物料类别的分类树状结构 
export function defineAddBatchByImport(query) {
    return request({
        method: 'get',
        url: '/mdm/material-type/list-tree',
        params: query
    })
}

// 获取上级分类的数据  
export function materialTypeListAll(query) {
    return request({
        url: '/mdm/material-type/list-all',
        method: 'get',
        params: query
    })
}
// 新增物料  
export function materialTypeAdd(query) {
    return request({
        method: 'post',
        url: '/mdm/material-type/add',
        data: query
    })
}
// 修改物料
export function materialTypeUpdate(query) {
    return request({
        method: 'put',
        url: '/mdm/material-type/update',
        data: query
    })
}
// 删除物料 /mdm/material-type/delete/{id}
export function materialTypeDelete(queryId) {
    return request({
        method: 'delete',
        url: `/mdm/material-type/delete/${queryId}`,
    })
}
// 获取某一条数据 /mdm/material-type/get/{id}
export function materialTypeGet(query) {
    return request({
        url: `/mdm/material-type/get/${query}`,
        method: 'get'
    })
}



// 属性管理  列表
export function materialPropertyDefineList(query) {
    return request({
        url: '/mdm/material-property-define/list',
        method: 'get',
        params: query
    })
}

// 新增 
export function materialPropertyDefineAdd(query) {
    return request({
        method: 'post',
        url: '/mdm/material-property-define/add',
        data: query
    })
}
// 修改 
export function materialPropertyDefineUpdate(query) {
    return request({
        method: 'put',
        url: '/mdm/material-property-define/update',
        data: query
    })
}
// 删除 /mdm/material-property-define/delete/{id}
export function materialPropertyDefineDelete(queryId) {
    return request({
        method: 'delete',
        url: `/mdm/material-property-define/delete/${queryId}`,
    })
}

// 获取详情 /mdm/material-property-define/get/{id}
export function materialPropertyDefineGet(query) {
    return request({
        url: `/mdm/material-property-define/get/${query}`,
        method: 'get'
    })
}

// 批量复制属性 
export function defineAddBatchByCopy(query) {
    return request({
        method: 'post',
        url: '/mdm/material-property-define/add-batch-by-copy',
        data: query
    })
}

// 获取配置的列表的数据 
export function itemDefineListAll(query) {
    return request({
        url: '/mdm/material-property-item-define/list-all',
        method: 'get',
        params: query
    })
}

// 批量操作弹框的数据  
export function addDeleteUpdateBatch(query) {
    return request({
        method: 'post',
        url: '/mdm/material-property-item-define/add-delete-update-batch',
        data: query
    })
}

//下载模板 
export function exportImportTemplate() {
    return request({
        url: '/mdm/material-property-define/export-import-template',
        method: 'get',
      
    })
}




// 单位管理

export function unitListAll(query) {
    return request({
        url: '/mdm/unit/list',
        method: 'get',
        params: query
    })
}

// 获取所有的单位 
export function unitListAllNoPage() {
    return request({
        url: '/mdm/unit/list-all',
        method: 'get',
       
    })
}

// 新增单位 
export function unitAdd(query) {
    return request({
        method: 'post',
        url: '/mdm/unit/add',
        data: query
    })
}
//修改 
export function unitUpdate(query) {
    return request({
        method: 'put',
        url: '/mdm/unit/update',
        data: query
    })
}

// 通过id获取数据   
export function unitGetCode(query) {
    return request({
        url: `/mdm/unit/get/${query}`,
        method: 'get'
    })
}
// 通过 id进行删除  
export function unitDelete(queryId) {
    return request({
        method: 'delete',
        url: `/mdm/unit/delete/${queryId}`,
    })
}

// 获取所有的属性 
export function propertyDefineListAll(query) {
    return request({
        url: '/mdm/material-property-define/list-all',
        method: 'get',
        params: query
    })
}


// 查询物料品种表  
export function materialVarietyList(query) {
    return request({
        url: '/mdm/material-variety/list',
        method: 'get',
        params: query
    })
}


// 新增物料 
export function materialDefineAdd(query) {
    return request({
        method: 'post',
        url: '/mdm/material-property-define/add',
        data: query
    })
}

// 修改物料 
export function materialDefineUpdate(query) {
    return request({
        method: 'put',
        url: '/mdm/material-property-define/update',
        data: query
    })
}

// 新增物料服务  
export function materialVarietyAdd(query) {
    return request({
        method: 'post',
        url: '/mdm/material-variety/add',
        data: query
    })
}
// 获取物料服务的详情 
export function materialVarietyGet(query) {
    return request({
        url: `/mdm/material-variety/get/${query}`,
        method: 'get'
    })
}
// 公司下拉对应的部门
export function departmentListSelect(companyId) {
    return request({
        url: `/uc/department/list/select/${companyId}`,
        method: 'get'
    })
}
//公司对应的角色
export function roleListSelect(companyId,current,size) {
    return request({
        url: `/uc/role/list/?companyId=${companyId}&current=${current}&size=${size}`,
        method: 'get'
    })
}
// 删除对应用户
export function deleteSelect(id) {
    return request({
        url: `/uc/user/delete/${id}`,
        method: 'delete'
    })
}
// 更新用户信息
export function updataSelect(query) {
    return request({
        url: `/uc/user/update`,
        method: 'post',
        data: query
    })
}
// 校验原密码
export function provePassword(query) {
    return request({
        url: `uc/user/check-password`,
        method: 'post',
        data: query
    })
}
// 更新密码
export function upadataPassword(query) {
    return request({
        url: `uc/user/check-password`,
        method: 'post',
        data: query
    })
}

// 修改数据  
export function materialVarietyUpdate(query) {
    return request({
        method: 'put',
        url: '/mdm/material-variety/update',
        data: query
    })
}

// 价格管理


// 列表数据
export function materialPriceHdrList(query) {
    return request({
        url: '/mdm/material-price/list',
        method: 'get',
        params: query
    })
}

//申请人的模糊查询 /uc/user/list?keyword=旺
export function listKeyword(key) {
    return request({
        url: `/uc/user/list?keyword=${key}`,
        method: 'get'
    })
}
// 根据用户获取对应的部门 
export function departmentListSelectPart(key) {
    return request({
        url: `/uc/department/list/select/department/${key}`,
        method: 'get'
    })
}
// 获取下价格管理调整价格的弹框的数组 
export function priceHdrListAllDetail(query) {
    return request({
        url: '/mdm/material-price/list-detail',
        method: 'get',
        params: query
    })
}

//历史记录的列表数据
export function  listHdrWithDtl(query) {
    return request({
        url: '/mdm/material-price/list-with-detail',
        method: 'get',
        params: query
    })
}
// 分页查询物料调价单 
export function  priceHdrListHdr(query) {
    return request({
        url: '/mdm/material-price/list-basic',
        method: 'get',
        params: query
    })
}

// 获取下所有的调价单和明细 
export function  listAllHdrWithDtl(query) {
    return request({
        url: '/mdm/material-price/list-with-detail',
        method: 'get',
        params: query
    })
}

 
// 提交的按钮 和审核  驳回的操作 
export function updateBillStatusWhenVerify(query) {
    return request({
        method: 'put',
        url: '/mdm/material-price/update-bill-status-when-verify',
        data: query
    })
}
