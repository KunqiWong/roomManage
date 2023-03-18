import { addCodeToPermission } from '@/common/utils/index'

export type RouteKeyT = keyof typeof RouteIds
export type RouteRecordRawCustom = any

export const RouteIds = {
  index: 'index',
  request: 'request',
  sys: 'sys',
  room: 'room',
  user: 'user',
  reserve: 'reserve',
  judge: 'judge',
  record: 'record',
  table: 'table',
  practice: 'practice',
  safe: 'safe',
}

export const ROUTE_PERMISSION = addCodeToPermission<{
  id: symbol
  title: string
  code?: string
}>({
  index: { id: Symbol(), title: '首页' },
  request: { id: Symbol(), title: '申请预约' },
  sys: { id: Symbol(), title: '系统管理' },
  user: { id: Symbol(), title: '用户管理' },
  room: { id: Symbol(), title: '机房管理' },
  reserve: { id: Symbol(), title: '预约管理' },
  judge: { id: Symbol(), title: '预约审核' },
  record: { id: Symbol(), title: '预约记录' },
  table: { id: Symbol(), title: '表格登记' },
  practice: { id: Symbol(), title: '实践登记表' },
  safe: { id: Symbol(), title: '安全检查表' },
})

const {
  index,
  sys,
  user,
  room,
  reserve,
  judge,
  record,
  request,
  table,
  practice,
  safe,
} = ROUTE_PERMISSION
export const routesData = [
  {
    name: index.name,
    meta: {
      title: index.title,
      noCache: false,
      link: null,
    },
  },
  {
    name: request.name,
    meta: {
      title: request.title,
      noCache: false,
      link: null,
    },
  },
  {
    name: table.name,
    meta: {
      title: table.title,
      noCache: false,
      link: null,
    },
    children: [
      {
        name: practice.name,
        meta: {
          title: practice.title,
          noCache: false,
          link: null,
        },
      },
      {
        name: safe.name,
        meta: {
          title: safe.title,
          noCache: false,
          link: null,
        },
      },
    ],
  },
  {
    name: sys.name,
    meta: {
      title: sys.title,
      noCache: false,
      link: null,
    },
    children: [
      {
        name: user.name,
        meta: {
          title: user.title,
          noCache: false,
          link: null,
        },
      },
      {
        name: room.name,
        meta: {
          title: room.title,
          noCache: false,
          link: null,
        },
      },
    ],
  },
  {
    name: reserve.name,
    meta: {
      title: reserve.title,
      noCache: false,
      link: null,
    },
    children: [
      {
        name: judge.name,
        meta: {
          title: judge.title,
          noCache: false,
          link: null,
        },
      },
      {
        name: record.name,
        meta: {
          title: record.title,
          noCache: false,
          link: null,
        },
      },
    ],
  },
]
