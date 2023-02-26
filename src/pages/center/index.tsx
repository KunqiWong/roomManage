import { Layout, Menu } from 'antd'
import styles from './index.module.scss'
import { globalStore } from '@/stores/index'
import {
  Outlet,
  useNavigate,
  useLocation,
  type Location,
} from 'react-router-dom'
import { observer } from 'mobx-react'
import { useEffect } from 'react'
import { useState } from 'react'
import themeProviderHoc from '@/common/hocs/themeProviderHoc/index'
import Tabs from './components/tabs'
import Breadcrumb from './components/breadcrumb'
import useLocationListen from '@/common/hooks/useLocationListen'
import KeepAlive from '@/common/hocs/keepAlive'
import routerConfig from '@/router/config'
import { UserOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Dropdown, Space } from 'antd'

const { Header, Content, Sider } = Layout

const processRoute = (data, result: any) => {
  data.forEach((item) => {
    let temp: any = {
      key: item.routeId,
      icon: item.meta.icon,
      label: item.meta.title,
    }
    result.push(temp)
    if (item?.children?.length) {
      temp.children = []
      processRoute(item.children, temp.children)
    }
  })
}

const center = observer(() => {
  const navigate = useNavigate()
  const [defaultOpenKeys, setDefaultOpenKeys] = useState([])
  const [defaultSelectedKeys, setDefaultSelectedKeys] = useState([])
  const [menuData, setMenuData] = useState([])
  useLocationListen((location: Location) => {
    const { pathname } = location
    let temp = pathname.split('/').filter((item) => {
      return item
    })
    setDefaultSelectedKeys([temp.slice(-1)[0]])
    let temp2 = temp.slice(1, temp.length - 1)
    if (temp2.length) {
      setDefaultOpenKeys(temp2)
    }
    globalStore.addTabHistory(location)
  })
  const { routerData = [] } = globalStore
  // 路由监听
  useEffect(() => {
    if (routerData.length) {
      let result = []
      processRoute(routerData[1].children, result)
      setMenuData(result)
    }
  }, [routerData])

  const logOut = () => {
    sessionStorage.clear()
    globalStore.logOut()
    navigate('/')
  }

  const changeSecret = () => {}

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <a style={{ fontSize: '10px' }} onClick={changeSecret}>
          修改密码
        </a>
      ),
    },
    {
      key: '2',
      label: (
        <a style={{ fontSize: '10px' }} onClick={logOut}>
          退出登录
        </a>
      ),
    },
  ]

  return (
    <Layout className={styles.content}>
      <Header className={styles.header}>
        <div className={styles.logo}>机房预约系统</div>
        <div className={styles.right}>
          <Dropdown menu={{ items }} arrow>
            <a style={{ color: 'white' }} onClick={(e) => e.preventDefault()}>
              <UserOutlined style={{ paddingRight: '5px' }}></UserOutlined>
              <Space>{globalStore.username}</Space>
            </a>
          </Dropdown>
        </div>
      </Header>
      <Layout>
        <Sider width={260}>
          {menuData.length > 0 && (
            <Menu
              theme="dark"
              mode="inline"
              selectedKeys={defaultSelectedKeys}
              defaultOpenKeys={defaultOpenKeys}
              style={{ height: '100%', borderRight: 0 }}
              items={menuData}
              onClick={({ key }) => {
                const path = routerConfig[key]?.path
                if (path) {
                  navigate(path)
                }
              }}
            />
          )}
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Breadcrumb />
          <Content
            style={{
              margin: 0,
              minHeight: 280,
            }}>
            <Tabs></Tabs>
            <div
              style={{
                padding: 32,
                background: 'white',
              }}>
              <KeepAlive
                include={[
                  '/center/sys/user',
                  '/center/sys/room',
                  '/center/table/practice',
                  '/center/table/safe',
                  '/center/home',
                  '/center/reserve/record',
                ]}
                keys={[]}></KeepAlive>
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
})

export default themeProviderHoc(center, {
  components: {
    Menu: {
      // colorPrimary: 'skyblue',
    },
  },
})
