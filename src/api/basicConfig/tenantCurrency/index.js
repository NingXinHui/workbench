import request from "@/utils/request";

//币种维护(租户)
// 查询本币
export function getCurCurrency(data) {
    return request({
        url: "/trade-sm/pc/pbcurrency/getCurCurrency",
        method: "post",
        params: data
    });
}

//列表
export function getCurrencyList(data) {
    return request({
        url: "/trade-sm/pc/pbcurrency/getCurrencyList",
        method: "get",
        params: data
    });
}

//保存币种列表
export function saveCurrencyList(data) {
    return request({
        url: "/trade-sm/pc/pbcurrency/saveCurrencyList",
        method: "post",
        data
    });
}
