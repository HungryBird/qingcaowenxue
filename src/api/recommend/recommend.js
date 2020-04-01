import request from '@/utils/request'

export function recommendList(data) {
  return request({
    url: '/recommend/list',
    method: 'post',
    data
  })
}

export function recommendDelete(params) {
  return request({
    url: '/recommend/list', // 假地址 自行替换
    method: 'post',
    params
  })
}

export function recommendAdd(data) {
  return request({
    url: '/recommend/add', // 假地址 自行替换
    method: 'post',
    data
  })
}

export function recommendUpdate(data) {
  return request({
    url: '/recommend/update', // 假地址 自行替换
    method: 'post',
    data
  })
}
