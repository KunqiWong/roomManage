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
  date:any = {}

  constructor() {
    makeAutoObservable(this)
  }

  init() {
    const data = JSON.parse(sessionStorage.getItem('roomData'))
    if (data) {
      this.roomData = data.room
      this.record = data.record
      this.date = data.date
    }
  }

  setRoomData = (data) => {
    this.roomData = data
  }
  setRecord = (data) => {
    this.record = data
  }
  setDate = (data) => {
    this.date = data
  }

  update = (data) => {
    let temp = toJS(this.roomData)
    let tag = temp.findIndex((item) => item.id == data.id)
    if (tag >= 0) {
      temp[tag] = data
      this.setRoomData(temp)
    } else this.setRoomData([data, ...temp])
    
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
