import { Popconfirm, Select, Space, Table } from 'antd'
import 'react'
import { useEffect, useState } from 'react'
import { cancelRecord, getOwn, getSafe } from '@/common/http/user'
import type { ColumnsType } from 'antd/es/table'
import { getSafeInfo } from '@/common/http/room'
import { values } from 'mobx'
import CommonTable from '@/common/hocs/table/CommonTable'

export default (props) => {
  const [data, setData] = useState([])
  const [courseNameList, setCourseNameList] = useState([])
  const [classNameList, setClassNameList] = useState([])
  const [courseName, setCourseName] = useState('')
  const [className, setClassName] = useState('')

  const chooseClass = (value: string) => {
    setClassName(value)
  }

  const chooseCourse = (value: string) => {
    setCourseName(value)
  }

  useEffect(() => {
    if (courseName && className)
      getSafe({ courseName, className }).then((res) => {
        setData(
          res.data.map((item) => {
            return {
              key: item.id,
              content: item.content,
              teacherName: item.teacherName,
              roomName: item.roomName,
              phone: item.phone,
              gap: item.gap,
              num: item.num,
              date: item.date,
              week: item.week,
              situation: item.situation,
              realNum: 0,
            }
          })
        )
      })
  }, [courseName, className])
  useEffect(() => {
    getSafeInfo().then((res) => {
      setClassNameList(
        res.data.classNameList.map((item) => {
          return { label: item, value: item }
        })
      )
      setCourseNameList(
        res.data.courseNameList.map((item) => {
          return { label: item, value: item }
        })
      )
    })
  }, [])
  const columns: any = [
    {
      title: '周次',
      dataIndex: 'week',
      editable: true,
    },
    {
      title: '课节',
      dataIndex: 'gap',
      editable: true,
    },
    {
      title: '月日',
      dataIndex: 'date',
      editable: true,
    },
    {
      title: '实验项目名称',
      dataIndex: 'content',
      editable: true,
    },
    {
      title: '实到人数',
      dataIndex: 'realNum',
      editable: true,
    },
    {
      title: '实验教室',
      dataIndex: 'roomName',
      editable: true,
    },
    {
      title: '教师',
      dataIndex: 'teacherName',
      editable: true,
    },
    {
      title: '安全情况',
      dataIndex: 'situation',
      editable: true,
    },
  ]
  return (
    <>
      <Space style={{ marginBottom: '10px' }} size={20}>
        <Select
          showSearch
          placeholder="选择班级"
          optionFilterProp="children"
          onChange={chooseClass}
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          options={classNameList}
        />
        <Select
          showSearch
          placeholder="选择课程"
          optionFilterProp="children"
          onChange={chooseCourse}
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          options={courseNameList}
        />
        <div>应到人数: {data[0]?.num}</div>
      </Space>
      <CommonTable initColumns={columns} data={data} buttonName={' + 添加行'} />
    </>
  )
}
