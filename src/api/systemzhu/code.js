import request from "@/utils/request";

//查询列表
export function getoFrmulaList(file) {
  return request({
    url: "/sm/bill-formula/list",
    method: "get",
    params: { ...file, current: file.pageNo, size: file.pageSize }
  });
}
//测试编码规则
export function generatorTest(file) {
  return request({
    url: "/sm/bill-formula/generator-test",
    method: "post",
    data: file
  });
}
//设置编码规则
export function updateFormula(file) {
  return request({
    url: "/sm/bill-formula/update",
    method: "put",
    data: file
  });
}
