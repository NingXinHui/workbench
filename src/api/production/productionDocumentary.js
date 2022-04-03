import request from "@/utils/request";
//生产跟单管理
// 列表
export function getTracklist(file) {
  return request({
    url: "/pd/track/list",
    method: "get",
    params: file
  });
}
//查看详情
export function getTrackDetail(file) {
  return request({
    url: "/pd/track/get/" + file.id,
    method: "get",
  });
}
//保存接口
export function updateTrack(file) {
  return request({
    url: "/pd/track/update",
    method: "put",
    data:file,
  });
}
//批量提交
export function submitTrack(file) {
  return request({
    url: "/pd/track/submit",
    method: "put",
    params: file
  });
}
//批量撤回
export function revocationTrack(file) {
  return request({
    url: "/pd/track/revoke",
    method: "put",
    params: file
  });
}
//批量完成
export function completeTrack(file) {
  return request({
    url: "/pd/track/complete",
    method: "put",
    params: file
  });
}
//批量取消
export function cancelCompleteTrack(file) {
  return request({
    url: "/pd/track/cancel-complete",
    method: "put",
    params: file
  });
}
//批量取消关闭
export function cancelCloseTrack(file) {
  return request({
    url: "/pd/track/cancel-close",
    method: "put",
    params: file
  });
}
//批量关闭接口
export function closeTrack(file) {
  return request({
    url: "/pd/track/close",
    method: "put",
    params: file
  });
}
//删除接口
export function deleteTrack(file) {
  return request({
    url: "/pd/track/delete/" + file.id,
    method: "delete",
  });
}
