import request from '@/utils/request'

export function recommendList(data) {
  return request({
    url: '/recommend/list',
    method: 'post',
    data
  })
}

export function recommendDelete(params) {
  return request({
    url: '/recommend/delete',
    method: 'post',
    params
  })
}

export function recommendAdd(data) {
  return request({
    url: '/recommend/add',
    method: 'post',
    data
  })
}

export function recommendAddBooks(data) {
  return request({
    url: '/recommend/addbooks',
    method: 'post',
    data
  })
}

export function recommendUpdate(data) {
  return request({
    url: '/recommend/update',
    method: 'post',
    data
  })
}

export function getBooks(data) {
  return request({
    url: '/recommend/getbooks',
    method: 'post',
    data
  })
}

export function addBooks(data) {
  return request({
    url: '/recommend/addbooks',
    method: 'post',
    data
  })
}

export function delBooks(data) {
  return request({
    url: '/recommend/delbooks',
    method: 'post',
    data
  })
}
