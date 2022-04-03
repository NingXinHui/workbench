import request from "@/utils/request";

//采购订单模块
// 采购类型下拉
export function selectPurchaseType(file) {
  return request({
    url: "/po/purchase-type/list/select",
    method: "get",
    params: file
  });
}
//查询供应商lookup
export function selectCheckItem(file) {
  return request({
    url: "/mdm/check-item/lookup",
    method: "get",
    params: { ...file, current: file.pageNo, size: file.pageSize }
  });
}
//查询供应商下面的采购员lookup
export function selectBusinessPerson(file) {
  return request({
    url: "mdm/check-item/lookup/business-person",
    method: "get",
    params: { ...file, current: file.pageNo, size: file.pageSize }
  });
}
//根据采购员id查询采购组
export function selectDepartment(file) {
  return request({
    url: "/uc/department/look-up",
    method: "get",
    params: { ...file, current: file.pageNo, size: file.pageSize }
  });
}
//业务联系人lookup
export function selectCheckContact(file) {
  return request({
    url: "/mdm/check-item-contact/lookup",
    method: "get",
    params: { ...file, current: file.pageNo, size: file.pageSize }
  });
}
//新增接口
export function addPurchaseOrder(file) {
  return request({
    url: "/po/purchase-order/add",
    method: "post",
    data: file
  });
}
//修改接口
export function updatePurchaseOrder(file) {
  return request({
    url: "/po/purchase-order/update",
    method: "put",
    data: file
  });
}
//列表接口
export function purchaseOrderList(file) {
  return request({
    url: "/po/purchase-order/list",
    method: "get",
    params: file
  });
}
//查看详情
export function searchOrderDetail(file) {
  return request({
    url: "/po/purchase-order/get/" + file.id,
    method: "get",
  });
}
//批量删除
export function deletePurchaseOrder(file) {
  return request({
    url: "/po/purchase-order/delete/batch",
    method: "delete",
    params:file
  });
}
//提交审核
export function submitPurchaseOrder(file) {
  return request({
    url: "/po/purchase-order/submit",
    method: "put",
    params: file
  });
}
//撤回审核
export function revokePurchaseOrder(file) {
  return request({
    url: "/po/purchase-order/update/revoke",
    method: "put",
    params: file
  });
}
//完成订单接口
export function completePurchaseOrder(file) {
  return request({
    url: "/po/purchase-order/update/complete",
    method: "put",
    params: file
  });
}
//取消完成接口
export function cancelCompletePurchaseOrder(file) {
  return request({
    url: "/po/purchase-order/update/cancel-complete",
    method: "put",
    params: file
  });
}
//关闭订单接口
export function closePurchaseOrder(file) {
  return request({
    url: "/po/purchase-order/update/close",
    method: "put",
    params: file
  });
}
//取消关闭订单接口
export function cancelClosePurchaseOrder(file) {
  return request({
    url: "/po/purchase-order/update/cancel-close",
    method: "put",
    params: file
  });
}
