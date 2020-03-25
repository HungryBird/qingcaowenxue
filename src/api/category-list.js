import request from '@/utils/request'

export function categoryList() {
  return request({
    url: '/category/list',
    method: 'post'
  })
}
