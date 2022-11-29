import request from '@/utils/request'

// 路由接口配置
export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

// 用refresh_token去刷新access_token
export function checkRefreshToken() {
  return request({
    url: '/refresh_token',
    method: 'get'
  })
}

export function getInfo() {
  return request({
    url: '/getInfo',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/admin/acl/index/logout',
    method: 'post'
  })
}
