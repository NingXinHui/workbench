import request from "@/utils/request";

// 获取列表
export function getDataList(data) {
  return request({
    url: "/po/consignment-purchase-price/list",
    method: "get",
    params: data
  });
}
// 获取单个数据

export function getSingleList(id) {
  return request({
    url: `/po/consignment-purchase-price/get/${id}`,
    method: "get",

  });
}

// 新增数据

export function addList(data) {
  return request({
    url: "/po/consignment-purchase-price/add",
    method: "POST",
    data

  });
}
// 修改数据
export function updateList(data) {
  return request({
    url: "/po/consignment-purchase-price/update",
    method: "Put",
    data

  });
}
//删除
export function deleteChangePrice(data) {
  return request({
    url: "/po/consignment-purchase-price/delete/" + data.id,
    method: "delete",
  });
}
//提交审核
export function submitChangePrice(data) {
  return request({
    url: "/po/consignment-purchase-price/submit",
    method: "get",
    params:data,
  });
}
//撤回审核
export function cancelChangePrice(data) {
  return request({
    url: "/po/consignment-purchase-price/cancel",
    method: "get",
    params: data
  });
}
//查询任务的明细
export function searchPriceTask(data) {
  return request({
    url: "/po/change-price-task/list/ids",
    method: "get",
    params: data
  });
}
