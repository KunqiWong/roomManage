import { Table, Divider, Space, Select } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { room } from '@/stores/index'
import { useEffect, useState } from 'react'
import { getPractice } from '@/common/http/room'

interface DataType {
  key: React.Key
  roomName: string
  count: number
  remarks: string
}

const columns: ColumnsType<DataType> = [
  {
    title: '班级',
    dataIndex: 'className',
  },
  {
    title: '教师',
    dataIndex: 'teacherName',
  },
  {
    title: '机房',
    dataIndex: 'roomName',
  },
  {
    title: '时间',
    dataIndex: 'date',
  },
  {
    title: '备注',
    dataIndex: 'remarks',
  },
]

const App: React.FC = () => {
  const [data, setData] = useState<DataType[]>([])
  const [goWeek, setGoWeek] = useState(1)
  const weekChange = (value: string) => {
    setGoWeek(parseInt(value))
  }
  let week = []
  for (let i = 1; i <= 20; i++) {
    week.push({
      value: i,
      label: `第${i}周`,
    })
  }
  useEffect(() => {
    getPractice({ week: goWeek }).then((res) => {
      setData(
        res.data.map((item) => {
          return {
            key: item.id,
            className: item.className,
            teacherName: item.teacherName,
            roomName: item.roomName,
            date: item.date,
            remarks: item.remarks,
          }
        })
      )
    })
  }, [goWeek])

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Select
          defaultValue="第1周"
          style={{ width: 120 }}
          onChange={weekChange}
          options={week}
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

export default App
