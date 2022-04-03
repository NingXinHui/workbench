import request from "@/utils/request";

//待改价任务
// 列表
export function changePriceTask(file) {
  return request({
    url: "/po/change-price-task/list",
    method: "get",
    params: file
  });
}
