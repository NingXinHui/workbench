import request from '@/utils/request'

import { getToken } from '@/utils/auth'


// 数据格式
const headers = { 'Content-Type': 'application/x-www-form-urlencoded' }

// 请求头添加 Authorization: Basic client_id:client_secret
const auth = { 
    username: 'erp', // client_id
    password: '123456' // client_secret
}


// 登录方法
// export function login(account, password, grantType,tenantId, uniqueCode) {
//   return request({
//     url: '/trade-auth/token',
//     method: 'post',
//     data: { account, password, grantType, tenantId,tenantCode:uniqueCode }
//   })
// }

// 大药的登录 
export function login(account, password, grantType,tenantId, uniqueCode){
  // Promise 
 
  return request({
    headers,
    auth,
    url: `/auth/login`,
    method: 'post',
    params: {username:account,password}
  })
}

// 刷新方法
export function refreshToken() {
  return request({
    url: '/trade-auth/refresh',
    method: 'post'
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: "/system/tenant/detail",
    method: 'get'
  })
}

// 退出方法
export function logout() {
  return request({
    url: `/auth/logout?accessToken=${getToken()}`,
    method: 'get'
  })
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: '/trade-auth/captcha',
    method: 'get'
  })
}
