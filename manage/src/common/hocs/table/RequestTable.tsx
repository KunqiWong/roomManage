import React, { useContext, useEffect, useReducer, useRef, useState } from 'react'
import { InputRef, Modal, Space } from 'antd'
import { Button, Form, Input, Popconfirm, Table, message } from 'antd'
import type { FormInstance } from 'antd/es/form'
import styles from './index.module.scss'
import { globalStore, room } from '@/stores'
import { toJS } from 'mobx'
import { postRecord } from '@/common/http/room'
import useWebsocket from '@/common/hooks/webSocket'

const EditableContext = React.createContext<FormInstance<any> | null>(null)

interface EditableRowProps {
  index: number
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm()
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  )
}

interface EditableCellProps {
  title: React.ReactNode
  editable: boolean
  children: React.ReactNode
  dataIndex: keyof roomType | userType
  record: roomType | userType
  handleSave: (record: roomType | userType) => void
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  send,
  ...restProps
}) => {
  // const {sendMessage} = useWebsocket({
  //     url: `ws://localhost:80/websocket/${globalStore.username}`, // 此参数为websocket地址
  //     verify: true, // 此参数控制是否有权限，请求该方法
  //   })
  // const [isLocalPage, setIsLocalPage] = useState(true)
// const {wsData,readyState,reconnect,sendMessage } = useWebsocket({
//   url: `ws://localhost:80/websocket/${globalStore.username}`, // 此参数为websocket地址
//   verify: true, // 此参数控制是否有权限，请求该方法
// })
// useEffect(() => {
//   // 不在白名单人员之间不执行后续操作，不需要可以删除
//   // if (!verify) {
//   // 		return
//   // }

//   // 如果是已关闭且是当前页面自动重连
//   if (readyState.key === 3 ) {
//     reconnect()
//   }
//   // 不是当前页面 清空 webSocket 此处为优化代码使用的，不需要可以直接删除。
//   // if (!isLocalPage) {
//   //   closeWebSocket()
//   // }
// }, [wsData, readyState])

  const [messageApi, contextHolder] = message.useMessage()
  const [base, setBase] = useState({})
  const [editing, setEditing] = useState(false)
  const [info, setInfo] = useState({
    courseName: '',
    num: 0,
    teacherName: '',
    className: '',
    phone: '',
    content:''
  })

  const toggleEdit = (roomName: string, gap: string) => {
    setEditing(!editing)
    setBase({ roomName, gap })
    const record = toJS(room.record)
    const target = record.find(
      (item) => item.gap == gap && item.roomName == roomName
    )

    if (target) {
      const { courseName, num, teacherName, className, phone,content } = target
      // const { courseName, num, teacherName, className, phone, date } = record[0]
      setInfo({
        courseName,
        num,
        teacherName,
        className,
        phone,
        content
      })
    } else {
      send(JSON.stringify({roomName,gap,...room.date,status:4}))
    }
  }

  const handleCancel = () => {
    setEditing(!editing)
    send(JSON.stringify({...base,...room.date,status:0}))
  }
  const onFinish = (values: any) => {
    postRecord({data:{ ...values, ...base,...room.date,id:parseInt(Math.random() * 10000000 + 10000000),num:parseInt(values.num) }})
      .then((res) => {
        setEditing(!editing)
        send(JSON.stringify({...base,...room.date,status:1}))
        messageApi.success('预约请求已发出')
        window.location.reload()
      })
      .catch((res) => {
        messageApi.error('此机房已有预约')
      })
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  let childNode = children

  childNode = editing ? (
    <>
      <Modal
        title="预约信息"
        open={editing}
        footer={null}
        onCancel={handleCancel}>
        { children[1] == '空' ? (
      <Form
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off">
        <Form.Item
          label="班级"
          name="className"
          rules={[{ required: true, message: '请输入！' }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="人数"
          name="num"
          rules={[{ required: true, message: '请输入！' }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="课程名称"
          name="courseName"
          rules={[{ required: true, message: '请输入！' }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="实验内容"
          name="content"
          rules={[{ required: true, message: '请输入！' }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="主讲教师"
          name="teacherName"
          rules={[{ required: true, message: '请输入！' }]}>
          <Input />
        </Form.Item>
        <Form.Item>
          <Space style={{ marginLeft: '335px' }}>
            <Button onClick={handleCancel}>取消</Button>
            <Button type="primary" htmlType="submit">
              确认
            </Button>
          </Space>
        </Form.Item>
      </Form>
    ) : (
      <>
        <div>
          班级:<em className={styles.em}>{info.className}</em>
        </div>
        <div>
          人数:<em>{info.num}</em>
        </div>
        <div>
          课程名称:<em>{info.courseName}</em>
        </div>
        <div>
          实验内容:<em>{info.content}</em>
        </div>
        <div>
          主讲教师:<em>{info.teacherName}</em>
        </div>
        <div>
          电话号码:<em>{info.phone}</em>
        </div>
      </>
    )}
      </Modal>
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24, cursor: 'pointer' }}
        onClick={() => toggleEdit(dataIndex, record.gap)}>
        {children}
      </div>
    </>
  ) : (
    <div
      className="editable-cell-value-wrap"
      style={{ paddingRight: 24, cursor: 'pointer' }}
      onClick={() => toggleEdit(dataIndex, record.gap)}>
      {children}
    </div>
  )

  return (
    <>
      {contextHolder}
      <td {...restProps}>{childNode}</td>
    </>
  )
}

type EditableTableProps = Parameters<typeof Table>[0]

type roomType = {
  key: React.Key
  roomName: string
  count: string
  remarks: string
}

type userType = {
  key: React.Key
  name: string
  username: string
  phone: string
}

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>

const CommonTable: React.FC = ({ data, initColumns, send }) => {
  const [dataSource, setDataSource] = useState<any[]>(data)
  useEffect(() => {
    setDataSource(data)
  }, [data])

  const defaultColumns: (ColumnTypes[number] & {
    editable?: boolean
    dataIndex: string
  })[] = [...initColumns]

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  }

  const columns = defaultColumns.map((col) => {
    return {
      ...col,
      onCell: (record: any) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        send:send,
        //单元格样式,行列对照
        style: {
          backgroundColor:
            col.title != '课节'
              ? Object.entries(record).some(
                  (x) => x[1] == '审核中' && col.title == x[0]
                )
                ? 'yellow'
                : Object.entries(record).some(
                    (x) => x[1] == '已预约' && col.title == x[0]
                  )
                ? 'red'
                : Object.entries(record).some(
                  (x) => x[1] == '填写中' && col.title == x[0]
                )
              ? 'green':''
              : '',
        },
      }),
    }
  })
  return (
    <div>
      <Table
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={dataSource}
        columns={columns as ColumnTypes}
        pagination={false}
        scroll={{ x: 1200 }}
        size='middle'
      />
    </div>
  )
}

export default CommonTable
