import request from '@/utils/request'

export function recommendList() {
  return request({
    url: '/recommend/list', // 假地址 自行替换
    method: 'post'
  })
}
