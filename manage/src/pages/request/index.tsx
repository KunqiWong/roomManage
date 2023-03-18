import React, { useEffect, useRef, useState } from 'react'
import { Select, Space, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import RequestTable from '@/common/hocs/table/RequestTable'
import { globalStore, room } from '@/stores'
import { getRecord } from '@/common/http/room'
import useWebsocket from '@/common/hooks/webSocket'

// interface DataType {
//   key: React.Key
//   gap: string
//   status: string
// }
type DataType = any

const App: React.FC = () => {
  const [goWeek, setGoWeek] = useState(parseInt(sessionStorage.getItem('week')))
  const [goDay, setGoDay] = useState(parseInt(sessionStorage.getItem('day')))
  const [data, setData] = useState([])
  const timer = useRef()
  const [isLocalPage, setIsLocalPage] = useState(true)
  const { wsData, readyState, closeWebSocket, reconnect,sendMessage } = useWebsocket({
    url: `ws://localhost:80/websocket/${globalStore.username}`, // 此参数为websocket地址
    verify: true, // 此参数控制是否有权限，请求该方法
  })
  
useEffect(() => {
  return () => {
      // 清除定时器
      clearInterval(timer.current);
  };
}, [])
  useEffect(() => {
    // 不在白名单人员之间不执行后续操作，不需要可以删除
    // if (!verify) {
    // 		return
    // }
  
    // 接受到socket数据， 进行业务逻辑处理
    if (Object.keys(wsData).length !== 0) {
      if(wsData.week==goWeek&&wsData.weekDate==goDay) {
        if(wsData.status==4) setData(data.map(item=>{
          if(item.gap==wsData.gap) item[wsData.roomName] = '填写中'
          return item
        }))
        if(wsData.status==1) {
          setData(data.map(item=>{
            if(item.gap==wsData.gap) item[wsData.roomName] = '审核中'
            return item
          }))
        }
        if(wsData.status==0) {
          setData(data.map(item=>{
            if(item.gap==wsData.gap) item[wsData.roomName] = '空'
            return item
          }))
        }
      }
    }
  
    // 如果是已关闭且是当前页面自动重连
    if (readyState.key === 3 ) {
      reconnect()
    }
    // 不是当前页面 清空 webSocket 此处为优化代码使用的，不需要可以直接删除。
    // if (!isLocalPage) {
    //   closeWebSocket()
    // }
  }, [wsData, readyState])
  /*
   ** 判断用户是否离开当前页面，离开后不请求轮询接口，回到当前页面重新执行轮询
   */
  useEffect(() => {
    document.addEventListener('visibilitychange', function () {
      // 页面变为不可见时触发
      if (document.visibilityState === 'hidden') {
        setIsLocalPage(false)
      }
      // 页面变为可见时触发
      if (document.visibilityState === 'visible') {
        setIsLocalPage(true)
      }
    })
  })
  const send = (str:string) => {
    if(!timer.current) timer.current = setInterval(()=>sendMessage(str),100)
    const wsData = JSON.parse(str)
    if(wsData.week==goWeek&&wsData.weekDate==goDay) {
      if(wsData.status==4) setData(data.map(item=>{
        if(item.gap==wsData.gap) item[wsData.roomName] = '填写中'
        return item
      }))
      if(wsData.status==1) {
        clearInterval(timer.current)
        sendMessage(str)
        setData(data.map(item=>{
          if(item.gap==wsData.gap) item[wsData.roomName] = '审核中'
          return item
        }))
      }
      if(wsData.status==0) {
        clearInterval(timer.current)
        sendMessage(str)
        setData(data.map(item=>{
          if(item.gap==wsData.gap) item[wsData.roomName] = '空'
          return item
        }))
      } 
    }
  }
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
    sessionStorage.setItem('week',value)
    setGoWeek(parseInt(value))
  }
  const dateChange = (value: string) => {
    sessionStorage.setItem('day',value)
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
      room.setDate({ week: goWeek, weekDate: goDay })
      // setInfo(res.data)
      res.data.forEach((item) => {
        if (item.gap == '1-2') {
          content.first[item.roomName] =
            item.status == 1 ? '审核中' : item.status == 2 ? '已预约' : item.status == 4?'填写中': '空'
        }
        if (item.gap == '3-4') {
          content.second[item.roomName] =
            item.status == 1 ? '审核中' : item.status == 2 ? '已预约' :item.status == 4?'填写中': '空'
        }
        if (item.gap == '5-6') {
          content.third[item.roomName] =
            item.status == 1 ? '审核中' : item.status == 2 ? '已预约' : item.status == 4?'填写中': '空'
        }
        if (item.gap == '7-8') {
          content.fourth[item.roomName] =
            item.status == 1 ? '审核中' : item.status == 2 ? '已预约' : item.status == 4?'填写中': '空'
        }
        if (item.gap == '9-11') {
          content.fifth[item.roomName] =
            item.status == 1 ? '审核中' : item.status == 2 ? '已预约' : item.status == 4?'填写中': '空'
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
          defaultValue='请选择周'
          style={{ width: 120 }}
          onChange={weekChange}
          options={week}
        />
        <Select
          defaultValue='请选择日'
          style={{ width: 120 }}
          onChange={dateChange}
          options={date}
        />
        <Space style={{marginLeft:'10px'}}>
          <div style={{color:'green'}}>绿色：填写中</div>
          <div>黄色：审核中</div>
          <div style={{color:'red'}}>红色：已预约（以背景色为主）</div>
        </Space>
      </Space>
      <RequestTable initColumns={columns} data={data} send={send} />
    </>
  )
}

export default App
