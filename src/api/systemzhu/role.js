import request from "@/utils/request";

// 新增
export function addRole(file) {
  return request({
    url: "/uc/role/add",
    method: "post",
    data: file
  });
}
//修改
export function updateRole(file) {
  return request({
    url: "/uc/role/update",
    method: "put",
    data: file
  });
}
//查询列表
export function roleList(file) {
  return request({
    url: "/uc/role/list",
    method: "get",
    params: file
  });
}
//查询详情
export function searchRole(file) {
  return request({
    url: "/uc/role/get/" + file.id,
    method: "get",
  });
}
//删除接口
export function deleteRole(file) {
  return request({
    url: "/uc/role/delete/"+ file.id,
    method: "delete",
  });
}
//查询企业
export function selectCompany(file) {
  return request({
    url: "/uc/company/list/select",
    method: "get",
    params: {
      ...file,
      current: file.pageNo,
      size:file.pageSize,
    }
  });
}
