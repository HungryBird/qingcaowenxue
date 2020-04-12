import request from '@/utils/request'

export function rankList(params) {
  return request({
    url: '/rank/list',
    method: 'get',
    params
  })
}

export function rankDelete(params) {
  return request({
    url: '/rank/delete',
    method: 'post',
    params
  })
}

export function rankAdd(data) {
  return request({
    url: '/rank/add',
    method: 'post',
    data
  })
}

export function rankUpdate(data) {
  return request({
    url: '/rank/update',
    method: 'post',
    data
  })
}

export function rankAddbooks(data) {
  return request({
    url: '/rank/addbooks',
    method: 'post',
    data
  })
}

export function rankDelbooks(params) {
  return request({
    url: '/rank/delbooks',
    method: 'get',
    params
  })
}

export function getBooks(data) {
  return request({
    url: '/rank/getbooks',
    method: 'post',
    data
  })
}

export function delBooks(data) {
  return request({
    url: '/rank/delbooks',
    method: 'post',
    data
  })
}

