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

export function chapterList(data) {
  return request({
    url: '/chapter/list',
    method: 'post',
    data
  })
}

export function chapterContent(data) {
  return request({
    url: '/chapter/content',
    method: 'post',
    data
  })
}

export function setcost(data) {
  return request({
    url: '/chapter/setcost',
    method: 'post',
    data
  })
}

export function setfree(data) {
  return request({
    url: '/chapter/setfree',
    method: 'post',
    data
  })
}

export function sectionDelete(data) {
  return request({
    url: '/chapter/sectionDelete',
    method: 'post',
    data
  })
}

export function clearRead(data) {
  return request({
    url: '/chapter/clearRead',
    method: 'post',
    data
  })
}

export function importChapter(data) {
  return request({
    url: '/chapter/importChapter',
    method: 'post',
    data
  })
}

export function chapterAdd(data) {
  return request({
    url: '/chapter/add',
    method: 'post',
    data
  })
}

export function chapterUpdate(data) {
  return request({
    url: '/chapter/update',
    method: 'post',
    data
  })
}

export function bookAdd(data) {
  return request({
    url: '/book/add',
    method: 'post',
    data
  })
}

export function chapterDelete(params) {
  return request({
    url: '/chapter/delete',
    method: 'get',
    params
  })
}

export function bookUpdate(data) {
  return request({
    url: '/book/update',
    method: 'post',
    data
  })
}

export function chapterAllId(params) {
  return request({
    url: '/chapter/all_id',
    method: 'get',
    params
  })
}

// 获取上一章下一章
export function getNextChapter(data) {
  return request({
    url: '/chapter/info',
    method: 'post',
    params: data
  })
}

// 获取过滤管理列表
export function getFiltrationList(data) {
  return request({
    url: '/filter/list',
    method: 'get',
    params: data
  })
}

// 过滤管理列表编辑接口
export function editorFiltrationList(data) {
  return request({
    url: '/filter/update',
    method: 'post',
    params: data
  })
}

// 过滤管理列表删除接口
export function delFiltrationList(data) {
  return request({
    url: '/filter/delete',
    method: 'post',
    params: data
  })
}

// 过滤管理列表新增接口
export function addFiltrationList(data) {
  return request({
    url: '/filter/add',
    method: 'post',
    params: data
  })
}
