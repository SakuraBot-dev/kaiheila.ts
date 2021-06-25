import ws from 'ws'
import http from './http'
import { EventEmitter } from 'events'
import logger from '../logger'

interface WebSocketData {
  s: number,
  d: any,
  sn?: number
}

declare interface WebSocket {
  on(event: 'open', listener: () => void): this;
  on(event: 'close', listener: () => void): this;
  on(event: 'pong', listener: () => void): this;
  on(event: 'message', listener: (msg: WebSocketData) => void): this;
}

class WebSocket extends EventEmitter{
  private token: string
  private socket: ws | null
  private http: http
  private maxSN: number

  constructor(token: string) {
    super()
    this.token = token
    this.socket = null
    this.http = new http(this.token)
    this.maxSN = 0
    this.start()
    
    this.once('open', () => {
      setInterval(() => {
        let flag = false

        this.on('pong', () => {
          flag = true
        })

        this.send({
          "s": 2,
          "sn": this.maxSN
        })

        setTimeout(() => {
          if (!flag) {
            logger('WebSocket').warn('连接超时!')
            this.start()
          }
        }, 6e3)
      }, 30e3)
    })

    this.on('message', msg => {
      if (msg.s === 3) this.emit('pong')
      if (msg.sn && this.maxSN < msg.sn) this.maxSN = msg.sn
      
      if (msg.s === 6) {
        if (this.socket) this.socket.close()
        this.start()
      }
    })
  }

  private async getGateway () {
    const data = await this.http.get('/gateway/index', {
      compress: 0
    })
    logger('WebSocket').info('WebSocket Gateway获取成功')
    return data.url
  }

  public send (data: any) {
    if (this.socket) this.socket.send(JSON.stringify(data))
  }

  private async start () {
    this.socket = new ws(await this.getGateway())
    this.socket.onopen = () => this.emit('open')
    this.socket.onmessage = msg => {
      try {
        const data = JSON.parse(msg.data.toString())
        this.emit('message', data)
      } catch (error) {
        logger('WebSocket').warn('收到了无法解析的消息', msg.data)
      }
    }
    this.socket.onclose = () => this.emit('close')

    this.once('open', () => {
      let flag = false
      this.once('message', msg => {
        if (msg.s === 1) {
          flag = true
          logger('WebSocket').info('连接成功!')
        }
      })

      setTimeout(() => {
        if (!flag) {
          logger('WebSocket').warn('连接超时!')
          this.start()
        }
      }, 6e3);
    })
  }
}

export default WebSocket