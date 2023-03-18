import { lazy } from 'react'
const Center = lazy(() => import('./center'))
const Login = lazy(() => import('./login'))
const Record = lazy(() => import('./reserve/record'))
const Judge = lazy(() => import('./reserve/judge'))
const Practice = lazy(() => import('./register/practice'))
const Safe = lazy(() => import('./register/safe'))
const Hello = lazy(() => import('./hello'))
const RoomPage = lazy(() => import('./sys/room'))
const UserPage = lazy(() => import('./sys/user'))
const Request = lazy(() => import('./request'))
export {
  Center,
  Login,
  Record,
  Hello,
  RoomPage,
  UserPage,
  Request,
  Judge,
  Practice,
  Safe,
}
