import request from "@/utils/request";

//客商公司
// 列表数据
export function checkitemList(file) {
  return request({
    url: "/mdm/check-item/list",
    method: "get",
    params: file
  });
}
//批量查询词典下拉
export function serachAllType(file) {
  return request({
    url: "/sm/dict-data/list/type-code/",
    method: "post",
    data: file
  });
}
//关联企业lookup
export function lookupCheckItem(file) {
  return request({
    url: "/mdm/check-item/lookup",
    method: "get",
    params: file
  });
}
//新增
export function addCheckItem(file) {
  return request({
    url: "/mdm/check-item/add",
    method: "post",
    data: file
  });
}
//修改
export function updateCheckItem(file) {
  return request({
    url: "/mdm/check-item/update",
    method: "put",
    data: file
  });
}
//查询详情
export function getCheckItem(file) {
  return request({
    url: "/mdm/check-item/get/" + file.id,
    method: "get",
  });
}
