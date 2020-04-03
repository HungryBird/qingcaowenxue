import request from '@/utils/request'

export function withdrawsList(params) {
  return request({
    url: '/withdraws/list',
    method: 'get',
    params
  })
}

export function withdrawsAdd(data) {
  return request({
    url: '/withdraws/add',
    method: 'post',
    data
  })
}

export function withdrawsUpdate(data) {
  return request({
    url: '/withdraws/update',
    method: 'post',
    data
  })
}

export function withdrawsDelete(params) {
  return request({
    url: '/withdraws/delete',
    method: 'get',
    params
  })
}

export function withdrawDetail(params) {
  return request({
    url: '/withdraws/detailed_list',
    method: 'get',
    params
  })
}
