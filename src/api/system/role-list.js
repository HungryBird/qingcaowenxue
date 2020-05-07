import request from '@/utils/request'

// 获取列表
export function roleList(params) {
  return request({
    url: '/auth_group/list',
    method: 'get',
    params
  })
}
//删除
export function delList(params) {
  return request({
    url: '/auth_group/delete',
    method: 'get',
    params
  })
}
// 新增
export function addList(data) {
  return request({
    url: '/auth_group/add',
    method: 'post',
    params:data
  })
}

//编辑
export function editorList(data) {
  return request({
    url: '/auth_group/update',
    method: 'post',
    params:data
  })
}

//获取角色权限
export function roleRightList(params) {
  return request({
    url: '/auth_group/getRules',
    method: 'get',
    params
  })
}
//设置权限分配
export function setRoleRightList(data) {
  return request({
    url: '/auth_group/addrule',
    method: 'post',
    params:data
  })
}