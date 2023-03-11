import { createElement } from 'react'
import {
  DesktopOutlined,
  UserOutlined,
  HomeOutlined,
  SettingOutlined,
  CalendarOutlined,
  CarryOutOutlined,
  FormOutlined,
  ScheduleOutlined,
  TableOutlined,
  ProfileOutlined,
} from '@ant-design/icons'
import {
  Login,
  Center,
  Record,
  Hello,
  RoomPage,
  UserPage,
  Request,
  Judge,
  Practice,
  Safe,
} from '../pages'
export default {
  center: {
    meta: {
      title: '中心',
    },
  },
  home: {
    meta: {
      title: '首页',
      icon: createElement(HomeOutlined),
    },
    component: Hello,
  },
  table: {
    meta: {
      title: '表格登记',
      icon: createElement(TableOutlined),
    },
  },
  practice: {
    meta: {
      title: '实践登记表',
      icon: createElement(ProfileOutlined),
    },
    component: Practice,
  },
  safe: {
    meta: {
      title: '安全检查表',
      icon: createElement(ProfileOutlined),
    },
    component: Safe,
  },
  request: {
    meta: {
      title: '预约申请',
      icon: createElement(FormOutlined),
    },
    component: Request,
  },
  sys: {
    meta: {
      title: '系统管理',
      icon: createElement(SettingOutlined),
    },
  },
  room: {
    meta: {
      title: '机房管理',
      icon: createElement(DesktopOutlined),
    },
    component: RoomPage,
  },
  user: {
    meta: {
      title: '用户管理',
      icon: createElement(UserOutlined),
    },
    component: UserPage,
  },
  reserve: {
    meta: {
      title: '预约管理',
      icon: createElement(ScheduleOutlined),
    },
  },
  judge: {
    meta: {
      title: '预约审核',
      icon: createElement(CalendarOutlined),
    },
    component: Judge,
  },
  record: {
    meta: {
      title: '预约记录',
      icon: createElement(CarryOutOutlined),
    },
    component: Record,
  },
}
