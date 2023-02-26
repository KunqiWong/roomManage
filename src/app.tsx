import {
  RouterProvider,
  createBrowserRouter,
  useNavigate,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom'
import { useEffect } from 'react'
import { useState } from 'react'
import { globalStore, room } from '@/stores/index'
import { createRouteData, routeData } from '@/router/index'
import { observer } from 'mobx-react'
import Login from './pages/login'
import Center from './pages/center'

export default observer(() => {
  const [routerData, setRouter] = useState<any>()
  const navigate = useNavigate()
  const location = useLocation()
  const token = sessionStorage.getItem('ACCESS_TOKEN')

  window.addEventListener('beforeunload', () => {
    sessionStorage.setItem(
      'userData',
      JSON.stringify({
        tabsHistory: globalStore.tabsHistory,
        username: globalStore.username,
      })
    )
    sessionStorage.setItem(
      'roomData',
      JSON.stringify({
        room: room.roomData,
      })
    )
    if (location.pathname == '/') {
      sessionStorage.removeItem('userData')
      sessionStorage.removeItem('roomData')
    }
  })

  // 路由守卫
  useEffect(() => {
    if (!globalStore.token && !token) navigate('/')
  }, [location.pathname])

  useEffect(() => {
    globalStore.init()
    room.init()

    if (globalStore.token || token) {
      sessionStorage.setItem('ACCESS_TOKEN', globalStore.token || token)
      const toStart = (data) => {
        let temp = createRouteData(data)
        setRouter(temp)
        globalStore.setRouterData(temp)
        globalStore.setPermissions(data)
      }
      let per = JSON.parse(sessionStorage.getItem('PERMISSIONS'))?.PERMISSIONS

      if (!Array.isArray(per)) {
        globalStore
          .getPermissions()
          .then((res) => {
            const { userPower } = res.data
            sessionStorage.setItem(
              'PERMISSIONS',
              JSON.stringify({ PERMISSIONS: userPower })
            )
            toStart(userPower)
          })
          .finally(() => {
            navigate('/center/home')
          })
      } else {
        toStart(per)
      }
    } else {
      navigate('/')
      setRouter(routeData)
      globalStore.setRouterData(routeData)
    }
  }, [token, globalStore.token])

  const toRenderRoute = (item) => {
    const { children } = item
    let arr = []
    if (children) {
      arr = children.map((item) => {
        return toRenderRoute(item)
      })
    }
    return (
      <Route
        children={arr}
        key={item.path}
        path={item.path}
        element={item.element}></Route>
    )
  }

  return (
    <>
      {routerData && (
        <Routes>
          <Route path="/" element={<Login></Login>}></Route>
          <Route
            path="/center"
            element={<Center></Center>}
            children={routerData?.[1]?.children?.map((item) => {
              return toRenderRoute(item)
            })}></Route>
        </Routes>
      )}
    </>
  )
})
