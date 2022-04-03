import request from "@/utils/request";
//工艺管理
// 列表
export function getBomlist(file) {
  return request({
    url: "/pd/bom/list",
    method: "get",
    params: file
  });
}
//新增
export function addBom(file) {
  return request({
    url: "/pd/bom/add",
    method: "post",
    data: file
  });
}
//修改
export function updateBom(file) {
  return request({
    url: "/pd/bom/update",
    method: "put",
    data: file
  });
}
//获取详情
export function getBomDetail(file) {
  return request({
    url: "/pd/bom/get/" + file.id,
    method: "get"
  });
}
//提交审核
export function submitBom(file) {
  return request({
    url: "/pd/bom/submit",
    method: "put",
    params: file
  });
}
//撤回
export function revokeBom(file) {
  return request({
    url: "/pd/bom/revoke",
    method: "put",
    params: file
  });
}
