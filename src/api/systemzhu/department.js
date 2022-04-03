import request from "@/utils/request";

//查询列表
export function geteDpartmentList(file) {
  return request({
    url: "/uc/department/list",
    method: "get",
    params: file
  });
}
//新增
export function addDpartment(file) {
  return request({
    url: "/uc/department/create",
    method: "post",
    data: file
  });
}
//修改
export function updateDpartment(file) {
  return request({
    url: "/uc/department/update",
    method: "put",
    data: file
  });
}
//删除
export function deleteDpartment(file) {
  return request({
    url: "/uc/department/delete/" + file.id,
    method: "delete",
  });
}
//部门下拉
export function selectDpartment(file) {
  return request({
    url: "/uc/department/list/parent/" + file.companyId,
    method: "get"
  });
}
