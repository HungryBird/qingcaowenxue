import request from '@/utils/request'

export function wechatList(params) {
  return request({
    url: '/wechat/list',
    method: 'get',
    params
  })
}

export function wechatDelete(params) {
  return request({
    url: '/wechat/delete',
    method: 'get',
    params
  })
}

export function wechatAdd(data) {
  return request({
    url: '/wechat/add',
    method: 'post',
    data
  })
}

export function wechatUpdate(data) {
  return request({
    url: '/wechat/update',
    method: 'post',
    data
  })
}
