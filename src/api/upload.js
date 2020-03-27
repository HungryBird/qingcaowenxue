import request from '@/utils/request'

export function upload_picture() {
  return request({
    url: '/common/upload_picture',
    method: 'post'
  })
}
