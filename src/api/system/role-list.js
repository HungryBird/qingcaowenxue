import request from '@/utils/request'

// 获取列表
export function roleList(params) {
  return request({
    url: '/auth_group/list',
    method: 'get',
    params
  })
}