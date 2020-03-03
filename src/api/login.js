import request from '@/utils/request'

export function checkclass (data) {
  return request({
    url: '/checkclass',
    method: 'post',
    data
  })
}

export function submit (data) {
  return request({
    url: '/submit',
    method: 'post',
    data
  })
}

export function uptoken (data) {
  return request({
    url: '/uptoken',
    method: 'post',
    data
  })
}

export function imgUpLoad (data) {
  return request({
    url: '/imgUpLoad',
    method: 'post',
    data
  })
}

export function checkTaskInfo (data) {
  return request({
    url: '/checkTaskInfo',
    method: 'post',
    data
  })
}

export function classinfo (data) {
  return request({
    url: '/classinfo',
    method: 'post',
    data
  })
}

export function userinfo (data) {
  return request({
    url: '/userinfo',
    method: 'post',
    data
  })
}

export function videoUp (data) {
  return request({
    url: '/videoUp',
    method: 'post',
    data
  })
}

export function submitHai (data) {
  return request({
    url: '/submitHai',
    method: 'post',
    data
  })
}

export function copySys (data) {
  return request({
    url: '/copySys',
    method: 'post',
    data
  })
}
