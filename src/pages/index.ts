import { lazy } from 'react'
const Center = lazy(() => import('./center'))
const Login = lazy(() => import('./login'))
const Record = lazy(() => import('./record'))
const Hello = lazy(() => import('./hello'))
const RoomPage = lazy(() => import('./sys/room'))
const UserPage = lazy(() => import('./sys/user'))

const Request = lazy(() => import('./request'))
export { Center, Login, Record, Hello, RoomPage, UserPage, Request }
