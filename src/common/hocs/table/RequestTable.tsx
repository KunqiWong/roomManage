import React, { useContext, useEffect, useRef, useState } from 'react'
import { InputRef, Modal, Space } from 'antd'
import { Button, Form, Input, Popconfirm, Table, message } from 'antd'
import type { FormInstance } from 'antd/es/form'
import styles from './index.module.scss'
import { room } from '@/stores'
import { toJS } from 'mobx'
import { postRecord } from '@/common/http/room'

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
  ...restProps
}) => {
  const [messageApi, contextHolder] = message.useMessage()
  const [base, setBase] = useState({})
  const [editing, setEditing] = useState(false)
  const [info, setInfo] = useState({
    courseName: '',
    num: '',
    teacherName: '',
    className: '',
    phone: '',
    date: '',
  })

  const toggleEdit = (roomName: string, gap: string) => {
    setEditing(!editing)
    setBase({ roomName, gap })
    const record = toJS(room.record)
    const target = record.find(
      (item) => item.gap == gap && item.roomName == roomName
    )

    if (target) {
      const { courseName, num, teacherName, className, phone, date } = target
      // const { courseName, num, teacherName, className, phone, date } = record[0]
      setInfo({
        courseName,
        num,
        teacherName,
        className,
        phone,
        date,
      })
    }
  }

  const handleCancel = () => {
    setEditing(!editing)
  }

  const onFinish = (values: any) => {
    postRecord({ ...values, ...base })
      .then((res) => {
        setEditing(!editing)
        messageApi.success('?????????????????????')
      })
      .catch((res) => {
        messageApi.error('?????????????????????')
      })
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  let childNode = children

  const Info = () => {
    return children[1] == '???' ? (
      <Form
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off">
        <Form.Item
          label="??????"
          name="class"
          rules={[{ required: true, message: '????????????' }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="??????"
          name="num"
          rules={[{ required: true, message: '????????????' }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="????????????"
          name="courseName"
          rules={[{ required: true, message: '????????????' }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="????????????"
          name="teacherName"
          rules={[{ required: true, message: '????????????' }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="??????"
          name="date"
          rules={[{ required: true, message: '????????????' }]}>
          <Input />
        </Form.Item>
        <Form.Item>
          <Space style={{ marginLeft: '335px' }}>
            <Button onClick={handleCancel}>??????</Button>
            <Button type="primary" htmlType="submit">
              ??????
            </Button>
          </Space>
        </Form.Item>
      </Form>
    ) : (
      <>
        <div>
          ??????:<em className={styles.em}>{info.className}</em>
        </div>
        <div>
          ??????:<em>{info.num}</em>
        </div>
        <div>
          ????????????:<em>{info.courseName}</em>
        </div>
        <div>
          ????????????:<em>{info.teacherName}</em>
        </div>
        <div>
          ????????????:<em>{info.phone}</em>
        </div>
      </>
    )
  }

  childNode = editing ? (
    <>
      <Modal
        title="????????????"
        open={editing}
        footer={null}
        onCancel={handleCancel}>
        <Info></Info>
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

const CommonTable: React.FC = ({ data, initColumns }) => {
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
        //???????????????,????????????
        style: {
          backgroundColor:
            col.title != '??????'
              ? Object.entries(record).some(
                  (x) => x[1] == '?????????' && col.title == x[0]
                )
                ? 'yellow'
                : Object.entries(record).some(
                    (x) => x[1] == '???' && col.title == x[0]
                  )
                ? ''
                : 'red'
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
      />
    </div>
  )
}

export default CommonTable
