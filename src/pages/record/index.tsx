import { Select, Space, Table } from 'antd'
import 'react'
import { getRecord } from '@/common/http/room'
import styles from './index.module.scss'
import { useEffect, useState } from 'react'

export default (props) => {
  const [goWeek, setGoWeek] = useState(1)
  const [goDay, setGoDay] = useState(1)
  const weekChange = (value: string) => {
    setGoWeek(parseInt(value))
  }
  const dateChange = (value: string) => {
    setGoDay(parseInt(value))
  }
  let week = []
  for (let i = 1; i <= 20; i++) {
    week.push({
      value: i,
      label: `第${i}周`,
    })
  }
  let date = [
    {
      value: 1,
      label: `星期一`,
    },
    {
      value: 2,
      label: `星期二`,
    },
    {
      value: 3,
      label: `星期三`,
    },
    {
      value: 4,
      label: `星期四`,
    },
    {
      value: 5,
      label: `星期五`,
    },
    {
      value: 6,
      label: `星期六`,
    },
    {
      value: 7,
      label: `星期日`,
    },
  ]
  const [data, setData] = useState([])
  useEffect(() => {
    getRecord({ week: goWeek, weekDate: goDay }).then((res) => {
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
  const columns = [
    {
      title: '课程名称',
      dataIndex: 'courseName',
    },
    {
      title: '老师',
      dataIndex: 'teacherName',
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
      title: '手机号',
      dataIndex: 'phone',
    },
    {
      title: '预约状态',
      dataIndex: 'status',
    },
    {
      title: '未通过原因',
      dataIndex: 'reason',
    },
  ]
  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Select
          defaultValue="第1周"
          style={{ width: 120 }}
          onChange={weekChange}
          options={week}
        />
        <Select
          defaultValue="星期一"
          style={{ width: 120 }}
          onChange={dateChange}
          options={date}
        />
      </Space>
      <Table
        columns={columns}
        dataSource={data}
        size="small"
        pagination={{ defaultPageSize: 8 }}
      />
    </>
  )
}
