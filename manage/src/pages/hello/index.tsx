import { Table, Divider } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { room } from '@/stores/index'
import { useEffect, useState } from 'react'

interface DataType {
  key: number
  roomName: string
  count: number
  remarks: string
}

const columns: ColumnsType<DataType> = [
  {
    title: '机房',
    dataIndex: 'roomName',
  },
  {
    title: '容纳人数',
    dataIndex: 'count',
  },
  {
    title: '说明',
    dataIndex: 'remarks',
  },
]

const App: React.FC = () => {
  const [data, setData] = useState<DataType[]>([])

  useEffect(() => {
    room.getRoom().then((res) => {
      room.setRoomData(res.data)
      setData(
        res.data.map((item) => {
          return {
            key: item.id,
            roomName: item.roomName,
            count: item.count,
            remarks: item.remarks,
          }
        })
      )
    })
  }, [])

  return (
    <>
      <Divider>机房信息</Divider>
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
