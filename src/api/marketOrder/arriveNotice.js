//
import request from "@/utils/request";

// 获取列表
export function getDataList(data) {
  return request({
    url: "/pd/arrival-notice/list",
    method: "get",
    params: data
  });
}
// 主键查询单挑数据
// 
export function getDetailList(id) {
  return request({
    url:`/pd/arrival-notice/get/${id}`,
    method: "get",
    
  });
}
// 选单数据
export function getOrderList(data) {
  return request({
    url:'/pd/outsource/list-arrival-notice-menu',
    method: "get",
    params: data
    
  });
}
// 新增数据

export function addDataList(data) {
  return request({
    url: "/pd/arrival-notice/add",
    method: "post",
    data
  });
}

// 修改数据

export function updateDataList(data) {
  return request({
    url: "/pd/arrival-notice/update",
    method: "put",
    data
  });
}

// 提交
export function submitDataList(data) {
  return request({
    url: '/pd/arrival-notice/update-submit-batch',
    method: "put",
    data
  })
}

// 删除

export function deleteData(data) {
  return request({
    url: `/pd/arrival-notice/delete-batch`,
    method: "delete",
   data
  });
}

// 撤回
export function withdrawDataList(data) {
  return request({
    url: '/pd/arrival-notice/update-de-approval-batch',
    method: "put",
    data
  })
}
// 审核
// /pd/outsource/update-approval-batch
export function auditDataList(data) {
  return request({
    url: '/pd/arrival-notice/update-withdraw-batch',
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