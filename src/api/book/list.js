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
