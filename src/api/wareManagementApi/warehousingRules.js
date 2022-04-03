import request from "@/utils/request";
//仓储费规则
// 分页查询所有数据
export function searchstoreFeeRuleList(query) {
  return request({
    url: "/st/storeFeeRule/list",
    method: "get",
    params: query
  });
}
//新增
export function addStoreFeeRule(query) {
  return request({
    url: "/st/storeFeeRule/add",
    method: "post",
    data: query
  });
}
//修改
export function updateStoreFeeRule(query) {
  return request({
    url: "/st/storeFeeRule/update",
    method: "put",
    data: query
  });
}
//查看
export function getStoreFeeRuleDetail(query) {
  return request({
    url: "/st/storeFeeRule/get/" + query.id,
    method: "get"
  });
}
