import { http } from '@/common/http'

interface updateRoom {
  id: string
  roomName: string
  count: string
  remarks: string
}

interface record {
  week: number
  weekDate: number
}

export function updateRoom(data: updateRoom) {
  return http.request({
    url: '/updateRoom',
    method: 'POST',
    data,
  })
}

export function deleteRoom(data: { id: string }) {
  return http.request({
    url: '/deleteRoom',
    method: 'POST',
    data,
  })
}
//获取机房信息
export function getRoom() {
  return http.request({
    url: '/getRoom',
    method: 'GET',
  })
}

export function searchRoom(data: string) {
  return http.request({
    url: '/searchRoom',
    method: 'POST',
    data,
  })
}

export function getRecord(data: record) {
  return http.request({
    url: '/getRecord',
    method: 'POST',
    data,
  })
}
