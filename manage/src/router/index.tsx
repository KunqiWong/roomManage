import { Suspense } from 'react'
import { Login, Center } from '../pages'
import routerConfig from './config'
export const RouteIds = {
  home: 'home',
  request: 'request',
  sys: 'sys',
  room: 'room',
  user: 'user',
  reserve: 'reserve',
  judge: 'judge',
  record: 'record',
  table: 'table',
  practice: 'practice',
  safe: 'safe',
}

export const routesStructData = [
  {
    id: RouteIds.home,
  },
  {
    id: RouteIds.request,
  },
  {
    id: RouteIds.table,
    children: [{ id: RouteIds.practice }, { id: RouteIds.safe }],
  },
  {
    id: RouteIds.sys,
    children: [{ id: RouteIds.user }, { id: RouteIds.room }],
  },
  {
    id: RouteIds.reserve,
    children: [{ id: RouteIds.judge }, { id: RouteIds.record }],
  },
]

const processRoute = (children: any[], routesData: any[], prefix: string) => {
  routesData.forEach((routeItem, index) => {
    const { id } = routeItem
    if (permissions.includes(id)) {
      let routeData = routerConfig[id]
      // 沿途记录，然后拼接成path
      routeData.path = prefix + '/' + id
      routeData.routeId = id
      const { component: Component } = routeData
      if (Component) {
        routeData.element = (
          <Suspense>
            <Component></Component>
          </Suspense>
        )
      }
      children!.push(routeData)
      if (routeItem.children!?.length > 0) {
        routeData.children = []
        processRoute(routeData.children, routeItem.children!, routeData.path)
      }
    }
  })
}

// 中心路由
export let centerRouteDta = {
  id: RouteIds.home,
  name: '中心',
  path: '/center',
  element: (
    <Suspense>
      <Center></Center>
    </Suspense>
  ),
  children: [],
}

export let routeData = [
  {
    name: '登陆页',
    path: '/',
    element: <Login></Login>,
  },
  centerRouteDta,
]
let permissions = []
export const createRouteData = (per) => {
  let result = []
  permissions = per
  processRoute(result, routesStructData, '/center')
  // centerRouteDta.children = []
  centerRouteDta.children = result
  return routeData
}

export default routeData
