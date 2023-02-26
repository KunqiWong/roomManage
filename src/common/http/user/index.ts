import { http } from '@/common/http'

interface updatePower {
  username: string
  userPower: string[]
}
interface loginParamsT {
  username: string
  password: string
}

export function login(params: loginParamsT) {
  return http.request({
    url: '/login',
    method: 'POST',
    data: params,
  })
}
export function updatePermissions(data: updatePower) {
  return http.request({
    url: '/users/updatePermissions',
    method: 'POST',
    data,
  })
}
//获得权限
export function getPermissions() {
  return http.request({
    url: '/users/getPermissions',
    method: 'GET',
  })
}
export function getUsers() {
  return http.request({
    url: '/getUser',
    method: 'GET',
  })
}

export function searchUser(data: string) {
  return http.request({
    url: '/searchUser',
    method: 'POST',
    data,
  })
}

export function deleteUser(data: { id: string }) {
  return http.request({
    url: '/deleteUser',
    method: 'POST',
    data,
  })
}
