import React, { useContext, useEffect, useRef, useState } from 'react'
import { InputRef, Space } from 'antd'
import { Button, Form, Input, Popconfirm, Table, message } from 'antd'
import type { FormInstance } from 'antd/es/form'
import { UUID } from '@/common/utils'
import styles from './index.module.scss'
import { globalStore, room } from '@/stores/index'
import { getPath } from '@/common/hooks/path'
import { deleteSafe, updateSafe } from '@/common/http/user'

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
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false)
  const inputRef = useRef<InputRef>(null)
  const form = useContext(EditableContext)!
  const mobx = getPath() == '/center/sys/room' ? room : globalStore
  const path =  getPath()
  const [messageApi, contextHolder] = message.useMessage()

  useEffect(() => {
    if (editing) {
      inputRef.current!.focus()
    }
  }, [editing])

  const toggleEdit = () => {
    setEditing(!editing)
    form.setFieldsValue({ [dataIndex]: record[dataIndex] })
  }

  const save = async () => {
    try {
      const values = await form.validateFields()

      toggleEdit()
      handleSave({ ...record, ...values })
      let user = { ...record, ...values, id: record.key }
      delete user.key
      
      if(path=='/center/sys/user') user.userPower = user.userPower.join(',')
      if(path=='/center/table/safe') {
        updateSafe(user).then(res=>{
          console.log(user);
          if(!res.flag) {
            messageApi.error(res.msg)
          }
        })
      } else {
        mobx.update(user).then(res=>{
          console.log(user);
          if(!res.flag) {
            messageApi.error(res.msg)
          }
        })

      }
    } catch (errInfo) {
      console.log('Save failed:', errInfo)
    }
  }

  let childNode = children

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title}不能为空`,
          },
        ]}>
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={toggleEdit}>
        {children}
      </div>
    )
  }

  return <>{contextHolder}<td {...restProps}>{childNode}</td></>
}

type EditableTableProps = Parameters<typeof Table>[0]

type roomType = {
  key: Number
  roomName: string
  count: string
  remarks: string
}

type userType = {
  key: Number
  name: string
  username: string
  phone: string
}

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>

const CommonTable: React.FC = ({ data, initColumns, buttonName }) => {
  const [messageApi, contextHolder] = message.useMessage()
  const mobx = getPath() == '/center/sys/room' ? room : globalStore
  const [dataSource, setDataSource] = useState<(roomType | userType)[]>(
    data
    // room.roomData.map((item) => {
    //   return {
    //     key: item.id,
    //     roomName: item.roomName,
    //     count: item.count,
    //     remarks: item.remarks,
    //   }
    // })
  )
  useEffect(() => {
    setDataSource(data)
  }, [data])

  const handleDelete = (key: React.Key) => {
    mobx.delete({ id: key }).then(() => {
      const newData = dataSource.filter((item) => item.key !== key)
      setDataSource(newData)
      messageApi.open({
        type: 'success',
        content: '删除成功',
      })
    }) ||
      deleteSafe({ id: key }).then(() => {
        const newData = dataSource.filter((item) => item.key !== key)
        setDataSource(newData)
        messageApi.open({
          type: 'success',
          content: '删除成功',
        })
      })
  }

  const action = {
    title: '操作',
    dataIndex: 'operation',
    render: (_, record: { key: React.Key }) =>
      dataSource.length >= 1 ? (
        <Popconfirm
          title={`确定删除该行吗?`}
          onConfirm={() => handleDelete(record.key)}>
          <a>删除</a>
        </Popconfirm>
      ) : null,
  }

  const defaultColumns: (ColumnTypes[number] & {
    editable?: boolean
    dataIndex: string
  })[] =
    getPath() != '/center/sys/user'
      ? [
          // {
          //   title: '机房',
          //   dataIndex: 'roomName',
          //   editable: true,
          // },
          // {
          //   title: '容纳人数',
          //   dataIndex: 'count',
          //   editable: true,
          // },
          // {
          //   title: '说明',
          //   dataIndex: 'remarks',
          //   editable: true,
          // },
          ...initColumns,
          action,
        ]
      : [...initColumns]

  const handleAdd = (data: roomType | userType) => {
    const temp = JSON.parse(JSON.stringify(data[0]))
    for (let i in temp) {
      temp[i] = '请填写'
      if (i == 'userPower')
      temp[i] = 'home,reserve,record,request,table,practice,safe'
    }
    const newData: roomType | userType = {
      ...temp,
      // key: UUID(),
      key: parseInt(Math.random() * 10000000 + 10000000),
    }
    setDataSource([newData, ...dataSource])
  }

  const handleSave = (row: roomType | userType) => {
    const newData = [...dataSource]
    const index = newData.findIndex((item) => row.key === item.key)
    const item = newData[index]
    newData.splice(index, 1, {
      ...item,
      ...row,
    })
    setDataSource(newData)
  }

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  }

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: (record: roomType | userType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
        className: Object.values(record).some((item) => item == '请填写')
          ? styles.red
          : '',
      }),
    }
  })

  const { Search } = Input
  const onSearch = (value: string) => {
    if (value == '') {
      setDataSource(data)
      return
    }
    mobx.search({value}).then((res) => {
      
      let temp = res.data.map((item) => {
        return {
          key: item.id,
          name: item.name,
          username: item.username,
          phone: item.phone,
        }
      })
      setDataSource(temp)
    })
  }
  function UserSearch(): React.FC {
    return getPath() == '/center/sys/user' ? (
      <Search placeholder="搜索教师或职工号" onSearch={onSearch} enterButton />
    ) : (
      ''
    )
  }
  const Header = (): React.FC => {
    return getPath() == '/center/sys/user'||getPath() == '/center/sys/room' ? (
      <Space style={{ marginBottom: 16 }}>
        <UserSearch></UserSearch>
        <Button onClick={() => handleAdd(data)} type="primary">
          {buttonName}
        </Button>
      </Space>
    ) : ''
  }
  return (
    <div>
      {contextHolder}
      <Header></Header>
      <Table
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={dataSource}
        columns={columns as ColumnTypes}
        pagination={{ defaultPageSize: 5 }}
      />
    </div>
  )
}

export default CommonTable
