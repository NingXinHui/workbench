//
import request from "@/utils/request";

// 获取列表
export function getDataList(data) {
  return request({
    url: "/pd/feed-apply/list",
    method: "get",
    params: data
  });
}
// 主键查询单挑数据
// 
export function getDetailList(id) {
  return request({
    url:`/pd/feed-apply/get/${id}`,
    method: "get",
    
  });
}
// 选单数据
export function getOrderList(data) {
  return request({
    url:'/pd/outsource/list-feed-apply-menu',
    method: "get",
    params: data
    
  });
}
// 新增数据

export function addDataList(data) {
  return request({
    url: "/pd/feed-apply/add",
    method: "post",
    data
  });
}

// 修改数据

export function updateDataList(data) {
  return request({
    url: "/pd/feed-apply/update",
    method: "put",
    data
  });
}

// 提交
export function submitDataList(data) {
  return request({
    url: '/pd/feed-apply/update-submit-batch',
    method: "put",
    data
  })
}

// 删除

export function deleteData(data) {
  return request({
    url: `/pd/feed-apply/delete-batch`,
    method: "delete",
   data
  });
}

// 批量取消关闭

// /pd/outsource/update-cancel-close-batch

export function allCancleCloseList(data) {
  return request({
    url: '/pd/feed-apply/update-cancel-close-batch',
    method: "put",
    data
  })
}
export function allCloseList(data) {
  return request({
    url: '/pd/feed-apply/update-close-batch',
    method: "put",
    data
  })
}
// 取消完成
export function allCancleComplateList(data) {
  return request({
    url: '/pd/feed-apply/update-cancel-complete-batch',
    method: "put",
    data
  })
}
// 完成
export function allComplateList(data) {
  return request({
    url: '/pd/feed-apply/update-complete-batch',
    method: "put",
    data
  })
}

// 撤回
export function withdrawDataList(data) {
  return request({
    url: '/pd/feed-apply/update-withdraw-batch',
    method: "put",
    data
  })
}
// 审核
// /pd/outsource/update-approval-batch
export function auditDataList(data) {
  return request({
    url: '/pd/feed-apply/update-approval-batch',
    method: "put",
    data
  })
}
// 反审核
export function againistAuditDataList(data) {
  return request({
    url: '/pd/feed-apply/update-de-approval-batch',
    method: "put",
    data
  })
}
// 仓库的下拉
export function getWarehouseList(data) {
  return request({
    url: '/st/store-warehouse/list-by-name',
    method: "GET",
    data
  })
}