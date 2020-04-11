import request from '@/utils/request'

export function adList(params) {
  return request({
    url: '/ad/list',
    method: 'get',
    params
  })
}

export function adAdd(data) {
  return request({
    url: '/ad/add',
    method: 'post',
    data
  })
}

export function adUpdate(data) {
  return request({
    url: '/ad/update',
    method: 'post',
    data
  })
}

export function adDelete(params) {
  return request({
    url: '/ad/delete',
    method: 'get',
    params
  })
}
