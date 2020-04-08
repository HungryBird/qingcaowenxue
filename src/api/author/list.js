import request from '@/utils/request'

export function authorList(params) {
  return request({
    url: '/author/list',
    method: 'get',
    params
  })
}
