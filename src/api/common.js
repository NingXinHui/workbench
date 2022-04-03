
import request from '@/utils/request'

// 上传方法
export function uploadUrl(file) {
    return request({
        url: '/trade-sm/sys/oss/uploadFile',
        method: 'post',
        data: file
    })
}
// 行政区划懒加载
export function areas(query) {
    return request({
        url: '/trade-sm/sm/frameworkregion/select',
        method: 'get',
        params: query
    })
}
//获取省
export function getProvinceList(query) {
  return request({
    url: "/sm/address/list-province",
    method: "get",
    params: query
  });
}
//获取市
export function getCityList(query) {
  return request({
    url: "/sm/address/list-city",
    method: "get",
    params: query
  });
}
//获取区
export function getAreaList(query) {
  return request({
    url: "/sm/address/list-area",
    method: "get",
    params: query
  });
}
//获取街道
export function getTownList(query) {
  return request({
    url: "/sm/address/list-town",
    method: "get",
    params: query
  });
}
//获取所有国家
export function getCountryList(query) {
  return request({
    url: "/sm/address/list-country",
    method: "get",
    params: query
  });
}

// 文件的删除 
export function deleteMenuFileToId(file) {
  return request({
    url: "/sm/file/delete",
    method: "delete",
    params: file
  });
}

// 通用列
export function user_page_config(file) {
  return request({
    url: "/sm/page-config/get",
    method: "get",
    params: file
  });
}
export function user_page_config_save(params) {
  return request({
      url: '/sm/page-config/add',
      method: 'post',
      data: params
  })
}


// 根据idlist获取所有的文件 
export function fileListAll(file) {
  return request({
    url: "/sm/file/list",
    method: "get",
    params: file
  });
}

// 文件的上传 
export function uploadFileTanKuang(params) {
  return request({
      url: '/sm/file/uploadFile',
      method: 'post',
      data: params
  })
}
// 获取附件列表
export function fileListBill(file) {
  return request({
    url: "/sm/file/list/bill",
    method: "get",
    params: file
  });
}