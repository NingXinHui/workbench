import request from "@/utils/request";

//销售订单
// 查询销售类型下拉
export function searchSaleType(file) {
  return request({
    url: "/sd/sales-type/list/name",
    method: "get",
    params: file
  });
}
// 查询客户lookup
export function searchCustomer(file) {
  return request({
    url: "/mdm/check-item/lookup",
    method: "get",
    params: { ...file, current: file.pageNo, size: file.pageSize }
  });
}
//查询业务联系人和收货单位lookup
export function searchContact(file) {
  return request({
    url: "/mdm/check-item-contact/lookup",
    method: "get",
    params: { ...file, current: file.pageNo, size: file.pageSize }
  });
}
//查询业务联系人和收货单位lookup
export function searchdepartment(file) {
  return request({
    url: "/uc/department/look-up",
    method: "get",
    params: { ...file, current: file.pageNo, size: file.pageSize }
  });
}
//查询物料lookup
export function searchMaterial(file) {
  return request({
    url: "/mdm/material-variety/lookup/material",
    method: "get",
    params: { ...file, current: file.pageNo, size: file.pageSize }
  });
}
//查询打样任务单号lookup
export function searchProductionTask(file) {
  return request({
    url: "/sd/production-task/look-up",
    method: "get",
    params: { ...file, current: file.pageNo, size: file.pageSize }
  });
}
//选单接口
export function chooseForOrder(file) {
  return request({
    url: "/po/purchase-order/list/choose/for-sale",
    method: "get",
    params: file
  });
}
//新增销售订单
export function addSaleOrder(file) {
  return request({
    url: "/sd/order/add",
    method: "post",
    data: file
  });
}
//查询列表数据
export function searchOrderList(file) {
  return request({
    url: "/sd/order/list",
    method: "get",
    params: file
  });
}
//查看销售订单详情
export function searchOrderDetail(file) {
  return request({
    url: "/sd/order/get/" + file.id,
    method: "get",
  });
}
//修改订单
export function updateSaleOrder(file) {
  return request({
    url: "/sd/order/update",
    method: "put",
    data:file
  });
}
//批量删除的订单
export function deleteSaleOrder(file) {
  return request({
    url: "/sd/order/delete/batch",
    method: "delete",
    params: file
  });
}
//批量提交销售订单
export function submitSaleOrder(file) {
  return request({
    url: "/sd/order/submit",
    method: "put",
    params: file
  });
}
//批量撤回销售订单
export function revocationSaleOrder(file) {
  return request({
    url: "/sd/order/update/revocation",
    method: "put",
    params: file
  });
}
//批量完成订单
export function completeSaleOrder(file) {
  return request({
    url: "/sd/order/update/complete",
    method: "put",
    params: file
  });
}
//批量取消订单
export function cancelCompleteSaleOrder(file) {
  return request({
    url: "/sd/order/update/cancel-complete",
    method: "put",
    params: file
  });
}
//批量取消关闭
export function cancelCloseSaleOrder(file) {
  return request({
    url: "/sd/order/update/cancel-close",
    method: "put",
    params: file
  });
}
//批量关闭接口
export function closeSaleOrder(file) {
  return request({
    url: "/sd/order/update/close",
    method: "put",
    params: file
  });
}
//下推接口
export function pushSaleOrder(file) {
  return request({
    url: "/sd/order/push",
    method: "put",
    params: file
  });
}
//合同归档
export function archiveSaleOrder(file) {
  return request({
    url: "/sd/order/archive",
    method: "put",
    params: file
  });
}