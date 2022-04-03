import request from '@/utils/request'

// 获取路由
export const getRouters = (query) => {
  return request({
    url: '/uc/menu/tree',
    method: 'get',
    params: query
  })
}


export const roleGetMame = () => {
  return request({
    url: 'uc/role/get/name',
    method: 'get',
  })
}


// 获取所有的公司下拉数据
export const companyListSelect = (userId) => {
  return request({
    url: `/uc/department/list/select/company/${userId}`,
    method: "get"
  });
}
