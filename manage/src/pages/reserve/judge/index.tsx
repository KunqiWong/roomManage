import { Button, Modal, Popconfirm, Select, Space, Table, Input } from 'antd'
import 'react'
import { useEffect, useState } from 'react'
import {
  cancelRecord,
  failReserve,
  getOwn,
  successReserve,
} from '@/common/http/user'
import type { ColumnsType } from 'antd/es/table'
import { judgeReserve } from '@/common/http/room'

export default (props) => {
  const [data, setData] = useState([])
  useEffect(() => {
    judgeReserve().then((res) => {
      setData(
        res.data.map((temp) => {
          return {
            key: temp.id,
            courseName: temp.courseName,
            teacherName: temp.teacherName,
            roomName: temp.roomName,
            gap: temp.gap,
            phone: temp.phone,
            date: temp.date,
            num: temp.num,
          }
        })
      )
    })
  }, [])
  const columns: ColumnsType<any> = [
    {
      title: '课程名称',
      dataIndex: 'courseName',
    },
    {
      title: '机房',
      dataIndex: 'roomName',
    },
    {
      title: '教师',
      dataIndex: 'teacherName',
    },
    {
      title: '电话号码',
      dataIndex: 'phone',
    },
    {
      title: '月日',
      dataIndex: 'date',
    },
    {
      title: '课节',
      dataIndex: 'gap',
    },
    {
      title: '人数',
      dataIndex: 'num',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <>
          <Space style={{ fontSize: '5px' }}>
            <Button
              size="small"
              type="primary"
              onClick={() => approve(record.key)}>
              通过
            </Button>
            <Button
              size="small"
              type="primary"
              onClick={() => reject(record.key)}
              danger>
              不通过
            </Button>
          </Space>
        </>
      ),
    },
  ]
  const { TextArea } = Input
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [key, setKey] = useState('')
  const approve = (key) => {
    successReserve({ id: key }).then(() => {
      setData(data.filter((item) => item.key != key))
    })
  }
  const reject = (key) => {
    setIsModalOpen(!isModalOpen)
    setKey(key)
  }
  const handleOk = () => {
    failReserve({ id: key, reason: reason }).then((res) => {
      setData(data.filter((item) => item.key != key))
      setIsModalOpen(!isModalOpen)
    })
  }
  const handleCancel = () => {
    setIsModalOpen(!isModalOpen)
  }
  const dateChangeHandler = (event) => {
    setReason(event.target.value)
  }
  return (
    <>
      <Modal
        title="不通过原因"
        open={isModalOpen}
        okText={'确认'}
        cancelText={'取消'}
        onOk={handleOk}
        onCancel={handleCancel}>
        <TextArea
          rows={8}
          value={reason}
          onChange={dateChangeHandler}></TextArea>
      </Modal>
      <Table
        columns={columns}
        dataSource={data}
        size="small"
        pagination={{ defaultPageSize: 8 }}
      />
    </>
  )
}
