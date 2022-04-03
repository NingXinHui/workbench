import request from "@/utils/request";

// 新增
export function menuAddAndCopy(file) {
  return request({
    url: "/uc/menu/add",
    method: "post",
    data: file
  });
}
//获取列表
export function menuQueryAll(file) {
  return request({
    url: "/uc/menu/tree",
    method: "get",
    params: file
  });
}
//修改数据
export function editById(file) {
  return request({
    url: "/uc/menu/update",
    method: "put",
    data: file
  });
}
//查看详情
export function updateMenu(file) {
  return request({
    url: "/uc/menu/get/" + file.id,
    method: "get",
    data: file
  });
}
//删除
export function deleteMenu(file) {
  return request({
    url: "/uc/menu/delete/" + file.id,
    method: "delete",
    data: file
  });
}
