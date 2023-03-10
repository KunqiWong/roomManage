import 'react'
import { Table, Form, Tree, Modal, Input, Space, Button, message } from 'antd'
import ModalForm from './components/modalForm'
import { globalStore } from '@/stores/index'
// import {
//   BTN_PERMISSIONS,
//   ActionsPermissionConfig,
//   type BtnItemT,
// } from '@/permissions/actionConfig'
import type { ColumnsType } from 'antd/es/table'
import { useEffect } from 'react'
import { centerRouteDta, routesStructData } from '@/router/index'
import routerConfig from '@/router/config'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CommonTable from '@/common/hocs/table/CommonTable'

interface DataType {
  key: string
  phone: string
  name: string
  username: string
}

const processPermission = (routesData: any[], newData: any[]) => {
  routesData.forEach((routeStructItem) => {
    const { id } = routeStructItem
    let routeItem = routerConfig[id]
    routeItem.routeId = id
    let item: any = {
      title: routeItem.meta.title,
      value: routeItem.routeId,
      key: routeItem.routeId,
    }
    newData.push(item)
    if (routeStructItem.children) {
      item.children = []
      processPermission(routeStructItem.children, item.children)
    }
    // else {
    //   item.children = []
    //   // if (routeItem.routeId in ActionsPermissionConfig) {
    //   //   const actionsPermissions =
    //   //     ActionsPermissionConfig[
    //   //       routeItem.routeId as keyof typeof ActionsPermissionConfig
    //   //     ]
    //   //   actionsPermissions.forEach((actionId) => {
    //   //     const btnConfig = BTN_PERMISSIONS[actionId.split(':')[1]]
    //   //     item.children?.push({
    //   //       title: btnConfig.title,
    //   //       value: actionId,
    //   //       key: actionId,
    //   //     })
    //   //   })
    //   // }
    // }
  })
}

export default (props) => {
  const [data, setData] = useState<DataType[]>([])
  // const [allPermissions, setPer] = useState<any[]>()
  const [choices, setChecked] = useState<string[]>([])
  const [messageApi, contextHolder] = message.useMessage()
  const navigate = useNavigate()
  const handleSubmit = (username: string, checked: Array<string>) => {
    Modal.confirm({
      title: `??????????????????${username}?????????`,
      okText: '??????',
      cancelText: '??????',
      onOk: () => {
        if (Array.isArray(checked)) {
          globalStore
            .updatePermissions({ username, userPower: checked.join('') })
            .then(() => {
              messageApi.open({
                type: 'success',
                content: '??????????????????',
              })
            })
        }
      },
    })
  }
  const handleDelete = (username: string) => {
    Modal.confirm({
      // title: '??????',
      content: `?????????????????????${username}`,
      okText: '??????',
      cancelText: '??????',
      onOk: () => {
        globalStore.delete({ username: username }).then(() => {
          setData(data.filter((item) => item.username != username))
          messageApi.open({
            type: 'success',
            content: '?????????????????????',
          })
        })
      },
    })
  }
  const getData = async function () {
    const res = await globalStore.getUsers()
    setData(
      res.data.map((item) => {
        return {
          key: item.id,
          name: item.name,
          username: item.username,
          phone: item.phone,
          userPower: item.userPower.split(','),
        }
      })
    )
  }
  useEffect(() => {
    getData()
  }, [])

  const initColumns = [
    {
      title: '??????',
      dataIndex: 'name',
      editable: true,
    },
    {
      title: '?????????',
      dataIndex: 'username',
      editable: true,
    },
    {
      title: '????????????',
      dataIndex: 'phone',
      editable: true,
    },
    {
      title: '??????',
      dataIndex: 'operation',
      render: (_, record) => {
        let result = []
        processPermission(routesStructData, result)
        return (
          <ModalForm
            handleSubmit={() =>
              handleSubmit(
                record.username,
                choices.length == 0 ? record.userPower : choices
              )
            }
            handleDelete={handleDelete}
            username={record.username}>
            <Tree
              defaultCheckedKeys={record.userPower}
              checkable
              treeData={result}
              onCheck={(data: any) => {
                setChecked(data)
              }}
            />
          </ModalForm>
        )
      },
    },
  ]

  return (
    <div>
      {contextHolder}
      <CommonTable
        buttonName={' + ????????????'}
        initColumns={initColumns}
        data={data}></CommonTable>
    </div>
  )
}
