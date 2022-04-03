import request from "@/utils/request";

// 获取列表
export function getDataList(data) {
  return request({
    url: "/po/purchase-return-order/list",
    method: "get",
    params: data
  });
}
// 查询单条是数据

export function getSinglList(id) {
  return request({
    url: `/po/purchase-return-order/get/${id}`,
    method: "get"
  });
}
//   新增数据

export function addSinglList(data) {
  return request({
    url: "/po/purchase-return-order/add/",
    method: "post",
    data
  });
}
// 删除数据
export function deletedIdList(id) {
  return request({
    url: `/po/purchase-return-order/delete/${id}`,
    method: "delete"
  });
}

// 修改数据

export function updateList(data) {
  return request({
    url: "/po/purchase-return-order/update",
    method: "put",
    data
  });
}
//   提交

export function submitList(data) {
  return request({
    url: "/po/purchase-return-order/submit",
    method: "put",
    params: data
  });
}
//   取消关闭

export function cancleClose(data) {
  return request({
    url: "/po/purchase-return-order/update/cancel-close",
    method: "put",
    params: data
  });
}

// 关闭
export function closeSaleOrder(data) {
  return request({
    url: "/po/purchase-return-order/update/close",
    method: "put",
    params: data
  });
}

// 完成

export function completeSaleOrder(data) {
  return request({
    url: "/po/purchase-return-order/update/complete",
    method: "put",
    params: data
  });
}

//   取消完成
export function cancelCompleteSaleOrder(data) {
  return request({
    url: "/po/purchase-return-order/update/cancel-complete",
    method: "put",
    params: data
  });
}

//   撤回

export function withdrawData(data) {
  return request({
    url: "/po/purchase-return-order/update/revoke",
    method: "put",
    params: data
  });
}
// 获取选单数据

export function getChooseData(data) {
  return request({
    url: "/po/purchase-order/list/choose",
    method: "get",
    params: data
  });
}
// 详情提交
export function detailSubmit(data) {
  return request({
    url: "/po/purchase-return-order/submit",
    method: "put",
    params: data
  });
}