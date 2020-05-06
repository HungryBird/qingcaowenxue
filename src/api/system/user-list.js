import request from '@/utils/request'

// 获取列表
export function adminList(params) {
  return request({
    url: '/admin/list',
    method: 'get',
    params
  })
}
//删除
export function delList(params) {
    return request({
      url: '/admin/delete',
      method: 'get',
      params
    })
}
// 新增
export function addList(data) {
    return request({
      url: '/admin/add',
      method: 'post',
      params:data
    })
}

//编辑
export function editorList(data) {
    return request({
      url: '/admin/update',
      method: 'post',
      params:data
    })
}