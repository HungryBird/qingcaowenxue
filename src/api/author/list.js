import request from '@/utils/request'

export function authorList(params) {
  return request({
    url: '/author/list',
    method: 'get',
    params
  })
}

export function authorAdd(params) {
  return request({
    url: '/author/add',
    method: 'post',
    params
  })
}

export function authorUpdate(params) {
  return request({
    url: '/author/update',
    method: 'post',
    params
  })
}

export function authorDelete(params) {
  return request({
    url: '/author/delete',
    method: 'get',
    params
  })
}
