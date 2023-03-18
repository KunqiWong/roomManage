import { Popconfirm, Select, Space, Table } from 'antd'
import 'react'
import { useEffect, useState } from 'react'
import { cancelRecord, getOwn } from '@/common/http/user'
import type { ColumnsType } from 'antd/es/table'

export default (props) => {
  const [data, setData] = useState([])
  useEffect(() => {
    getOwn().then((res) => {
      setData(
        res.data.map((temp) => {
          return {
            key: temp.id,
            courseName: temp.courseName,
            teacherName: temp.teacherName,
            roomName: temp.roomName,
            gap: temp.gap,
            phone: temp.phone,
            status:
              temp.status == 1
                ? '审核中'
                : temp.status == 2
                ? '已通过'
                : '未通过',
            reason: temp.reason,
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
      title: '课节',
      dataIndex: 'gap',
    },
    {
      title: '预约状态',
      dataIndex: 'status',
      render: (text) => {
        return text == '已通过' ? (
          <div style={{ color: '#60A95F' }}>{text}</div>
        ) : text == '未通过' ? (
          <div style={{ color: 'red' }}>{text}</div>
        ) : (
          <div>{text}</div>
        )
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Popconfirm
          title={`确定取消该预约吗?`}
          onConfirm={() => cancel(record.key)}>
          <a>取消预约</a>
        </Popconfirm>
      ),
    },
    {
      title: '未通过原因',
      dataIndex: 'reason',
    },
  ]
  const cancel = (key) => {
    cancelRecord({ id: key }).then((res) => {
      setData(data.filter((item) => item.key != key))
    })
  }
  return (
    <>
      <Table
        columns={columns}
        dataSource={data}
        size="small"
        pagination={{ defaultPageSize: 8 }}
      />
    </>
  )
}
