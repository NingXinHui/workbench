// 仓库管理API


import request from "@/utils/request";

// 分页查询所有数据-左边树
export function searchManagerApi (query) {
  return request({
    url: '/st/store-library/list',
    method: "get",
    params: query
  });
}
// 分页查询所有数据-右边表格
export function searchManagerLibraryApi (query) {
  return request({
    url: '/st/storeLocation/list',
    method: "get",
    params: query
  });
}

// 新增地区
export function addManagerAreaApi (file) {
  return request({
    url: "/st/store-district/add",
    method: "post",
    data: file
  });
}

// 新增仓
export function addWarehouseApi (file) {
  return request({
    url: "/st/store-warehouse/add",
    method: "post",
    data: file
  });
}

// 新增库
export function addWareLibraryApi (file) {
  return request({
    url: "/st/store-library/add",
    method: "post",
    data: file
  });
}

//新增仓位表
export function addStoreLocationApi (file) {
  return request({
    url: "/st/storeLocation/add",
    method: "post",
    data: file
  });
}

//所属库
export function searchStoreLibraryApi (query) {
  return request({
    url: '/st/store-library/list-by-name',
    method: "get",
    params: query
  });
}

// 编辑仓库地区表
export function editStoreDistrictApi (file) {
  return request({
    url: "/st/store-district/update",
    method: "put",
    data: file
  });
}

// 编辑仓表
export function editWareHouseApi (file) {
  return request({
    url: "/st/store-warehouse/update",
    method: "put",
    data: file
  });
}

// 编辑库表
export function editStoreLibraryApi (file) {
  return request({
    url: "/st/store-library/update",
    method: "put",
    data: file
  });
}


// 编辑仓位表
export function editStoreLocationApi (file) {
  return request({
    url: "/st/storeLocation/update",
    method: "put",
    data: file
  });
}

// 删除地区表
export function deleteStoreDistrictApi (queryId) {
  return request({
    method: "delete",
    url: `/st/store-district/delete/${queryId}`
  });
}


// 删除仓表
export function deleteWareHouseApi (queryId) {
  return request({
    method: "delete",
    url: `/st/store-warehouse/delete/${queryId}`
  });
}

// 删除库表
export function deleteStoreLibraryApi (queryId) {
  return request({
    method: "delete",
    url: `/st/store-library/${queryId}`
  });
}

// 删除仓位表
export function deleteStoreLibararyApi (queryId) {
  return request({
    method: "delete",
    url: `/st/storeLocation/${queryId}`
  });
}


// 删除仓库表
export function deleteLibararyApi (params) {
  return request({
    method: "delete",
    url: `/st/store-library/delete-by-level-and-id`,
    data: params
  });
}



// // 新增出入库类型数据
// export function addStockTypeApi (file) {
//   return request({
//     url: "/st/in-out-type/add",
//     method: "post",
//     data: file
//   });
// }

// //批量删除出入库类型数据
// export function deleteStockTypeApi (queryId) {
//   return request({
//     method: "delete",
//     url: `/st/in-out-type/delete/batch/${queryId}`
//   });
// }

// // 通过主键查询单条数据
// export function searchStockTypeApi (query) {
//   return request({
//     url: `/st/in-out-type/get/${query}`,
//     method: "get"
//   });
// }

// // 分页查询所有数据
// export function searchStockTypeListApi (query) {
//   return request({
//     url: '/st/in-out-type/list',
//     method: "get",
//     params: query
//   });
// }

// // 修改出入库类型数据
// export function stockTypeUpdateApi (query) {
//   return request({
//     method: "put",
//     url: "/st/in-out-type/update",
//     data: query
//   });
// }

// 删除右侧的仓位 
export function deletestoreLocation (params) {
  return request({
    method: "delete",
    url: `/st/storeLocation/delete/batch`,
    params: params
  });
}