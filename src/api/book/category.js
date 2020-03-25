import request from '@/utils/request'

export function categoryList(data) {
  return request({
    url: '/category/list',
    method: 'post',
    data
  })
}
