import request from '@/utils/request'


// 获取所有的菜单
// 获取复制配置的接口
export function menuQueryAll(parameter) {
    return request({
        url: '/trade-sm/menu/queryAll',
        method: 'get',
        params: parameter
    })
}

//新增菜单
export function menuAddAndCopy(parameter) {
    return request({
        url: "/trade-sm/menu/add",
        method: 'post',
        data: parameter
    })
}


// 编辑菜单
export function editById(parameter) {
    return request({
        url: '/trade-sm/menu/editById',
        method: 'put',
        data: parameter
    })
}

// 参数配置
export function queryAll(parameter) {
    return request({
        url: '/trade-sm/pageParam/queryAll',
        method: 'get',
        params: parameter
    })
}

// 菜单参数编辑
export function queryEdit(parameter) {
    return request({
        url: '/trade-sm/pageParam/editById',
        method: 'put',
        data: parameter
    })
}


// 角色维护


// 获取所有的角色
export function roleQueryAll(parameter) {
    return request({
        url: '/trade-sm/role/queryPage',
        method: 'get',
        params: parameter
    })
}


// 新增
export function roleAdd(parameter) {
    return request({
        url: "/trade-sm/role/add",
        method: 'post',
        data: parameter
    })
}

// 编辑角色
export function roleEditById(parameter) {
    return request({
        url: '/trade-sm/role/editById',
        method: 'put',
        data: parameter
    })
}

// 删除角色
export function roleDeleteById(parameter) {
    return request({
        url: '/trade-sm/role/deleteById',
        method: 'delete',
        params: parameter
    })
}

// 获取树状菜单结构
export function roleMenuTree(parameter) {
    return request({
        url: '/trade-sm/role/menuTree',
        method: 'get',
        params: parameter
    })
}


// 获取所有的角色信息 （用来筛选）
export function roleQueryAllInUser(parameter) {
    return request({
        url: '/trade-sm/role/queryAll',
        method: 'get',
        params: parameter
    })
}

// 获取用户的列表
export function userQueryPage(parameter) {
    return request({
        url: '/trade-sm/user/queryPage',
        method: 'get',
        params: parameter
    })
}

// 新增用户
export function userAdd(parameter) {
    return request({
        url: "/trade-sm/user/add",
        method: 'post',
        data: parameter
    })
}

// 编辑用户
export function userEditById(parameter) {
    return request({
        url: '/trade-sm/user/editById',
        method: 'put',
        data: parameter
    })
}

// 删除用户
export function userDeleteById(parameter) {
    return request({
        url: '/trade-sm/user/deleteById',
        method: 'delete',
        params: parameter
    })
}

// 获取所有菜单的竖主图
export function menuMenuTree(parameter) {
    return request({
        url: '/trade-sm/menu/menuTree',
        method: 'get',
        params: parameter
    })
}

// 获取角色的菜单
export function roleOwnMenus(parameter) {
    return request({
        url: '/trade-sm/role/ownMenus',
        method: 'get',
        params: parameter
    })
}

// 查看用户的详情信息
export function userQueryById(parameter) {
    return request({
        url: '/trade-sm/user/queryById',
        method: 'get',
        params: parameter
    })
}

// 给角色配置菜单
export function userGrant(parameter) {
    return request({
        url: "/trade-sm/user/grant",
        method: 'post',
        data: parameter
    })
}

// 角色配置成艾丹
export function roleConfigMenu(parameter) {
    return request({
        url: "/trade-sm/role/configMenu",
        method: 'post',
        data: parameter
    })
}


//流程设计的菜单
export function getProcessDefinitionList(parameter) {

    return request({
        url: '/trade-flowable/flowable/getProcessDefinitionList',
        method: 'post',
        data: parameter
    })
}

// 流程设计的新增
export function restModels(parameter) {

    return request({
        url: '/flowable/getUrl',
        method: 'post',
        data: parameter
    })
}

// 流程删除的
export function deleteProcessDefinition(parameter) {
    return request({
        url: '/trade-flowable/flowable/deleteProcessDefinition',
        method: 'get',
        params: parameter
    })
}

// 我的已办
export function getHistoryByUserId(parameter) {
    return request({
        url: '/trade-flowable/flowable/getHistoryByUserId',
        method: 'post',
        data: parameter
    })
}

// 我发起的
export function getUserStarts(parameter) {
    return request({
        url: '/trade-flowable/flowable/getUserStarts',
        method: 'post',
        data: parameter
    })
}

// 我的待办
export function getTaskList(parameter) {
    return request({
        url: '/trade-flowable/flowable/getTaskList',
        method: 'post',
        data: parameter
    })
}

// 获取各待办
export function userTaskCount(parameter) {
    return request({
        url: '/trade-flowable/flowable/userTaskCount',
        method: 'get',
        params: parameter
    })
}

// 获取流程图 图片
export function processDiagram(parameter) {
    return request({
        url: '/flowable/processDiagram',
        method: 'get',
        params: parameter
    })
}

// 获得历史记录
export function getHistoryList(parameter) {
    return request({
        url: '/trade-flowable/flowable/getHistoryList',
        method: 'get',
        params: parameter
    })
}

// 通过或者拒绝
export function processGuoOrJu(parameter) {
    return request({
        url: '/trade-flowable/flowable/process',
        method: 'post',
        data: parameter
    })
}
