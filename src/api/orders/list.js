import request from '@/utils/request'

export function rechargeList(query) {
  return request({
    url: '/recharge/list',
    method: 'get',
    params: query
  })
}
