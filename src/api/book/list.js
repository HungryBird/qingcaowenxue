import request from '@/utils/request'

export function bookList(data) {
  return request({
    url: '/book/list',
    method: 'post',
    data
  })
}

export function bookDelete(data) {
  return request({
    url: '/book/delete',
    method: 'post',
    data
  })
}
