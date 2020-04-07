import request from '@/utils/request'

export function adminList(query) {
  return request({
    url: '/admin/list_agent',
    method: 'get',
    params: query
  })
}

export function agentAdd(data) {
  return request({
    url: '/agent/add',
    method: 'post',
    data
  })
}

export function add_agent(data) {
  return request({
    url: '/admin/add_agent',
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
    url: '/admin/update_agent',
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
