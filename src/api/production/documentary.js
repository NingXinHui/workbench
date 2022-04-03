import request from "@/utils/request";
//跟单流程
// 列表
export function getTrackTemplatelist(file) {
  return request({
    url: "/pd/track-template/list",
    method: "get",
    params: file
  });
}
//新增
export function addTrackTemplate(file) {
  return request({
    url: "/pd/track-template/add",
    method: "post",
    data: file
  });
}
//修改
export function updateTrackTemplate(file) {
  return request({
    url: "/pd/track-template/update",
    method: "put",
    data: file
  });
}
//获取详情
export function getTrackTemplateDetail(file) {
  return request({
    url: "/pd/track-template/get/" + file.id,
    method: "get"
  });
}
