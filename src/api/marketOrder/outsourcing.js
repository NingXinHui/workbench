import request from "@/utils/request";

// 获取列表
export function getDataList(data) {
  return request({
    url: "/pd/outsource/list",
    method: "get",
    params: data
  });
}
//   新增
export function addDataList(data) {
  return request({
    url: "/pd/outsource/add",
    method: "post",
    data
  });
}
//   单条数据
export function getDetailList(id) {
  return request({
    url: `/pd/outsource/get/${id}`,
    method: "get"
  });
}
//  获取选单数据

export function getOrderList(data) {
  return request({
    url: "/sd/production-task/list/choose",
    method: "get",
    params: data
  });
}
// 明细数据
export function getOrderDetailList(id) {
  return request({
    url: `/sd/production-task/get/${id}`,
    method: "get"
  });
}
// 通过字典值获取数据
// /sm/dict-data/list-usable/{typeCode}
export function dictList(typeCode) {
  return request({
    url: `/sm/dict-data/list-usable/${typeCode}`,
    method: "get"
  });
}
// 修改数据
// /pd/outsource/update
export function updateDataList(data) {
  return request({
    url: "/pd/outsource/update",
    method: "put",
    data
  });
}
// 删除数据

export function deleteData(data) {
  return request({
    url: `/pd/outsource/delete-batch`,
    method: "delete",
   data
  });
}
// 修改单据状态
// 
export function modifyState(data) {
  return request({
    url: '/pd/outsource/update-bill-status',
    method: "put",
   params:data
  });
}

export function modifyBusiness(data) {
  return request({
    url: '/pd/outsource/update-business-status',
    method: "put",
     params:data
  });
}

// 批量取消关闭

// /pd/outsource/update-cancel-close-batch

export function allCancleCloseList(data) {
  return request({
    url: '/pd/outsource/update-cancel-close-batch',
    method: "put",
    data
  })
}
export function allCloseList(data) {
  return request({
    url: '/pd/outsource/update-close-batch',
    method: "put",
    data
  })
}
// 取消完成
export function allCancleComplateList(data) {
  return request({
    url: '/pd/outsource/update-cancel-complete-batch',
    method: "put",
    data
  })
}
// 完成
export function allComplateList(data) {
  return request({
    url: '/pd/outsource/update-complete-batch',
    method: "put",
    data
  })
}
// 提交

export function submitDataList(data) {
  return request({
    url: '/pd/outsource/update-submit-batch',
    method: "put",
    data
  })
}
// 撤回
export function withdrawDataList(data) {
  return request({
    url: '/pd/outsource/update-withdraw-batch',
    method: "put",
    data
  })
}
// 审核
// /pd/outsource/update-approval-batch
export function auditDataList(data) {
  return request({
    url: '/pd/outsource/update-approval-batch',
    method: "put",
    data
  })
}
// 反审核
export function againistAuditDataList(data) {
  return request({
    url: '/pd/outsource/update-de-approval-batch',
    method: "put",
    data
  })
}

// 导出当页数据
// /pd/outsource/export-current-page-data
export function exportList(data) {
  return request({
    url: '/pd/outsource/export-current-page-data',
    method: "put",
    data
  })
}
