import request from "@/utils/request";
//工序管理
// 列表
export function getWorkprocedurelist(file) {
  return request({
    url: "/pd/work-procedure/list",
    method: "get",
    params: file
  });
}
//新增
export function addWorkprocedure(file) {
  return request({
    url: "/pd/work-procedure/add",
    method: "post",
    data: file
  });
}
//修改
export function updateWorkprocedure(file) {
  return request({
    url: "/pd/work-procedure/update",
    method: "put",
    data: file
  });
}
//获取详情
export function getWorkprocedureDetail(file) {
  return request({
    url: "/pd/work-procedure/get/" + file.id,
    method: "get",
  });
}
//导出数据
export function exportWorkprocedure(file) {
  return request({
    url: "/pd/work-procedure/export",
    method: "get",
    params:file,
  });
}
//查询跟进项配置
export function followUpList(file) {
  return request({
    url: "/pd/follow-up-config/list/" + file.id,
    method: "get",
  });
}
//保存跟进项配置
export function addFollowUp(file) {
  return request({
    url: "/pd/follow-up-config/add",
    method: "post",
    data:file
  });
}
//查询所有数据
export function workprocedureListAll(file) {
  return request({
    url: "/pd/work-procedure/list/all",
    method: "get",
    params: file
  });
}
