import request from '@/utils/request'

export function categoryList(data) {
  return request({
    url: '/category/list',
    method: 'post',
    data
  })
}

export function categoryUpdate(data) {
  return request({
    url: '/category/update',
    method: 'post',
    data
  })
}

export function categoryDelete(params) {
  return request({
    url: '/category/delete',
    method: 'get',
    params
  })
}

export function categoryAdd(data) {
  return request({
    url: '/category/add',
    method: 'post',
    data
  })
}

export function categoryListAll(params) {
  return request({
    url: '/category/listall',
    method: 'get',
    params
  })
}
