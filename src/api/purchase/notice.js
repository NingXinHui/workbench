import request from "@/utils/request";

//采购到货通知
// 新增
export function addNotice(file) {
  return request({
    url: "/po/arrival-notice-order/add",
    method: "post",
    data: file
  });
}
//修改
export function updateNotice(file) {
  return request({
    url: "/po/arrival-notice-order/update",
    method: "put",
    data: file
  });
}
//查看详情
export function searchNotice(file) {
  return request({
    url: "/po/arrival-notice-order/get/" + file.id,
    method: "get",
  });
}
//查询列表
export function noticeList(file) {
  return request({
    url: "/po/arrival-notice-order/list",
    method: "get",
    params:file
  });
}
//删除
export function deleteNotice(file) {
  return request({
    url: "/po/arrival-notice-order/delete/batch",
    method: "delete",
    params: file
  });
}
//提交审核
export function submitNotice(file) {
  return request({
    url: "/po/arrival-notice-order/submit",
    method: "put",
    params: file
  });
}
//撤回
export function revokeNotice(file) {
  return request({
    url: "/po/arrival-notice-order/update/revoke",
    method: "put",
    params: file
  });
}
//完成
export function completeNotice(file) {
  return request({
    url: "/po/arrival-notice-order/update/complete",
    method: "put",
    params: file
  });
}
//取消完成
export function cancelCompleteNotice(file) {
  return request({
    url: "/po/arrival-notice-order/update/cancel-complete",
    method: "put",
    params: file
  });
}
//关闭
export function closeNotice(file) {
  return request({
    url: "/po/arrival-notice-order/update/close",
    method: "put",
    params: file
  });
}
//取消关闭
export function cancelCloseNotice(file) {
  return request({
    url: "/po/arrival-notice-order/update/cancel-close",
    method: "put",
    params: file
  });
}
//获取选单数据
export function chooseOrder(file) {
  return request({
    url: "/po/purchase-order/list/choose",
    method: "get",
    params: file
  });
}
