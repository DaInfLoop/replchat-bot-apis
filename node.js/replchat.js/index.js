// A library for replchat (https://replchat.vapwastaken.repl.co/)
const io = require('socket.io-client')
const { EventEmitter } = require('events')

module.exports = class Client extends EventEmitter {
  constructor(username, beta = false) {
    super()
    this.socket = {}
    this.username = username
    this.useBeta = beta
  }
  sendMessage(message) {
    this.socket.emit('chat message', { message })
  }
  disconnect() {
    this.socket.disconnect()
  }
  login() {
    this.socket = io(`https://replchat${this.useBeta ? '-test-branch' : ''}.vapwastaken.repl.co/`, {
      transports: ["websocket"],
      extraHeaders: {
        "X-Replit-User-Name": `${this.username}` // WARN: this will be ignored in a browser
      }
    })

    this.socket.on('debug', (code) => {
      if (code == "REQUIRES_IDENTIFY") this.socket.emit('identify', `${this.username} [BOT]`)
      this.emit('debug', code)
    })

    this.socket.on('getmessages', () => {
      this.emit('ready')
    })
    
    this.socket.on('joined', (data) => {
      this.emit('join', data.username)
    })

    this.socket.on('left', (data) => {
      this.emit('leave', data.username)
    })

    this.socket.on('admin.kick', (data) => {
      this.disconnect()
      this.emit('error', new Error('This user has been kicked from replchat.'))
    })

    this.socket.on('banned', (data) => {
      this.disconnect()
      this.emit('error', new Error('This username has been banned from replchat. It is not recommended to rejoin with another username.'))
    })

    this.socket.on('chat message', (data) => {
      this.emit('message', {
        author: {
          username: data.username,
          bot: data.username.endsWith(' [BOT]')
        },
        content: data.message,
        mentions: {
          everyone: data.message.toLowerCase().includes('@everyone') && ['CosmicBear', 'DaInfLoop', 'VapWasTaken'].includes(data.username),
          me: data.message.toLowerCase().includes(`@${this.username.toLowerCase()}`)
        }
      })
    })
  }
  joinRoom(room) {
    this.socket.emit('joinRoom', room)
    return {
      name: room,
      sendMessage: (message) => {
        this.socket.emit('chat message', {
          message,
          room
        })
      }
    }
  }
  sendRoomMessage(room, message) {
    this.socket.emit('chat message', {
      message,
      room
    })
  }
}
