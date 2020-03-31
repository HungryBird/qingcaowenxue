import request from '@/utils/request'

export function wechatList(data) {
  return request({
    url: '/agent/wechat/list',
    method: 'get',
    data
  })
}

export function fetchList(query) {
  return request({
    url: '/agent/wechat/list',
    method: 'get',
    params: query
  })
}

export function wechatAdd(data) {
  return request({
    url: '/agent/wechat/add',
    method: 'post',
    // method: 'get',
    data
  })
}

export function shanchu(id) {
  return request({
    url: '/agent/wechat/delete',
    method: 'delete',
    params: { id }
  })
}

export function wechatUpdate(data) {
  return request({
    url: '/agent/wechat/update',
    method: 'post',
    data
  })
}

export function zizhanghaohuoqv(data) {
  return request({
    url: '/agent/admin/list',
    method: 'get',
    params: data
  })
}
