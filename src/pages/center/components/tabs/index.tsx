import { useRef, useState } from 'react'
import { Tabs } from 'antd'
import { globalStore } from '@/stores/index'
import { observer, inject } from 'mobx-react'
import { toJS } from 'mobx'
import styles from './index.module.scss'
import routeConfig from '@/router/config'
import { useEffect } from 'react'
import useLocationListen from '@/common/hooks/useLocationListen'
import { useNavigate } from 'react-router-dom'

export default observer(() => {
  const [activeKey, setActiveKey] = useState('')
  const [items, setItems] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    let tabsHistory = Object.values(toJS(globalStore.tabsHistory))
    setItems(
      tabsHistory.map((item) => {
        const { pathname } = item
        let routeId = pathname.split('/').slice(-1)[0]
        const { meta } = routeConfig[routeId]
        return { label: meta.title, key: pathname }
      })
    )
  }, [globalStore.tabsHistory])
  useLocationListen((location) => {
    setActiveKey(location.pathname)
  })
  const onChange = (newActiveKey: string) => {
    setActiveKey(newActiveKey)
    navigate(newActiveKey)
  }

  return (
    <Tabs
      className={styles.content}
      type="editable-card"
      onChange={onChange}
      activeKey={activeKey}
      items={items}
      hideAdd={true}
      onEdit={(key: string, action) => {
        if (action == 'remove') {
          globalStore.deleteTabHistory(key)
          let idx = items.findIndex((item) => item.key == key)
          if (key == activeKey)
            navigate(items[idx + 1] ? items[idx + 1].key : items[idx - 1].key)
        }
      }}
    />
  )
})
