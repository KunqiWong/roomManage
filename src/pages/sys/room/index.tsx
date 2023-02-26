import React from 'react'
import CommonTable from '@/common/hocs/table/CommonTable'
import { room } from '@/stores/index'

type roomType = {
  key: React.Key
  roomName: string
  count: string
  remarks: string
}

const RoomTable: React.FC = () => {
  const data: roomType[] = room.roomData.map((item) => {
    return {
      key: item.id,
      roomName: item.roomName,
      count: item.count,
      remarks: item.remarks,
    }
  })
  const initColumns = [
    {
      title: '机房',
      dataIndex: 'roomName',
      editable: true,
    },
    {
      title: '容纳人数',
      dataIndex: 'count',
      editable: true,
    },
    {
      title: '说明',
      dataIndex: 'remarks',
      editable: true,
    },
  ]
  return (
    <div>
      <CommonTable
        buttonName={' + 添加机房'}
        initColumns={initColumns}
        data={data}></CommonTable>
    </div>
  )
}

export default RoomTable
