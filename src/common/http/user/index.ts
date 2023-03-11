import { http } from '@/common/http'

interface updatePower {
  username: string
  userPower: string
}
interface updateUser {
  username: string
  name: string
  phone: string
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

export function getOwn() {
  return http.request({
    url: '/getOwn',
    method: 'GET',
  })
}

export function cancelRecord(data: { id: string }) {
  return http.request({
    url: '/cancelRecord',
    method: 'POST',
    data,
  })
}

export function failReserve(data: { id: string; reason: string }) {
  return http.request({
    url: '/failReserve',
    method: 'POST',
    data,
  })
}

export function successReserve(data: { id: string }) {
  return http.request({
    url: '/successReserve',
    method: 'POST',
    data,
  })
}

export function updateUser(data: updateUser) {
  return http.request({
    url: '/updateUser',
    method: 'POST',
    data,
  })
}

export function updateSecret(data: { password: string }) {
  return http.request({
    url: '/updateSecret',
    method: 'POST',
    data,
  })
}

export function updateSafe(data: any) {
  return http.request({
    url: '/updateSafe',
    method: 'POST',
    data,
  })
}

export function deleteSafe(data: any) {
  return http.request({
    url: '/deleteSafe',
    method: 'POST',
    data,
  })
}

export function getSafe(data: { className: string; courseName: string }) {
  return http.request({
    url: '/getSafe',
    method: 'POST',
    data,
  })
}
