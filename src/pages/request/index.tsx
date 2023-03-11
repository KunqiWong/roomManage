import React, { useEffect, useState } from 'react'
import { Select, Space, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import RequestTable from '@/common/hocs/table/RequestTable'
import { room } from '@/stores'
import { getRecord } from '@/common/http/room'

// interface DataType {
//   key: React.Key
//   gap: string
//   status: string
// }
type DataType = any

const App: React.FC = () => {
  const [goWeek, setGoWeek] = useState(1)
  const [goDay, setGoDay] = useState(1)
  const [data, setData] = useState([])
  const columns: ColumnsType<DataType> = [
    {
      title: '课节',
      width: 100,
      dataIndex: 'gap',
      key: 'gap',
      fixed: 'left',
    },
    ...room.roomData.map((item) => {
      return {
        title: item.roomName,
        key: item.id,
        dataIndex: item.roomName,
      }
    }),
  ]

  let content = {
    first: {},
    second: {},
    third: {},
    fourth: {},
    fifth: {},
  }

  for (let x of room.roomData) {
    content.first[x.roomName] = '空'
    content.second[x.roomName] = '空'
    content.third[x.roomName] = '空'
    content.fourth[x.roomName] = '空'
    content.fifth[x.roomName] = '空'
  }

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
  // const [info, setInfo] = useState([])
  useEffect(() => {
    // setInfo([])
    getRecord({ week: goWeek, weekDate: goDay }).then((res) => {
      room.setRecord(res.data)

      // setInfo(res.data)
      res.data.forEach((item) => {
        if (item.gap == '1-2') {
          content.first[item.roomName] =
            item.status == 1 ? '审核中' : item.status == 2 ? '已预约' : '空'
        }
        if (item.gap == '3-4') {
          content.second[item.roomName] =
            item.status == 1 ? '审核中' : item.status == 2 ? '已预约' : '空'
        }
        if (item.gap == '5-6') {
          content.third[item.roomName] =
            item.status == 1 ? '审核中' : item.status == 2 ? '已预约' : '空'
        }
        if (item.gap == '7-8') {
          content.fourth[item.roomName] =
            item.status == 1 ? '审核中' : item.status == 2 ? '已预约' : '空'
        }
        if (item.gap == '9-11') {
          content.fifth[item.roomName] =
            item.status == 1 ? '审核中' : item.status == 2 ? '已预约' : '空'
        }
      })

      setData([
        {
          key: '1',
          gap: '1-2',
          ...content.first,
        },
        {
          key: '2',
          gap: '3-4',
          ...content.second,
        },
        {
          key: '3',
          gap: '5-6',
          ...content.third,
        },
        {
          key: '4',
          gap: '7-8',
          ...content.fourth,
        },
        {
          key: '5',
          gap: '9-11',
          ...content.fifth,
        },
      ])
    })
  }, [goWeek, goDay])
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
      <RequestTable initColumns={columns} data={data} />
    </>
  )
}

export default App
