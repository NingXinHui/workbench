import request from "@/utils/request";

//发货通知单
// 获取选单数据
export function getOrderList(file) {
  return request({
    url: "/sd/order/list/choose",
    method: "get",
    params: file
  });
}
//新增接口
export function addInvoice(file) {
  return request({
    url: "/sd/shipment/add",
    method: "post",
    data: file
  });
}
//列表数据
export function invoiceList(file) {
  return request({
    url: "/sd/shipment/list",
    method: "get",
    params: file
  });
}
//查询详情
export function invoiceDeatail(file) {
  return request({
    url: "/sd/shipment/get/" + file.id,
    method: "get",
  });
}
//批量删除
export function deleteInvoice(file) {
  return request({
    url: "/sd/shipment/delete/batch",
    method: "delete",
    params:file
  });
}
//修改数据
export function updateInvoice(file) {
  return request({
    url: "/sd/shipment/update",
    method: "put",
    data: file
  });
}
//提交审核
export function submitInvoice(file) {
  return request({
    url: "/sd/shipment/submit",
    method: "put",
    params: file
  });
}
//撤回
export function revocationInvoice(file) {
  return request({
    url: "/sd/shipment/update/revocation",
    method: "put",
    params: file
  });
}
//完成接口
export function completeInvoice(file) {
  return request({
    url: "/sd/shipment/update/complete",
    method: "put",
    params: file
  });
}
//取消完成接口
export function cancelCompleteInvoice(file) {
  return request({
    url: "/sd/shipment/update/cancel-complete",
    method: "put",
    params: file
  });
}
//关闭接口
export function closeInvoice(file) {
  return request({
    url: "/sd/shipment/update/close",
    method: "put",
    params: file
  });
}
//取消关闭
export function cancelCloseInvoice(file) {
  return request({
    url: "/sd/shipment/update/cancel-close",
    method: "put",
    params: file
  });
}
//根据销售订单号查询物料明细
export function searchOrderDetail(file) {
  return request({
    url: "/sd/order/list/detail",
    method: "get",
    params: file
  });
}
