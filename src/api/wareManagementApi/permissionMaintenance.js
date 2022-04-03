// 仓库权限维护
import request from "@/utils/request";


// 分页查询所有数据
export function searchJurisdictionListApi (query) {
  return request({
    url: '/st/manager/list',
    method: "get",
    params: query
  });
}

// 新增出入库类型数据
export function addJurisdictionApi (file) {
  return request({
    url: "/st/manager/add",
    method: "post",
    data: file
  });
}

//批量删除出入库类型数据
export function deleteJurisdictionApi (queryId) {
  return request({
    method: "delete",
    url: `/st/manager/delete/batch`,
    data: queryId
  });
}

// 通过主键查询单条数据
export function searchJurisdictionApi (query) {
  return request({
    url: `/st/in-out-type/get/${query}`,
    method: "get"
  });
}

// 修改出入库类型数据
export function jurisdictionUpdateApi (query) {
  return request({
    method: "put",
    url: "/st/manager/update",
    data: query
  });
}

// 下拉-模糊查询数据最多50条
export function storeWarehouseApi (query) {
  return request({
    url: "/st/store-warehouse/list-by-name",
    method: "get",
    params: { ...query, current: query.pageNo, size: query.pageSize }
  });
}

// 下拉-模糊查询数据最多50条
export function searchUserApi (query) {
  return request({
    url: "/uc/user/list-by-position",
    method: "get",
    params: { ...query, current: query.pageNo, size: query.pageSize }
  });
}

// 下拉-模糊查询数据最多50条 -仓库地区表
export function searchDistrictApi (query) {
  return request({
    url: "/st/store-district/list-by-name",
    method: "get",
    params: { ...query, current: query.pageNo, size: query.pageSize }
  });
}
