import { action, makeAutoObservable, toJS } from 'mobx'
import { json, Location } from 'react-router-dom'
import {
  login,
  updatePermissions,
  getPermissions,
  getUsers,
  searchUser,
  deleteUser,
  updateUser,
} from '@/common/http/user'

// Model the application state.
class Global {
  routerData = null
  token = ''
  username = ''
  tabsHistory: { [key: string]: Location } = {}
  permissions: any[] = []

  constructor() {
    makeAutoObservable(this)
  }

  init() {
    const data = JSON.parse(sessionStorage.getItem('userData'))
    if (data) {
      this.username = data.username
      this.tabsHistory = data.tabsHistory
    }
  }

  login = (data) => login(data)
  getPermissions = () => getPermissions()
  updatePermissions = (data) => updatePermissions(data)
  getUsers = () => getUsers()
  search = (data) => searchUser(data)
  delete = (data) => deleteUser(data)
  update = (data) => updateUser(data)

  logOut() {
    this.token = ''
    this.username = ''
    this.tabsHistory = {}
    this.routerData = null
    this.permissions = []
    sessionStorage.clear()
    localStorage.removeItem('remember')
  }

  setRouterData = (data) => {
    this.routerData = data
  }

  setToken = ({ username, token }) => {
    this.token = token
    this.username = username
  }

  addTabHistory = (newItem: Location) => {
    let temp = toJS(this.tabsHistory)
    temp[newItem.pathname] = newItem
    this.tabsHistory = temp
  }

  deleteTabHistory = (pathName: string) => {
    let temp = toJS(this.tabsHistory)
    if (Object.values(temp).length > 1) {
      Reflect.deleteProperty(temp, pathName)
      this.tabsHistory = temp
    }
  }

  setPermissions = (permissions) => {
    this.permissions = permissions
  }
}

export default new Global()
