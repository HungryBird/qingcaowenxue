import request from '@/utils/request'

export function adminList(query) {
  return request({
    url: '/admin/list',
    method: 'get',
    params: query
  })
}
