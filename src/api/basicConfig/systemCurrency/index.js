import request from "@/utils/request";

//币种维护(系统)
// 列表
export function sysCurrencyPage(data) {
    return request({
        url: "/trade-sm/pb/sysCurrency/queryPage",
        method: "get",
        params: data
    });
}

//新增
export function sysCurrencyAdd(data) {
    return request({
        url: "/trade-sm/pb/sysCurrency/add",
        method: "post",
        data
    });
}

//编辑
export function sysCurrencyEdit(data) {
    return request({
        url: "/trade-sm/pb/sysCurrency/editById",
        method: "post",
        data
    });
}

//删除
export function deleteSysCurrency(data) {
    return request({
        url: "/trade-sm/pb/sysCurrency/deleteById",
        method: "post",
        data: data,
    });
}

//获取详情数据
export function detailSysCurrency(data) {
    return request({
        url: "/trade-sm/pb/sysCurrency/queryById",
        method: "get",
        params: data
    });
}
