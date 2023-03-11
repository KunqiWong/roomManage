import { action, makeAutoObservable, toJS } from 'mobx'
import { updateRoom, deleteRoom, getRoom } from '@/common/http/room'

type room = {
  id: string
  roomName: string
  count: string
  remarks: string
  status: string
}[]

class Room {
  roomData: room = []
  record: any = []

  constructor() {
    makeAutoObservable(this)
  }

  init() {
    const data = JSON.parse(sessionStorage.getItem('roomData'))
    if (data) {
      this.roomData = data.room
      this.record = data.record
    }
  }

  setRoomData = (data) => {
    this.roomData = data
  }
  setRecord = (data) => {
    this.record = data
  }

  update = (data) => {
    let temp = toJS(this.roomData)
    let tag = temp.findIndex((item) => item.id == data.key)

    data.id = data.key
    delete data.key

    if (tag >= 0) {
      temp[tag] = data
      this.setRoomData(temp)
    } else this.setRoomData([...temp, data])

    return updateRoom(data)
  }

  delete = (data) => {
    let temp = toJS(this.roomData)
    temp = temp.filter((item) => item.id != data.id)
    this.setRoomData(temp)

    return deleteRoom(data)
  }

  getRoom = () => getRoom()
}

export default new Room()
