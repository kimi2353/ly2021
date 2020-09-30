import request from '@/utils/request2'

export function changeHaiChannel (data) {
  return request({
    url: '/changeHaiChannel',
    method: 'post',
    data
  })
}
