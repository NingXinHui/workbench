import request from "@/utils/request";

// 新增出入库类型数据
export function addStockTypeApi (file) {
  return request({
    url: "/st/in-out-type/add",
    method: "post",
    data: file
  });
}

//批量删除出入库类型数据
export function deleteStockTypeApi (queryId) {
  return request({
    method: "delete",
    url: `/st/in-out-type/delete/batch`,
    data: queryId
  });
}

// 通过主键查询单条数据
export function searchStockTypeApi (query) {
  return request({
    url: `/st/in-out-type/get/${query}`,
    method: "get"
  });
}

// 分页查询所有数据
export function searchStockTypeListApi (query) {
  return request({
    url: '/st/in-out-type/list',
    method: "get",
    params: query
  });
}

// 修改出入库类型数据
export function stockTypeUpdateApi (query) {
  return request({
    method: "put",
    url: "/st/in-out-type/update",
    data: query
  });
}