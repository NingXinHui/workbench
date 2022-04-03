import request from "@/utils/request";

// 分页查询所有数据
export function searchwareListApi (query) {
  return request({
    url: '/st/in-store/list',
    method: "get",
    params: query
  });
}

//  新增仓库管理数据
export function addWareManagerApi (file) {
  return request({
    url: "/st/in-store/add",
    method: "post",
    data: file
  });
}

// 通过主键查询单条数据
export function searchWareByIdApi (query) {
  return request({
    url: `/st/in-store/${query}`,
    method: "get"
  });
}

// 修改出入库类型数据
export function wareUpdateApi (query) {
  return request({
    method: "put",
    url: "/st/in-store/update",
    data: query
  });
}

// //批量删除出入库类型数据
export function deleteWareApi (queryId) {
  return request({
    method: "delete",
    url: `/st/in-store/delete/batch`,
    data: queryId
  });
}

// 提交出入库类型数据
export function submitWareApi (data) {
  return request({
    method: "put",
    url: `/st/in-store/submit`,
    params: data
  });
}

// 提交出入库类型数据
export function backSubmitWareApi (data) {
  return request({
    method: "put",
    url: `/st/in-store/revocation`,
    params: data
  });
}

// 导出选中的数据
export function searchStockTypeApi (query) {
  return request({
    url: '/st/in-store/export',
    method: "get",
    params: query
  });
}
// 导出选中的数据
export function searchUserApi (query) {

  return request({
    url: '/uc/user/list/position',
    method: "get",
    params: query
  });
}

