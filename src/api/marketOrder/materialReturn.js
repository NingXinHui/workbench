//
import request from "@/utils/request";

// 获取列表
export function getDataList(data) {
  return request({
    url: "/pd/feed-return/list",
    method: "get",
    params: data
  });
}
// 主键查询单挑数据
// 
export function getDetailList(id) {
  return request({
    url:`/pd/feed-return/get/${id}`,
    method: "get",
    
  });
}
// 退料选单数据
export function getOrderList(data) {
  return request({
    url:'/pd/outsource/list-feed-return-menu',
    method: "get",
    params: data
    
  });
}
// 新增数据

export function addDataList(data) {
  return request({
    url: "/pd/feed-return/add",
    method: "post",
    data
  });
}

// 修改数据

export function updateDataList(data) {
  return request({
    url: "/pd/feed-return/update",
    method: "put",
    data
  });
}

// 提交
export function submitDataList(data) {
  return request({
    url: '/pd/feed-return/update-submit-batch',
    method: "put",
    data
  })
}

// 删除

export function deleteData(data) {
  return request({
    url: `/pd/feed-return/delete-batch`,
    method: "delete",
   data
  });
}

// 批量取消关闭



export function allCancleCloseList(data) {
  return request({
    url: '/pd/feed-return/update-cancel-close-batch',
    method: "put",
    data
  })
}
export function allCloseList(data) {
  return request({
    url: '/pd/feed-return/update-close-batch',
    method: "put",
    data
  })
}
// 取消完成
export function allCancleComplateList(data) {
  return request({
    url: '/pd/feed-return/update-cancel-complete-batch',
    method: "put",
    data
  })
}
// 完成
export function allComplateList(data) {
  return request({
    url: '/pd/feed-return/update-complete-batch',
    method: "put",
    data
  })
}

// 撤回
export function withdrawDataList(data) {
  return request({
    url: '/pd/feed-return/update-withdraw-batch',
    method: "put",
    data
  })
}
// 审核
// /pd/outsource/update-approval-batch
export function auditDataList(data) {
  return request({
    url: '/pd/feed-return/update-approval-batch',
    method: "put",
    data
  })
}
// 反审核
export function againistAuditDataList(data) {
  return request({
    url: '/pd/feed-return/update-de-approval-batch',
    method: "put",
    data
  })
}