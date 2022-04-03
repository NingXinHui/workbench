
import request from '@/utils/request'

// 数据格式
const headers = { 'Content-Type': 'application/x-www-form-urlencoded' }

// 请求头添加 Authorization: Basic client_id:client_secret
const auth = { 
    username: 'erp', // client_id
    password: '123456' // client_secret
}

// 登录，获取 token 接口
export function login(data) {
  // Promise 
  return request({
    headers,
    auth,
    url: `/auth/login`,
    method: 'post',
    params: data
  })
}

// 退出系统
export function logout(accessToken) {
  return request({
    url: `/auth/logout`, 
    method: 'get',
    params: {
      accessToken
    }
  })
}

// 刷新令牌获取新的认证信息
export function refreshToken (refreshToken) {
  return request({
      headers,
      auth,
      url: '/auth/refresh-token',
      method: 'get',
      params: {
        refreshToken
      }
  })
}