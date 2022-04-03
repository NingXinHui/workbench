import request from "@/utils/request";


//采购合同条款管理
// 新增
export function addContract(file) {
  return request({
    url: "/po/contract-terms/add",
    method: "post",
    data: file
  });
}
//通过id查询
export function searchContract(file) {
  return request({
    url: "/po/contract-terms/get/" + file.id,
    method: "get",
  });
}
//查询列表
export function contractList(file) {
  return request({
    url: "/po/contract-terms/list",
    method: "get",
    params:file,
  });
}
//修改
export function updateContract(file) {
  return request({
    url: "/po/contract-terms/update",
    method: "put",
    data: file
  });
}
//删除采购合同
export function delContract(file) {
  return request({
    url: "/po/contract-terms/delete/"+ file.id,
    method: "delete",
  });
}


//采购类型维护
// 新增类型
export function addPurchaseType(file) {
  return request({
    url: "/po/purchase-type/add",
    method: "post",
    data: file
  });
}
//通过id查询
export function searchPurchaseType(file) {
  return request({
    url: "/po/purchase-type/get/" + file.id,
    method: "get"
  });
}
//查询列表
export function purchaseTypeList(file) {
  return request({
    url: "/po/purchase-type/list",
    method: "get",
    params: file
  });
}
//修改
export function updatePurchaseType(file) {
  return request({
    url: "/po/purchase-type/update",
    method: "put",
    data: file
  });
}
//删除采购合同
export function delPurchaseType(file) {
  return request({
    url: "/po/purchase-type/delete/" + file.id,
    method: "delete"
  });
}
//获取采购业务员
export function getPersonList(file) {
  return request({
    url: "/uc/user/list-by-position",
    method: "get",
    params: {
      ...file,
      current: file.pageNo,
      size: file.pageSize
    }
  });
}
