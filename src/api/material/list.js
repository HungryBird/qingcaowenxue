import request from '@/utils/request'

export function materialList(params) {
  return request({
    url: '/material/list',
    method: 'get',
    params
  })
}
