import request from "@/utils/request";

//查询列表
export function getCompanyList(file) {
  return request({
    url: "/uc/company/list",
    method: "get",
    params: file
  });
}
//新增
export function addCompany(file) {
  return request({
    url: "/uc/company/add",
    method: "post",
    data: file
  });
}
//修改
export function updateCompany(file) {
  return request({
    url: "/uc/company/update",
    method: "put",
    data: file
  });
}
//删除
export function deleteCompany(file) {
  return request({
    url: "/uc/company/delete/" + file.id,
    method: "delete",
  });
}
//查看详情
export function getCompanyDetail(file) {
  return request({
    url: "/uc/company/get/" + file.id,
    method: "get"
  });
}
