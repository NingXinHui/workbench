import request from "@/utils/request";

// 分页查询所有数据
export function searchOutwareListApi (query) {
  return request({
    url: '/st/out-store-order/list',
    method: "get",
    params: query
  });
}

//  新增仓库管理数据
export function addOutWareManagerApi (file) {
  return request({
    url: "/st/out-store-order/add",
    method: "post",
    data: file
  });
}

// 通过主键查询单条数据
export function searchOutWareByIdApi (query) {
  return request({
    url: `/st/out-store-order/get/${query}`,
    method: "get"
  });
}

// 修改入库类型数据
export function OutwareUpdateApi (query) {
  return request({
    method: "put",
    url: "/st/out-store-order/update",
    data: query
  });
}

// //批量删除入库类型数据
export function deleteOutWareApi (queryId) {
  return request({
    method: "delete",
    url: `/st/out-store-order/delete/batch`,
    params: queryId
  });
}


// 提交入库类型数据
export function submitOutWareApi (data) {
  return request({
    method: "put",
    url: `/st/out-store-order/submit`,
    params: data
  });
}

// 撤回入库类型数据
export function backSubmitOutWareApi (data) {
  return request({
    method: "put",
    url: `/st/out-store-order/update/revoke`,
    params: data
  });
}

// 导出选中的数据
export function searchStockTypeApi (query) {
  return request({
    url: '/st/out-store-order/export',
    method: "get",
    params: query
  });
}

//  确认收货
export function trueOutWareManagerApi (file) {
  return request({
    url: "/st/out-store-order/confirm-receipt",
    method: "post",
    data: file
  });
}
