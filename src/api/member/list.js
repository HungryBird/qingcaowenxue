import request from '@/utils/request'

export function memberList(params) {
  return request({
    url: '/member/list',
    method: 'get',
    params
  })
}

export function memberDelete(params) {
  return request({
    url: '/member/delete',
    method: 'get',
    params
  })
}
