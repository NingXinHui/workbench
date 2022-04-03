import request from "@/utils/request";

//销售合同条款管理
// 新增
export function addContract(file) {
  return request({
    url: "/sd/contract-terms/add",
    method: "post",
    data: file
  });
}
//通过id查询
export function searchContract(file) {
  return request({
    url: "/sd/contract-terms/get/" + file.id,
    method: "get"
  });
}
//查询列表
export function contractList(file) {
  return request({
    url: "/sd/contract-terms/list",
    method: "get",
    params: file
  });
}
//修改
export function updateContract(file) {
  return request({
    url: "/sd/contract-terms/update",
    method: "put",
    data: file
  });
}
//删除采购合同
export function delContract(file) {
  return request({
    url: "/sd/contract-terms/delete/" + file.id,
    method: "delete"
  });
}


//销售类型维护
// 新增类型
export function addSalesType(file) {
  return request({
    url: "/sd/sales-type/add",
    method: "post",
    data: file
  });
}
//通过id查询
export function searchSalesType(file) {
  return request({
    url: "/sd/sales-type/get/" + file.id,
    method: "get"
  });
}
//查询列表
export function SalesTypeList(file) {
  return request({
    url: "/sd/sales-type/list",
    method: "get",
    params: file
  });
}
//修改
export function updateSalesType(file) {
  return request({
    url: "/sd/sales-type/update",
    method: "put",
    data: file
  });
}
//删除采购合同
export function delSalesType(file) {
  return request({
    url: "/sd/sales-type/delete/" + file.id,
    method: "delete"
  });
}

//计息规则
// 新增规则
export function addInterestRules(file) {
  return request({
    url: "/sd/interest-rules/add",
    method: "post",
    data: file
  });
}
//通过id查询
export function searchInterestRules(file) {
  return request({
    url: "/sd/interest-rules/get/" + file.id,
    method: "get"
  });
}
//查询列表
export function interestRulesList(file) {
  return request({
    url: "/sd/interest-rules/list",
    method: "get",
    params: { ...file },
  });
}
//修改
export function updateInterestRules(file) {
  return request({
    url: "/sd/interest-rules/update",
    method: "put",
    data: file
  });
}
//删除采购合同
export function delInterestRules(file) {
  return request({
    url: "/sd/interest-rules/delete",
    method: "delete",
    params:file
  });
}
