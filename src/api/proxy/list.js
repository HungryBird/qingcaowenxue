import request from '@/utils/request'

export function adminList(query) {
  return request({
    url: '/agent/list',
    method: 'get',
    params: query
  })
}

export function add_agent(data) {
  return request({
    url: '/agent/add',
    method: 'post',
    data
  })
}

// 编辑获取其他数据
export function getEditOther(params) {
  return request({
    url: '/agent/info/admin_id/' + params.id,
    method: 'get'
  })
}

export function update_agent(data) {
  return request({
    url: '/agent/update',
    method: 'post',
    data
  })
}

export function agentUpdate(data) {
  return request({
    url: '/agent/update',
    method: 'post',
    data
  })
}
