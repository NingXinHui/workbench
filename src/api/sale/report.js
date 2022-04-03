import request from "@/utils/request";

//佣金统计报表
//查询列表
export function commissionList(file) {
  return request({
    url: "/sd/commission-statistics/list",
    method: "get",
    params: file
  });
}
//结清
export function settleCommission(file) {
  return request({
    url: "/sd/commission-statistics/update/settle",
    method: "put",
    params: file
  });
}
